import React from "react";

const SocialAuth = () => {
  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth in later modules
    console.log("Google OAuth - Coming soon");
  };

  const handleMicrosoftAuth = () => {
    // TODO: Implement Microsoft OAuth in later modules
    console.log("Microsoft OAuth - Coming soon");
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGoogleAuth}
          className="
            flex items-center justify-center gap-3 px-4 py-3
            bg-white dark:bg-slate-800 
            border-2 border-slate-300 dark:border-slate-600
            rounded-xl font-semibold
            hover:border-green-500 hover:bg-slate-50 dark:hover:bg-slate-700
            transition-all duration-300
            group
          "
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-slate-700 dark:text-slate-300 group-hover:text-green-600 transition-colors">
            Google
          </span>
        </button>

        <button
          onClick={handleMicrosoftAuth}
          className="
            flex items-center justify-center gap-3 px-4 py-3
            bg-white dark:bg-slate-800 
            border-2 border-slate-300 dark:border-slate-600
            rounded-xl font-semibold
            hover:border-green-500 hover:bg-slate-50 dark:hover:bg-slate-700
            transition-all duration-300
            group
          "
        >
          <svg className="w-5 h-5" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          <span className="text-slate-700 dark:text-slate-300 group-hover:text-green-600 transition-colors">
            Microsoft
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;
