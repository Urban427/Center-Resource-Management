import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../api/apiFetch";

type EntityQuery = {
  search?: string;
  sortKey?: string;
  sortAsc?: boolean;
};

const WINDOWSIZE = 4;

type ApiResponse<T> = {
  items: T[];
  total: number;
};

export function useEntityApi<T extends { id: number }>(endpoint: string) {
  // -----------------------------
  // core state
  // -----------------------------
  const [pages, setPages] = useState<Map<number, T[]>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState<EntityQuery>({});
  const [version, setVersion] = useState(0);
  const [total, setTotal] = useState(0);
  const loadingCountRef = useRef(0);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // refs (truth sources)
  // -----------------------------
  const pagesRef = useRef(pages);
  const loadingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  // -----------------------------
  // stable query key
  // -----------------------------
  const queryKey = useMemo(
    () => JSON.stringify({ query, pageSize }),
    [query, pageSize]
  );

  // -----------------------------
  // fetch one page (STABLE)
  // -----------------------------
  const fetchPage = useCallback(
    async (page: number, versionKey: number) => {
      if (page < 1) return;
      if (pagesRef.current.has(page)) return;
      if (loadingRef.current.has(page)) return;

      loadingRef.current.add(page);
      loadingCountRef.current++;
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("pageSize", pageSize.toString());

        if (query.search) params.set("search", query.search);
        if (query.sortKey) params.set("sort", query.sortKey);
        if (query.sortAsc !== undefined)
          params.set("order", query.sortAsc ? "asc" : "desc");

        const res = await apiFetch(`${endpoint}?${params}`);
        if (!res.ok) throw new Error(res.statusText);

        const response: ApiResponse<T> = await res.json();
        setPages(prev => {
          if (versionKey !== version) return prev; // ignore old fetch
          const next = new Map(prev);
          next.set(page, response.items);
          return next;
        });
        
        setTotal(response.total);
      } catch (e: any) {
        setError(e.message);
      } finally {
        loadingRef.current.delete(page);
        loadingCountRef.current--;

        if (loadingCountRef.current <= 0) {
          loadingCountRef.current = 0;
        }
      }
    },
    [endpoint, pageSize, queryKey, version]
  );

  // -----------------------------
  // load window pages
  // -----------------------------
  useEffect(() => {
    const from = currentPage - WINDOWSIZE;
    const to = currentPage + WINDOWSIZE;

    for (let p = from; p <= to; p++) {
      fetchPage(p, version);
    }
  }, [currentPage, version]); // ← fetchPage intentionally excluded

  // -----------------------------
  // trim pages outside window
  // -----------------------------
  useEffect(() => {
    const from = currentPage - WINDOWSIZE;
    const to = currentPage + WINDOWSIZE;

    setPages(prev => {
      let changed = false;
      const next = new Map<number, T[]>();

      for (const [p, data] of prev) {
        if (p >= from && p <= to) {
          next.set(p, data);
        } else {
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [currentPage]);

  // -----------------------------
  // flatten + dedupe rows
  // -----------------------------
  const data = useMemo(() => {
    const seen = new Set<number | string>();
    const out: T[] = [];
    const from = currentPage - WINDOWSIZE;
    const to = currentPage + WINDOWSIZE;

    const sortedPages = Array.from(pages)
      .filter(([pageNum]) => pageNum >= from && pageNum <= to)
      .sort(([a], [b]) => a - b);

    for (const [, page] of sortedPages) {
      if (!Array.isArray(page)) continue;
      for (const row of page) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          out.push(row);
        }
      }
    }
    return out;
  }, [pages, currentPage]);

  // -----------------------------
  // refresh
  // -----------------------------
  const refresh = useCallback(() => {
    loadingRef.current.clear();
    setPages(new Map());
    setVersion(v => v + 1);
  }, []);

const getPage = useCallback(
  (pageNumber: number): T[] => {
    if (!pages.has(pageNumber)) return [];

    const pageItems = pages.get(pageNumber)!;

    // In case the last page has fewer items than pageSize, slice safely
    const start = 0;
    const end = pageSize;
    return pageItems.slice(start, end);
  },
  [pages, pageSize]
);
  // -----------------------------
  // public API
  // -----------------------------
  const loading =  loadingRef.current.has(currentPage);
  return {
    data,
    loading,
    total,
    error,

    page: currentPage,
    pageSize,

    setPage: setCurrentPage,
    setPageSize: (n: number) => {
      setPageSize(n); 
      setPages(new Map());
      loadingRef.current.clear();
      setVersion(v => v + 1);
      setCurrentPage(1);
    },
    setQuery: (updater: (q: EntityQuery) => EntityQuery) => {
      setQuery(prev => updater(prev));
      setPages(new Map());
      setVersion(v => v + 1);
    },
    getPage: getPage,
    refresh,
  };
}
