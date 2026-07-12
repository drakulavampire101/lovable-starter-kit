import { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .request({ url, ...options })
      .then((res) => alive && setData(res.data))
      .catch((err) => alive && setError(err))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [url]);

  return { data, error, loading };
}
