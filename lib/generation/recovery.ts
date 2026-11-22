export const GENERATE_ERROR_CODE = {
  insufficientCredits: "INSUFFICIENT_CREDITS",
  generationFailed: "GENERATION_FAILED",
  unauthorized: "UNAUTHORIZED",
} as const;

export type GenerateErrorPayload = {
  error?: string;
  code?: string;
};

export function isInsufficientCreditsError(
  status: number,
  payload?: GenerateErrorPayload | null,
): boolean {
  if (status === 402) return true;
  if (!payload) return false;
  return (
    payload.code === GENERATE_ERROR_CODE.insufficientCredits ||
    /insufficient credits/i.test(payload.error ?? "")
  );
}

export function safeRedirectPath(value?: string | null): string | null {
  if (!value || value.length > 512) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (value.includes("\\") || /[\r\n]/.test(value)) return null;
  return value;
}
