import { useState } from "react";

export function Tabs({
  tabs
}: {
  tabs: { label: string; content: JSX.Element }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-4 border-b mb-4">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`pb-2 ${
              active === i
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>{tabs[active].content}</div>
    </div>
  );
}
