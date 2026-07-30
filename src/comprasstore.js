const STORAGE_KEY = "sporthub_compras";

export function getCompras(email) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data[email] || [];
  } catch {
    return [];
  }
}

export function guardarCompra(email, compra) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!data[email]) data[email] = [];
    data[email].push({ ...compra, fecha: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
}