// === LINKS FIJOS (SIN SETTINGS EN PANTALLA) ===
// Cambia cuando publiques cada repo.
const LINKS = {
  crm: "#",              // "https://servicios.oasisservicespr.com/"
  facturacion: "#",      // "https://TUUSUARIO.github.io/oasis-facturacion/"
  inventario: "#",       // "https://TUUSUARIO.github.io/oasis-inventario/"
  auth: "#"              // "https://TUUSUARIO.github.io/oasis-auth/"
};

// Si quieres que el botón “Abrir Facturación” vaya a tu web actual:
const DEFAULT_OPEN = LINKS.facturacion !== "#" ? LINKS.facturacion : "https://servicios.oasisservicespr.com/";

function stamp(){
  return new Date().toLocaleString();
}

function dot(color){
  return `<span class="dot" style="background:${color}"></span>`;
}

function badgeOnline(){
  return `<span class="badge">${dot("#22c55e")} Online</span>`;
}
function badgeSoon(){
  return `<span class="badge">${dot("#fbbf24")} Próximo</span>`;
}

function appCard({name, desc, url, tags=[]}){
  const online = url && url !== "#";
  const href = online ? url : "#";
  const target = online ? `target="_blank" rel="noopener"` : "";
  const status = online ? badgeOnline() : badgeSoon();

  const tagBadges = tags.map(t => `<span class="badge">${t}</span>`).join("");

  return `
    <a class="appCard" href="${href}" ${target}>
      <div class="appTop">
        <div>
          <div class="appTitle">${name}</div>
          <div class="appDesc">${desc}</div>
        </div>
      </div>
      <div class="badges">
        ${status}
        ${tagBadges}
      </div>
      ${online ? `<div class="small" style="margin-top:10px;opacity:.65">Abrir en nueva pestaña</div>` : ""}
    </a>
  `;
}

function render(){
  const grid = document.getElementById("appsGrid");
  const list = [
    {
      name:"CRM",
      desc:"Clientes, historial, seguimiento y notas. Todo en orden.",
      url: LINKS.crm,
      tags:[`${dot("rgba(255,255,255,.55)")} Clientes`, `${dot("rgba(255,255,255,.55)")} Historial`]
    },
    {
      name:"Cotización / Factura",
      desc:"En el mismo módulo: cotización, factura y PDF con logo y datos del negocio.",
      url: LINKS.facturacion,
      tags:[`${dot("rgba(255,255,255,.55)")} PDF`, `${dot("rgba(255,255,255,.55)")} IVU`, `${dot("rgba(255,255,255,.55)")} Logo`]
    },
    {
      name:"Inventario",
      desc:"Entradas/salidas, stock mínimo y alertas. Fase 2.",
      url: LINKS.inventario,
      tags:[`${dot("rgba(255,255,255,.55)")} Movimientos`, `${dot("rgba(255,255,255,.55)")} Stock`]
    },
    {
      name:"Auth (opcional)",
      desc:"Login central cuando lo activemos para empleados.",
      url: LINKS.auth,
      tags:[`${dot("rgba(255,255,255,.55)")} Acceso`, `${dot("rgba(255,255,255,.55)")} Roles`]
    }
  ];

  grid.innerHTML = list.map(appCard).join("");

  const onlineCount = Object.values(LINKS).filter(u => u && u !== "#").length;
  document.getElementById("statOnline").textContent = String(onlineCount);
  document.getElementById("lastBuild").textContent = stamp();
  document.getElementById("footInfo").textContent = "build: " + stamp();

  // botón abrir default
  document.getElementById("btnOpenDefault").setAttribute("href", DEFAULT_OPEN);
  document.getElementById("btnContact").setAttribute("href", "https://oasisservicespr.com");
}

render();
