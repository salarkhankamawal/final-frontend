import { useEffect } from "react";

export function MetaTags({ title, description }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | SkyRoute Travel` : "SkyRoute Travel Agency";

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";

    if (description) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (meta && description) meta.setAttribute("content", prevDesc);
    };
  }, [title, description]);

  return null;
}
