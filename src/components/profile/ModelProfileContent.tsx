// src/components/profile/ModelProfileContent.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useModelProfile } from "../../hooks/useModelProfile";

import ProfileGallery from "./ProfileGallery";
import ProfileHeader from "./ProfileHeader";
import AvailableServices from "./AvailableServices";
import ProfileBio from "./ProfileBio";
import ProfileDetailsGrid from "./ProfileDetailGrid";

interface ModelProfileContentProps {
  workingTime?: string;
  variant?: "page" | "modal";
}

const ModelProfileContent: React.FC<ModelProfileContentProps> = ({
  workingTime,
  variant = "page",
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  const { loading, apiError, model } =
    useModelProfile(slug);

  const natLabel = (raw: string) => {
    const key = `nationalities.${raw}`;

    return i18n.exists(key)
      ? t(key)
      : raw;
  };

  if (loading) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center bg-black">
        <p className="text-lg text-zinc-400">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center bg-black px-6">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            404
          </h2>

          {apiError ? (
            <p className="text-lg text-zinc-400">
              {t("profile.loadFailed")} ({apiError})
            </p>
          ) : (
            <p className="text-lg text-zinc-400">
              {t("profile.notFound")}
            </p>
          )}
        </div>
      </div>
    );
  }

  const content = (
    <>
      {/* Gallery */}
      <div className="space-y-6">
        <ProfileGallery
          name={model.name}
          images={model.images}
          isNew={model.isNew}
        />
      </div>

      {/* Information */}
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10">
        <ProfileHeader
          name={model.name}
          workingTime={workingTime || model.workingTime}
          rates={model.rates}
        />

        <div className="mx-auto flex w-full max-w-[340px] flex-col gap-10">
          <AvailableServices services={model.services} />

          <ProfileDetailsGrid
            natLabel={natLabel}
            nationality={model.nationality}
            height={model.height}
            weight={model.weight}
            bust={model.bust}
            dressSize={model.dressSize}
            figure={model.figure}
            hair={model.hair}
            skin={model.skin}
            tattoos={model.tattoos}
            pubes={model.pubes}
          />

          {model.bio && (
            <ProfileBio
              bio={model.bio}
              name={model.name}
            />
          )}
        </div>
      </div>
    </>
  );

  if (variant === "modal") {
    return (
      <section className="bg-black px-4 pb-10 pt-4">
        <div className="flex flex-col gap-8">
          {content}
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-black">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {content}
      </div>
    </section>
  );
};

export default ModelProfileContent;