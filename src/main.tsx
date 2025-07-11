import { Routes } from "@generouted/react-router/lazy";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@arco-design/web-react/dist/css/arco.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Button, Card, createTheme, MantineProvider } from "@mantine/core";
import { Toaster } from "sonner";
import React from "react";
import ReactDOM from "react-dom/client";
export const queryClient = new QueryClient();

const theme = createTheme({
  headings: {
    fontFamily: "Roboto, sans-serif",
  },

  colors: {
    primary: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
      "#172554",
    ],
  },
  primaryShade: { light: 6, dark: 7 },
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "rgb(22, 93, 255)",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        shadow: "md",
        withBorder: true,
      },
    }),
  },
});

const themeColor = localStorage.getItem("theme") == "dark";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={theme}
        defaultColorScheme={themeColor ? "dark" : "light"}
      >
        <Toaster visibleToasts={2} />
        <Routes />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
