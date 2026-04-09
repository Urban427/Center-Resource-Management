import { QRCodeCanvas } from "qrcode.react";
import Button from "../common/Button";
import { theme } from "../theme";

type QrModalProps = {
  value: string | null;
  onClose: () => void;
};

export default function QrModal({ value, onClose }: QrModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.background,
          padding: theme.spacing.large,
          borderRadius: theme.borderRadius,
          minWidth: 300,
          textAlign: "center",
        }}
      >
        <h3>Device QR</h3>

        <QRCodeCanvas
          value={value || ""}
          size={200}
          level="H"
        />

        <div style={{ marginTop: theme.spacing.medium }}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
