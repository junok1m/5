// src/hooks/useModelProfile.ts

import { useEffect, useState } from "react";

const PROVIDERS_URL = "/api/providers/";
const ROSTER_TODAY_URL = "/api/roster/today/";

type ApiRosterEntry = {
  provider_id: number;
  provider_name: string;
  start_time: string;
  end_time: string;
};

type ApiProviderImage = {
  image: string;
  file_type?: string;
  profile?: boolean;
  priority?: number;
};

type ApiProvider = {
  id: number;
  slug: string;
  provider_name: string;
  description?: string;
  country?: string | null;

  cup?: string;
  weight?: number;
  height?: number;
  images?: ApiProviderImage[];

  dress_size?: number;
  figure?: string;
  hair?: string;
  skin?: string;
  tattoos?: string;
  pubes?: string;
  requirements?: string;

  is_new?: boolean;

  service_bbbj?: boolean;
  service_cim?: boolean;
  service_dfk?: boolean;
  service_69?: boolean;
  service_rimming?: boolean;
  service_filming?: boolean;
  service_cbj?: boolean;
  service_massage?: boolean;
  service_gfe?: boolean;
  service_pse?: boolean;
  service_double?: boolean;
  service_shower?: boolean;

  total_30?: number | string | null;
  total_45?: number | string | null;
  total_60?: number | string | null;
};

export type Service = {
  name: string;
  available: boolean;
};

export type ModelProfile = {
  id: number;
  name: string;
  slug: string;
  nationality: string;

  height?: number;
  weight?: number;
  bust?: string;
  dressSize?: number;
  figure?: string;
  hair?: string;
  skin?: string;
  tattoos?: string;
  pubes?: string;

  bio?: string;

  images: string[];
  isNew: boolean;

  workingTime?: string;

  services: Service[];

  rates?: {
    min30?: number;
    min45?: number;
    min60?: number;
  };
};

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function bool(value: unknown) {
  return value === true;
}

function imagesFromProvider(provider: ApiProvider): string[] {
  const allImages = (provider.images || [])
    .filter((item) => item?.image)
    .slice()
    .sort(
      (a, b) =>
        (b.priority ?? 0) - (a.priority ?? 0),
    );

  const nonProfileImages = allImages.filter(
    (item) => !item.profile,
  );

  const finalImages =
    nonProfileImages.length > 0
      ? nonProfileImages
      : allImages;

  return finalImages.map((item) => item.image);
}

function servicesFromProvider(provider: ApiProvider): Service[] {
  const flags: Service[] = [
    { name: "bbbj", available: bool(provider.service_bbbj) },
    { name: "cim", available: bool(provider.service_cim) },
    { name: "dfk", available: bool(provider.service_dfk) },
    { name: "69", available: bool(provider.service_69) },
    {
      name: "rimming",
      available: bool(provider.service_rimming),
    },
    {
      name: "filming",
      available: bool(provider.service_filming),
    },
    { name: "cbj", available: bool(provider.service_cbj) },
    {
      name: "massage",
      available: bool(provider.service_massage),
    },
    { name: "gfe", available: bool(provider.service_gfe) },
    { name: "pse", available: bool(provider.service_pse) },
    {
      name: "double",
      available: bool(provider.service_double),
    },
    {
      name: "shower",
      available: bool(provider.service_shower),
    },
  ];

  if (flags.some((service) => service.available)) {
    return flags;
  }

  const text = stripHtml(provider.description || "");
  const match = text.match(/Service:\s*([^.\n]+)/i);

  const list = match
    ? match[1]
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean)
    : [];

  const has = (label: string) =>
    list.some(
      (item) =>
        item.toLowerCase() === label.toLowerCase(),
    );

  return [
    { name: "bbbj", available: has("BBBJ") },
    { name: "cim", available: has("CIM") },
    { name: "dfk", available: has("DFK") },
    { name: "69", available: has("69") },
    { name: "rimming", available: has("RIMMING") },
    { name: "filming", available: has("FILMING") },
    { name: "cbj", available: has("CBJ") },
    { name: "massage", available: has("MASSAGE") },
    { name: "gfe", available: has("GFE") },
    { name: "pse", available: has("PSE") },
    { name: "double", available: has("DOUBLE") },
    {
      name: "shower",
      available:
        has("SHOWER TOGETHER") || has("SHOWER"),
    },
  ];
}

function priceOrUndefined(
  value: unknown,
): number | undefined {
  const numberValue =
    typeof value === "string"
      ? Number(value)
      : (value as number);

  if (!Number.isFinite(numberValue)) {
    return undefined;
  }

  return numberValue > 0
    ? numberValue
    : undefined;
}

function formatTimeLabel(time: string) {
  const [hourString, minuteString] = (
    time || "0:0"
  ).split(":");

  let hour = Number(hourString);
  const minute = Number(minuteString);

  const period = hour >= 12 ? "PM" : "AM";

  hour %= 12;

  if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${String(minute).padStart(
    2,
    "0",
  )} ${period}`;
}

function formatWorkingTime(
  start: string,
  end: string,
) {
  return `${formatTimeLabel(start)} - ${formatTimeLabel(
    end,
  )}`;
}

export function useModelProfile(slug?: string) {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<
    string | null
  >(null);
  const [model, setModel] =
    useState<ModelProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setApiError(null);
        setModel(null);

        if (!slug) {
          setApiError("Missing slug in URL");
          return;
        }

        const [providersResponse, rosterResponse] =
          await Promise.all([
            fetch(PROVIDERS_URL),
            fetch(ROSTER_TODAY_URL),
          ]);

        if (!providersResponse.ok) {
          throw new Error(
            `providers fetch failed: ${providersResponse.status}`,
          );
        }

        const providers =
          (await providersResponse.json()) as ApiProvider[];

        if (!Array.isArray(providers)) {
          throw new Error(
            "providers response not an array",
          );
        }

        const found = providers.find(
          (provider) =>
            (provider.slug || "").toLowerCase() ===
            slug.toLowerCase(),
        );

        if (!found) {
          return;
        }

        let apiWorkingTime: string | undefined;

        if (rosterResponse.ok) {
          const roster =
            (await rosterResponse.json()) as ApiRosterEntry[];

          if (Array.isArray(roster)) {
            const entry = roster.find(
              (item) =>
                item.provider_id === found.id,
            );

            if (entry) {
              apiWorkingTime = formatWorkingTime(
                entry.start_time,
                entry.end_time,
              );
            }
          }
        }

        const images = imagesFromProvider(found);
        const services = servicesFromProvider(found);

        const mappedModel: ModelProfile = {
          id: found.id,
          slug: found.slug,
          name:
            found.provider_name || found.slug,
          nationality:
            found.country || "Unknown",

          height: found.height || undefined,
          weight: found.weight || undefined,
          bust: found.cup
            ? `${found.cup}`
            : undefined,

          dressSize:
            found.dress_size || undefined,
          figure: found.figure || undefined,
          hair: found.hair || undefined,
          skin: found.skin || undefined,
          tattoos: found.tattoos || undefined,
          pubes: found.pubes || undefined,

          bio: found.description
            ? stripHtml(found.description)
            : undefined,

          images,
          isNew: found.is_new === true,
          workingTime: apiWorkingTime,
          services,

          rates: {
            min30: priceOrUndefined(
              found.total_30,
            ),
            min45: priceOrUndefined(
              found.total_45,
            ),
            min60: priceOrUndefined(
              found.total_60,
            ),
          },
        };

        if (!cancelled) {
          setModel(mappedModel);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Provider API error";

          setApiError(message);
          setModel(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return {
    loading,
    apiError,
    model,
  };
}