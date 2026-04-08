const API_BASE = "http://127.0.0.1:8000";

const authState = {
  loggedIn: false,
  email: null,
};

const selectors = {
  navLinks: document.querySelectorAll("[data-tab]"),
  sections: document.querySelectorAll("main section"),
  userBadge: document.getElementById("usuario-nombre"),
  logoutButton: document.getElementById("logout-button"),
  listaServicios: document.getElementById("lista-servicios"),
  selectServicio: document.getElementById("mascota-servicio"),
  resultadoMascotas: document.getElementById("resultado-busqueda-mascotas"),
  reporteResultados: document.getElementById("reporte-resultados"),
  reporteEmail: document.getElementById("reporte-email"),
  buscarMascotaEmail: document.getElementById("buscar-mascota"),
};

const protectedTabs = ["servicios", "mascotas", "reporte"];

function showAlert(message, type = "success", duration = 3000) {
  const flex = document.createElement("div");
  flex.style.position = "fixed";
  flex.style.top = "16px";
  flex.style.right = "16px";
  flex.style.zIndex = "999";

  const alerta = document.createElement("div");
  alerta.className = `alert alert-${type}`;
  alerta.textContent = message;

  flex.appendChild(alerta);
  document.body.appendChild(flex);

  setTimeout(() => {
    flex.remove();
  }, duration);
}

function setProtectedTabs(lock) {
  selectors.navLinks.forEach((link) => {
    const target = link.dataset.tab;
    if (protectedTabs.includes(target)) {
      if (lock) {
        link.classList.add("locked");
        link.setAttribute("aria-disabled", "true");
        link.removeAttribute("href");
      } else {
        link.classList.remove("locked");
        link.removeAttribute("aria-disabled");
        link.href = `#${target}`;
      }
    }
  });
}

function switchTab(name) {
  const lower = name.toLowerCase();

  if (protectedTabs.includes(lower) && !authState.loggedIn) {
    showAlert("Debes iniciar sesión para acceder a esta sección", "error");
    return;
  }

  selectors.sections.forEach((section) => {
    section.classList.remove("active");
    if (section.id === lower) section.classList.add("active");
  });

  selectors.navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.tab === lower);
  });

  if (lower === "servicios") fetchServicios();
  if (lower === "mascotas") {
    if (authState.loggedIn) prefillMascotaCorreo();
  }
  if (lower === "reporte") {
    if (authState.loggedIn) {
      selectors.reporteEmail.value = authState.email;
      fetchReporte(authState.email);
    }
  }
}

function prefillMascotaCorreo() {
  const input = document.getElementById("mascota-email");
  if (input) input.value = authState.email;
}

async function fetchServicios() {
  try {
    const response = await fetch(`${API_BASE}/servicios`);
    if (!response.ok) throw new Error("Error al obtener servicios");
    const data = await response.json();
    renderServicios(data.servicios || []);
    renderSelectServicios(data.servicios || []);
  } catch (error) {
    showAlert(error.message, "error");
  }
}

function renderServicios(servicios) {
  selectors.listaServicios.innerHTML = "";
  if (!servicios.length) {
    selectors.listaServicios.textContent = "No hay servicios registrados.";
    return;
  }

  servicios.forEach(({ nombre, precio }) => {
    const li = document.createElement("li");
    li.textContent = `${nombre} - $${precio}`;
    selectors.listaServicios.appendChild(li);
  });
}

function renderSelectServicios(servicios) {
  selectors.selectServicio.innerHTML = "<option value=''>Seleccionar servicio</option>";
  servicios.forEach(({ nombre }) => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    selectors.selectServicio.appendChild(option);
  });
}

async function fetchMascotas(correo) {
  try {
    const response = await fetch(`${API_BASE}/mascotas/${encodeURIComponent(correo)}`);
    if (!response.ok) throw new Error("Error al obtener mascotas");
    const data = await response.json();
    renderMascotas(data.mascotas || []);
  } catch (error) {
    showAlert(error.message, "error");
  }
}

function renderMascotas(mascotas) {
  selectors.resultadoMascotas.innerHTML = "";
  if (!mascotas.length) {
    selectors.resultadoMascotas.textContent = "No se encontraron mascotas.";
    return;
  }

  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gap = "12px";

  mascotas.forEach((mascota) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${mascota.nombre}</strong><br>
      <small>Dueño: ${mascota.correo || correo || "<desconocido>"}</small><br>
      <small>Servicio: ${mascota.tipo_servicio || "-"}</small><br>
      <small>Fecha: ${mascota.fecha || "-"}</small>
    `;
    container.appendChild(card);
  });

  selectors.resultadoMascotas.appendChild(container);
}

async function fetchReporte(correo) {
  if (!correo) return;
  try {
    const response = await fetch(`${API_BASE}/reporte/${encodeURIComponent(correo)}`);
    if (!response.ok) throw new Error("Error al obtener reporte");
    const data = await response.json();
    renderReporte(data);
  } catch (error) {
    showAlert(error.message, "error");
  }
}

function renderReporte(data) {
  selectors.reporteResultados.innerHTML = "";

  const boxGrid = document.createElement("div");
  boxGrid.style.display = "grid";
  boxGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
  boxGrid.style.gap = "1rem";

  const cards = [
    { title: "Cantidad servicios", value: data.cantidad_servicios ?? "0" },
    { title: "Total gastado", value: `$${data.total_gastado ?? "0"}` },
    { title: "Correo", value: data.correo ?? "-" },
  ];

  cards.forEach((item) => {
    const stat = document.createElement("div");
    stat.className = "card";
    stat.innerHTML = `<strong>${item.title}</strong><p>${item.value}</p>`;
    boxGrid.appendChild(stat);
  });

  selectors.reporteResultados.appendChild(boxGrid);
}
