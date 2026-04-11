import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Otp from "./pages/otp/Otp";
import Start from "./pages/start/Start";
import Camera from "./pages/camera/Camera";
import WaitPrompt from "./pages/prompt/waitPrompt";
import PhotoSelection from "./pages/photoSelection/photoSelection";
import CopiesSelection from "./pages/copiesSelection/copiesSelection";
import LayoutSelection from "./pages/layout/LayoutSelection";
import ThemeSelection from "./pages/layout/ThemeSelection";
import Editor from "./pages/layout/Editor";

import { CandidProvider } from "./context/storeContext";

const App = () => {
  return (
    <CandidProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/copies" element={<CopiesSelection />} />
          <Route path="/layout" element={<LayoutSelection />} />
          <Route path="/theme" element={<ThemeSelection />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/polaroid" element={<PhotoSelection />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/wait-screen" element={<WaitPrompt />} />
        </Routes>
      </Router>
    </CandidProvider>
  );
};

export default App;
