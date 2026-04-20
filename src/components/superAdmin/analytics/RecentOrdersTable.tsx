import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { RecentOrder } from "@/types/superAdmin/analytics.type";
import Link from "next/link";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pt-5 pb-2 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">
            Recent Subscriptions
          </CardTitle>
          <Link href={"/admin/dashboard/user"}>
          <Button size="icon" className="size-8 px-10 text-xs cursor-pointer">
            View All
          </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                {["Tracking no", "User", "Plan Price", "Plan", "Created At"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-400 uppercase tracking-wide py-3"
                  >
                    <span className="flex items-center gap-1">
                      {h}
                      {["Tracking no", "User", "Plan Price", "Plan"].includes(h) && (
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-gray-400"
                  >
                    No recent subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, i) => (
                  <TableRow
                    key={order.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${
                      i % 2 === 1 ? "bg-gray-50/40" : ""
                    }`}
                  >
                    <TableCell className="py-4 text-sm text-gray-500 font-mono">
                      {order.tracking}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <span className="text-lg">👤</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                          {order.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-sm text-gray-600">
                      {order.price}
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#2d5a3d] text-white text-sm font-semibold min-w-12">
                        {order.totalOrder}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 text-sm text-gray-700 font-medium">
                      {order.totalAmount}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}