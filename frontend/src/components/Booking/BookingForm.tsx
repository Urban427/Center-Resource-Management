import { useState } from "react";
import { theme } from "../../theme";
import type { Booking, BookingFormProps } from "../../types/booking";
import { ModalWindow } from "../../common/ModalWindow";
import { InputField } from "../../common/InputField";


export default function BookingForm({ onClose, onSave }: BookingFormProps) {
  const [typeId, setTypeId] = useState("");
  const [comment, setComment] = useState("");
  const [numberOfDevices, setNumberOfDevices] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!typeId) {
      setError("TypeID is required");
      return;
    }
    if (!numberOfDevices) {
      setError("NumberOfDevices is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const booking: Booking = {
        id: 0,
        deviceTypeId: parseInt(typeId),
        deviceTypeName: "",
        numberOfDevices: parseInt(numberOfDevices) || 0,
        comment,
        status: 0,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      await onSave(booking);
      onClose();
      setTypeId("");
      setComment("");
      setNumberOfDevices("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   return (
      <div>
        {error && (<div style={theme.styles.error}>⚠ {error}</div> )}
        <ModalWindow title={`Create Device`} onClose={onClose} width="40%" height="55%" closeOnOverlay={false}>
          <div style={theme.styles.bodyLeft}>       
            <InputField
              label="TypeID"
              placeholder="TypeID"
              value={typeId}
              onChange={setTypeId}
              rows={1}
            />            
            <InputField
              label="Number of Devices"
              placeholder="Number of Devices"
              value={numberOfDevices}
              onChange={setNumberOfDevices}
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
