"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import {
  getNotificationsAction,
  markNotificationReadAction,
} from "@/actions/admin/notification.action";
import {
  NOTIFICATION_TYPE_META,
  type NotificationItem,
} from "@/types/notification.type";
import { toast } from "sonner";

function getNotificationHref(item: NotificationItem) {
  if (item.notification_type === "low_stock") {
    return `/dashboard/products/${item.product_id}`;
  }

  if (
    item.notification_type === "expiring_soon" ||
    item.notification_type === "urgent"
  ) {
    return `/dashboard/products/${item.product_id}/batches/${item.batch_id}`;
  }

  if (item.notification_type === "open_item") {
    return `/dashboard/dlc-track`;
  }

  return "/dashboard";
}

export default function NotificationDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const isSuperAdmin = pathname.startsWith("/admin");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  async function loadPage(nextPage: number, reset = false) {
    if (loading) return;
    setLoading(true);

    const result = await getNotificationsAction({ page: nextPage });

    if (!result.success) {
      setLoading(false);
      return;
    }

    const nextItems = result.data ?? [];
    const totalCount = result.count ?? 0;

    setUnreadCount(result.unreadCount ?? 0);

    setItems((prev) => {
      if (reset) return nextItems;

      const existing = new Set(prev.map((x) => x.id));
      const merged = [...prev];

      for (const item of nextItems) {
        if (!existing.has(item.id)) {
          merged.push(item);
        }
      }

      return merged;
    });

    const expectedLoaded = reset ? nextItems.length : items.length + nextItems.length;
    setHasMore(expectedLoaded < totalCount);
    setPage(nextPage);
    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      void loadPage(1, true);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      void loadPage(1, true);
    }, 60_000);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!open || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !loading) {
          void loadPage(page + 1);
        }
      },
      { root: null, threshold: 0.2 }
    );

    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [open, hasMore, loading, page, items.length]);

  async function handleNotificationClick(item: NotificationItem) {
    if (!item.is_read) {
      const result = await markNotificationReadAction(item.id);

      if (!result.success) {
        toast.error("Failed to update notification", {
          description: result.message,
        });
      } else {
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }

    setOpen(false);
    router.push(getNotificationHref(item));
  }

  const safeItems = useMemo(() => items, [items]);

  if (isSuperAdmin) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell size={18} style={{ color: "#3B82F6" }} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "#3B82F6", color: "white" }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#EEF3EA", color: "#3A7326" }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        <ScrollArea className="h-72">
          {safeItems.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
              <Bell size={28} className="mb-2 opacity-40" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <ul className="py-1">
              {safeItems.map((n) => {
                const meta = NOTIFICATION_TYPE_META[n.notification_type];

                return (
                  <li
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ backgroundColor: n.is_read ? "transparent" : meta.lightBg }}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {n.category_img ? (
                        <Image
                          src={n.category_img}
                          alt={n.product_name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">🔔</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: meta.dot }}
                          />
                          {meta.label}
                        </span>
                      </div>

                      <p
                        className={`text-xs leading-snug mt-1 ${
                          n.is_read ? "text-gray-600" : "text-gray-800 font-medium"
                        }`}
                      >
                        {n.message}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time_ago}</p>
                    </div>

                    {!n.is_read && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: "#3A7326" }}
                        aria-label="Unread"
                      />
                    )}
                  </li>
                );
              })}

              <li ref={loadMoreRef} className="h-6" />

              {loading && (
                <li className="px-4 py-3 text-xs text-center text-gray-400">
                  Loading...
                </li>
              )}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}