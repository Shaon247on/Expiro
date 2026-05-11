"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

function SettingNav() {
    const pathname = usePathname();

  const isSuperAdmin = pathname.startsWith("/admin")
  const isStaff = pathname.startsWith("/staff")
  return (
    <div className="relative">
          <Link href={isSuperAdmin ? "/admin/dashboard/settings": isStaff ? "/staff/dashboard/settings":"/dashboard/settings"}>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition-colors"
              aria-label="Settings"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  stroke="#EC4899"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                  stroke="#EC4899"
                  strokeWidth="1.8"
                  fill="none"
                />
              </svg>
            </button>
          </Link>
        </div>
  )
}

export default SettingNav
