const correoRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const nombreRegex =
  /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;

const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;


const movilRegex =
  /^[0-9]{7,12}$/;

function cargarUsuarios() {
  try {
    return JSON.parse(localStorage.getItem("demo_users") || "{}");
  } catch (e) {
    return {};
  }
}

function guardarUsuarios(obj) {
  localStorage.setItem("demo_users", JSON.stringify(obj));
}

const formRegistro = document.getElementById("formRegistro");
const regNombre = document.getElementById("reg-nombre");
const regCorreo = document.getElementById("reg-correo");
const regMovil = document.getElementById("reg-movil");
const regPass = document.getElementById("reg-pass");
const regMsg = document.getElementById("reg-msg");
const regToggle = document.getElementById("reg-togglePass");


const formIngreso = document.getElementById("formIngreso");
const ingCorreo = document.getElementById("ing-correo");
const ingPass = document.getElementById("ing-pass");
const ingMsg = document.getElementById("ing-msg");
const ingToggle = document.getElementById("ing-togglePass");
const mostrarRecuperar = document.getElementById("mostrarRecuperar");

const tarjetaRecuperar = document.getElementById("tarjetaRecuperar");
const formRecuperar = document.getElementById("formRecuperar");
const recCorreo = document.getElementById("rec-correo");
const recPass = document.getElementById("rec-pass");
const recMsg = document.getElementById("rec-msg");
const recToggle = document.getElementById("rec-togglePass");
const ocultarRecuperar = document.getElementById("ocultarRecuperar");


const bienvenida = document.getElementById("bienvenida");
const textoBienvenida = document.getElementById("textoBienvenida");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");


function activarToggle(btn, input) {
  btn.addEventListener("click", () => {
    const mostrar = input.type === "password";
    input.type = mostrar ? "text" : "password";
    btn.textContent = mostrar ? "Ocultar" : "Mostrar";
  });
}

activarToggle(regToggle, regPass);
activarToggle(ingToggle, ingPass);
activarToggle(recToggle, recPass);


formRegistro.addEventListener("submit", (e) => {
  e.preventDefault();
  regMsg.textContent = "";

  const nombre = regNombre.value.trim();
  const correo = (regCorreo.value || "").trim().toLowerCase();
  const movil = (regMovil.value || "").trim();
  const pass = regPass.value || "";

  if (!nombreRegex.test(nombre)) {
    regMsg.style.color = "crimson";
    regMsg.textContent = "Nombre inválido.";
    alert("❌ Nombre inválido.");
    return;
  }

  if (!correoRegex.test(correo)) {
    regMsg.style.color = "crimson";
    regMsg.textContent = "Correo inválido.";
    alert("❌ Correo inválido.");
    return;
  }

  if (!movilRegex.test(movil)) {
    regMsg.style.color = "crimson";
    regMsg.textContent = "Número de móvil inválido.";
    alert("❌ Número de móvil inválido.");
    return;
  }

  if (!passRegex.test(pass)) {
    regMsg.style.color = "crimson";
    regMsg.textContent = "Contraseña insegura.";
    alert("❌ Contraseña insegura.");
    return;
  }

  const usuarios = cargarUsuarios();

  if (usuarios[correo]) {
    regMsg.style.color = "crimson";
    regMsg.textContent = "El correo ya está registrado.";
    alert("❌ Correo ya registrado.");
    return;
  }

  usuarios[correo] = {
    nombre,
    movil,
    pass: btoa(pass),
    intentosFallidos: 0,
    bloqueado: false,
  };

  guardarUsuarios(usuarios);

  regMsg.style.color = "green";
  regMsg.textContent = "Registro exitoso.";
  alert("✅ Registro exitoso");
  formRegistro.reset();
});

formIngreso.addEventListener("submit", (e) => {
  e.preventDefault();
  ingMsg.textContent = "";

  const correo = (ingCorreo.value || "").trim().toLowerCase();
  const pass = ingPass.value || "";

  const usuarios = cargarUsuarios();
  const usuario = usuarios[correo];

  if (!usuario) {
    ingMsg.style.color = "crimson";
    ingMsg.textContent = "Usuario o contraseña incorrectos.";
    alert("❌ Datos incorrectos");
    return;
  }

  if (usuario.bloqueado) {
    ingMsg.style.color = "crimson";
    ingMsg.textContent = "Cuenta bloqueada.";
    alert("⛔ Cuenta bloqueada.");
    tarjetaRecuperar.hidden = false;
    recCorreo.value = correo;
    return;
  }

  if (usuario.pass === btoa(pass)) {
    usuario.intentosFallidos = 0;
    guardarUsuarios(usuarios);

    textoBienvenida.textContent = `Bienvenido, ${usuario.nombre}`;
    bienvenida.hidden = false;
    formIngreso.hidden = true;

    alert(`👋 Bienvenido ${usuario.nombre}`);
    return;
  }

  usuario.intentosFallidos = (usuario.intentosFallidos || 0) + 1;
  const restantes = 3 - usuario.intentosFallidos;

  if (usuario.intentosFallidos >= 3) {
    usuario.bloqueado = true;
    guardarUsuarios(usuarios);
    ingMsg.style.color = "crimson";
    ingMsg.textContent = "Cuenta bloqueada.";
    alert("⛔ Cuenta bloqueada.");
    tarjetaRecuperar.hidden = false;
    recCorreo.value = correo;
    return;
  }

  guardarUsuarios(usuarios);
  ingMsg.style.color = "crimson";
  ingMsg.textContent = `Incorrecto. Intentos restantes: ${restantes}`;
  alert("❌ Incorrecto");
});


mostrarRecuperar.addEventListener("click", () => {
  tarjetaRecuperar.hidden = false;
});

ocultarRecuperar.addEventListener("click", () => {
  tarjetaRecuperar.hidden = true;
  formRecuperar.reset();
  recMsg.textContent = "";
});


formRecuperar.addEventListener("submit", (e) => {
  e.preventDefault();
  recMsg.textContent = "";

  const correo = (recCorreo.value || "").trim().toLowerCase();
  const nuevaPass = recPass.value || "";

  const usuarios = cargarUsuarios();
  const usuario = usuarios[correo];

  if (!usuario) {
    recMsg.style.color = "crimson";
    recMsg.textContent = "Correo no registrado.";
    alert("❌ Correo no registrado.");
    return;
  }

  if (!passRegex.test(nuevaPass)) {
    recMsg.style.color = "crimson";
    recMsg.textContent = "Contraseña inválida.";
    alert("❌ Contraseña inválida.");
    return;
  }

  usuario.pass = btoa(nuevaPass);
  usuario.intentosFallidos = 0;
  usuario.bloqueado = false;

  guardarUsuarios(usuarios);

  recMsg.style.color = "green";
  recMsg.textContent = "Contraseña actualizada.";
  alert("🔑 Contraseña actualizada.");

  setTimeout(() => {
    tarjetaRecuperar.hidden = true;
    formRecuperar.reset();
  }, 900);
});

btnCerrarSesion.addEventListener("click", () => {
  bienvenida.hidden = true;
  formIngreso.hidden = false;
  formIngreso.reset();

  ingMsg.style.color = "#333";
  ingMsg.textContent = "Sesión cerrada.";

  alert("👋 Sesión cerrada");
});
