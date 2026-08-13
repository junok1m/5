// src/components/RosterGrid.tsx

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import RosterCard from "./RosterCard";
import RosterToolbar from "./roster/RosterToolbar";
import RosterFilters from "./roster/RosterFilters";
import RosterMessages from "./roster/RosterMessages";

import { useRosterData } from "../hooks/useRosterData";
import { useRosterParams } from "../hooks/useRosterParams";


import {
  buildProvidersIndex,
  buildRosterModel,
  serviceKey,
  type RosterModel,
} from "../lib/roster/providerMap";

import { addDays, getShiftStatusOnDay, startOfDay } from "../lib/roster/time";

function shuffle<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RosterGrid: React.FC = () => {
  const { t, i18n } = useTranslation();
  const natLabel = useCallback(
    (raw: string) => {
      const key = `nationalities.${raw}`;
      return i18n.exists(key) ? t(key) : raw;
    },
    [i18n, t]
  );

  const { providers, apiToday, apiTomorrow, apiError, isLoading } = useRosterData();
  const { tab, time, nat, svc, showFilters, commitParams } = useRosterParams();

  const providersIndex = useMemo(() => buildProvidersIndex(providers), [providers]);

  const currentRoster: RosterModel[] = useMemo(() => {
    const roster = tab === "today" ? apiToday : apiTomorrow;
    if (!roster || !providers) return [];

    return roster
      .map((entry) => buildRosterModel(entry, providersIndex))
      .filter(Boolean) as RosterModel[];
  }, [tab, apiToday, apiTomorrow, providers, providersIndex]);

  // ✅ shop "business day" starts at 10:00 and runs until 03:00 next day
  const SHOP_DAY_START_HOUR = 10;

  const shopToday = useMemo(() => {
    const now = new Date();
    const calendarToday = startOfDay(now);

    return now.getHours() < SHOP_DAY_START_HOUR
      ? addDays(calendarToday, -1)
      : calendarToday;
  }, []);

  const shopTomorrow = useMemo(
    () => addDays(shopToday, 1),
    [shopToday],
  );

  const rosterDay =
    tab === "tomorrow" ? shopTomorrow : shopToday;

  const shuffleKey = useMemo(() => {
    return ["n5m", tab, time, nat.join("|"), svc.join("|")].join("::");
  }, [tab, time, nat, svc]);

  const randomizedRoster = useMemo(() => {
    if (!currentRoster.length) return [];

    const cacheKey = `roster-shuffle:${shuffleKey}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const ids = JSON.parse(cached) as number[];
        const map = new Map(currentRoster.map((m) => [m.id, m]));
        const ordered = ids.map((id) => map.get(id)).filter(Boolean) as RosterModel[];

        if (ordered.length !== currentRoster.length) {
          const seen = new Set(ordered.map((m) => m.id));
          const missing = currentRoster.filter((m) => !seen.has(m.id));
          return [...ordered, ...missing];
        }

        return ordered;
      } catch {
        // fall through
      }
    }

    const newOnes = currentRoster.filter((m) => m.isNew);
    const rest = currentRoster.filter((m) => !m.isNew);
    const shuffled = [...newOnes, ...shuffle(rest)];

    sessionStorage.setItem(cacheKey, JSON.stringify(shuffled.map((m) => m.id)));
    return shuffled;
  }, [currentRoster, shuffleKey]);

  const timeFilteredRoster = useMemo(() => {
    if (time === "all") {
      return randomizedRoster;
    }

    return randomizedRoster.filter((model) => {
      if (!model.startTime || !model.endTime) {
        return false;
      }

      return (
        getShiftStatusOnDay(
          model.startTime,
          model.endTime,
          rosterDay,
        ) === "now"
      );
    });
  }, [randomizedRoster, time, rosterDay]);

  const nationalities = useMemo(
    () => [...new Set(timeFilteredRoster.map((m) => m.nationality))].filter(Boolean).sort(),
    [timeFilteredRoster]
  );

  const serviceFilterLabels = useMemo(() => {
    return [
      ...new Set(
        timeFilteredRoster
          .flatMap((m) => (m.services || []).filter((s) => s.available).map((s) => s.name))
          .filter(Boolean)
      ),
    ].sort();
  }, [timeFilteredRoster]);

  const modelHasAllSelectedServices = useCallback(
    (model: RosterModel) => {
      if (svc.length === 0) return true;
      const available = (model.services || []).filter((s) => s.available).map((s) => s.name);
      return svc.every((s) => available.includes(s));
    },
    [svc]
  );

  const filteredRoster = useMemo(() => {
    return timeFilteredRoster.filter((model) => {
      if (nat.length > 0 && !nat.includes(model.nationality)) return false;
      if (!modelHasAllSelectedServices(model)) return false;
      return true;
    });
  }, [timeFilteredRoster, nat, modelHasAllSelectedServices]);

  const toggleNationality = (n: string) => {
    const next = nat.includes(n) ? nat.filter((x) => x !== n) : [...nat, n];
    commitParams({ nat: next });
  };

  const toggleService = (s: string) => {
    const next = svc.includes(s) ? svc.filter((x) => x !== s) : [...svc, s];
    commitParams({ svc: next });
  };

  const clearFilters = () => {
    commitParams({ nat: [], svc: [] });
  };

  const activeFilterCount = nat.length + svc.length;

  const showTomorrowReleaseMsg =
    tab === "tomorrow" && apiTomorrow != null && Array.isArray(apiTomorrow) && apiTomorrow.length === 0;

  const emptyText = t("roster.emptyTitleTime", {
    defaultValue:
      "No girls match your current time or filters. Try switching the time filter or clearing filters.",
  });

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-12">
      <div className="relative z-10 w-full">
        <RosterMessages
          apiError={apiError}
          isLoading={isLoading}
          showTomorrowReleaseMsg={showTomorrowReleaseMsg}
          showEmpty={
            !isLoading &&
            !showTomorrowReleaseMsg &&
            filteredRoster.length === 0
          }
          emptyText={emptyText}
          onClearFilters={clearFilters}
        />

          <RosterToolbar
            tab={tab}
            todayDate={shopToday}
            tomorrowDate={shopTomorrow}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            time={time}
            onTabChange={(nextTab) =>
              commitParams({ tab: nextTab })
            }
            onToggleFilters={() =>
              commitParams({ filters: !showFilters })
            }
            onToggleTime={() =>
              commitParams({
                time: time === "all" ? "now" : "all",
              })
            }
          />

        <RosterFilters
          show={showFilters}
          nationalities={nationalities}
          selectedNationalities={nat}
          onToggleNationality={toggleNationality}
          natLabel={natLabel}
          services={serviceFilterLabels}
          selectedServices={svc}
          onToggleService={toggleService}
          serviceLabel={(service) =>
            t(`services.${serviceKey(service)}`)
          }
          onClear={clearFilters}
        />

        {/* Grid */}
        <div className="w-full px-0">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-0">
            {filteredRoster.map((model) => (
              <RosterCard key={model.id} model={model} natLabel={natLabel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RosterGrid;
