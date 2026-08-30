import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Fetches data with the current auth token, tracks loading/error, and exposes reload().
// deps re-run the fetch (e.g. a selected branch filter changing).
export function useApiData(fetcher, deps = []) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetcher(token);
      setData(result);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, ...deps]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}
