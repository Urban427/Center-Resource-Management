import { useState } from "react";
import { ModalWindow } from "../../common/ModalWindow";
import { InputField } from "../../common/InputField";
import { theme } from "../../theme";
import type { DeviceType } from "../../types/deviceType";

export type DeviceTypeFormProps = {
  onClose: () => void;
  onSave: (deviceType: DeviceType) => Promise<void>;
};

export default function DeviceTypeForm({ onClose, onSave }: DeviceTypeFormProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const devuiceType: DeviceType = {
        id: 0,
        name: name,
        comment: comment
      }
      await onSave(devuiceType);
      onClose();
      setName("");
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
      <ModalWindow title={`Create Device Type`} onClose={onClose} width="40%" height="50%" closeOnOverlay={false}>
        <div style={theme.styles.bodyLeft}>       
          <InputField
            label="Name"
            placeholder="Name"
            value={name}
            onChange={setName}
            rows={1}
          />

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
            }}
          >
            Save
          </button>
        </div>
      </ModalWindow>
    </div>
  );
}
