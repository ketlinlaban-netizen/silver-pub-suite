import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const queryClient = new QueryClient();
const router = getRouter();
router.update({ context: { queryClient } });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {
    // Service worker registration failed, app will still work
    console.log("Service Worker registration failed");
  });
}

