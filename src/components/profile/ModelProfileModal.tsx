// src/components/profile/ModelProfileModal.tsx

import { useEffect } from "react";
import { Phone, Share2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import ModelProfileContent from "./ModelProfileContent";

interface ProfileModalLocationState {
  workingTime?: string;
}

const PHONE_NUMBER = "+61417888123";

function ModelProfileModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const state =
    location.state as ProfileModalLocationState | null;

  const workingTime = state?.workingTime;

  const closeModal = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );
    } catch (error) {
      console.error("Failed to copy profile link", error);
    }
  };

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Model profile"
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/75
        p-3 sm:p-6
      "
      onClick={closeModal}
    >
      <div
        className="
          flex
          h-[calc(100dvh-24px)]
          w-full
          max-w-[430px]
          flex-col
          overflow-hidden
          border border-red-900/60
          bg-black
          shadow-[0_0_40px_rgba(127,29,29,0.3)]
          sm:h-[calc(100dvh-48px)]
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Fixed header */}
        <div
          className="
            flex h-12 shrink-0
            items-center justify-end
            border-b border-red-900/40
            bg-black/95
            px-3
          "
        >
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE_NUMBER}`}
              aria-label="Book now"
              className="
                p-1 text-zinc-400
                transition-colors
                hover:text-red-300
              "
            >
              <Phone className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share profile"
              className="
                p-1 text-zinc-400
                transition-colors
                hover:text-red-300
              "
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={closeModal}
              aria-label="Close profile"
              className="
                p-1 text-zinc-400
                transition-colors
                hover:text-white
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Entire profile scrolls */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ModelProfileContent
            workingTime={workingTime}
            variant="modal"
          />
        </div>
      </div>
    </div>
  );
}

export default ModelProfileModal;