import { theme } from "../../theme";
import type { Test } from "../../types/test";
import { formatDateTime } from "../../utils/format";
import { ResultCard } from "../../common/ResultCard";
import { InfoField } from "../../common/InfoField";
import { ModalWindow } from "../../common/ModalWindow";

type Props = {
  onClose: () => void;
  test: Test;
};

export default function TestComponentForm({ onClose, test }: Props) {
  return (
    <ModalWindow title={`Test Record — ${test.id}`} onClose={onClose} width="40%" closeOnOverlay={true}>
        {/* Body */}
        <div style={theme.styles.body}>
          <div style={theme.styles.bodyLeft}>
            <InfoField label="Device ID" value={test.deviceId} />
            <InfoField label="Device Type" value={test.deviceTypeName} />

            <div style={{ display: "flex", gap: theme.spacing.medium }}>
                <InfoField
                    label="Changed By"
                    value={test.changedBy}
                    grow
                />
                <InfoField
                    label="Changed At"
                    value={formatDateTime(test.changedAt)}
                    grow
                />
            </div>
            <InfoField
              label="Comment"
              value={test.comment || "—"}
              multiline
            />
            <ResultCard result={test.newStageResult} status={test.newStageResult} />
          </div>
        </div>
    </ModalWindow>
  );
}