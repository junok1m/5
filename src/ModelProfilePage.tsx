// src/ModelProfilePage.tsx

import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import Layout from "./components/Layout";
import ModelProfileContent from "./components/profile/ModelProfileContent";

interface ProfileLocationState {
  workingTime?: string;
}

const ModelProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();

  const { t, i18n } = useTranslation();
  

  const state =
    location.state as ProfileLocationState | null;

  const workingTimeFromState = state?.workingTime;

  const natLabel = (raw: string) => {
    const key = `nationalities.${raw}`;

    return i18n.exists(key)
      ? t(key)
      : raw;
  };

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(
      {
        pathname: "/",
        search: window.location.search,
        hash: "#roster",
      },
      {
        state: {
          scrollTo: "roster",
        },
      },
    );
  };

  

  

  return (
    <Layout>
      <section className="relative min-h-screen overflow-hidden bg-black py-12">
        {/* Subtle red grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(127, 29, 29, 0.35) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(127, 29, 29, 0.25) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 lg:pb-0">
          <button
            type="button"
            onClick={handleBack}
            className="
              mb-6 inline-flex items-center gap-2
              border border-red-900 bg-black/60
              px-4 py-2
              text-sm font-bold uppercase tracking-wider
              text-zinc-200
              transition-colors
              hover:bg-white/5 hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roster
          </button>

          <ModelProfileContent
  workingTime={workingTimeFromState}
/>

        </div>
      </section>
    </Layout>
  );
};

export default ModelProfilePage;