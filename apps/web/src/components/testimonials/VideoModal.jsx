import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const VideoModal = ({ testimonial, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Extract video ID from URL
  const getVideoEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        : null;
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId
        ? `https://player.vimeo.com/video/${videoId}?autoplay=1`
        : null;
    }

    return url;
  };

  const embedUrl = getVideoEmbedUrl(testimonial.videoUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors text-white"
          aria-label="Close video"
        >
          <X size={24} />
        </button>

        {/* Video */}
        <div className="relative aspect-video">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Video testimonial from ${testimonial.name}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
              <p>Video not available</p>
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="p-6 bg-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-700">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">
                {testimonial.name}
              </h3>
              <p className="text-sm text-slate-400">
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
            {testimonial.metrics && (
              <div className="flex gap-4 text-sm">
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    {testimonial.metrics.costSavings}
                  </div>
                  <div className="text-slate-400">Saved</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-bold">
                    {testimonial.metrics.carbonReduction}
                  </div>
                  <div className="text-slate-400">CO₂ Cut</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
