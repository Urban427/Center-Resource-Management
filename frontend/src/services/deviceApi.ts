import { apiFetch } from "../api/apiFetch";
import type { Device, DeviceStatusHistory } from "../types/device";

export async function saveDevice(device: Device) {
  const payload: any = {
    deviceTypeId: device.deviceTypeId,
    comment: device.comment,
  };

  if (device.id !== 0) {
    payload.id = device.id;
  }

  const res = await apiFetch("/api/device", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to save device");
  }

  return res.json();
}

export async function fetchDeviceHistory(id: number) {
  const res = await apiFetch(`/api/device/statusHistory/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }

  return res.json() as Promise<DeviceStatusHistory[]>;
}

export async function deleteDevice(id: number) {
  const res = await apiFetch(`/api/device/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to delete device");
  }

  return true;
}