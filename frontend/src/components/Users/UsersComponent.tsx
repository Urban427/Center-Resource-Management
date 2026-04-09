import { EntityTable } from "../CommonComponent";
import type { User } from "../../types/users";
import UsersForm from "./UsersForm";
import { useEntityApi } from "../EntityQuery";
import { useState } from "react";
import QrModal from "../QrModal";
import { saveUser } from "../../services/userApi";

export default function UsersComponent() {
  const { data, total, loading, error, refresh, setQuery, getPage, setPage, setPageSize } = useEntityApi<User>("/api/users");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [create, setCreate] = useState(false);

  const columns = [
    { key: "id", header: "ID", width: "8%", sortable: false, render: (d: User) => d.id },
    { key: "name", header: "Name", width: "14%", sortable: false, render: (d: User) => d.name },
    { key: "email", header: "Email", width: "20%", sortable: false, render: (d: User) => d.email },
    { key: "role", header: "Role", width: "14%", sortable: false, render: (d: User) => d.roleName },
    ];

  return <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <EntityTable
        data={data}
        loading={loading}
        error={error}
        total={total}
        columns={columns}
        getRowKey={(d) => d.id}
        refresh={refresh}
        createButton={() => setCreate(true)}
        onSearch={(s) => setQuery((q) => ({ ...q, search: s, page: 1 }))}
        onSort={(k, asc) => setQuery((q) => ({ ...q, sortKey: k, sortAsc: asc, page: 1 }))}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(n) => setPageSize(n)}
        getPage={getPage}
      />

      {qrValue && <QrModal value={qrValue} onClose={() => setQrValue(null)} />}
    {create   && <UsersForm onSave={saveUser} onClose={() => setCreate(false)} />}
    </div>
}
