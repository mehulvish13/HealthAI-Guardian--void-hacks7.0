import { useEffect } from "react";

const BASE_TITLE = "HealthAI Guardian";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
