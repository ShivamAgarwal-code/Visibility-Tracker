import { useState, useEffect } from "react";

interface UseQueriesLeftProps {
  userId: number | null;
}

export function useQueriesLeft({ userId }: UseQueriesLeftProps) {
  const [queriesLeft, setQueriesLeft] = useState<number | null>(null);

  const fetchQueries = async () => {
    if (!userId) {
      console.log("No userId provided to useQueriesLeft");
      return;
    }
    try {
      const res = await fetch("/api/queries");
      const data = await res.json();
      console.log("API /api/queries response:", data);
      const user = data.users.find((u: { user_id: number }) => u.user_id === userId);
      setQueriesLeft(user ? user.queries_left : 0);
    } catch (err) {
      console.error("Error fetching queries left:", err);
      setQueriesLeft(0);
    }
  };

  const decrementQueries = async () => {
    fetchQueries();
  };

  useEffect(() => {
    console.log("useQueriesLeft useEffect, userId:", userId);
    fetchQueries();
  }, [userId]);

  return {
    queriesLeft,
    fetchQueries,
    decrementQueries,
  };
}
