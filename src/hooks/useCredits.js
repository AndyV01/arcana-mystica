import { useEffect, useState } from "react";
import { getUserId, checkCredits } from "../credits.js";

export function useCredits() {
  const [credits, setCredits] = useState(null);

  const loadCredits = async () => {
    const userId = getUserId();
    const data = await checkCredits(userId);
    setCredits(data);
  };

  useEffect(() => {
    loadCredits();
  }, []);

  return { credits, reloadCredits: loadCredits };
}