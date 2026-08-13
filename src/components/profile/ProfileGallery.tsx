import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  images: string[];
  isNew?: boolean;
  className?: string;
};

const ProfileGallery: React.FC<Props> = ({ name, images, isNew = false, className }) => {
  const { t } = useTranslation();

  const imageArray = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasMany = imageArray.length > 1;

  const nextImage = () => {
    if (!hasMany) return;
    setCurrentImageIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!hasMany) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > 50) nextImage();
    if (distance < -50) prevImage();

    setTouchStart(0);
    setTouchEnd(0);
  };

  React.useEffect(() => {
    if (!imageArray.length) return;
    if (currentImageIndex > imageArray.length - 1) setCurrentImageIndex(0);
  }, [imageArray, currentImageIndex]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, hasMany, imageArray.length]);

  return (
    <div className={className}>
      {/* Main image */}
      <div
        className="relative aspect-[3/4] overflow-hidden touch-pan-y border border-red-900/40 bg-black/40"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {imageArray.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="block w-full h-full"
            aria-label={`Open ${name}'s photo in full view`}
          >
            <img
              src={imageArray[currentImageIndex]}
              alt={`${name} - Photo ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-zoom-in"
              loading="eager"
            />
          </button>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            {t("common.noImage")}
          </div>
        )}

        {isNew && (
          <span className="absolute top-4 right-4 bg-red-900 text-white text-sm px-3 py-1 font-bold uppercase tracking-wider">
            {t("badges.new")}
          </span>
        )}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-4 bg-black/70 border border-red-900 text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-4 bg-black/70 border border-red-900 text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imageArray.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 transition-all ${
                    index === currentImageIndex ? "bg-red-900 w-8" : "bg-zinc-700 w-2 hover:bg-zinc-500"
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMany && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {imageArray.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-28 overflow-hidden transition-colors border ${
                index === currentImageIndex ? "border-red-900" : "border-zinc-800 hover:border-red-900/60"
              }`}
              aria-label={`Thumbnail ${index + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && imageArray.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white bg-black/60 border border-white/10 p-2"
            aria-label="Close full image"
          >
            <X className="w-5 h-5" />
          </button>

          {hasMany && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/60 border border-white/10 p-3"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/60 border border-white/10 p-3"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={imageArray[currentImageIndex]}
            alt={`${name} - Full photo ${currentImageIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileGallery;