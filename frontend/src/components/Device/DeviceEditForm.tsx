import { useState, useEffect } from "react";
import { ModalWindow } from "../../common/ModalWindow";
import { InputField } from "../../common/InputField";
import { formatDateTime } from "../../utils/format";
import { saveDevice, fetchDeviceHistory } from "../../services/deviceApi";
import { ResultCard } from "../../common/ResultCard";
import DeviceLifecycleDiagram from "../Tests/DeviceLifecycleDiagram";
import { InfoField } from "../../common/InfoField";
import { theme } from "../../theme";
import type { Device, DeviceStatusHistory } from "../../types/device";
import {  formatStatus } from "../../types/device";
import { apiFetch } from "../../api/apiFetch";
import { useTranslation } from "react-i18next";

export type DeviceFormProps = {
  device: Device | null;
  title: string;
  onClose: () => void;
};

export default function DeviceEditForm({ onClose, title, device }: DeviceFormProps) {
  const [id, setId] = useState<string>("");
  const [deviceChecked, setDeviceChecked] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [result, setResult] = useState<number>(0);
  const [status, setStatus] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DeviceStatusHistory[]>([]);
  const { t } = useTranslation();


  useEffect(() => {
    if (!device) return;

    setEditMode(true);
    setId(device.id.toString() ?? "");
    setDeviceChecked(device.checked ?? 0);
    setStatus(device.status ?? 0);
    setResult(device.stageResult ?? 0);
    setType(device.deviceTypeName ?? "");
    setComment(device.comment ?? "");
    fetchDeviceHistory(device.id)
      .then(setHistory)
      .catch(console.error);
  }, [device]);


  const handleSave = async () => {
    if (!device) return;

    setLoading(true);
    setError(null);

    try {
      const updatedDevice: Device = {
        ...device,
        comment: comment,
      };

      await saveDevice(updatedDevice);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const loadDevice = async (id: string) => {
    try {
      const res = await apiFetch(`/api/device/${id}`);
      if (!res.ok) throw new Error("Device not found");

      const info: Device = await res.json();
      setId(info.id.toString());
      setComment(info.comment ?? "");
      setDeviceChecked(info.checked ?? 0);
      setType(info.deviceTypeName ?? "");
      setStatus(info.status ?? 0);
      setResult(info.stageResult ?? 0);

      fetchDeviceHistory(info.id)
        .then(setHistory)
        .catch(console.error);

      setError(null);
    } catch (e: any) {
      setDeviceChecked(0);
      setError(e.message);
    }
  };

  return (
    <div>
      {error && (<div style={theme.styles.error}>⚠ {error}</div> )}
      <ModalWindow title={title} onClose={onClose} width="80%" height="80%" closeOnOverlay={false}>
        <div style={theme.styles.bodyLeft}>
            <InputField
                label="ID"
                placeholder="ID"
                value={id}
                readonly={editMode}
                onEnter={loadDevice}
                onChange={setId}
                rows={1}
            />
            <div style={{ display: "flex", gap: theme.spacing.medium }}>
                <InfoField
                    label="Type"
                    value={type}
                    grow
                />
                <InfoField
                    label="Status"
                    value={formatStatus(status, result, t)}
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
            <DeviceLifecycleDiagram deviceChecked={deviceChecked} />


          {/* Save */}
          <button
            disabled={loading}
            onClick={handleSave}
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
            {history.length === 0 ? (
                <div style={{ color: theme.colors.textMuted }}>No tests yet</div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: theme.spacing.small,
                    }}
                    >
                    {history.map((item) => (
                        <ResultCard 
                            key={item.id}
                            result={item.newStageResult} 
                            id={item.deviceId} 
                            status={item.newStatus}
                            comment={item.comment}
                        />
                    ))}
                </div>
            )}
            </div>
      </ModalWindow>
    </div>
  );
}
