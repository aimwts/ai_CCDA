import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function PageContainer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <TopBar title={title} />

        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
