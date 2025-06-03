import { useRef, useEffect } from "react";

/**
 * Hides the scrollbar of a target element if there's no user action for `timeout` ms.
 * Shows the scrollbar again on user interaction.
 * @param targetSelector - CSS selector for the scrollable element (e.g. ".my-scrollable-div")
 * @param timeout - Time in ms before hiding the scrollbar (default: 1500)
 */

export function formatTimeTo12Hour(time24: string) {
  if (!time24) return "";
  const [hour, minute] = time24.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12.toString().padStart(2, "0")}:${minute} ${ampm}`;
}

export function formatTimeTo24Hour(time12h: string) {
  if (!time12h) return "";
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  if (modifier === 'PM' && h < 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minutes}`;
}

export function formatUserDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} ${date.toLocaleDateString("en-US", { weekday: "short" })}`;
}

export const useLongPress = (callback: () => void, ms: number = 500) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    const start = () => {
      timerRef.current = setTimeout(callback, ms);
    };
  
    const clear = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  
    return {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: clear,
    };
};

export function filterAndSortUsers(
  users: any[],
  query: string,
  role: string,
  order: string,
  verified: string,
  status: string
) {
  let filtered = [...users];

  // Search query filter
  if (query.trim()) {
    filtered = filtered.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }

  // Role filter
  if (role) {
    filtered = filtered.filter((user) => user.role === role);
  }

  // Email verified filter
  if (verified) {
    filtered = filtered.filter((user) =>
      verified === "verified" ? user.emailVerified : !user.emailVerified
    );
  }

  // Status filter
  if (status) {
    filtered = filtered.filter((user) =>
      status === "active" ? !user.disabled : user.disabled
    );
  }

  // Alphabetical order filter
  if (order === "asc") {
    filtered = filtered.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  } else if (order === "desc") {
    filtered = filtered.sort((a, b) =>
      b.displayName.localeCompare(a.displayName)
    );
  }

  return filtered;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (safePage - 1) * perPage;
  const endIdx = startIdx + perPage;
  return {
    paged: items.slice(startIdx, endIdx),
    totalPages,
    safePage,
  };
}

export function filterAndSortMembers(
  users: any[],
  query: string,
) {
  let filtered = [...users];

  // Search query filter
  if (query.trim()) {
    filtered = filtered.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }

  return filtered;
}

export function paginateMembers<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (safePage - 1) * perPage;
  const endIdx = startIdx + perPage;
  return {
    paged: items.slice(startIdx, endIdx),
    totalPages,
    safePage,
  };
}

export function useAutoHideScrollbar(targetSelector: string, timeout: number = 1500) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = document.querySelector(targetSelector) as HTMLElement | null;
    if (!el) return;

    const showScrollbar = () => {
      el.classList.remove("hide-scrollbar");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hideScrollbar, timeout);
    };

    const hideScrollbar = () => {
      el.classList.add("hide-scrollbar");
    };

    // Initial show
    showScrollbar();

    // Listen for user actions
    el.addEventListener("mousemove", showScrollbar);
    el.addEventListener("scroll", showScrollbar);
    el.addEventListener("keydown", showScrollbar);

    return () => {
      el.removeEventListener("mousemove", showScrollbar);
      el.removeEventListener("scroll", showScrollbar);
      el.removeEventListener("keydown", showScrollbar);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [targetSelector, timeout]);
}
