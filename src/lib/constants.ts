/** PostgreSQL unique constraint violation error code */
export const PG_UNIQUE_VIOLATION = "23505";

export const DURATION_OPTIONS = [
  { months: 1, label: "1 mes" },
  { months: 3, label: "3 meses" },
  { months: 6, label: "6 meses" },
  { months: 12, label: "12 meses" },
  { months: 24, label: "24 meses" },
] as const;

export const DEFAULT_DURATION = 3;

/** @deprecated Use product.prices[months] directly */
export function getDiscountForMonths(_months: number): number {
  return 0;
}

export type DurationOption = (typeof DURATION_OPTIONS)[number];
