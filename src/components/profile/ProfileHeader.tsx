// src/components/profile/ProfileHeader.tsx
import React from "react";
import { useTranslation } from "react-i18next";

type Rates = {
  min30?: number;
  min45?: number;
  min60?: number;
};

type Props = {
  name: string;
  workingTime?: string;
  rates?: Rates;
  className?: string;
};

const ProfileHeader: React.FC<Props> = ({ name, workingTime, rates, className }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {/* NAME aura */}
      <div className="relative px-4 mb-2 flex flex-col items-center text-center">
        <div className="pointer-events-none absolute -inset-x-6 -inset-y-6 opacity-70 blur-2xl">
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.55),transparent_100%)]" />
        </div>

        <h1 className="font-cormorant relative text-5xl font-bold leading-[1.1] text-white">
          {name}
        </h1>

        {workingTime && (
          <p className="relative text-zinc-300 text-3xl mt-4 tracking-wide">{workingTime}</p>
        )}
      </div>

      {/* Rates wrap to fit the modal without horizontal scrolling */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 px-2 text-center text-base leading-tight text-white/90">
        {rates?.min30 && (
          <span>
            <span className="text-white/70">{t("rates.min30")}</span>{" "}
            <span className="text-white/95">${rates.min30}</span>
          </span>
        )}

        {rates?.min45 && (
          <span>
            <span className="text-white/70">{t("rates.min45")}</span>{" "}
            <span className="text-white/95">${rates.min45}</span>
          </span>
        )}

        {rates?.min60 && (
          <span>
            <span className="text-white/70">{t("rates.min60")}</span>{" "}
            <span className="text-white/95">${rates.min60}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
