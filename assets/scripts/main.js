let productos = [];

fetch("assets/scripts/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const inputBusqueda = document.querySelector("#input-busqueda");

botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";

  if (productosElegidos.length === 0) {
    contenedorProductos.innerHTML =
      "<p>No hay productos disponibles con nombre o categoria '" +
      document.getElementById("input-busqueda").value +
      "'.</p>";
  } else {
    productosElegidos.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
                <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <p class="producto-precio">$${producto.precio} USD</p>
                    <button class="btn-ver-mas" data-id="${producto.id}">Ver más</button>
                    <button class="btn-96 producto-agregar" data-id="${producto.id}"><span>Agregar</span></button>
                </div>
            `;
      contenedorProductos.append(div);
    });
  }

  actualizarBotonesAgregar();
}

[...botonesCategorias, document.querySelector("#topSale")].forEach((boton) => {
  boton.addEventListener("click", (e) => {
    [...botonesCategorias, document.querySelector("#topSale")].forEach(
      (boton) => boton.classList.remove("active")
    );
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id === "topSale") {
      const productosTopSale = productos.filter(
        (producto) => producto.estado === "topSale"
      );
      cargarProductos(productosTopSale);
      tituloPrincipal.innerText = "Lo mas vendido";
    } else if (e.currentTarget.id !== "todos") {
      const productosCategoria = productos.filter(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      const nombreCategoria =
        productosCategoria.length > 0
          ? productosCategoria[0].categoria.nombre
          : "";
      cargarProductos(productosCategoria);
      tituloPrincipal.innerText = nombreCategoria;
    } else {
      cargarProductos(productos);
      tituloPrincipal.innerText = "Todos los productos";
    }
  });
});

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const idBoton = e.currentTarget.dataset.id;
      agregarAlCarrito(idBoton);
    });
  });
}

let productosEnCarrito =
  JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
actualizarNumerito();

function agregarAlCarrito(idProducto) {
  Toastify({
    text: "Producto agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #0e0700, #502902)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
      color: "#fff",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const productoAgregado = productos.find(
    (producto) => producto.id === idProducto
  );

  const productoEnCarrito = productosEnCarrito.find(
    (productoCarrito) => productoCarrito.id === idProducto
  );

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}

inputBusqueda.addEventListener("input", () => {
  const textoBusqueda = inputBusqueda.value.trim().toLowerCase();
  const productosFiltrados = productos.filter((producto) => {
    const titulo = producto.titulo.toLowerCase();
    const categoria = producto.categoria.nombre.toLowerCase();
    return titulo.includes(textoBusqueda) || categoria.includes(textoBusqueda);
  });
  cargarProductos(productosFiltrados);
});

function ordenarYRenderizarPorPrecioMayor() {
  const productosEnPantalla = Array.from(
    contenedorProductos.querySelectorAll(".producto")
  );
  const productosOrdenados = productosEnPantalla.sort((a, b) => {
    const precioA = parseFloat(
      a.querySelector(".producto-precio").innerText.replace("$", "")
    );
    const precioB = parseFloat(
      b.querySelector(".producto-precio").innerText.replace("$", "")
    );
    return precioB - precioA;
  });
  productosOrdenados.forEach((producto) =>
    contenedorProductos.appendChild(producto)
  );
}

function ordenarYRenderizarPorPrecioMenor() {
  const productosEnPantalla = Array.from(
    contenedorProductos.querySelectorAll(".producto")
  );
  const productosOrdenados = productosEnPantalla.sort((a, b) => {
    const precioA = parseFloat(
      a.querySelector(".producto-precio").innerText.replace("$", "")
    );
    const precioB = parseFloat(
      b.querySelector(".producto-precio").innerText.replace("$", "")
    );
    return precioA - precioB;
  });
  productosOrdenados.forEach((producto) =>
    contenedorProductos.appendChild(producto)
  );
}

const botonOrdenarMayor = document.querySelector("#ordenar-descendente");
const botonOrdenarMenor = document.querySelector("#ordenar-ascendente");

botonOrdenarMayor.addEventListener("click", ordenarYRenderizarPorPrecioMayor);
botonOrdenarMenor.addEventListener("click", ordenarYRenderizarPorPrecioMenor);

function ordenarYRenderizarPorNombreAZ() {
  const productosEnPantalla = Array.from(
    contenedorProductos.querySelectorAll(".producto")
  );
  const productosOrdenados = productosEnPantalla.sort((a, b) => {
    const nombreA = a.querySelector(".producto-titulo").innerText.toLowerCase();
    const nombreB = b.querySelector(".producto-titulo").innerText.toLowerCase();
    return nombreA.localeCompare(nombreB);
  });
  productosOrdenados.forEach((producto) =>
    contenedorProductos.appendChild(producto)
  );
}

function ordenarYRenderizarPorNombreZA() {
  const productosEnPantalla = Array.from(
    contenedorProductos.querySelectorAll(".producto")
  );
  const productosOrdenados = productosEnPantalla.sort((a, b) => {
    const nombreA = a.querySelector(".producto-titulo").innerText.toLowerCase();
    const nombreB = b.querySelector(".producto-titulo").innerText.toLowerCase();
    return nombreB.localeCompare(nombreA);
  });
  productosOrdenados.forEach((producto) =>
    contenedorProductos.appendChild(producto)
  );
}

const botonOrdenarNombreAZ = document.querySelector("#ordenar-nombre-az");
const botonOrdenarNombreZA = document.querySelector("#ordenar-nombre-za");

botonOrdenarNombreAZ.addEventListener("click", ordenarYRenderizarPorNombreAZ);
botonOrdenarNombreZA.addEventListener("click", ordenarYRenderizarPorNombreZA);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-ver-mas")) {
    const productoId = event.target.dataset.id;
    const producto = productos.find((prod) => prod.id === productoId);
    if (producto) {
      fetch("assets/scripts/especificaciones.json")
        .then((response) => response.json())
        .then((data) => {
          const especificaciones = data.find(
            (item) => item.id.toLowerCase() === producto.titulo.toLowerCase()
          );
          if (especificaciones) {
            mostrarEspecificaciones(especificaciones, producto);
          } else {
            console.error(
              "No se encontraron especificaciones para el producto:",
              producto.titulo
            );
          }
        });
    }
  }
});

function mostrarEspecificaciones(especificaciones, producto) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <div class="producto-modal-container">
        <img class="producto-modal-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="producto-modal-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="producto-precio">$${producto.precio} USD</p>
            <button class="btn-96 producto-agregar" data-id="${producto.id}"><span>Agregar</span></button>
        </div>
      </div>
      <h4 class="especificacionesTitulo">Especificaciones</h4>
      <h3 class="especificacionesProducto">${producto.titulo}</h3>
      <ul>
        <li class="especificacionesAcabado">Acabado: ${especificaciones.acabado}</li>
        <li class="especificacionesCapacidad">Capacidad: ${especificaciones.capacidad}</li>
        <li class="especificacionesDimensiones">Dimensiones: ${especificaciones.dimensiones}</li>
        <li class="especificacionesPantalla">Pantalla: ${especificaciones.pantalla}</li>
        <li class="especificacionesChip">Chip: ${especificaciones.chip}</li>
        <li class="especificacionesCamara">Cámara: ${especificaciones.camara}</li>
      </ul>
    </div>
  `;
  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const botonAgregar = modal.querySelector(".producto-agregar");
  botonAgregar.addEventListener("click", (e) => {
    const idProducto = e.currentTarget.dataset.id;
    agregarAlCarrito(idProducto);
    modal.style.display = "none";
  });

  modal.style.display = "block";
}
