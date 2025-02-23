// toast.ts
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

const defaultStyles = {
  success: {
    background: "#10b981",
    color: "#fff",
  },
  error: {
    background: "#f43f5e",
    color: "#fff",
  },
  warning: {
    background: "#f59e0b",
    color: "#fff",
  },
  info: {
    background: "#2563eb",
    color: "#fff",
  },
} as const;

const createToast =
  (type: ToastType) => (message: string, customStyle?: React.CSSProperties) => {
    toast[type](message, {
      style: {
        ...defaultStyles[type],
        ...customStyle,
      },
    });
  };

export const toastMessage = {
  success: createToast("success"),
  error: createToast("error"),
  warning: createToast("warning"),
  info: createToast("info"),
};
