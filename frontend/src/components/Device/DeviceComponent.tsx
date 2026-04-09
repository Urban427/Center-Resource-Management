import { useState } from "react";
import { EntityTable } from "../CommonComponent";
import { HistoryForm } from "../History/HistoryForm";
import QrModal from "../QrModal";
import type { Device } from "../../types/device";
import { formatStatus } from "../../types/device";
import { Edit, QrCode, Trash2, History } from "lucide-react";
import { theme } from "../../theme";
import { useEntityApi } from "../EntityQuery";
import DeviceForm  from "./DeviceForm";
import DeviceEditForm  from "./DeviceEditForm";
import { saveDevice, fetchDeviceHistory } from "../../services/deviceApi";
import { useTranslation } from "react-i18next";


export default function DeviceComponent() {
  const { data, total, loading, error, refresh, setQuery, setPage, setPageSize, getPage } = useEntityApi<Device>("/api/device");
  const { t } = useTranslation();
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [history, setHistory] = useState<Device | null>(null);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState<Device | null>(null);

  const columns = [
    { key: "id", header: t("id"), width: "30%", sortable: true, render: (d: Device) => d.id },
    { key: "type", header: t("type"), width: "15%", sortable: true, render: (d: Device) => d.deviceTypeName },
    { key: "version", header: t("version"), width: "15%", sortable: true, render: (d: Device) => {
        const seed = d.id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const major = (seed % 5) + 1;    // 1-5
        const minor = (seed * 7 % 10);   // 0-9
        const patch = (seed * 13 % 20);  // 0-19
        return `v${major}.${minor}.${patch}`;
    }},
    { key: "status", header: t("status"), width: "20%", sortable: false, render: (d: Device) => formatStatus(d.status, d.stageResult, t) },
    { key: "comment", header: t("comment"), width: "18%", sortable: false, render: (d: Device) => <span style={{ color: theme.colors.textMuted }}>{d.comment || "—"}</span> },
  ];

  const actions = [
    { label: t("Edit"), icon: <Edit size={16} />, onClick:(d: Device) => setUpdate(d) },
    { label: t("History"), icon: <History size={16} />, onClick: (d: Device) => setHistory(d) },
    { label: t("QR Code"), icon: <QrCode size={16} />, onClick: (d: Device) => setQrValue(d.id.toString()), },
    { label: t("Delete"), icon: <Trash2 size={16} />, onClick: (d: Device) => fetchDeviceHistory(d.id), danger: true },
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
        getPage={getPage}
      />
      
      {qrValue && <QrModal value={qrValue} onClose={() => setQrValue(null)} />}
      {create   && <DeviceForm onSave={saveDevice} onClose={() => setCreate(false)} />}
      {update   && <DeviceEditForm title={"Edit Device"} device={update} onClose={() => setUpdate(null)} />}
      <HistoryForm entityType="device" entityId={history?.id} onClose={() => setHistory(null)}/>
    </div>
}