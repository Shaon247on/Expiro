import NotFound from "@/components/elements/NotFound";
import ProductPagination from "@/components/dashboard/product/Productpagination";
import {
  getNotificationSummaryAction,
  getNotificationsAction,
} from "@/actions/admin/notification.action";
import { NOTIFICATION_PAGE_SIZE } from "@/types/notification.type";
import NotificationSummaryCards from "@/components/dashboard/alart/NotificationSummaryCards";
import NotificationStatusFilter from "@/components/dashboard/alart/NotificationStatusFilter";
import NotificationList from "@/components/dashboard/alart/NotificationList";

interface NotificationPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export const metadata = { title: "Notifications — Expiro" };

export default async function NotificationPage({
  searchParams,
}: NotificationPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const activeStatus = params?.status ?? "all";

  const [summaryResult, notificationsResult] = await Promise.all([
    getNotificationSummaryAction(),
    getNotificationsAction({
      page: currentPage,
      filter: activeStatus,
    }),
  ]);

  console.log("Notification message:",summaryResult)

  if (!summaryResult.success) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
        {summaryResult.message}
      </div>
    );
  }

  if (!notificationsResult.success) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
        {notificationsResult.message}
      </div>
    );
  }

  const notifications = notificationsResult.data ?? [];
  const totalItems = notificationsResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / NOTIFICATION_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * NOTIFICATION_PAGE_SIZE;

  const paginationBase =
    activeStatus && activeStatus !== "all"
      ? `/dashboard/alerts?status=${encodeURIComponent(activeStatus)}`
      : "/dashboard/alerts";

  if (notifications.length === 0 && safePage === 1) {
    return (
      <div className="flex flex-col gap-6">
        <NotificationSummaryCards summary={summaryResult?.data?.summary} />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A3340" }}>
              Notifications
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#51564E" }}>
              Track alerts and product events.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <p className="text-xs text-gray-400">No notifications</p>
            <NotificationStatusFilter currentStatus={activeStatus === "all" ? "" : activeStatus} />
          </div>
        </div>

        <NotFound />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <NotificationSummaryCards summary={summaryResult?.data?.summary} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1A3340" }}>
            Notifications
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#51564E" }}>
            Track alerts and product events.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <p className="text-xs text-gray-400">
            {totalItems === 0
              ? "No notifications"
              : `${start + 1}–${Math.min(start + NOTIFICATION_PAGE_SIZE, totalItems)} of ${totalItems}`}
          </p>

          <NotificationStatusFilter currentStatus={activeStatus === "all" ? "" : activeStatus} />
        </div>
      </div>

      <NotificationList notifications={notifications} />

      <ProductPagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath={paginationBase}
      />
    </div>
  );
}