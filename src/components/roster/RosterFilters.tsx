import React from "react";
import { useTranslation } from "react-i18next";

interface RosterFiltersProps {
  show: boolean;

  nationalities: string[];
  selectedNationalities: string[];
  onToggleNationality: (nationality: string) => void;
  natLabel: (raw: string) => string;

  services: string[];
  selectedServices: string[];
  onToggleService: (service: string) => void;
  serviceLabel: (service: string) => string;

  onClear: () => void;
}

const selectedBtn =
  "bg-red-900 border-red-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

const unselectedBtn =
  "bg-transparent border-red-900 text-zinc-300 hover:text-white hover:bg-white/5";

const RosterFilters: React.FC<RosterFiltersProps> = ({
  show,

  nationalities,
  selectedNationalities,
  onToggleNationality,
  natLabel,

  services,
  selectedServices,
  onToggleService,
  serviceLabel,

  onClear,
}) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="mx-6 mb-6 border border-red-900 bg-black/40 p-4">
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={onClear}
          className="text-lg text-zinc-400 hover:text-white"
        >
          {t("filter.clear")}
        </button>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 font-bold text-white">
          {t("filter.nationality")}
        </h4>

        <div className="flex flex-wrap gap-2">
          {nationalities.map((n) => (
            <button
              key={n}
              onClick={() => onToggleNationality(n)}
              className={`border px-3 py-1 transition-colors ${
                selectedNationalities.includes(n)
                  ? selectedBtn
                  : unselectedBtn
              }`}
            >
              {natLabel(n)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-bold text-white">
          {t("profile.availableServices")}
        </h4>

        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service}
              onClick={() => onToggleService(service)}
              className={`border px-3 py-1 transition-colors ${
                selectedServices.includes(service)
                  ? selectedBtn
                  : unselectedBtn
              }`}
            >
              {serviceLabel(service)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RosterFilters;