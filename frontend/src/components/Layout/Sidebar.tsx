import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-56 bg-gray-900 text-white p-6 h-screen">
      <h2 className="text-xl font-bold mb-8">AI CC/DA</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/">Home</Link>
        <Link to="/plant">Plant Monitor</Link>
        <Link to="/sensehat">SenseHat Monitor</Link>
        <Link to="/aggregate">Aggregate Dashboard</Link>
        <Link to="/system">System Monitor</Link>
        <Link to="/zones">Zones</Link>
        <Link to="/history">History</Link>
      </nav>
    </div>
  );
}
