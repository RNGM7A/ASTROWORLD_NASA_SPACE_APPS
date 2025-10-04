import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import Overview from "./pages/nasa/Overview";
import Explorer from "./pages/nasa/Explorer";
import Insights from "./pages/nasa/Insights";
import PaperDetails from "./pages/nasa/PaperDetails";
import Simulator from "./pages/nasa/Simulator";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing Page - No Layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* NASA BioExplorer */}
            <Route path="/nasa" element={<Overview />} />
            <Route path="/nasa/explorer" element={<Explorer />} />
            <Route path="/nasa/insights" element={<Insights />} />
            <Route path="/nasa/details/:paperId" element={<PaperDetails />} />
            <Route path="/nasa/simulator" element={<Simulator />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
