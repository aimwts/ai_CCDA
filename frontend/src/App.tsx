import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MachineMonitor from "./pages/MachineMonitor";
import SenseHatMonitor from "./pages/SenseHatMonitor";
import AggregateDashboard from "./pages/AggregateDashboard";
import SystemMonitor from "./pages/SystemMonitor";
import ZonesPage from "./pages/ZonesPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/machine" element={<MachineMonitor />} />
        <Route path="/sensehat" element={<SenseHatMonitor />} />
        <Route path="/aggregate" element={<AggregateDashboard />} />
        <Route path="/system" element={<SystemMonitor />} />
        <Route path="/zones" element={<ZonesPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
