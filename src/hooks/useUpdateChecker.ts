import { useState, useEffect } from "react";
import { isElectron } from "@/lib/electron-utils";

const GITHUB_OWNER = "YumiNoona";
const GITHUB_REPO = "VeilY";
const RELEASES_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

function parseVersion(tag: string): string {
  return tag.replace(/^v/i, "");
}

function isNewer(latest: string, current: string): boolean {
  const l = latest.split(".").map(Number);
  const c = current.split(".").map(Number);
  for (let i = 0; i < Math.max(l.length, c.length); i++) {
    const a = l[i] || 0;
    const b = c[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

export function useUpdateChecker() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isElectron()) return;
    const dismissedFlag = localStorage.getItem("veily_update_dismissed");
    if (dismissedFlag) {
      setDismissed(true);
      return;
    }

    let cancelled = false;

    const check = async () => {
      try {
        const { getVersion } = await import("@tauri-apps/api/app");
        const current = await getVersion();
        if (cancelled) return;
        setCurrentVersion(current);

        const res = await fetch(API_URL, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const latest = parseVersion(data.tag_name || data.name || "");
        setLatestVersion(latest);

        if (latest && isNewer(latest, current)) {
          setUpdateAvailable(true);
        }
      } catch {
        // Silently fail — don't bother the user on errors
      }
    };

    check();
    return () => { cancelled = true; };
  }, []);

  const dismiss = () => {
    setUpdateAvailable(false);
    setDismissed(true);
    localStorage.setItem("veily_update_dismissed", "true");
  };

  return { updateAvailable, currentVersion, latestVersion, dismiss, releasesUrl: RELEASES_URL };
}
