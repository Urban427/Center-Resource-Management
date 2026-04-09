import { theme } from "../theme";

export function InfoField({
  label,
  value,
  multiline,
  grow,
  width,
}: {
  label: string;
  value: React.ReactNode;
  multiline?: boolean;
  grow?: boolean;
  width?: string;
}) {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    value === "—";

  const height = multiline ? undefined : 29;

  return (
    <div
      style={{
        position: "relative",
        flex: grow ? 1 : undefined,
        width: width ? width : undefined,
        marginBottom: theme.spacing.medium, 
      }}
    >
      {/* Field box */}
      <div
        style={{
          position: "relative",
          padding: multiline ? "18px 12px 12px" : "14px 12px",
          borderRadius: theme.borderRadius,
          border: theme.border,
          background: theme.colors.background,
          display: "flex",
          alignItems: multiline ? "flex-start" : "center",
          color: isEmpty ? theme.colors.textMuted : theme.colors.text,
          fontStyle: isEmpty ? "italic" : "normal",
          wordBreak: "break-word",
          whiteSpace: multiline ? "pre-wrap" : "normal", // preserve newlines
          height,
        }}
      >
        {isEmpty ? (
          <span style={{ opacity: 0.7 }}>Unknown</span>
        ) : (
          value
        )}
      </div>

      {/* Floating label */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: 10,
          padding: "0 6px",
          fontSize: 11,
          fontWeight: 600,
          color: theme.colors.textMuted,
          background: theme.colors.background,
          letterSpacing: 0.6,
          pointerEvents: "none",
        }}
      >
        {label}
      </div>
    </div>
  );
}