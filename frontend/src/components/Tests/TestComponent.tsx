import { EntityTable } from "../CommonComponent";
import { theme } from "../../theme";
import type { Test } from "../../types/test";
import { StageResult } from "../../types/device";
import { formatDateTime } from "../../utils/format";
import { FileText, QrCode  } from "lucide-react";
import { useEntityApi } from "../EntityQuery";
import { useState } from "react";
import TestComponentForm from "./TestComponentForm";
import QrModal from "../QrModal";

export default function TestComponent() {
  const { data, total, loading, error, refresh, setQuery, getPage, setPage, setPageSize } = useEntityApi<Test>("/api/history/tests");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [testForm, setTestForm] = useState<Test | null>(null);

  const columns = [
    { key: "id", header: "ID", width: "10%", sortable: true, render: (d: Test) => d.id },
    { key: "result", header: "Result", width: "15%", sortable: false,
    render: (d: Test) => {
      let content = "";
      let color = theme.colors.text;

      switch (d.newStageResult) {
        case 1:
          content = "✅ Passed";
          color = "#2ecc71";
          break;
        case 2:
          content = "❌ Failed";
          color = "#e74c3c";
          break;
      }

      return (
        <span style={{ color, fontWeight: 500 }}>
          {content}
        </span>
      );
    },},
    { key: "deviceId", header: "Device ID", width: "40%", sortable: true, render: (d: Test) => d.deviceId},
    { key: "deviceTypeId", header: "Type", width: "25%", sortable: true, render: (d: Test) => d.deviceTypeName },
    { key: "changedAt", header: "Changed At", width: "25%", sortable: true, render: (d: Test) => formatDateTime(d.changedAt) },
    { key: "changedBy", header: "Changed By", width: "25%", sortable: true, render: (d: Test) => d.changedBy },
    { key: "comment", header: "Comment", width: "18%", sortable: false, render: (d: Test) => <span style={{ color: theme.colors.textMuted }}>{d.comment || "—"}</span> },
  ];

  const actions = [
    { label: "QR Code", icon: <QrCode size={16} />, onClick: (d: Test) => setQrValue(d.deviceId.toString()), },
    { label: "Info", icon: <FileText  size={16} />, onClick: (d: Test) => setTestForm(d), },
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
      {testForm && <TestComponentForm test={testForm} onClose={() => setTestForm(null)} />}
    </div>
}