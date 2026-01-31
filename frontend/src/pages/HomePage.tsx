import PageContainer from "../components/Layout/PageContainer";

export default function HomePage() {
  return (
    <PageContainer title="Home">
      <div className="text-xl font-semibold mb-4">Welcome to AI CC/DA</div>

      <p className="text-gray-700 leading-relaxed">
        This dashboard provides real‑time monitoring, analytics, and AI‑powered
        insights for your machine sensors, SenseHat, system health, and historical
        trends.
      </p>

      <p className="mt-4 text-gray-700">
        Use the sidebar to navigate through the monitoring pages.
      </p>
    </PageContainer>
  );
}
