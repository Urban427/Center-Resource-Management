import React from "react";
import { Check, X } from "lucide-react";
import { DeviceStatus, StageResult } from "./device";

export function formatStatusWithIcons(status: number, stageResult: number, t: (key: string) => string): React.ReactNode {
  if (status === DeviceStatus.None) return "—";
  if (status === DeviceStatus.Deleted) return "D";

  const statusMap: Record<number, string> = {
    0: t("registration"),
    1: t("test"),
    2: t("visualTest"),
    3: t("release"),
    4: t("warehouse"),
    5: t("sentOut"),
  };

  const statusStr = statusMap[status] || t("Unknown");
  if (status === DeviceStatus.Testing || status === DeviceStatus.VisualTesting) {
    let icon: React.ReactNode = null;

    if (stageResult === StageResult.Passed) {
      icon = <Check size={20} strokeWidth={5} color="#1abb65" style={{ transform: "translateY(2px)" }} />;
    } else if (stageResult === StageResult.Failed) {
      icon = <X size={20} strokeWidth={5} color="#e74c3c" style={{ transform: "translateY(2px)" }} />;
    }

    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {statusStr} {icon}
      </span>
    );
  }

  return statusStr;
}
