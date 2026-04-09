import { EntityTable } from "../CommonComponent";
import type { Trash } from "../../types/trash";
import { RotateCcw, QrCode, Trash2 } from "lucide-react";
import { theme } from "../../theme";
import { formatDateTime } from "../../utils/format";
import { useEntityApi } from "../EntityQuery";
import { useState } from "react";
import QrModal from "../QrModal";
import { apiFetch } from "../../api/apiFetch";

export default function TrashComponent() {
  const { data, total, loading, error, refresh, setQuery, getPage, setPage, setPageSize } = useEntityApi<Trash>("/api/trash");
  const [qrValue, setQrValue] = useState<string | null>(null);

  const columns = [
    { key: "id", header: "ID", width: "10%", sortable: true, render: (d: Trash) => d.id },
    { key: "entityType", header: "Entity Type", width: "15%", sortable: true, render: (d: Trash) => d.entityName },
    { key: "entityId", header: "Entity ID", width: "40%", sortable: true, render: (d: Trash) => d.entityKey },
    { key: "date", header: "Expire Date", width: "20%", sortable: true, render: (d: Trash) => formatDateTime(d.expiresAt) },
    { key: "deletedBy", header: "Trashed by", width: "20%", sortable: true, render: (d: Trash) => d.deletedBy || "—" },
    //{ key: "comment", header: "Comment", width: "18%", sortable: false, render: (d: Trash) => <span style={{ color: theme.colors.textMuted }}>{d.reason || "—"}</span> },
  ];

  const actions = [
    { label: "Restore", icon: <RotateCcw size={16} />, onClick: (d: Trash) => apiFetch(`/api/trash/${d.id}`, { method: "POST" }).then(() => refresh?.()) },
    { label: "QR Code", icon: <QrCode size={16} />, onClick: (d: Trash) => setQrValue(`${d.entityKey}`), },
    { label: "Delete", icon: <Trash2 size={16} />, onClick: (d: Trash) => apiFetch(`/api/trash/${d.id}`, { method: "DELETE" }).then(() => refresh?.()), danger: true },
  ];

  return <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <EntityTable
        data={data}
        loading={loading}
        error={error}
        total={total}
        columns={columns}
        getRowKey={(d) => d.id}
        actions={actions}
        refresh={refresh}
        onSearch={(s) => setQuery((q) => ({ ...q, search: s, page: 1 }))}
        onSort={(k, asc) => setQuery((q) => ({ ...q, sortKey: k, sortAsc: asc, page: 1 }))}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(n) => setPageSize(n)}
        getPage={getPage}
      />

      {qrValue && <QrModal value={qrValue} onClose={() => setQrValue(null)} />}
    </div>
}
