const KEY = "oasis_hub_links_v2";

const DEFAULTS = {
  crm: "",
  fac: "",
  inv: "",
  auth: ""
};

function nowStamp(){
  return new Date().toLocaleString();
}

function loadLinks(){
  try {
    const raw = localStorage.getItem(KEY);
    return { ...DEFAULTS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveLinks(v){
  localStorage.setItem(KEY, JSON.stringify(v));
  localStorage.setItem(KEY + "_updated", nowStamp());
}

function normalizeUrl(u){
  const s = (u || "").trim();
  if (!s) return "";
  // fuerza slash final para repos en Pages
  return s.endsWith("/") ? s : (s + "/");
}

function dot(color){
  return `<span class="dot" style="background:${color}"></span>`;
}

function card({title, desc, url, fallbackHash}){
  const ok = !!url;
  const href = ok ? url : fallbackHash;
  const badge = ok
    ? `${dot("#22c55e")} Link listo`
    : `${dot("#9ca3af")} Configurar enlace`;

  const secondary = ok
    ? `<span class="badge">${dot("#fbbf24")} Abrir en nueva pestaña</span>`
    : `<span class="badge">${dot("#fb7185")} Sin URL</span>`;

  return `
    <a class="appCard" href="${href}" ${ok ? 'target="_blank" rel="noopener"' : ""}>
      <div class="appTitle">${title}</div>
      <div class="appDesc">${desc}</div>
      <div class="badgeRow">
        <span class="badge">${badge}</span>
        ${secondary}
      </div>
    </a>
  `;
}

function computeReadiness(links){
  const vals = [links.crm, links.fac, links.inv, links.auth].filter(Boolean);
  const pct = Math.round((vals.length / 4) * 100);
  return { count: vals.length, pct: `${pct}%` };
}

function render(){
  const links = loadLinks();
  const updated = localStorage.getItem(KEY + "_updated") || "—";

  // status panel
  document.getElementById("stSaved").textContent = (updated !== "—") ? "Sí" : "No";
  document.getElementById("stCrm").textContent = links.crm ? shortUrl(links.crm) : "—";
  document.getElementById("stFac").textContent = links.fac ? shortUrl(links.fac) : "—";
  document.getElementById("stInv").textContent = links.inv ? shortUrl(links.inv) : "—";
  document.getElementById("stAuth").textContent = links.auth ? shortUrl(links.auth) : "—";

  const { count, pct } = computeReadiness(links);
  document.getElementById("kpiApps").textContent = String(count);
  document.getElementById("kpiReady").textContent = pct;
  document.getElementById("kpiUpdated").textContent = updated;
  document.getElementById("footBuild").textContent = "build: " + updated;

  // apps grid
  const grid = document.getElementById("appsGrid");
  grid.innerHTML = [
    card({
      title: "CRM",
      desc: "Clientes, historial, seguimiento. (Repo separado)",
      url: links.crm,
      fallbackHash: "#config"
    }),
    card({
      title: "Cotización / Factura",
      desc: "PDF, IVU, estados, logo y datos del negocio. (Repo separado)",
      url: links.fac,
      fallbackHash: "#config"
    }),
    card({
      title: "Inventario",
      desc: "Stock y movimientos. (Fase 2)",
      url: links.inv,
      fallbackHash: "#config"
    }),
    card({
      title: "Auth (opcional)",
      desc: "Login central cuando lo activemos.",
      url: links.auth,
      fallbackHash: "#config"
    })
  ].join("");

  // form
  document.getElementById("urlCrm").value = links.crm;
  document.getElementById("urlFac").value = links.fac;
  document.getElementById("urlInv").value = links.inv;
  document.getElementById("urlAuth").value = links.auth;
}

function shortUrl(u){
  try {
    const url = new URL(u);
    return (url.origin + url.pathname).replace(/\/+$/,"/").slice(0, 44) + (u.length > 44 ? "…" : "");
  } catch {
    return u;
  }
}

function bind(){
  const msg = document.getElementById("msg");

  document.getElementById("btnConfig").addEventListener("click", () => {
    location.hash = "#config";
  });

  document.getElementById("btnQuickFill").addEventListener("click", () => {
    // intenta autollenar con el username detectado por el dominio actual (si aplica)
    // Nota: esto NO adivina el usuario real si el hub está en otro dominio.
    const guessUser = location.hostname.includes("github.io")
      ? location.hostname.split(".github.io")[0]
      : "";

    if (!guessUser) {
      msg.textContent = "No pude detectar tu usuario desde el dominio. Pega las URLs manualmente.";
      return;
    }

    const crm = `https://${guessUser}.github.io/oasis-crm/`;
    const fac = `https://${guessUser}.github.io/oasis-facturacion/`;
    const inv = `https://${guessUser}.github.io/oasis-inventario/`;
    const auth = `https://${guessUser}.github.io/oasis-auth/`;

    document.getElementById("urlCrm").value = crm;
    document.getElementById("urlFac").value = fac;
    document.getElementById("urlInv").value = inv;
    document.getElementById("urlAuth").value = auth;

    msg.textContent = "Auto-llenado con tu usuario. Ahora dale Guardar.";
  });

  document.getElementById("btnSave").addEventListener("click", () => {
    const v = {
      crm: normalizeUrl(document.getElementById("urlCrm").value),
      fac: normalizeUrl(document.getElementById("urlFac").value),
      inv: normalizeUrl(document.getElementById("urlInv").value),
      auth: normalizeUrl(document.getElementById("urlAuth").value),
    };
    saveLinks(v);
    msg.textContent = "Guardado. Tu hub ya apunta a tus repos.";
    render();
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY + "_updated");
    msg.textContent = "Reset listo. Vuelve a configurar enlaces.";
    render();
  });

  document.getElementById("btnTestLinks").addEventListener("click", () => {
    const links = loadLinks();
    const list = [
      ["CRM", links.crm],
      ["Facturación", links.fac],
      ["Inventario", links.inv],
      ["Auth", links.auth],
    ].filter(x => x[1]);

    if (!list.length) {
      msg.textContent = "No hay enlaces configurados todavía.";
      location.hash = "#config";
      return;
    }

    // abre el primero; los demás solo los “valida” visualmente
    window.open(list[0][1], "_blank", "noopener");
    msg.textContent = `Abriendo: ${list[0][0]}. Los demás quedan listos cuando los publiques.`;
  });
}

render();
bind();
