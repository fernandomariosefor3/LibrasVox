import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import i18n from "./i18n";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { SkipLinks } from "./components/base/SkipLinks";

function MainContentMarker() {
  const location = useLocation();
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.id = "main-content";
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <AccessibilityProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter basename={__BASE_PATH__}>
          <SkipLinks />
          <MainContentMarker />
          <AppRoutes />
        </BrowserRouter>
      </I18nextProvider>
    </AccessibilityProvider>
  );
}

export default App;
