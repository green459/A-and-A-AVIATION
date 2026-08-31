"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

export interface SettingsSubTab {
  id: string;
  label: string;
  /** Each entry renders as its own card in the responsive grid below. */
  items: ReactNode[];
}

export interface SettingsTab {
  id: string;
  label: string;
  description: string;
  /** Either provide `items` directly, or split the tab into `subTabs` when
   * it covers more than a couple of unrelated sections. */
  items?: ReactNode[];
  subTabs?: SettingsSubTab[];
}

/** Lays cards out in up to 2 columns on large screens, using CSS grid
 * rather than CSS multi-column (`columns-2`). Multi-column's
 * `break-inside-avoid` is only a hint — Chromium still fragments a card
 * that's taller than the column's balanced height, which visibly corrupts
 * anything with its own internal layout (a delete button ends up rendered
 * mid-card, form rows overlap, etc.). Grid never fragments an item, so a
 * tall repeating-fields card just renders in full inside its cell — the
 * only tradeoff is columns aren't height-balanced against each other, which
 * is a purely cosmetic gap, not a broken layout.
 *
 * `@container` makes the *actual rendered width* of a cell queryable — the
 * form cards inside (ImageListField, ImageRepeatingFieldsField,
 * SocialLinksField) switch their own internal row layout on `@sm:`/`@lg:`
 * container-query variants rather than `sm:`/`lg:` viewport ones, so they
 * correctly stay stacked when a cell is narrow even on a wide viewport,
 * instead of prematurely going horizontal and overlapping. */
function ContentGrid({ items }: { items: ReactNode[] }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className="@container min-w-0">
          {item}
        </div>
      ))}
    </div>
  );
}

function updateUrl(tab: string, subtab?: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.set("tab", tab);
  if (subtab) params.set("subtab", subtab);
  else params.delete("subtab");
  const query = params.toString();
  // Raw History API, not next/navigation's router — this only needs to
  // make the URL reload-safe, not trigger a Server Component re-fetch (the
  // data driving every tab is already loaded; nothing here is fetched
  // per-tab). router.replace() would re-request the page on every click.
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

/** Groups the settings page's many forms into tabs (and, for the busier
 * pages, sub-tabs) instead of one long scroll. Every tab/sub-tab's content
 * stays mounted the whole time — switching just toggles CSS visibility —
 * so nothing is ever re-fetched or lost mid-edit by clicking around. The
 * active tab/sub-tab is read from the URL (`?tab=`/`?subtab=`) once on
 * load, and kept in sync as the admin clicks around, so a reload lands back
 * on the same section instead of resetting to the first tab. */
export default function SettingsTabs({ tabs }: { tabs: SettingsTab[] }) {
  const searchParams = useSearchParams();

  const [activeTabId, setActiveTabId] = useState(
    () => tabs.find((t) => t.id === searchParams.get("tab"))?.id ?? tabs[0]?.id,
  );
  const initialTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const [activeSubTabId, setActiveSubTabId] = useState(
    () =>
      initialTab?.subTabs?.find((s) => s.id === searchParams.get("subtab"))?.id ??
      initialTab?.subTabs?.[0]?.id,
  );

  function selectTab(tab: SettingsTab) {
    setActiveTabId(tab.id);
    const firstSub = tab.subTabs?.[0]?.id;
    setActiveSubTabId(firstSub);
    updateUrl(tab.id, firstSub);
  }

  function selectSubTab(id: string) {
    setActiveSubTabId(id);
    updateUrl(activeTabId ?? tabs[0]?.id ?? "", id);
  }

  return (
    <div>
      <div role="tablist" aria-label="Settings section" className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeTabId}
            onClick={() => selectTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab.id === activeTabId
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} className={tab.id === activeTabId ? "contents" : "hidden"}>
          <p className="mt-4 max-w-3xl text-sm text-gray-500">{tab.description}</p>

          {tab.subTabs && (
            <div
              role="tablist"
              aria-label={`${tab.label} section`}
              className="mt-5 flex flex-wrap gap-1.5 rounded-xl bg-gray-100 p-1.5"
            >
              {tab.subTabs.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  role="tab"
                  aria-selected={sub.id === activeSubTabId}
                  onClick={() => selectSubTab(sub.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                    sub.id === activeSubTabId
                      ? "bg-white text-navy shadow-sm"
                      : "text-gray-600 hover:text-navy"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {tab.subTabs ? (
            tab.subTabs.map((sub) => (
              <div
                key={sub.id}
                className={sub.id === activeSubTabId ? "mt-6" : "hidden"}
              >
                <ContentGrid items={sub.items} />
              </div>
            ))
          ) : (
            <div className="mt-6">
              <ContentGrid items={tab.items ?? []} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
