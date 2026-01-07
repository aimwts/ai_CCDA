import { useState } from "react";

export function DropdownMenu({
  trigger,
  items
}: {
  trigger: JSX.Element;
  items: { label: string; onClick: () => void }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 w-40">
          {items.map((item, i) => (
            <div
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
