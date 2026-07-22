"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Google's free "Website Translator" widget — chosen over a traditional i18n library
// because the catalog (product titles/descriptions) is admin-entered DB content, not
// fixed strings, so a library like next-intl would only ever translate the static UI
// chrome and leave every product untranslated. This translates the whole rendered page
// for $0/month.
//
// This uses the documented cookie + reload integration (not the undocumented trick of
// dispatching a "change" event on Google's internal <select> directly — that was tried
// and found unreliable: it sometimes applied the wrong language and sometimes didn't
// visually translate at all). The reload approach reliably translates, but Google's own
// on-page banner lets the visitor revert to English independently of our UI (by closing
// the banner or clicking "Show original"). A MutationObserver below watches for that and
// keeps this dropdown honest instead of trusting the cookie blindly.
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
      };
    };
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "pl", label: "Polski" },
  { code: "nl", label: "Nederlands" },
  { code: "ar", label: "العربية" },
  { code: "zh-CN", label: "中文 (简体)" },
  { code: "ja", label: "日本語" },
  { code: "hi", label: "हिन्दी" },
] as const;

const COOKIE_NAME = "googtrans";
const SCRIPT_ID = "google-translate-script";
const CONTAINER_ID = "google_translate_element";
const PENDING_LANGUAGE_KEY = "4f-pending-language";

function readLanguageFromCookie(): string {
  const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
  return match?.[1] ?? "en";
}

// Google's widget can itself persist a domain-qualified variant of this cookie
// alongside a bare one. If only the bare variant is ever touched, a stale
// domain-qualified value can survive underneath and win out over a freshly-set one —
// which is exactly what made switching directly between two non-English languages
// silently fall back to English. Clearing (and setting) both variants every time
// keeps exactly one value in play.
function clearLanguageCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  document.cookie = `${COOKIE_NAME}=; path=/; domain=${window.location.hostname}; max-age=0`;
}

function setLanguageCookie(code: string) {
  clearLanguageCookie();
  if (code === "en") return;
  document.cookie = `${COOKIE_NAME}=/en/${code}; path=/`;
  document.cookie = `${COOKIE_NAME}=/en/${code}; path=/; domain=${window.location.hostname}`;
}

// Google's script adds this class to <html> the instant translation is actually live, and
// removes it the instant the visitor reverts — via its own banner's "Show original", by
// closing the banner, or any other route. Checking this (rather than trusting our cookie)
// is what lets the dropdown notice a revert it didn't initiate itself.
function isActuallyTranslated(): boolean {
  const classList = document.documentElement.classList;
  return classList.contains("translated-ltr") || classList.contains("translated-rtl");
}

function loadGoogleTranslateScript() {
  if (document.getElementById(SCRIPT_ID)) return;

  window.googleTranslateElementInit = () => {
    if (!window.google) return;
    new window.google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, CONTAINER_ID);
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

export function LanguageSwitcher() {
  const [current, setCurrent] = useState("en");

  useEffect(() => {
    // Switching directly between two non-English languages was found to race with
    // Google's own widget (already live and reactive on the page from the prior
    // translation) and silently fail, landing back on English. Routing through a
    // plain English reload first guarantees the widget is uninitialized before the
    // target language cookie is applied, sidestepping that race entirely.
    const pending = window.sessionStorage.getItem(PENDING_LANGUAGE_KEY);
    if (pending) {
      window.sessionStorage.removeItem(PENDING_LANGUAGE_KEY);
      setLanguageCookie(pending);
      window.location.reload();
      return;
    }

    const cookieLang = readLanguageFromCookie();
    if (cookieLang === "en") return;

    // A cookie is asking for a translation — load the widget so it actually applies, then
    // confirm it really took (rather than trusting the cookie blindly: an earlier visit
    // may have been reverted via Google's own banner without ever clearing this cookie).
    loadGoogleTranslateScript();

    const deadline = Date.now() + 5000;
    const confirmInterval = setInterval(() => {
      if (isActuallyTranslated()) {
        setCurrent(cookieLang);
        clearInterval(confirmInterval);
      } else if (Date.now() > deadline) {
        clearLanguageCookie();
        clearInterval(confirmInterval);
      }
    }, 200);

    return () => clearInterval(confirmInterval);
  }, []);

  // Stay in sync for the rest of the page's life, too — if the visitor dismisses Google's
  // own banner (or clicks "Show original") without reloading, the page reverts to English
  // immediately, and this dropdown should reflect that immediately as well.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const translated = isActuallyTranslated();
      if (!translated && current !== "en") {
        clearLanguageCookie();
        setCurrent("en");
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [current]);

  function handleSelect(code: string) {
    if (code === current) return;

    if (current !== "en" && code !== "en") {
      // A translation is already live — step through a clean English reload first
      // (see the mount effect above for why) before applying the new target language.
      clearLanguageCookie();
      window.sessionStorage.setItem(PENDING_LANGUAGE_KEY, code);
      window.location.reload();
      return;
    }

    setLanguageCookie(code);
    window.location.reload();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Change language">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn(lang.code === current && "font-semibold")}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div id={CONTAINER_ID} className="hidden" />
    </>
  );
}
