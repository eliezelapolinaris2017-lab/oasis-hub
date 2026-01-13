// ===== Oasis Hub Config Modal FIX (iOS-proof) =====
const HUB_CFG_KEY = "oasis_hub_cfg_v1";

const el = (id)=>document.getElementById(id);

function cfgDefault(){
  return {
    pin: "1234",
    hubUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-hub/",
    crmUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-crm/",
    facturaUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-facturacion/",
    inventarioUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-inventario/",
    diagnosticoUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-diagnosticos/",
    contabilidadUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-contabilidad/",
    gastosUrl: "https://eliezelapolinaris2017-lab.github.io/oasis-gastos-ingresos/"
  };
}

function cfgLoad(){
  try{
    const raw = localStorage.getItem(HUB_CFG_KEY);
    return raw ? { ...cfgDefault(), ...JSON.parse(raw) } : cfgDefault();
  }catch{
    return cfgDefault();
  }
}

function cfgSave(data){
  localStorage.setItem(HUB_CFG_KEY, JSON.stringify(data));
}

function openCfg(){
  const modal = el("cfgModal");
  if(!modal) return;

  // llenar inputs
  const cfg = cfgLoad();
  el("cfgPin").value = cfg.pin || "";
  el("cfgHubUrl").value = cfg.hubUrl || "";
  el("cfgCrmUrl").value = cfg.crmUrl || "";
  el("cfgFacturaUrl").value = cfg.facturaUrl || "";
  el("cfgInventarioUrl").value = cfg.inventarioUrl || "";
  el("cfgDiagnosticoUrl").value = cfg.diagnosticoUrl || "";
  el("cfgContabilidadUrl").value = cfg.contabilidadUrl || "";
  el("cfgGastosUrl").value = cfg.gastosUrl || "";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");

  // evita scroll detrás (iOS)
  document.body.style.overflow = "hidden";
  setTimeout(()=> el("cfgPin")?.focus(), 50);
}

function closeCfg(){
  const modal = el("cfgModal");
  if(!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");

  document.body.style.overflow = "";
}

function readCfgFromInputs(){
  return {
    pin: (el("cfgPin").value || "").trim(),
    hubUrl: (el("cfgHubUrl").value || "").trim(),
    crmUrl: (el("cfgCrmUrl").value || "").trim(),
    facturaUrl: (el("cfgFacturaUrl").value || "").trim(),
    inventarioUrl: (el("cfgInventarioUrl").value || "").trim(),
    diagnosticoUrl: (el("cfgDiagnosticoUrl").value || "").trim(),
    contabilidadUrl: (el("cfgContabilidadUrl").value || "").trim(),
    gastosUrl: (el("cfgGastosUrl").value || "").trim()
  };
}

function applyLinks(){
  // si tus cards tienen IDs, actualiza href aquí:
  // <a id="linkCRM" ...>, etc.
  const cfg = cfgLoad();
  const map = [
    ["linkCRM", cfg.crmUrl],
    ["linkFACT", cfg.facturaUrl],
    ["linkINV", cfg.inventarioUrl],
    ["linkDIAG", cfg.diagnosticoUrl],
    ["linkCONT", cfg.contabilidadUrl],
    ["linkGAST", cfg.gastosUrl],
    ["linkHUB", cfg.hubUrl]
  ];
  map.forEach(([id,url])=>{
    const a = el(id);
    if(a && url) a.href = url;
  });
}

// Boot
document.addEventListener("DOMContentLoaded", ()=>{
  // aplicar links al cargar
  applyLinks();

  // botones
  el("btnOpenCfg")?.addEventListener("click", (e)=>{ e.preventDefault(); openCfg(); });
  el("cfgClose")?.addEventListener("click", (e)=>{ e.preventDefault(); closeCfg(); });

  el("cfgSave")?.addEventListener("click", (e)=>{
    e.preventDefault();
    const data = readCfgFromInputs();
    if(!data.pin) return alert("PIN requerido.");
    cfgSave(data);
    applyLinks();
    closeCfg();
    alert("Guardado ✅");
  });

  el("cfgReset")?.addEventListener("click", (e)=>{
    e.preventDefault();
    if(!confirm("¿Resetear configuración?")) return;
    cfgSave(cfgDefault());
    applyLinks();
    // refresca inputs si está abierto
    if(el("cfgModal")?.classList.contains("is-open")) openCfg();
  });

  // cerrar tocando afuera (overlay)
  el("cfgModal")?.addEventListener("click", (e)=>{
    if(e.target.id === "cfgModal") closeCfg();
  });

  // ESC
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && el("cfgModal")?.classList.contains("is-open")) closeCfg();
  });
});
