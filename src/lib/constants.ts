/** PostgreSQL unique constraint violation error code */
export const PG_UNIQUE_VIOLATION = "23505";

export const DURATION_OPTIONS = [
  { months: 1, label: "Mensual", discount: 0 },
  { months: 3, label: "3 meses", discount: 0.05 },
  { months: 6, label: "6 meses", discount: 0.10 },
  { months: 12, label: "12 meses", discount: 0.20 },
] as const;

export type DurationOption = (typeof DURATION_OPTIONS)[number];
