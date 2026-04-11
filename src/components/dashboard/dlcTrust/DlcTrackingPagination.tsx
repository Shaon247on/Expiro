"use client";

import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DlcTrackingPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function DlcTrackingPagination({
  currentPage,
  totalPages,
  basePath,
}: DlcTrackingPaginationProps) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  function href(page: number) {
    const sep = basePath.includes("?") ? "&" : "?";
    return `${basePath}${sep}page=${page}`;
  }

  function navigate(page: number) {
    router.push(href(page));
  }

  function getPages(): (number | "ellipsis")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex justify-center mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={canPrev ? () => navigate(currentPage - 1) : undefined}
              aria-disabled={!canPrev}
              className={
                !canPrev
                  ? "pointer-events-none opacity-40 cursor-default"
                  : "cursor-pointer"
              }
              href={canPrev ? href(currentPage - 1) : undefined}
            />
          </PaginationItem>

          {getPages().map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href={href(p)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(p);
                  }}
                  isActive={p === currentPage}
                  aria-current={p === currentPage ? "page" : undefined}
                  style={
                    p === currentPage
                      ? {
                          backgroundColor: "#3A7326",
                          color: "white",
                          borderColor: "#3A7326",
                        }
                      : { cursor: "pointer" }
                  }
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={canNext ? () => navigate(currentPage + 1) : undefined}
              aria-disabled={!canNext}
              className={
                !canNext
                  ? "pointer-events-none opacity-40 cursor-default"
                  : "cursor-pointer"
              }
              href={canNext ? href(currentPage + 1) : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}