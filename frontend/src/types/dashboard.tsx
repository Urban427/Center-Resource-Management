export type Booking = {
  id: number;
  deviceTypeId: number;
  deviceTypeName: string;
  numberOfDevices: number;
  comment: string;
  status: number;
  createdAt: string;
  completedAt: string | null;
};

export type Device = {
  id: number;
  deviceTypeId: number;
  deviceTypeName: string;
  stageResult: number;
  status: number;
  comment: string;
};

export type DeviceType = {
  id: number;
  name: string;
  comment?: string;
};

export type Test = {
    id: number;
    deviceId: number;
    deviceTypeName: string;
    newStageResult: number;
    deviceTypeId: number;
    changedAt: string;
    changedBy: string;
    comment: string;
}

export type Trash = {
    id: number;
    entityName: string;
    entityKey: string;
    deletedAt: Date;
    expiresAt: Date;
    deletedBy?: string;
    reason?: string;
};
