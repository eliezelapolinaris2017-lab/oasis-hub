const KEY = "oasis_hub_links_v1";

const defaults = {
  crm: "",
  facturacion: "",
  inventario: "",
  auth: ""
};

function loadLinks(){
  try { return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
  catch { return { ...defaults }; }
}

function saveLinks(v){
  localStorage.setItem(KEY, JSON.stringify(v));
}

function card(title, desc, url){
  const ok = !!url;
  const href = ok ? url : "#config";
  const dotColor = ok ? "background:#22c55e" : "background:#9ca3af";
  return `
    <a class="card appCard" href="${href}" target="${ok ? "_blank" : "_self"}" rel="noopener">
      <div class="appT">${title}</div>
      <div class="appD">${desc}</div>
      <div class="badge"><span class="dot" style="${dotColor}"></span>${ok ? "Link listo" : "Configurar enlace"}</div>
    </a>
  `;
}

function render(){
  const links = loadLinks();

  document.getElementById("appsGrid").innerHTML = [
    card("CRM", "Clientes, historial, seguimiento.", links.crm),
    card("Cotización / Factura", "PDF, IVU, estados, logo/negocio.", links.facturacion),
    card("Inventario", "Stock y movimientos (fase 2).", links.inventario),
    card("Auth (opcional)", "Login central cuando lo activemos.", links.auth),
  ].join("");

  const count = [links.crm, links.facturacion, links.inventario, links.auth].filter(Boolean).length;
  document.getElementById("appsCount").textContent = String(count);
  document.getElementById("lastUpdate").textContent = new Date().toLocaleString();
  document.getElementById("authState").textContent = "Pendiente";
}

function bind(){
  const links = loadLinks();

  const urlCrm = document.getElementById("urlCrm");
  const urlFact = document.getElementById("urlFact");
  const urlInv = document.getElementById("urlInv");
  const urlAuth = document.getElementById("urlAuth");
  const msg = document.getElementById("msg");

  urlCrm.value = links.crm;
  urlFact.value = links.facturacion;
  urlInv.value = links.inventario;
  urlAuth.value = links.auth;

  document.getElementById("saveBtn").addEventListener("click", () => {
    const v = {
      crm: urlCrm.value.trim(),
      facturacion: urlFact.value.trim(),
      inventario: urlInv.value.trim(),
      auth: urlAuth.value.trim()
    };
    saveLinks(v);
    msg.textContent = "Guardado. Ya el hub apunta a tus apps.";
    render();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem(KEY);
    msg.textContent = "Reset hecho. Vuelve a configurar enlaces.";
    render();
  });
}

render();
bind();
