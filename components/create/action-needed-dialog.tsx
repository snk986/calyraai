"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ActionNeededType = "sign-in" | "pricing" | "error";

export function ActionNeededDialog({
  action,
  localePrefix,
  onClose,
  onRetry,
  errorMessage,
}: {
  action: ActionNeededType | null;
  localePrefix: string;
  onClose: () => void;
  onRetry?: () => void;
  errorMessage?: string | null;
}) {
  const t = useTranslations("create.songMaker");
  const pathname = usePathname();
  const encodedRedirectTo = encodeURIComponent(pathname ?? "/");
  const pricingHref = `${localePrefix}/pricing?redirectTo=${encodedRedirectTo}`;
  const signInHref = `${localePrefix}/sign-in?redirectTo=${encodedRedirectTo}`;
  const title =
    action === "error" ? t("generationFailed") : t("actionNeededTitle");
  const description =
    action === "sign-in"
      ? t("signInRequiredMessage")
      : action === "pricing"
        ? t("creditsTooLowMessage")
        : (errorMessage ?? t("generationFailedMessage"));

  return (
    <Dialog
      open={Boolean(action)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md rounded-lg border-border bg-card p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {action === "error" ? (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onClose}
              >
                {t("close")}
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href={pricingHref}>{t("viewPlansCta")}</Link>
              </Button>
              {onRetry && (
                <Button className="w-full sm:w-auto" onClick={onRetry}>
                  {t("retryCta")}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onClose}
              >
                {t("laterCta")}
              </Button>
              <Button className="w-full sm:w-auto" asChild>
                <Link href={action === "sign-in" ? signInHref : pricingHref}>
                  {action === "sign-in" ? t("signInCta") : t("topUpCreditsCta")}
                </Link>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
