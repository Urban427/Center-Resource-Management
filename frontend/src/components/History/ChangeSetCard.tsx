import { theme } from "../../theme";
import type { EntityChangeSet } from "../../types/device";

export function ChangeSetCard({ changeSet }: { changeSet: EntityChangeSet }) {
  return (
    <div style={card}>
      <div style={cardHeader}>
        <strong>{operationLabel(changeSet.operation)}</strong>
        <span style={{ color: theme.colors.textMuted }}>
          {new Date(changeSet.changedAt).toLocaleString()}
        </span>
      </div>

      <div style={meta}>
        {changeSet.changedBy ?? "System"}
        {changeSet.comment && <> — 💬 {changeSet.comment}</>}
      </div>

      {changeSet.changes.length > 0 ? (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Property</th>
              <th style={th}>Old value</th>
              <th style={th}>New value</th>
            </tr>
          </thead>
          <tbody>
            {changeSet.changes.map((c) => (
              <tr key={c.id}>
                <td style={td}>{c.propertyName}</td>
                <td style={td}>{c.oldValue ?? "—"}</td>
                <td style={td}>{c.newValue ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={noChanges}>No property changes</div>
      )}
    </div>
  );
}

function operationLabel(op: number) {
  switch (op) {
    case 1:
      return "Deleted";
    case 2:
      return "Updated";
    case 3:
      return "Restored";
    default:
      return "Changed";
  }
}


const card: React.CSSProperties = {
  border: theme.border,
  borderRadius: theme.borderRadius,
  padding: 12,
  marginBottom: 12,
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 4,
};

const meta: React.CSSProperties = {
  fontSize: 13,
  color: theme.colors.textMuted,
  marginBottom: 8,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: 6,
  borderBottom: theme.border,
  fontWeight: 600,
  fontSize: 13,
};

const td: React.CSSProperties = {
  padding: 6,
  borderBottom: theme.border,
  fontSize: 13,
};

const noChanges: React.CSSProperties = {
  fontSize: 13,
  color: theme.colors.textMuted,
  fontStyle: "italic",
};
