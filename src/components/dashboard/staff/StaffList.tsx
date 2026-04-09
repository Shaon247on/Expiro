import { roleMeta, StaffApiMember } from "@/types/staff.type";
import StaffActions from "./Staffactions";
import Image from "next/image";

interface StaffListProps {
  members: StaffApiMember[];
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getAvatarBg(id: number) {
  const palette = ["#3D4F61", "#3A7326", "#7C3AED", "#EA580C", "#2563EB"];
  return palette[id % palette.length];
}

function StaffCard({ member }: { member: StaffApiMember }) {
  const role = roleMeta[member.role];
  const isBanned = !member.is_active;

  return (
    <article
      className="bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: isBanned ? "#FEE2E2" : "#F0F0F0" }}
      aria-label={member.name}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        {member.profile_image ? (
          <Image
            src={member.profile_image}
            alt={member.name}
            width={48}
            height={48}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 border-2"
            style={{
              borderColor: isBanned ? "#FCA5A5" : "transparent",
            }}
          />
        ) : (
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 border-2"
            style={{
              backgroundColor: getAvatarBg(member.id),
              borderColor: isBanned ? "#FCA5A5" : "transparent",
            }}
            aria-hidden="true"
          >
            {getInitials(member.name)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className="font-bold text-sm sm:text-base leading-tight"
              style={{ color: "#1F485B" }}
            >
              {member.name}
            </p>

            {isBanned && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
              >
                BANNED
              </span>
            )}

            {!member.invitation_is_used && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: "#FEF3C7", color: "#B45309" }}
              >
                INVITED
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: isBanned ? "#EF4444" : role.dot }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-medium"
              style={{ color: isBanned ? "#DC2626" : role.color }}
            >
              {isBanned ? "Banned" : member.role}
            </span>
          </div>
        </div>

        <StaffActions member={member} />
      </div>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-2.5 border-t text-xs"
        style={{
          borderColor: isBanned ? "#FEE2E2" : "#F5F5F5",
          backgroundColor: isBanned ? "#FFFAFA" : "#FAFAFA",
        }}
      >
        <span>
          <span className="font-semibold" style={{ color: "#3A7326" }}>
            Contact:{" "}
          </span>
          <span className="text-gray-600">{member.phone}</span>
        </span>

        <span>
          <span className="font-semibold" style={{ color: "#3A7326" }}>
            Email:{" "}
          </span>
          <span className="text-gray-600 break-all">{member.email}</span>
        </span>
      </div>
    </article>
  );
}

export default function StaffList({ members }: StaffListProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <p className="text-sm">No staff members found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {members.map((m) => (
        <StaffCard key={m.id} member={m} />
      ))}
    </div>
  );
}