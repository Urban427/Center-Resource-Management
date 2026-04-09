import { useState, useRef, useMemo } from "react";
import { ModalWindow } from "../../common/ModalWindow";
import { InputField } from "../../common/InputField";
import { theme } from "../../theme";
import type { Device } from "../../types/device";
import type { DeviceType } from "../../types/deviceType";
import { apiFetch } from "../../api/apiFetch";

export type DeviceFormProps = {
  onClose: () => void;
  onSave: (device: Device) => Promise<void>;
};

export default function DeviceForm({ onClose, onSave }: DeviceFormProps) {
  const [deviceTypeId, setDeviceTypeId] = useState<number | 0>(0);
  const [deviceTypeName, setDeviceTypeName] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debouncedType, setDebouncedType] = useState<string | "">("");
  const [tips, setTips] = useState<DeviceType[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const fetchTipsRef = useRef<(value: string) => void>(null);

if (!fetchTipsRef.current) {
  fetchTipsRef.current = debounce(async (value: string) => {
    if (!value) {
      setTips([]);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await apiFetch(`/api/deviceType/search?name=${value}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setTips(data);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error(err);
    }
  }, 100);
}

const handleFetchTips = fetchTipsRef.current!;
  const handleSubmit = async () => {
    if (!deviceTypeId) {
      setError("Device Type field is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const device: Device = {
        id: 0,
        deviceTypeId: deviceTypeId,
        deviceTypeName: deviceTypeName,
        checked: 0,
        stageResult: 0,
        status: 0,
        comment: comment,
      };
      await onSave(device);
      onClose();
      setDeviceTypeName("");
      setComment("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (<div style={theme.styles.error}>⚠ {error}</div> )}
      <ModalWindow title={`Create Device`} onClose={onClose} width="40%" height="50%" closeOnOverlay={false}>
        <div style={theme.styles.bodyLeft}>       
{/* Wrap input in relative container */}
<div style={{ position: "relative", marginBottom: 12 }}>
  <InputField
    label="Device Type"
    placeholder="Device Type"
    value={deviceTypeName}
    onChange={(value) => {
      setDeviceTypeName(value);
      handleFetchTips(value);
    }}
    rows={1}
  />
 {tips.length > 0 && (
    <div
      style={{
        position: "absolute",
        top: "90%",
        left: "0",
        width: "70%",
        maxHeight: 120,
        background: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        overflowY: "auto",
        zIndex: 9999,
        padding: 8,
        fontSize: 14,
      }}
    >
      <strong>Suggestions:</strong>
      {tips.map((tip) => (
        <div
          key={tip.id}
          style={{
            padding: 6,
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
          onClick={() => {
            setDeviceTypeName(tip.name);
            setDeviceTypeId(tip.id);
            setTips([]);
          }}
        >
          {tip.name}
        </div>
      ))}
    </div>
  )}
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
      </ModalWindow>
    </div>
  );
}
