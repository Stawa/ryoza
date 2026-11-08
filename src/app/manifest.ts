import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ryoza",
    short_name: "Ryoza",
    description: "Servers that stay online.",
    start_url: "/",
    display: "standalone",
    theme_color: "#0B0C10",
    background_color: "#0B0C10",
    icons: [
      { src: "/ryoza-kit/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/ryoza-kit/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
