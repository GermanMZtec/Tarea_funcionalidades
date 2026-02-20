const AUTH_KEY = "usuarios";

/** Devuelve el array de usuarios guardados */
function getUsuarios() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "[]");
}

/** Guarda el array de usuarios */
function saveUsuarios(usuarios) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(usuarios));
}

/** Registra un usuario nuevo. Retorna {ok, mensaje} */
function registrarUsuario({ nombre, email, usuario, contrasena }) {
  const usuarios = getUsuarios();

  const existeUsuario = usuarios.find(u => u.usuario === usuario);
  if (existeUsuario) {
    return { ok: false, mensaje: "El nombre de usuario ya está en uso." };
  }

  const existeEmail = usuarios.find(u => u.email === email);
  if (existeEmail) {
    return { ok: false, mensaje: "El email ya está registrado." };
  }

  const nuevo = { nombre, email, usuario, contrasena, creadoEn: new Date().toISOString() };
  usuarios.push(nuevo);
  saveUsuarios(usuarios);

  console.log(" Usuario registrado:", nuevo);
  console.log(" Usuarios en sistema:", usuarios);

  return { ok: true, mensaje: "Registro exitoso." };
}

/** Valida credenciales. Retorna {ok, usuario?, mensaje} */
function loginUsuario({ usuario, contrasena }) {
  const usuarios = getUsuarios();
  const encontrado = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

  if (!encontrado) {
    return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
  }

  // Guardar sesión activa
  sessionStorage.setItem("sesionActiva", JSON.stringify({ usuario: encontrado.usuario, nombre: encontrado.nombre }));

  return { ok: true, usuario: encontrado, mensaje: "Bienvenido, " + encontrado.nombre };
}

/** Cierra la sesión */
function logout() {
  sessionStorage.removeItem("sesionActiva");
  window.location.href = "index.html";
}

/** Retorna el usuario en sesión o null */
function getSesion() {
  return JSON.parse(sessionStorage.getItem("sesionActiva") || "null");
}

/** Redirige al login si no hay sesión activa */
function requireAuth() {
  if (!getSesion()) {
    window.location.href = "index.html";
  }
}
