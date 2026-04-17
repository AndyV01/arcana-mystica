import { v4 as uuidv4 } from "uuid";

/**
 * Obtiene o genera un ID único persistente para el usuario.
 * Se almacena en localStorage para mantener la identidad entre sesiones.
 */
export function getUserId() {
  let id = localStorage.getItem("arcana_user_id");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("arcana_user_id", id);
  }
  return id;
}
