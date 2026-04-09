import React from "react";
import { theme } from "../theme";
import { X } from "lucide-react";

type ModalWindowProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
  closeOnOverlay?: boolean;
};

export function ModalWindow({ title, onClose, children, width, height, closeOnOverlay }: ModalWindowProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={theme.styles.overlay} onClick={handleOverlayClick}>
      <div style={{...theme.styles.window, width:width, height:height}}>
        <div style={theme.styles.topBar}>
          <h2 style={{ margin: 0, color: theme.colors.background }}>{title}</h2>
          <button
            onClick={onClose}
            style={theme.styles.topBarButton}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#e74c3c")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "transparent")
            }
          >
            <X size={20} color={theme.colors.background} />
          </button>
        </div>
        <div style={theme.styles.body}>{children}</div>
      </div>
    </div>
  );
}
