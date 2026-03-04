/** PostgreSQL unique constraint violation error code */
export const PG_UNIQUE_VIOLATION = "23505";

export const DURATION_OPTIONS = [
  { months: 1, label: "1 mes", discount: 0 },
  { months: 3, label: "3 meses", discount: 0.05 },
  { months: 6, label: "6 meses", discount: 0.10 },
  { months: 12, label: "12 meses", discount: 0.20 },
  { months: 24, label: "24 meses", discount: 0.30 },
] as const;

export const DEFAULT_DURATION = 3;

/** @deprecated Use product.prices[months] directly for individual products */
export function getDiscountForMonths(months: number): number {
  const opt = DURATION_OPTIONS.find((o) => o.months === months);
  return opt?.discount ?? 0;
}

export type DurationOption = (typeof DURATION_OPTIONS)[number];
