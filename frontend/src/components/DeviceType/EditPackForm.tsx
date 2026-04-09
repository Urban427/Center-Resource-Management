import { useState, useEffect, useTransition } from "react";
import { ModalWindow } from "../../common/ModalWindow";
import { InputField } from "../../common/InputField";
import { InfoField } from "../../common/InfoField";
import { theme } from "../../theme";
import type { DeviceType } from "../../types/deviceType";
import type { Booking } from "../../types/booking";
import { CommonTable, type TableColumn } from "../CommonTable";
import { EntityTable } from "../CommonComponent";
import type { Device } from "../../types/device";
import { formatStatus } from "../../types/device";
import { useEntityApi } from "../EntityQuery";
import { useTranslation } from "react-i18next";

type EditPackFormProps =
  | {
      mode: "deviceType";
      value: DeviceType;
      onSave: (data: DeviceType) => Promise<void>;
      onClose: () => void;
      tittle: string;
    }
  | {
      mode: "booking";
      value: Booking;
      onSave: (data: Booking) => Promise<void>;
      onClose: () => void;
      tittle: string;
    };


export default function EditPackForm(props: EditPackFormProps) {
    const [numberOfDevices, setNumberOfDevices] = useState<string | "">("");
    const [deviceTypeId, setDeviceTypeId] = useState<string | "">("");
    const [name, setName] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const { t } = useTranslation();

  const { data, total, loading, error, refresh, setQuery, setPage, setPageSize, getPage } = useEntityApi<Device>("/api/device");
  const columns = [
    { key: "id", header: "ID", width: "50%", sortable: true, render: (d: Device) => d.id },
    { key: "status", header: "Status", width: "20%", sortable: true, render: (d: Device) => formatStatus(d.status, d.stageResult, t) },
    { key: "comment", header: "Comment", width: "18%", sortable: false, render: (d: Device) => <span style={{ color: theme.colors.textMuted }}>{d.comment || "—"}</span> },
  ];

    useEffect(() => {
        if (!props.value) return;

        setDeviceTypeId(props.value.id.toString());
        if (props.mode === "deviceType") {
            setName(props.value.name ?? "");
        }
        if (props.mode === "booking") {
            setName(props.value.deviceTypeName);
            setNumberOfDevices(props.value.numberOfDevices.toString());
        }
            setComment(props.value.comment ?? "");
    }, [props.value, props.mode]);

    const handleSubmit = async () => {
        if (!props.value) return;

        try {
            if (props.mode === "deviceType") {
            const deviceType: DeviceType = {
                id: props.value.id,
                name,
                comment,
            };

            await props.onSave(deviceType);
            }

            if (props.mode === "booking") {
            const booking: Booking = {
                ...props.value,
                comment,
            };

            await props.onSave(booking);
            }

            props.onClose();
        } catch (err) {
            console.error(err);
        }
    };


  return (
    <div>
      {error && (<div style={theme.styles.error}>⚠ {error}</div> )}
      <ModalWindow title={props.tittle} onClose={props.onClose} width="80%" height="83%" closeOnOverlay={false}>
        <div style={theme.styles.bodyLeft}>       
          <div style={{ display: "flex", gap: theme.spacing.medium }}>
            <InfoField
                label="ID"
                value={deviceTypeId}
                width={"25%"}
            />

            {props.mode == "booking" && (<InfoField
                label="Number of Devices"
                value={numberOfDevices}
                width={"25%"}
            />)}

            <InputField
                label="Type"
                placeholder="Type"
                value={name}
                readonly={props.mode == "booking"}
                onChange={setName}
                rows={1}
                grow
            />
          </div>

          <InputField
            label="Comment"
            placeholder="Comment (optional)"
            value={comment}
            multiline
            onChange={setComment}
            rows={6}
          />

          {/* Save */}
          <button
            disabled={loading}
            onClick={handleSubmit}
            style={{
              marginTop: 24,
              width: "100%",
              padding: 14,
              background: theme.colors.primary,
              color: theme.colors.background,
              fontWeight: "bold",
              outline: "none",
            }}
          >
            Save
          </button>
        </div>
        
        <div
            style={{
                flex: 1,
                padding: theme.spacing.large,
                background: theme.colors.rowAltBg,
                overflowY: "auto",
            }}
            >
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <EntityTable
                    data={data}
                    loading={loading}
                    error={error}
                    total={total}
                    hideMeta
                    columns={columns}
                    getRowKey={(d) => d.id}
                    refresh={refresh}
                    onSearch={(s) => setQuery((q) => ({ ...q, search: s, page: 1 }))}
                    onSort={(k, asc) => setQuery((q) => ({ ...q, sortKey: k, sortAsc: asc, page: 1 }))}
                    onPageChange={(p) => setPage(p)}
                    onRowsPerPageChange={(n) => setPageSize(n)}
                    getPage={getPage}
                />
            </div>
        </div>
      </ModalWindow>
    </div>
  );
}
