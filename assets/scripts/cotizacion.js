const moneda = document.getElementById('moneda');
let fechaActualizacion = document.getElementById('fechaActualizacion');
let compra = document.getElementById('compra');
let venta = document.getElementById('venta');
 
async function DolarBlue() {
    const url = "https://dolarapi.com/v1/dolares/blue";
    const dolarApi = await fetch(url);
    const data = await dolarApi.json();

    let fechaActualizadaFinal = data.fechaActualizacion.slice(0, 10);
    fechaActualizacion.innerHTML = "Fecha: " + fechaActualizadaFinal;

    moneda.innerHTML = "Cotizacion " + data.moneda;
    compra.innerHTML = "Compra: ARG $" + data.compra;
    venta.innerHTML = "Venta: ARG $" + data.venta;
}

try {
    DolarBlue();  
} catch {
    console.log(err);
} finally {
    console.log('Promesa finalizada (cotizacion USD)');
}
