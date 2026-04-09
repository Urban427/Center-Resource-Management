import { apiFetch } from "./apiFetch";


export function createEntityApi<TCreate, TUpdate, TEntity>(baseUrl: string) {
  return {
    getAll: async (): Promise<TEntity[]> => {
      const res = await apiFetch(baseUrl);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },

    create: async (data: TCreate) => {
      const res = await apiFetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.statusText);
    },

    update: async (id: string | number, data: TUpdate) => {
      const res = await apiFetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.statusText);
    },

    remove: async (id: string | number) => {
      const res = await apiFetch(`${baseUrl}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(res.statusText);
    },

    history: async (id: string | number) => {
      const res = await apiFetch(`${baseUrl}/${id}/history`);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  };
}
