
User wants the CookieYes banner script installed in `<head>` as high as possible. Currently `index.html` has GA4 right after `<head>`. CookieYes recommends loading BEFORE other tags so it can manage consent for them. Plan: place CookieYes as the very first script in `<head>`, before GA4.

The user also mentions Google Consent Mode "Anular valores predeterminados" (override defaults). CookieYes auto-injects Consent Mode v2 default signals when its script loads first — that's why placement order matters. No code changes needed in GA4 itself; CookieYes will gate it.

One thing worth flagging before starting: do they want me to also configure Consent Mode defaults manually (gtag('consent', 'default', {...}) before GA4), or trust CookieYes to inject them automatically? CookieYes by default DOES inject Consent Mode defaults when enabled in their dashboard, so usually no manual code is needed. I'll note this in the plan.
