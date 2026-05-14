import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActivityRow } from "@/types/analytics.type";

const actionBadgeVariant: Record<string, { label: string; className: string }> =
  {
    sold: {
      label: "Sold",
      className:
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
    },

    batch_created: {
      label: "Batch Created",
      className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
    },

    removed: {
      label: "Removed",
      className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    },
  };

interface RecentActivityTableProps {
  rows: ActivityRow[];
}

export function RecentActivityTable({ rows }: RecentActivityTableProps) {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-base font-semibold text-gray-800">
          Recently Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Responsive wrapper */}
        <div className="w-full overflow-x-auto rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 pl-0">
                  User
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide py-3">
                  Product
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide py-3">
                  Quantity
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide py-3">
                  Action
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide py-3">
                  Date &amp; Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => {
                const badge =
                  actionBadgeVariant[row.action] ?? actionBadgeVariant["sold"];
                return (
                  <TableRow
                    key={index}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    <TableCell className="py-4 pl-0 font-medium text-gray-800 text-sm whitespace-nowrap">
                      {row.user}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm whitespace-nowrap">
                      {row.product}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm">
                      {row.quantity}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold px-2.5",
                          badge.className,
                        )}
                      >
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
