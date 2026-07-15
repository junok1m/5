import React from "react";
import { useTranslation } from "react-i18next";

interface RosterMessagesProps {
  apiError: string | null;
  isLoading: boolean;
  showTomorrowReleaseMsg: boolean;
  showEmpty: boolean;
  emptyText: string;
  onClearFilters: () => void;
}

const RosterMessages: React.FC<RosterMessagesProps> = ({
  apiError,
  isLoading,
  showTomorrowReleaseMsg,
  showEmpty,
  emptyText,
  onClearFilters,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {apiError && (
        <div className="mx-6 mb-4 border border-red-900 bg-red-900/10 p-3 text-sm text-zinc-200">
          API error: {apiError}
        </div>
      )}

      {showTomorrowReleaseMsg && (
        <div className="mx-6 mb-6 border border-red-900 bg-red-900/10 p-4 text-center text-zinc-100">
          {t("roster.tomorrowReleaseTitle", { time: "7:00 PM" })}

          <div className="mt-1 text-zinc-300">
            {t("roster.tomorrowReleaseSubtitle")}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mx-6 mb-8 border border-red-900 bg-red-900/10 p-6 text-center">
          <div className="text-xl font-bold text-zinc-100">
            {t("roster.loadingTitle")}
          </div>

          <div className="mt-2 text-zinc-400">
            {t("roster.loadingSubtitle")}
          </div>
        </div>
      )}

      {showEmpty && (
        <div className="mx-6 mb-10 border border-red-900/20 bg-black/40 p-8 text-center">
          <p className="text-xl text-zinc-300">{emptyText}</p>

          <button
            type="button"
            onClick={onClearFilters}
            className="mt-6 border border-red-900 px-6 py-2 text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            {t("filter.clear")}
          </button>
        </div>
      )}
    </>
  );
};

export default RosterMessages;