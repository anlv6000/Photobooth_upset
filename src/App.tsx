import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Otp from "./pages/otp/Otp";
import Start from "./pages/start/Start";
import Camera from "./pages/camera/Camera";
import WaitPrompt from "./pages/prompt/waitPrompt";
import PhotoSelection from "./pages/photoSelection/photoSelection";
import PhotoEditor from "./pages/photoSelection/PhotoEditor";
import CopiesSelection from "./pages/copiesSelection/copiesSelection";
import LayoutSelection from "./pages/layout/LayoutSelection";
import ThemeSelection from "./pages/layout/ThemeSelection";
import Editor from "./pages/layout/Editor";
import CaptureType from "./pages/captureType/CaptureType";
import ShootMode from "./pages/shootMode/ShootMode";
import FrameLibrary from "./pages/frameLibrary/FrameLibrary";
import EventLibrary from "./pages/event/EventLibrary";
import EventFrameSelection from "./pages/event/EventFrameSelection";
import PhotoLibrary from "./pages/photoLibrary/PhotoLibrary";

import { CandidProvider } from "./context/storeContext";

const App = () => {
  return (
    <CandidProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/shoot-mode" element={<ShootMode />} />
          <Route path="/capture-type" element={<CaptureType />} />
          <Route path="/event-frames" element={<FrameLibrary />} />
          <Route path="/event-library" element={<EventLibrary />} />
          <Route path="/event-frame" element={<EventFrameSelection />} />
          <Route path="/copies" element={<CopiesSelection />} />
          <Route path="/layout" element={<LayoutSelection />} />
          <Route path="/theme" element={<ThemeSelection />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/polaroid" element={<PhotoSelection />} />
          <Route path="/photo-editor" element={<PhotoEditor />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/wait-screen" element={<WaitPrompt />} />
          <Route path="/photo-library" element={<PhotoLibrary />} />
        </Routes>
      </Router>
    </CandidProvider>
  );
};

export default App;
