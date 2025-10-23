import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ← keep this so Tailwind/shadcn styles load
import { I18nProvider } from "./lib/i18n.jsx";
import { Toaster } from "sonner"; // ✅ toast provider
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ Auth provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <I18nProvider>
        <App /> {/* BrowserRouter already exists inside App.jsx */}
        <Toaster position="top-right" richColors />
      </I18nProvider>
    </AuthProvider>
  </React.StrictMode>
);
