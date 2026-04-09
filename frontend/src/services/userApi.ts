import type { User } from "../types/users";
import { apiFetch } from "../api/apiFetch";

export async function saveUser(user: User) {
  const payload: any = {
    name: user.name,
    email: user.email,
    roleName: user.roleName,
    roleId: user.roleId,
  };

  if (user.id !== 0) {
    payload.id = user.id;
  }

  const res = await apiFetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to save user");
  }

  return res.json();
}
