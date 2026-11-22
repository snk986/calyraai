import { createClient } from "@/utils/supabase/server";
import { ensureCustomerInitialized } from "@/lib/auth/ensure-customer-initialized";
import { trackServerUserEvent } from "@/lib/analytics/user-events-server";
import { SEO_TOOL_PAGE_PATHS } from "@/config/seo-pages";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectToParam = requestUrl.searchParams.get("redirect_to");
  const redirectTo =
    redirectToParam &&
    redirectToParam.startsWith("/") &&
    !redirectToParam.startsWith("//")
      ? redirectToParam
      : null;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      try {
        await ensureCustomerInitialized(user.id, user.email, "auth_callback");
      } catch (error) {
        console.error("Failed to ensure customer initialization:", error);
      }
      await trackServerUserEvent({
        userId: user.id,
        eventName: "auth_callback_completed",
        properties: {
          route: redirectTo ?? SEO_TOOL_PAGE_PATHS.aiTextToSong,
        },
        pathname: "/auth/callback",
      });
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after auth callback completes without explicit redirect target.
  return NextResponse.redirect(`${origin}${SEO_TOOL_PAGE_PATHS.aiTextToSong}`);
}
