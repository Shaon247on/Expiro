"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  NOTIFICATION_TYPE_META,
  type NotificationItem,
} from "@/types/notification.type";
import { markNotificationReadAction } from "@/actions/admin/notification.action";

interface NotificationListProps {
  notifications: NotificationItem[];
}

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

function NotificationCard({ item }: { item: NotificationItem }) {
  const router = useRouter();
  const meta = NOTIFICATION_TYPE_META[item.notification_type];

  async function handleClick() {
    if (!item.is_read) {
      const result = await markNotificationReadAction(item.id);

      if (!result.success) {
        toast.error("Failed to update notification", {
          description: result.message,
        });
      }
    }

    router.push(getNotificationHref(item));
  }

  return (
    <article
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      aria-label={item.title}
    >
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={{ backgroundColor: item.is_read ? "white" : meta.lightBg }}
      >
        <div
          className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden"
          aria-hidden="true"
        >
          {item.category_img ? (
            <Image
              src={item.category_img}
              alt={item.product_name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">🔔</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-base" style={{ color: "#1A3340" }}>
              {item.product_name}
            </p>

            {!item.is_read && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "#3A7326" }}
              />
            )}
          </div>

          <p className="text-sm mt-1 text-gray-700">{item.title}</p>
          <p className="text-xs mt-1 text-gray-500">{item.message}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">{item.time_ago}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: meta.dot }}
          />
          <span className="text-xs font-medium" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>

        <span className="text-xs text-gray-400">
          {item.is_read ? "Read" : "Unread"}
        </span>
      </div>
    </article>
  );
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="mb-3 opacity-30"
          aria-hidden="true"
        >
          <path
            d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22ZM18 16V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <p className="text-sm">No notifications found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notifications.map((item) => (
        <NotificationCard key={item.id} item={item} />
      ))}
    </div>
  );
}