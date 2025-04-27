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

// Función para guardar un pedido
async function guardarPedido(mesa, pedido) {
  const db = firebase.firestore();
  await db.collection("pedidos").add({
    mesa: mesa,
    pedido: pedido,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para marcar un pedido como listo y moverlo a pedidos terminados
async function marcarComoListo(id) {
  const db = firebase.firestore();
  const pedidoDoc = await db.collection("pedidos").doc(id).get();

  if (pedidoDoc.exists) {
    const data = pedidoDoc.data();
    const precio = prompt("💵 Ingresa el precio del pedido:", "0");

    if (precio !== null && !isNaN(precio) && precio !== "") {
      await db.collection("pedidos_terminados").add({
        mesa: data.mesa,
        pedido: data.pedido,
        precio: parseFloat(precio),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Ahora sí borrar de pedidos activos
      await db.collection("pedidos").doc(id).delete();
      alert('✅ Pedido marcado como terminado');
    } else {
      alert('❌ Precio inválido. No se completó la operación.');
    }
  } else {
    alert('❌ Pedido no encontrado.');
  }
}

// Función para eliminar todas las ventas terminadas
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

// Función de login
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

// Función de logout (cerrar sesión)
function logout() {
  localStorage.removeItem('logueado');
  window.location.href = 'login.html';
}

// Verificar que esté logueado al entrar a páginas protegidas
function verificarLogin() {
  if (localStorage.getItem('logueado') !== 'true') {
    window.location.href = 'login.html';
  }
}