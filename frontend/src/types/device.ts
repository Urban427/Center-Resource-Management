import { Check, X } from "lucide-react";
import React from "react";

export type Device = {
  id: number;
  deviceTypeId: number;
  deviceTypeName: string;
  stageResult: number;
  status: number;
  checked: number;
  comment: string;
};

export type EntityChangeSet = {
  id: number;
  operation: number;
  changedAt: string;
  changedBy: string | null;
  comment: string | null;
  changes: EntityChange[];
};

export type EntityChange = {
  id: number;
  propertyName: string;
  oldValue: string | null;
  newValue: string | null;
}


export type DeviceStatusHistory = {
  id: number;
  
  deviceId: string;
  newChecked: number;
  oldStatus: DeviceStatus;
  oldStageResult: StageResult;
  newStatus: DeviceStatus;
  newStageResult: StageResult;

  changedAt:string;
  changedBy: string;
  comment: string;
}

export const DeviceStatus = {
  Registered: 0,
  Testing: 1,
  VisualTesting: 2,
  Released: 3,
  InWarehouse: 4,
  SentToCustomer: 5,
  None: 98,
  Deleted: 99,
} as const;
export type DeviceStatus = typeof DeviceStatus[keyof typeof DeviceStatus];

export const StageResult = {
  None: 0,
  Passed: 1,
  Failed: 2,
  Wait: 3,
} as const;
export type StageResult = typeof StageResult[keyof typeof StageResult];

export const DeviceLifecycleFlags = {
    None: 0,

    // Lifecycle stages
    Registered:         1 << DeviceStatus.Registered,
    TestingDone:        1 << DeviceStatus.Testing,
    VisualTestingDone:  1 << DeviceStatus.VisualTesting,
    Released:           1 << DeviceStatus.Released,
    InWarehouse:        1 << DeviceStatus.InWarehouse,
    SentToCustomer:     1 << DeviceStatus.SentToCustomer,

    // Test results (errors)
    TestingFailed:        1 << 8, // 256
    VisualTestingFailed:  1 << 9, // 512
    ElectricalFailed:     1 << 10,// 1024
}

export function formatStatus(status: number, stageResult: number, t: (key: string) => string) {
  if(status == DeviceStatus.None) return "—"
  if(status == DeviceStatus.Deleted) return "D"
  const statusMap: Record<number, string> = {
    0: t("registration"),
    1: t("test"),
    2: t("visualTest"),
    3: t("release"),
    4: t("warehouse"),
    5: t("sentOut"),
  };

  const resultMap: Record<number, string> = {
    0: "",
    1: "✅",
    2: "❌",
  };

  const statusStr = statusMap[status] || t("Unknown");
  const resultStr = (status == 1 || status == 2) ? resultMap[stageResult]: "" ;

  return resultStr ? `${statusStr} ${resultStr}` : statusStr;
}

export function formatStatusText(status: number, stageResult: number, t: (key: string) => string) {
  if(status == DeviceStatus.None) return "—"
  if(status == DeviceStatus.Deleted) return "D"
  const statusMap: Record<number, string> = {
    0: t("registration"),
    1: t("test"),
    2: t("visualTest"),
    3: t("release"),
    4: t("warehouse"),
    5: t("sentOut"),
  };

  const statusStr = statusMap[status] || t("Unknown");
  return statusStr;
}