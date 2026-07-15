// src/hooks/useRosterParams.ts

import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export type RosterTab = "today" | "tomorrow";
export type RosterTimeFilter = "all" | "now";

export function useRosterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- parse URL (single source of truth)
  const rawTime = searchParams.get("time");

  const time: RosterTimeFilter =
    rawTime === "now" ? "now" : "all";

  const tab: RosterTab =
    searchParams.get("tab") === "tomorrow" ? "tomorrow" : "today";

  const nat = (searchParams.get("nat") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const svc = (searchParams.get("svc") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const page = Math.max(
    0,
    Number(searchParams.get("page") || "0") || 0,
  );

  const showFilters = searchParams.get("filters") === "1";

  const commitParams = useCallback(
    (patch: {
      tab?: RosterTab;
      nat?: string[];
      svc?: string[];
      page?: number;
      filters?: boolean;
      time?: RosterTimeFilter;
    }) => {
      const next = new URLSearchParams(searchParams);

      if (patch.time) {
        if (patch.time === "all") {
          next.delete("time");
        } else {
          next.set("time", patch.time);
        }
      }

      if (patch.tab) {
        next.set("tab", patch.tab);
      }

      if (patch.nat) {
        if (patch.nat.length) {
          next.set("nat", patch.nat.join(","));
        } else {
          next.delete("nat");
        }
      }

      if (patch.svc) {
        if (patch.svc.length) {
          next.set("svc", patch.svc.join(","));
        } else {
          next.delete("svc");
        }
      }

      if (typeof patch.page === "number") {
        next.set("page", String(patch.page));
      }

      if (typeof patch.filters === "boolean") {
        if (patch.filters) {
          next.set("filters", "1");
        } else {
          next.delete("filters");
        }
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Ensure required defaults exist
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;

    // "all" is the default, so no time parameter is needed
    if (
      next.get("time") &&
      next.get("time") !== "now"
    ) {
      next.delete("time");
      changed = true;
    }

    if (!next.get("tab")) {
      next.set("tab", "today");
      changed = true;
    }

    if (!next.get("page")) {
      next.set("page", "0");
      changed = true;
    }

    if (changed) {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return {
    time,
    tab,
    nat,
    svc,
    page,
    showFilters,
    commitParams,
  };
}