import { useState } from "react";
import { EntityTable } from "../CommonComponent";
import { HistoryForm } from "../History/HistoryForm";
import QrModal from "../QrModal";
import type { DeviceType } from "../../types/deviceType";
import { Edit, QrCode, Trash2, History } from "lucide-react";
import { theme } from "../../theme";
import { useEntityApi } from "../EntityQuery";
import DeviceTypeForm from "./DeviceTypeForm";
import EditPackForm from "./EditPackForm";
import { apiFetch } from "../../api/apiFetch";


export default function DeviceTypeComponent() {
  const { data, total, loading, error, refresh, setQuery, getPage, setPage, setPageSize } = useEntityApi<DeviceType>("/api/deviceType");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [history, setHistory] = useState<DeviceType | null>(null);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState<DeviceType | null>(null);

  //**Save**
  const handleSave = async (deviceType: DeviceType) => {
    try {
      const res = await apiFetch("/api/deviceType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deviceType.name,
          comment: deviceType.comment
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      refresh();
    } catch (err) {
      console.error("Failed to create device type:", err);
      throw err; 
    }
  };

  // **Delete**
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this device type?")) return;
    try {
      const res = await apiFetch(`/api/deviceType/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(res.statusText);

      refresh?.(); // refresh the list after deletion
    } catch (err) {
      console.error("Failed to delete device type:", err);
      alert("Failed to delete device type");
    }
  };

  const columns = [
    { key: "id", header: "ID", width: "30%", sortable: true, render: (d: DeviceType) => d.id },
    { key: "type", header: "Type", width: "25%", sortable: true, render: (d: DeviceType) => d.name },
    { key: "comment", header: "Comment", width: "18%", sortable: false, render: (d: DeviceType) => <span style={{ color: theme.colors.textMuted }}>{d.comment || "—"}</span> },
  ];

  const actions = [
    { label: "Edit", icon: <Edit size={16} />, onClick: (d: DeviceType) => setUpdate(d) },
    { label: "History", icon: <History size={16} />, onClick: (d: DeviceType) => setHistory(d) },
    { label: "QR Code", icon: <QrCode size={16} />, onClick: (d: DeviceType) => setQrValue(d.id.toString()), },
    { label: "Delete", icon: <Trash2 size={16} />, onClick: (d: DeviceType) => handleDelete(d.id), danger: true },
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
        createButton={() => setCreate(true)}
        onSearch={(s) => setQuery((q) => ({ ...q, search: s, page: 1 }))}
        onSort={(k, asc) => setQuery((q) => ({ ...q, sortKey: k, sortAsc: asc, page: 1 }))}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(n) => setPageSize(n)}
        emptyText="Device Types are empty" 
        getPage={getPage}
      />
      {qrValue && <QrModal value={qrValue} onClose={() => setQrValue(null)} />}
      {create   && <DeviceTypeForm onSave={handleSave} onClose={() => setCreate(false)} />}
      {update   && <EditPackForm mode="deviceType" tittle={"Edit Device Type"} value={update} onSave={handleSave} onClose={() => setUpdate(null)} />}
      <HistoryForm entityType="deviceType" entityId={history?.id} onClose={() => setHistory(null)}/>
    </div>
}