import { useEffect } from "react";
import { theme } from "../theme";

type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export function Toast({
  message,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: theme.spacing.large,
        left: theme.spacing.large,
        padding: `${theme.spacing.small}px ${theme.spacing.medium}px`,
        background: theme.colors.errorBg,
        color: theme.colors.error,
        border: `1px solid ${theme.colors.errorBorder}`,
        borderRadius: theme.borderRadius,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        animation: "toast-slide-up 200ms ease-out",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}
