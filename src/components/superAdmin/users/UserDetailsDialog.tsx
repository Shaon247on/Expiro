"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/superAdmin/users.type";

function getShopCategoryLabel(value: User["shopCategory"]) {
  return value === "super_market" ? "Super Market" : "Restaurant";
}

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onPause: (userId: string) => void;
  disabled?: boolean;
}

export function UserDetailsDialog({
  user,
  open,
  onClose,
  onPause,
  disabled = false,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-xl rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900">
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full sm:w-44 h-36 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl">🏪</div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Category Type: </span>
              {getShopCategoryLabel(user.shopCategory)}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Email Address: </span>
              {user.email}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Mobile Number: </span>
              {user.phone}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Plan Type: </span>
              {user.currentPlanType ?? "No Plan"}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Total Staff Added: </span>
              {user.totalStaffAdded}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Status: </span>
              {user.status === "active" ? "Active" : "Banned"}
            </p>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                disabled={disabled}
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                disabled={disabled}
                className="flex-1 bg-[#2d5a3d] hover:bg-[#234832] text-white disabled:opacity-60"
                onClick={() => {
                  onPause(user.id);
                  onClose();
                }}
              >
                {disabled
                  ? "Updating..."
                  : user.status === "active"
                  ? "Ban"
                  : "Unban"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}