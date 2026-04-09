import { useState, useMemo, useEffect, useRef } from "react";
import { CommonTable, type TableColumn } from "./CommonTable";
import IconButton from "../common/IconButton";
import Button from "../common/Button";
import { theme } from "../theme";
import { Toast } from "../common/Toast";
import { useTranslation } from "react-i18next";

export type EntityAction<T> = {
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
  danger?: boolean;
};

export type EntityTableProps<T> = {
  data: T[];
  total?: number;
  loading?: boolean;
  error?: string | null;
  columns: TableColumn<T>[];
  getRowKey: (row: T) => React.Key;
  refresh?: () => void;
  createButton?: () => void;
  searchFields?: (keyof T)[];
  actions?: EntityAction<T>[];
  emptyText?: string;
  hideMeta?:  boolean,
  onSearch?: (value: string) => void;
  onSort?: (key: string, asc: boolean) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (pageSize: number) => void;
  getPage: (page: number) => T[] | undefined;
};

export function EntityTable<T>({
  data,
  loading,
  total,
  error,
  columns,
  getRowKey,
  refresh,
  createButton,
  actions = [],
  hideMeta,
  emptyText = "No data",
  onSearch,
  onSort,
  onPageChange,
  onRowsPerPageChange,
  getPage,
}: EntityTableProps<T>) {
  const [search, setSearch] = useState("");
  const [toastError, setToastError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const isFirstSearch = useRef(true);
  const { t } = useTranslation();


  const handleSort = (key: string) => {
    const asc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(asc);
    onSort?.(key, asc);
  };

  useEffect(() => {
    if (error) setToastError(error);
  }, [error]);

  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }
    onSearch?.(search);
  }, [search]);


  const allColumns: TableColumn<T>[] = useMemo(() => {
    if (!actions.length) return columns;

    return [
      ...columns,
      {
        key: "__actions",
        header: t("actions"),
        width: "15%",
        align: "right",
        render: (row: T) => (
          <div style={{ display: "inline-flex", gap: theme.spacing.small }}>
            {actions.map((a, idx) => (
              <IconButton
                key={idx}
                title={a.label}
                danger={a.danger}
                onClick={() => a.onClick(row)}
              >
                {a.icon}
              </IconButton>
            ))}
          </div>
        ),
      },
    ];
  }, [columns, actions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, color: theme.colors.text }}>
      {/* Toolbar */}
      {!hideMeta && (<div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: theme.spacing.large,
          gap: theme.spacing.medium,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "inline-flex", gap: theme.spacing.medium }}>
          <Button onClick={refresh}>↻ {t("refresh")}</Button>
          {createButton && <Button onClick={createButton}>+ {t("create")}</Button>}
        </div>

        <input
          type="text"
          placeholder={t("Search") + "..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={SearchBarStyle}
          onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary}33`}
          onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
        />
      </div>)}

      {/* Table */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {toastError && (
          <Toast
            message={toastError}
            onClose={() => setToastError(null)}
          />
        )}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: theme.colors.loadingOverlay,
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <span style={{ color: theme.colors.textMuted }}>
              Loading…
            </span>
          </div>
        )}
        <CommonTable 
          data={data} 
          total={total}
          columns={allColumns} 
          getRowKey={getRowKey} 
          emptyText={emptyText} 
          onSort={handleSort} 
          sortKey={sortKey} 
          sortAsc={sortAsc} 
          resetPageTrigger={`${search}-${sortKey}-${sortAsc}`}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          getPage={getPage}
        />
      </div>
    </div>
  );
}

const SearchBarStyle: React.CSSProperties = {
  padding: `${theme.spacing.small}px ${theme.spacing.medium}px`,
  borderRadius: theme.borderRadius,
  border: theme.border,
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  outline: "none",
  transition: "0.2s",
  minWidth: 250,
};
