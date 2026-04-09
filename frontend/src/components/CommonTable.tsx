import { useEffect, useMemo, useState } from "react";
import { theme } from "../theme";
import { PaginationButton } from "../common/PaginationButton";
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter  } from "lucide-react";
import './CommonTable.css';
import { useTranslation } from "react-i18next";

export type TableColumn<T> = {
  key: string;
  header: string;
  width: string;
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type CommonTableProps<T> = {
  data: T[];
  total?: number;
  columns: TableColumn<T>[];
  emptyText?: string;

  pagination?: boolean;
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];

  getRowKey?: (row: T, index: number) => React.Key;
  onRowClick?: (row: T) => void;

  sortKey?: string | null;
  sortAsc?: boolean;
  onSort?: (key: string) => void;
  resetPageTrigger?: any; 
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  getPage: (page: number) => T[] | undefined;
};

export function CommonTable<T>({
  data,
  total,
  columns,
  emptyText = "No data",

  pagination = true,
  initialRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 20, 50],

  getRowKey,
  onRowClick,
  sortKey,
  sortAsc,
  onSort,
  resetPageTrigger,
  onPageChange,
  getPage,
  onRowsPerPageChange,
}: CommonTableProps<T>) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const { t } = useTranslation();
  const [copyTooltip, setCopyTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [sortKey, sortAsc, resetPageTrigger]);

  const totalPages = Math.max(
    1,
    Math.ceil((total ?? data.length) / rowsPerPage)
  );

  const visibleData = useMemo(() => {
    return getPage(page) ?? [];
  }, [page, getPage]);

  const copyText = (text: string, e: React.MouseEvent) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Modern approach
      navigator.clipboard.writeText(text).catch((err) => console.error(err));

      const x = e.clientX;
      const y = e.clientY;

      setCopyTooltip({ visible: true, x, y });

      setTimeout(() => {
        setCopyTooltip(null);
      }, 900);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // avoid scrolling
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
      document.body.removeChild(textarea);
    }
  };


  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <table style={table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    ...th,
                    width: c.width,
                    textAlign: c.align ?? "left",
                    alignItems: "center",
                    gap: 4,
                    cursor: c.sortable && onSort ? "pointer" : "default",
                  }}
                      onMouseEnter={() => c.sortable && setHoveredColumn(c.key)}
                      onMouseLeave={() => c.sortable && setHoveredColumn(null)}
                      onClick={() => c.sortable && onSort?.(c.key)}
                >
                  <span>{c.header}</span>

                  {c.header.toLowerCase().includes("статус") && (
                    <Filter
                      size={12}
                      style={{ marginLeft: 6, cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Filter clicked for ${c.key}`);
                      }}
                    />
                  )}
                  {c.sortable && onSort && (hoveredColumn === c.key || sortKey === c.key) && (
                    sortKey === c.key
                      ? sortAsc
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                      : <ChevronsUpDown size={12} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body */}
      <div style={body}>
        <table style={table}>
          <tbody>
            {visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    padding: theme.spacing.large,
                    color: theme.colors.textMuted,
                    fontStyle: "italic",
                  }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              visibleData.map((row, idx) => {
                const rowKey =
                  getRowKey?.(row, idx) ??
                  (row as any)?.id ??
                  `${page}-${idx}`;

                return (
                  <tr
                    key={rowKey}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                      backgroundColor:
                        idx % 2 === 0
                          ? "transparent"
                          : theme.colors.rowAltBg,
                    }}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        style={{
                          ...cell,
                          width: c.width,
                          textAlign: c.align ?? "left",
                          maxWidth: c.width,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={(e) => {
                          const text = c.render(row);

                          if (typeof text === "string" || typeof text === "number") {
                            copyText(text.toString(), e);
                          }
                        }}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {pagination && (
        <div style={footer}>
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.small }}>
            <span>{t("Rows")}:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
                onRowsPerPageChange?.(Number(e.target.value));
                onPageChange?.(1);
              }}
              style={choiceButton}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.buttonHoverBg)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.buttonBg)
              }
            >
              {rowsPerPageOptions.map((n) => (
                <option
                  key={n}
                  value={n}
                  style={{
                    backgroundColor: theme.colors.buttonBg,
                    color: theme.colors.buttonText,
                  }}
                >
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.small }}>
            <PaginationButton disabled={page === 1} 
              onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              onPageChange?.(newPage);
            }}>
              ◀
            </PaginationButton>

            <span style={{ margin: `0 ${theme.spacing.small}px` }}>
              {t("Page")} {page} / {totalPages}
            </span>

            <PaginationButton disabled={page === totalPages} 
              onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              onPageChange?.(newPage);
            }}>
              ▶
            </PaginationButton>
          </div>
        </div>
      )}
      {copyTooltip?.visible && (
        <div
          style={{
            position: "fixed",
            top: copyTooltip.y + 10,
            left: copyTooltip.x + 10,
            background: "black",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.9,
          }}
        >
          {t("copied")}
        </div>
      )}
    </div>
  );
}

/* ---------- shared styles ---------- */

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  height: "100%",
  minHeight: 0,
  borderRadius: theme.borderRadius,
  overflow: "hidden",
  backgroundColor: theme.colors.background,
  border: theme.border,
};

const choiceButton: React.CSSProperties = {
  marginLeft: theme.spacing.small,
  padding: `${theme.spacing.small}px ${theme.spacing.small}px`,
  borderRadius: theme.borderRadius,
  border: "none",
  backgroundColor: theme.colors.buttonBg,
  color: theme.colors.buttonText,
  cursor: "pointer",
  outline: "none",
  transition: "background-color 0.2s",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
};

const header: React.CSSProperties = {
  position: "sticky",
  top: 0,
  backgroundColor: theme.colors.tableHeaderBg,
};

const th: React.CSSProperties = {
  padding: theme.spacing.medium,
  fontWeight: 600,
  fontSize: 13,
  color: theme.colors.tableHeaderText,
  backgroundColor: theme.colors.tableHeaderBg,
  borderBottom: theme.border,
};

const body: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
};

const cell: React.CSSProperties = {
  padding: theme.spacing.medium,
  borderBottom: theme.border,
  fontSize: 14,
  verticalAlign: "middle",
};

const footer: React.CSSProperties = {
  flexShrink: 0,
  height: 25,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing.medium,
  borderTop: theme.border,
  backgroundColor: theme.colors.tableHeaderBg,
};
