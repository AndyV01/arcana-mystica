import { v4 as uuidv4 } from "uuid";

/**
 * Obtains or generates a unique, persistent user ID.
 * It is stored in localStorage to maintain identity across sessions.
 */
export function getUserId() {
  let id = localStorage.getItem("arcana_user_id");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("arcana_user_id", id);
  }
  return id;
}
