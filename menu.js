const productosBase = [
    {id:"agua", nombre:"Agua", precio:1000, imagen:"fotos/agua.png", stock:10, categoria:"consumible"},
    {id:"coca", nombre:"Coca", precio:800, imagen:"fotos/coca.png", stock:10, categoria:"consumible"},
    {id:"capuchino", nombre:"Capuchino", precio:1500, imagen:"fotos/capuchino.png", stock:10, categoria:"consumible"},
    {id:"cafe", nombre:"Cafe", precio:500, imagen:"fotos/cafe.png", stock:10, categoria:"consumible"},
    {id:"te", nombre:"Te", precio:500, imagen:"fotos/te.png", stock:10, categoria:"consumible"},
    {id:"chicle", nombre:"Chicle", precio:250, imagen:"fotos/chicle.png", stock:10, categoria:"consumible"},
    {id:"chockman", nombre:"Chockman", precio:500, imagen:"fotos/chockman.png", stock:10, categoria:"consumible"},
    {id:"queque", nombre:"Queque", precio:500, imagen:"fotos/queque.png", stock:10, categoria:"consumible"},
    {id:"chupete", nombre:"Chupete", precio:300, imagen:"fotos/chupete.png", stock:10, categoria:"consumible"},
    {id:"choquita", nombre:"Choquita", precio:400, imagen:"fotos/choquita.png", stock:10, categoria:"consumible"},
    {id:"brazo-reina", nombre:"Brazo de Reina", precio:300, imagen:"fotos/brazo_reina.png", stock:10, categoria:"consumible"},
    {id:"sandwich", nombre:"Sandwich", precio:1500, imagen:"fotos/sandwich.png", stock:10, categoria:"consumible"},
    {id:"roscas", nombre:"Roscas", precio:1000, imagen:"fotos/roscas.png", stock:10, categoria:"consumible"},
    {id:"super8", nombre:"Super 8", precio:500, imagen:"fotos/super8.png", stock:10, categoria:"consumible"},
    {id:"ave-mayo", nombre:"Ave Mayo", precio:1500, imagen:"fotos/ave_mayo.png", stock:10, categoria:"consumible"}
];

let productos = [];
let busqueda = "";

document.getElementById("busqueda").addEventListener("input", (e) => {
    busqueda = e.target.value.trim().toLowerCase();
    renderMenu();
});

window.addEventListener("storage", cargarProductos);
setInterval(cargarProductos, 2500);

cargarProductos();

function cargarProductos(){
    let guardados = JSON.parse(localStorage.getItem("productos"));
    productos = Array.isArray(guardados) && guardados.length > 0 ? guardados : productosBase;
    productos = productos.map(p => ({
        ...p,
        precio: Number(p.precio || 0),
        stock: Number(p.stock || 0),
        imagen: normalizarImagen(p.imagen),
        categoria: "Producto"
    }));
    renderMenu();
}

function renderMenu(){
    let cont = document.getElementById("menuProductos");
    let disponibles = productos.filter(p => p.stock > 0).length;
    let agotados = productos.filter(p => p.stock <= 0).length;

    let filtrados = productos
        .filter(p => p.nombre.toLowerCase().includes(busqueda))
        .sort((a,b) => {
            if(a.stock <= 0 && b.stock > 0) return 1;
            if(a.stock > 0 && b.stock <= 0) return -1;
            return a.nombre.localeCompare(b.nombre);
        });

    document.getElementById("resumenStock").innerText =
        `${disponibles} disponibles · ${agotados} agotados`;
    document.getElementById("contadorProductos").innerText =
        `${filtrados.length} productos encontrados`;

    if(filtrados.length === 0){
        cont.innerHTML = `
        <div class="empty-state">
            <div>
                <h3>No hay productos para mostrar</h3>
                <p>Prueba con otra busqueda o revisa el inventario.</p>
            </div>
        </div>`;
        return;
    }

    cont.innerHTML = filtrados.map(renderProducto).join("");
}

function renderProducto(p){
    let estado = obtenerEstadoStock(p.stock);

    return `
    <article class="menu-card ${estado.clase}">
        <div class="product-photo">
            <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='${crearPlaceholder()}'">
        </div>

        <div class="card-body">
            <div class="card-top">
                <h3 class="product-name">${p.nombre}</h3>
                <span class="price">$${p.precio}</span>
            </div>

            <div class="meta">
                <span class="category">${p.categoria}</span>
                <span class="stock">Stock: ${p.stock}</span>
            </div>

            <span class="status ${estado.clase}">${estado.texto}</span>
        </div>
    </article>`;
}

function normalizarImagen(imagen){
    if(!imagen) return crearPlaceholder();

    if(
        imagen.startsWith("data:") ||
        imagen.startsWith("http://") ||
        imagen.startsWith("https://") ||
        imagen.startsWith("blob:") ||
        imagen.startsWith("../")
    ){
        return imagen;
    }

    if(imagen.startsWith("fotos/")){
        return "../" + imagen;
    }

    return imagen;
}

function crearPlaceholder(){
    let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#ede9fe"/>
        <circle cx="200" cy="120" r="54" fill="#7c3aed" opacity="0.22"/>
        <rect x="118" y="190" width="164" height="24" rx="12" fill="#1f2a56" opacity="0.22"/>
        <text x="200" y="246" text-anchor="middle" font-family="Arial" font-size="24" fill="#1f2a56">Producto</text>
    </svg>`;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function obtenerEstadoStock(stock){
    if(stock <= 0){
        return {texto:"Agotado", clase:"agotado"};
    }

    if(stock <= 3){
        return {texto:"Poco stock", clase:"poco"};
    }

    return {texto:"Disponible", clase:"disponible"};
}
