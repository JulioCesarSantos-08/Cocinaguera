// Inicializar Firebase
function iniciarFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyA0OWKnhz0jmGiiiGwotDpkEhEj_tCUvjs",
    authDomain: "pedidospuestocomida.firebaseapp.com",
    projectId: "pedidospuestocomida",
    storageBucket: "pedidospuestocomida.firebasestorage.app",
    messagingSenderId: "251357525868",
    appId: "1:251357525868:web:9cf755590e16fdff686549"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

// Guardar el pedido en Firebase
async function guardarPedido(mesa, pedido, total) {
  const db = firebase.firestore();
  const snapshot = await db.collection("pedidos").get();
  const numeroPedido = snapshot.size + 1; // contar pedidos y sumar 1

  await db.collection("pedidos").add({
    numeroPedido: numeroPedido,
    mesa: mesa,
    pedido: pedido,
    total: total,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para marcar pedido como terminado
async function marcarComoListo(id) {
  const db = firebase.firestore();
  const pedidoDoc = await db.collection("pedidos").doc(id).get();

  if (pedidoDoc.exists) {
    const data = pedidoDoc.data();
    await db.collection("pedidos_terminados").add({
      numeroPedido: data.numeroPedido,
      mesa: data.mesa,
      pedido: data.pedido,
      total: data.total,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    await db.collection("pedidos").doc(id).delete();
    alert('✅ Pedido marcado como terminado');
  } else {
    alert('❌ Pedido no encontrado.');
  }
}

// Eliminar todas las ventas
async function eliminarTodasLasVentas() {
  if (!confirm('¿Estás seguro que deseas eliminar TODAS las ventas? Esta acción no se puede deshacer. ❗')) {
    return;
  }

  const db = firebase.firestore();
  const snapshot = await db.collection('pedidos_terminados').get();
  const batch = db.batch();

  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  alert('🗑️ Todas las ventas fueron eliminadas.');
}

// Login
function login(event) {
  event.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const contrasena = document.getElementById('contrasena').value;

  if (usuario === 'Cocinagüera2025' && contrasena === 'Enchiladas15') {
    localStorage.setItem('logueado', 'true');
    window.location.href = 'menu.html';
  } else {
    alert('❌ Usuario o contraseña incorrectos.');
  }
}

// Logout
function logout() {
  localStorage.removeItem('logueado');
  window.location.href = 'login.html';
}

// Verificar login
function verificarLogin() {
  if (localStorage.getItem('logueado') !== 'true') {
    window.location.href = 'login.html';
  }
}

// Función para calcular y preparar el pedido
async function procesarPedido(pedidoForm) {
  const empleado = document.getElementById('empleado').value.trim();
  const cliente = document.getElementById('cliente').value.trim();

  if (!empleado || !cliente) {
    alert('Por favor completa los campos de empleado y cliente.');
    return;
  }

  let pedidoTexto = `👩‍🍳 Empleado: ${empleado}\n👤 Cliente: ${cliente}\n`;
  let total = 0;

  // Enchiladas Verdes
  const cantidadEnchiladasVerdes = parseInt(document.getElementById('cantidadEnchiladasVerdes').value) || 0;
  const tipoEnchiladasVerdes = document.getElementById('tipoEnchiladasVerdes').value;
  if (cantidadEnchiladasVerdes > 0) {
    let subtotal = cantidadEnchiladasVerdes * 15;
    pedidoTexto += `- ${cantidadEnchiladasVerdes} Enchiladas Verdes ${tipoEnchiladasVerdes}\n`;
    if (tipoEnchiladasVerdes.includes('Huevo')) subtotal += 10;
    if (tipoEnchiladasVerdes.includes('Tasajo')) subtotal += 20;
    total += subtotal;
  }

  // Enchiladas Rojas
  const cantidadEnchiladasRojas = parseInt(document.getElementById('cantidadEnchiladasRojas').value) || 0;
  const tipoEnchiladasRojas = document.getElementById('tipoEnchiladasRojas').value;
  if (cantidadEnchiladasRojas > 0) {
    let subtotal = cantidadEnchiladasRojas * 15;
    pedidoTexto += `- ${cantidadEnchiladasRojas} Enchiladas Rojas ${tipoEnchiladasRojas}\n`;
    if (tipoEnchiladasRojas.includes('Huevo')) subtotal += 10;
    if (tipoEnchiladasRojas.includes('Tasajo')) subtotal += 20;
    total += subtotal;
  }

  // Tacos Dorados
const cantidadTacos = parseInt(document.getElementById('cantidadTacos').value) || 0;
const acompanamientoTacos = document.getElementById('acompanamientoTacos').value;
if (cantidadTacos > 0) {
  let subtotal = cantidadTacos * 15;
  pedidoTexto += `- ${cantidadTacos} Tacos Dorados ${acompanamientoTacos}\n`;
  if (acompanamientoTacos.includes('Sopa') || acompanamientoTacos.includes('Consomé')) {
    subtotal += 20;
  }
  total += subtotal;
}


  // Gorditas
  const cantidadGorditas = parseInt(document.getElementById('cantidadGorditas').value) || 0;
  const rellenoGorditas = document.getElementById('rellenoGorditas').value.trim();
  if (cantidadGorditas > 0) {
    pedidoTexto += `- ${cantidadGorditas} Gorditas (${rellenoGorditas})\n`;
    total += cantidadGorditas * 20;
  }

  // Entomatadas
  const cantidadEntomatadas = parseInt(document.getElementById('cantidadEntomatadas').value) || 0;
  const tipoEntomatadas = document.getElementById('tipoEntomatadas').value;
  if (cantidadEntomatadas > 0) {
    let subtotal = cantidadEntomatadas * 15;
    pedidoTexto += `- ${cantidadEntomatadas} Entomatadas ${tipoEntomatadas}\n`;
    if (tipoEntomatadas.includes('Huevo')) subtotal += 10;
    if (tipoEntomatadas.includes('Tasajo')) subtotal += 20;
    total += subtotal;
  }

  // Enfrijoladas
  const cantidadEnfrijoladas = parseInt(document.getElementById('cantidadEnfrijoladas').value) || 0;
  const tipoEnfrijoladas = document.getElementById('tipoEnfrijoladas').value;
  if (cantidadEnfrijoladas > 0) {
    let subtotal = cantidadEnfrijoladas * 15;
    pedidoTexto += `- ${cantidadEnfrijoladas} Enfrijoladas ${tipoEnfrijoladas}\n`;
    if (tipoEnfrijoladas.includes('Huevo')) subtotal += 10;
    if (tipoEnfrijoladas.includes('Tasajo')) subtotal += 20;
    total += subtotal;
  }

  // Aguas
  const cantidadAguaLitro = parseInt(document.getElementById('cantidadAguaLitro').value) || 0;
  const cantidadAguaMedio = parseInt(document.getElementById('cantidadAguaMedio').value) || 0;
  if (cantidadAguaLitro > 0) {
    pedidoTexto += `- ${cantidadAguaLitro} Agua(s) de 1L\n`;
    total += cantidadAguaLitro * 30;
  }
  if (cantidadAguaMedio > 0) {
    pedidoTexto += `- ${cantidadAguaMedio} Agua(s) de 1/2L\n`;
    total += cantidadAguaMedio * 20;
  }

  // Guisado
  const nombreGuisado = document.getElementById('nombreGuisado').value.trim();
  const precioGuisado = parseInt(document.getElementById('precioGuisado').value) || 0;
  const cantidadGuisado = parseInt(document.getElementById('cantidadGuisado').value) || 0;
  
  if (nombreGuisado && precioGuisado > 0 && cantidadGuisado > 0) {
    const subtotalGuisado = precioGuisado * cantidadGuisado;
    pedidoTexto += `- ${cantidadGuisado} Guisado(s) de ${nombreGuisado} ($${precioGuisado} c/u)\n`;
    total += subtotalGuisado;
  }  

  // Extras
  const pedidoExtra = document.getElementById('pedidoExtra').value.trim();
  if (pedidoExtra) {
    pedidoTexto += `📝 Notas: ${pedidoExtra}\n`;
  }

  pedidoTexto += `💵 Total Aproximado: $${total}`;

  await guardarPedido(cliente, pedidoTexto, total);
  pedidoForm.reset();
  alert('✅ Pedido enviado');
}