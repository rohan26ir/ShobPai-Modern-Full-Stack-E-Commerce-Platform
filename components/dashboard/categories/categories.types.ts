export type CategoryTimeFilter = "This Month" | "This Week" | "Today" | "All Time";

export type CategoryViewMode = "table" | "grid";

export interface CategoryColorPreset {
  label: string;
  value: string;
  dot: string;
}

export interface CategoryImagePreset {
  label: string;
  url: string;
}

