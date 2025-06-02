import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Link, InertiaLinkProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import React from 'react';

interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  children?: React.ReactNode;
}

interface PaginationItemProps {
  isActive?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  href: string;
  className?: string;
}

interface PaginationButtonProps {
  disabled?: boolean;
  children?: React.ReactNode;
  href: string;
  className?: string;
}

const Pagination = ({ className, children }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
  >
    {children}
  </nav>
);

const PaginationItem = ({ className, isActive, disabled, href, children }: PaginationItemProps) => {
    if (disabled) {
      return (
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm text-muted-foreground opacity-50 cursor-not-allowed",
            className
          )}
        >
          {children}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          className
        )}
      >
        {children}
      </Link>
    );
  }
;

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationNextButton = ({ className, disabled, href }: PaginationButtonProps) => {
  if (disabled) {
    return (
      <span
        className={cn(
          "flex h-9 px-2 items-center justify-center rounded-md border border-input bg-background text-sm text-muted-foreground opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span>Next</span>
        <ChevronRight className="ml-1 h-4 w-4" />
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 px-2 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <span>Next</span>
      <ChevronRight className="ml-1 h-4 w-4" />
    </Link>
  );
};

const PaginationPrevButton = ({ className, disabled, href }: PaginationButtonProps) => {
  if (disabled) {
    return (
      <span
        className={cn(
          "flex h-9 px-2 items-center justify-center rounded-md border border-input bg-background text-sm text-muted-foreground opacity-50 cursor-not-allowed",
          className
        )}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        <span>Previous</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 px-2 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      <span>Previous</span>
    </Link>
  );
};

Pagination.Item = PaginationItem;
Pagination.Ellipsis = PaginationEllipsis;
Pagination.NextButton = PaginationNextButton;
Pagination.PrevButton = PaginationPrevButton;

export { Pagination };
