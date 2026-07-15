import React from "react";
import { Clock, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RosterToolbarProps {
  tab: "today" | "tomorrow";
  todayDate: Date;
  tomorrowDate: Date;
  showFilters: boolean;
  activeFilterCount: number;
  time: "all" | "now";
  onTabChange: (tab: "today" | "tomorrow") => void;
  onToggleFilters: () => void;
  onToggleTime: () => void;
}

const activeButton =
  "border-red-800 bg-red-900 text-white";

const inactiveButton =
  "border-red-900/60 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white";

const RosterToolbar: React.FC<RosterToolbarProps> = ({
  tab,
  todayDate,
  tomorrowDate,
  showFilters,
  activeFilterCount,
  time,
  onTabChange,
  onToggleFilters,
  onToggleTime,
}) => {
  const { t, i18n } = useTranslation();

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
    }).format(date);

  return (
    <div className="mx-4 mb-6 flex w-fit items-center overflow-x-auto border-y border-red-900/40">
      <button
        type="button"
        onClick={() => onTabChange("today")}
        className={`shrink-0 border-r border-red-900/40 px-4 py-3 border-l text-lg font-semibold transition-colors ${
          tab === "today" ? activeButton : inactiveButton
        }`}
      >
        {formatDate(todayDate)}
      </button>

      <button
        type="button"
        onClick={() => onTabChange("tomorrow")}
        className={`shrink-0 border-r border-red-900/40 px-4 py-3 text-lg font-semibold transition-colors ${
          tab === "tomorrow" ? activeButton : inactiveButton
        }`}
      >
        {formatDate(tomorrowDate)}
      </button>

      <button
        type="button"
        onClick={onToggleTime}
        className={`flex shrink-0 items-center gap-2 border-r border-red-900/40 px-4 py-3 text-lg transition-colors ${
          time === "now" ? activeButton : inactiveButton
        }`}
      >
        <Clock className="h-4 w-4" />
        {time === "all"
          ? t("filter.viewAll")
          : t("filter.onNow")}
      </button>

      <button
        type="button"
        onClick={onToggleFilters}
        className={`flex shrink-0 items-center gap-2 px-4 py-3 border-r text-lg transition-colors ${
          showFilters || activeFilterCount > 0
            ? activeButton
            : inactiveButton
        }`}
      >
        <Filter className="h-4 w-4" />
        {t("filter.filters")}

        {activeFilterCount > 0 && (
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default RosterToolbar;