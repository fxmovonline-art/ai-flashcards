"use client";

import { useHistory } from "./HistoryProvider";
import HistorySidebar from "./HistorySidebar";
import { useRouter, useSearchParams } from "next/navigation";

export default function SidebarWrapper() {
  const { history } = useHistory();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentId = searchParams.get("session") || undefined;

  const handleSelect = (id: string) => {
    router.push(`/?session=${id}`);
  };

  return (
    <HistorySidebar 
      history={history} 
      onSelect={handleSelect} 
      currentId={currentId} 
    />
  );
}
