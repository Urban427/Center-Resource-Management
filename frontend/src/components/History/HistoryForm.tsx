import { useEffect, useState } from "react";
import { theme } from "../../theme";
import type { EntityChangeSet } from "../../types/device";
import { ChangeSetCard } from "./ChangeSetCard";
import { X as XIcon } from "lucide-react";
import { apiFetch } from "../../api/apiFetch";

/* ---------- props ---------- */
interface HistoryModalProps {
  entityType: string;
  entityId: string | number| undefined;
  onClose: () => void;
}

export function HistoryForm({
  entityType,
  entityId,
  onClose,
}: HistoryModalProps) {
  const [history, setHistory] = useState<EntityChangeSet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    const res = await apiFetch(`/api/history/${entityType}/${entityId}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return (await res.json()) as EntityChangeSet[];
  };

  useEffect(() => {
    if (!entityType || !entityId) return;

    setLoading(true);
    fetchHistory()
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [entityType, entityId]);

   if (!entityType || !entityId) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div 
      style={modal}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={header}>
          <h2 style={title}>{entityType.charAt(0).toUpperCase() + entityType.slice(1)} History — {entityId}</h2>
          <button style={closeButton} onClick={onClose}>
            <XIcon size={18} color={theme.colors.text} />
          </button>
        </div>

        {/* Body */}
        <div style={body}>
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : history.length === 0 ? (
            <p style={{ textAlign: "center" }}>No history available</p>
          ) : (
            history.map((cs) => <ChangeSetCard key={cs.id} changeSet={cs} />)
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: theme.colors.overlay, // use theme overlay
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  backgroundColor: theme.colors.modalBackground, // use theme modal background
  borderRadius: theme.borderRadius,
  width: "700px",
  maxHeight: "80%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `${theme.spacing.large}px ${theme.spacing.large}px`,
  borderBottom: theme.border,
  backgroundColor: theme.colors.tableHeaderBg, // header background
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
  color: theme.colors.text, // use theme text color
};

const closeButton: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 18,
  fontWeight: 600,
  color: theme.colors.text, // same text color
  padding: `${theme.spacing.tiny}px ${theme.spacing.small}px`,
};

const body: React.CSSProperties = {
  padding: theme.spacing.large,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.medium, // spacing between cards
};
