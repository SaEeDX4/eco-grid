import React from "react";

export const Skeleton = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "h-4 w-full",
    circle: "rounded-full h-10 w-10",
    text: "h-4 w-3/4",
    title: "h-8 w-1/2",
    card: "h-48 w-full",
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 
        dark:from-slate-700 dark:via-slate-600 dark:to-slate-700
        bg-[length:200%_100%]
        rounded-lg
        ${variants[variant]}
        ${className}
      `}
      style={{
        backgroundPosition: "200% 0",
        animation: "shimmer 2s linear infinite",
      }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-4">
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="card" />
  </div>
);

// Add shimmer animation to index.css (already included globally)
export const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;
