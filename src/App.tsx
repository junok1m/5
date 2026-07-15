import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  type Location,
} from "react-router-dom";

import Homepage from "./Homepage";
import ModelProfilePage from "./ModelProfilePage";
import RatesPage from "./RatesPage";
import ContactPage from "./ContactPage";
import NewsPage from "./NewsPage";
import NewsPostPage from "./NewsPostPage";

import ModelProfileModal from "./components/profile/ModelProfileModal";
import LanguageToggle from "./components/LanguageToggle";

interface RouteState {
  backgroundLocation?: Location;
  workingTime?: string;
  fromTab?: "today" | "tomorrow";
}

function ScrollToTop() {
  const location = useLocation();
  const state = location.state as RouteState | null;

  useEffect(() => {
    // 모달을 열 때는 뒤의 로스터 위치를 유지
    if (state?.backgroundLocation) return;

    // Homepage가 직접 roster 위치로 이동
    if (location.hash === "#roster") return;

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [location.pathname, location.hash, state?.backgroundLocation]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  const state = location.state as RouteState | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <ScrollToTop />

      {!backgroundLocation && <LanguageToggle />}

      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsPostPage />} />
        <Route path="/rates" element={<RatesPage />} />
        <Route path="/profile/:slug" element={<ModelProfilePage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/profile/:slug"
            element={<ModelProfileModal />}
          />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;