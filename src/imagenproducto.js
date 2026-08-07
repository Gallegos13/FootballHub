const imagenesActualizadas = {
  2: "/américa1.png",
};

export function obtenerImagenProducto(producto) {
  return imagenesActualizadas[Number(producto?.id)] || producto?.imagen;
}
