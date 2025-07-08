// Date formatting utilities
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "relative" = "short",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    case "long":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    case "relative":
      const diffInMs = now.getTime() - dateObj.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          return diffInMinutes <= 0
            ? "Just now"
            : `${diffInMinutes} minutes ago`;
        }
        return `${diffInHours} hours ago`;
      } else if (diffInDays === 1) {
        return "Yesterday";
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months > 1 ? "s" : ""} ago`;
      } else {
        const years = Math.floor(diffInDays / 365);
        return `${years} year${years > 1 ? "s" : ""} ago`;
      }

    default:
      return dateObj.toLocaleDateString();
  }
}

export function formatTimeUntil(futureDate: Date | string): string {
  const dateObj =
    typeof futureDate === "string" ? new Date(futureDate) : futureDate;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();

  if (diffInMs <= 0) {
    return "Expired";
  }

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes left`;
    }
    return `${diffInHours} hours left`;
  } else if (diffInDays === 1) {
    return "Tomorrow";
  } else if (diffInDays < 7) {
    return `${diffInDays} days left`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} left`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? "s" : ""} left`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? "s" : ""} left`;
  }
}

// Number formatting utilities
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(
  number: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    style?: "decimal" | "percent";
  },
): string {
  const defaults = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    style: "decimal" as const,
  };

  const config = { ...defaults, ...options };

  return new Intl.NumberFormat("en-US", config).format(number);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${size.toFixed(2)} ${sizes[i]}`;
}

// Text formatting utilities
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = "...",
): string {
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - ellipsis.length) + ellipsis;
}

export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function camelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function kebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function snakeCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// URL formatting utilities
export function formatUrl(url: string): string {
  if (!url) return "";

  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(formatUrl(url));
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(formatUrl(url));
    return true;
  } catch {
    return false;
  }
}

// Array formatting utilities
export function formatList(
  items: string[],
  conjunction: string = "and",
): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(", ")}, ${conjunction} ${lastItem}`;
}

export function formatTags(tags: string[], maxDisplay: number = 3): string {
  if (tags.length === 0) return "";

  if (tags.length <= maxDisplay) {
    return tags.join(", ");
  }

  const displayTags = tags.slice(0, maxDisplay);
  const remainingCount = tags.length - maxDisplay;

  return `${displayTags.join(", ")}, +${remainingCount} more`;
}

// Color utilities
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return "#000000";

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

// Search highlighting
export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  highlightClass: string = "highlight",
): string {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

// Phone number formatting
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phoneNumber;
}

/**
 * Clears all persisted Zustand stores from localStorage.
 * Call this on logout to fully reset all user/session state.
 */
export function clearAllZustandStores() {
  try {
    localStorage.removeItem("auth-store");
    localStorage.removeItem("layout-store");
    localStorage.removeItem("settings-storage");
    // If opportunity store is ever persisted, add its key here
    // localStorage.removeItem('opportunity-store');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to clear Zustand stores:", err);
  }
}

// Export all utilities
export const formatUtils = {
  formatDate,
  formatTimeUntil,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  camelCase,
  kebabCase,
  snakeCase,
  slugify,
  formatUrl,
  extractDomain,
  isValidUrl,
  formatList,
  formatTags,
  hexToRgb,
  rgbToHex,
  getContrastColor,
  highlightSearchTerm,
  formatPhoneNumber,
};
