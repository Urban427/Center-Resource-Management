
import { StageResult } from "../types/device";
import { theme } from "../theme";
import { useTranslation } from "react-i18next";
import { formatStatusWithIcons } from "../types/deviceFunctions";

const STATUS_META: Record<number, { label: string; bg: string; accent: string }> =
{
  [StageResult.None]: {
    label: "Not Tested",
    bg: "#ecf0f1",
    accent: "#7f8c8d",
  },
  [StageResult.Passed]: {
    label: "Passed",
    bg: "#eafaf1",
    accent: "#2ecc71",
  },
  [StageResult.Failed]: {
    label: "Failed",
    bg: "#fdecea",
    accent: "#e74c3c",
  },
  [StageResult.Wait]: {
    label: "Wait",
    bg: "#fff4e5",
    accent: "#f39c12",
  },
};

export type ResultCardProps = {
    status: number;
    result: number,
    id?: string;
    comment?: string;
    onClick?: () => void;
};
export function ResultCard({ result, onClick, comment, status, id }: ResultCardProps) {
  const meta = STATUS_META[result] ?? STATUS_META[StageResult.None];
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: theme.borderRadius * 2,
        background: meta.bg,
        borderLeft: `6px solid ${meta.accent}`,
        boxShadow: `0 4px 12px rgba(0,0,0,0.08)`,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Top labels */}
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.textMuted, letterSpacing: 0.5, marginBottom: 4 }}>
          {id ? `ID: ${id}` : "STATUS"}
        </div>

        {/* Status badge */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: meta.accent,
            background: `linear-gradient(120deg, ${meta.accent}20, ${meta.accent}50)`,
            padding: "4px 8px",
            borderRadius: theme.borderRadius,
            display: "inline-block",
          }}
        >
          {formatStatusWithIcons(status, result, t)}
        </div>

        {/* Comment */}
        {comment && (
          <div
            style={{
              fontSize: 14,
              color: theme.colors.textMuted,
              marginTop: 6,
              maxWidth: "300px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={comment}
          >
            {comment}
          </div>
        )}
      </div>

      {/* Large faded label */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          color: meta.accent,
          opacity: 0.1,
          userSelect: "none",
        }}
      >
        {meta.label.toUpperCase()}
      </div>
    </div>
  );
}
