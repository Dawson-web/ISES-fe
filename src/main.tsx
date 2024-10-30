import { Routes } from "@generouted/react-router/lazy";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MantineProvider } from "@mantine/core";
import { Toaster } from "sonner";
import React from "react";
import ReactDOM from "react-dom/client";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Toaster />
        <Routes />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
