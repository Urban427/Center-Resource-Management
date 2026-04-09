import { useState } from "react";
import { EntityTable } from "../CommonComponent";
import { HistoryForm } from "../History/HistoryForm";
import QrModal from "../QrModal";
import BookingForm from "./BookingForm";
import { Edit, QrCode, Trash2, History } from "lucide-react";
import { theme } from "../../theme";
import type { Booking } from "../../types/booking";
import { formatDateTime } from "../../utils/format";
import { useEntityApi } from "../EntityQuery";
import EditPackForm from "../DeviceType/EditPackForm";
import { apiFetch } from "../../api/apiFetch";

export default function BookingComponent() {
  const { data, loading, error, refresh, setQuery, getPage } = useEntityApi<Booking>("/api/booking");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [history, setHistory] = useState<Booking | null>(null);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState<Booking | null>(null);

  //**Save**
  const handleSave = async (booking: Booking) => {
    try {
      const res = await apiFetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (!res.ok) throw new Error(res.statusText);

      refresh();
    } catch (err) {
      console.error("Failed to create booking:", err);
      throw err; // IMPORTANT → BookingForm catches this
    }
  };

  // **Delete**
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await apiFetch(`/api/booking/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(res.statusText);

      refresh?.(); // refresh the list after deletion
    } catch (err) {
      console.error("Failed to delete device:", err);
      alert("Failed to delete device");
    }
  };

  const columns = [
    { key: "id", header: "ID", width: "20%", sortable: true, render: (d: Booking) => d.id },
    { key: "type", header: "Type", width: "25%", sortable: true, render: (d: Booking) => d.deviceTypeName },
    { key: "numberOfDevices", header: "Number of Devices", width: "20%", sortable: true, render: (d: Booking) => d.numberOfDevices },
    { key: "createdAt", header: "Created At", width: "20%", sortable: true, render: (d: Booking) => formatDateTime(d.createdAt) },
    { key: "comment", header: "Comment", width: "18%", render: (d: Booking) => <span style={{ color: theme.colors.textMuted }}>{d.comment || "—"}</span> },
  ];

  const actions = [
    { label: "Edit", icon: <Edit size={16} />, onClick: (d: Booking) => setUpdate(d) },
    { label: "History", icon: <History size={16} />, onClick: (d: Booking) => setHistory(d) },
    { label: "QR Code", icon: <QrCode size={16} />, onClick: (d: Booking) => setQrValue(d.id.toString()), },
    { label: "Delete", icon: <Trash2 size={16} />, onClick: (d: Booking) => handleDelete(d.id), danger: true },
  ];

  return <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <EntityTable
        data={data}
        loading={loading}
        error={error}
        columns={columns}
        getRowKey={(d) => d.id}
        actions={actions}
        refresh={refresh}
        createButton={() => setCreate(true)}
        onSearch={(s) => setQuery((q) => ({ ...q, search: s, page: 1 }))}
        onSort={(k, asc) => setQuery((q) => ({ ...q, sortKey: k, sortAsc: asc, page: 1 }))}
        onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
        onRowsPerPageChange={(ps) => setQuery((q) => ({ ...q, pageSize: ps, page: 1 }))}
        emptyText="Bookings are empty" 
        getPage={getPage}
      />
      {qrValue  && <QrModal value={qrValue} onClose={() => setQrValue(null)} />}
      {create   && <BookingForm onSave={handleSave} onClose={() => setCreate(false)} />}
      {update   && <EditPackForm mode="booking" tittle={"Edit Booking"} value={update} onSave={handleSave} onClose={() => setUpdate(null)} />}
      <HistoryForm entityType="booking" entityId={history?.id} onClose={() => setHistory(null)}/>
    </div>
}