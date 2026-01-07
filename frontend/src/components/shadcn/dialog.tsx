import { useState } from "react";

export function Dialog({
  trigger,
  children
}: {
  trigger: JSX.Element;
  children: JSX.Element;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
            {children}

            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
