/* Dr. Jander Toledo | comportamento da página. Ajustes rápidos: WHATSAPP (número) e REVISAO (botão de pendências). */
(function(){
  "use strict";
  /* Preencher com o número confirmado (somente dígitos, com DDI e DDD), ex.: "5531999999999" */
  var WHATSAPP = "";
  var MSG = "Olá, gostaria de agendar uma consulta com o Dr. Jander Toledo.";
  var WA_URL = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(MSG);
  function ligarWhats(raiz){
    (raiz || document).querySelectorAll("[data-whats]").forEach(function(a){ a.href = WA_URL; a.target = "_blank"; a.rel = "noopener"; });
  }
  ligarWhats();

  /* Medição de cliques (WhatsApp, telefone, agendamento, mapa): pronto para Google Tag Manager */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener("click", function(e){
    var el = e.target.closest("[data-track]");
    if (!el) return;
    var href = el.getAttribute("href") || "";
    var tipo = el.hasAttribute("data-whats") ? "whatsapp" : href.indexOf("tel:") === 0 ? "telefone" : el.hasAttribute("data-painel") ? "conteudo" : "navegacao";
    window.dataLayer.push({event:"clique_site", tipo:tipo, origem:el.getAttribute("data-track")});
  });

  /* Revisão interna: mostra o botão de pendências. Trocar para false ao publicar. */
  var REVISAO = true;
  var bp = document.getElementById("btn-pendencias");
  if (bp){
    if (!REVISAO) bp.remove();
    else { var tp = document.getElementById("pendencias"); document.getElementById("n-pend").textContent = tp ? tp.content.querySelectorAll("li").length : ""; }
  }

  var ano = document.getElementById("ano"); if (ano) ano.textContent = new Date().getFullYear();

  /* Cabeçalho e WhatsApp fixo */
  var topo = document.getElementById("topo"), fixo = document.getElementById("barra-acao");
  var topoWrap = topo.querySelector(".wrap");
  function ajustaTopo(){
    topo.classList.remove("c1","c2","c3");
    ["c1","c2","c3"].forEach(function(c){ if (topoWrap.scrollWidth > topoWrap.clientWidth + 1) topo.classList.add(c); });
  }
  ajustaTopo();
  window.addEventListener("resize", ajustaTopo);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustaTopo);
  function aoRolar(){
    var y = window.scrollY || 0;
    topo.classList.toggle("rolou", y > 8);
    fixo.classList.toggle("oculto", y < 380);
  }
  aoRolar(); window.addEventListener("scroll", aoRolar, {passive:true});

  /* Menu do celular */
  var gaveta = document.getElementById("gaveta"), abrir = document.getElementById("abrir-menu"), fechar = document.getElementById("fechar-menu");
  function abreMenu(){ gaveta.hidden = false; abrir.setAttribute("aria-expanded","true"); document.body.style.overflow = "hidden"; fechar.focus(); }
  function fechaMenu(){ gaveta.hidden = true; abrir.setAttribute("aria-expanded","false"); document.body.style.overflow = ""; }
  abrir.addEventListener("click", abreMenu);
  fechar.addEventListener("click", function(){ fechaMenu(); abrir.focus(); });
  gaveta.addEventListener("click", function(e){ if (e.target.closest("a")) fechaMenu(); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !gaveta.hidden){ fechaMenu(); abrir.focus(); } });

  /* Painel de leitura (condições e orientações) */
  var painel = document.getElementById("painel"), pConteudo = document.getElementById("painel-conteudo"), pRotulo = document.getElementById("painel-rotulo"), pFechar = document.getElementById("painel-fechar"), origem = null;
  function abrePainel(id, botao){
    var tpl = document.getElementById(id); if (!tpl) return;
    origem = botao || null;
    pRotulo.textContent = tpl.getAttribute("data-rotulo") || "";
    pConteudo.innerHTML = "";
    pConteudo.appendChild(tpl.content.cloneNode(true));
    var aviso = document.createElement("p"); aviso.className = "aviso";
    aviso.textContent = "Conteúdo informativo, que não substitui a consulta. Cada caso é avaliado individualmente.";
    pConteudo.appendChild(aviso);
    var acoes = document.createElement("div"); acoes.className = "acoes-painel";
    acoes.innerHTML = '<a class="btn btn-acao" href="#" data-whats data-track="whatsapp_painel_' + id + '">Agendar consulta</a><button class="btn btn-linha" type="button" data-fechar-painel>Voltar ao site</button>';
    pConteudo.appendChild(acoes);
    var ass = document.createElement("p"); ass.className = "assina-painel";
    ass.textContent = "Autoria e revisão médica: Dr. Jander Toledo Ferreira | MÉDICO | CRM-MG 19.515 | Cirurgia Geral RQE 48.711 | Cirurgia do Aparelho Digestivo RQE [A CONFIRMAR]";
    if (id === "pendencias"){ acoes.remove(); ass.remove(); aviso.remove(); }
    pConteudo.appendChild(ass);
    ligarWhats(pConteudo);
    pConteudo.scrollTop = 0;
    if (typeof painel.showModal === "function") painel.showModal(); else painel.setAttribute("open","");
    /* sempre abrir no início do texto, mesmo depois de rolar um painel anterior */
    pConteudo.scrollTop = 0;
    requestAnimationFrame(function(){ pConteudo.scrollTop = 0; pFechar.focus({preventScroll:true}); });
    document.body.style.overflow = "hidden";
  }
  function fechaPainel(){
    if (painel.open){ if (typeof painel.close === "function") painel.close(); else painel.removeAttribute("open"); }
  }
  painel.addEventListener("close", function(){ pConteudo.scrollTop = 0; document.body.style.overflow = ""; if (origem) origem.focus(); });
  pFechar.addEventListener("click", fechaPainel);
  painel.addEventListener("click", function(e){
    if (e.target === painel || e.target.closest("[data-fechar-painel]")) fechaPainel();
  });
  document.querySelectorAll("[data-painel]").forEach(function(b){
    b.addEventListener("click", function(){ abrePainel(b.getAttribute("data-painel"), b); });
  });

  /* Trilha das etapas: o traçado das serras passa exatamente sobre o centro de cada etapa */
  var trilha = document.getElementById("trilha"), etapas = document.querySelectorAll("#etapas .etapa");
  var alturas = [0.80, 0.64, 0.48, 0.34, 0.18];
  function desenhaTrilha(){
    if (!trilha || getComputedStyle(trilha).display === "none") return;
    var r = trilha.getBoundingClientRect(), W = r.width, H = r.height;
    if (!W) return;
    var svg = trilha.querySelector("svg"), path = trilha.querySelector("path");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    trilha.querySelectorAll(".ponto").forEach(function(p){ p.remove(); });
    var pts = [];
    etapas.forEach(function(li, i){
      var t = li.querySelector("h3").getBoundingClientRect();
      pts.push([t.left + t.width / 2 - r.left, alturas[i] * H]);
    });
    var d = "M0 " + (0.92 * H).toFixed(1), ant = [0, 0.92 * H], picos = [-0.16, 0.10, -0.12, 0.08, -0.14, 0.06];
    pts.concat([[W, 0.10 * H]]).forEach(function(p, i){
      var dx = p[0] - ant[0];
      var a = [ant[0] + dx * 0.36, (ant[1] + p[1]) / 2 + picos[i % picos.length] * H];
      var b = [ant[0] + dx * 0.68, (ant[1] + p[1]) / 2 - picos[(i + 1) % picos.length] * H * 0.6];
      d += " L" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " L" + b[0].toFixed(1) + " " + b[1].toFixed(1) + " L" + p[0].toFixed(1) + " " + p[1].toFixed(1);
      ant = p;
    });
    path.setAttribute("d", d);
    pts.forEach(function(p, i){
      var s = document.createElement("span");
      s.className = "ponto" + (i === pts.length - 1 ? " final" : "");
      s.style.left = p[0] + "px"; s.style.top = p[1] + "px";
      trilha.appendChild(s);
    });
  }
  desenhaTrilha();
  window.addEventListener("resize", desenhaTrilha);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhaTrilha);

  /* Mapa interativo */
  var mapa = null, marcadores = [];
  function iniciaMapa(){
    var D = window.MAPA_DADOS, el = document.getElementById("mapa");
    if (!el || !window.L || !D) return;
    var limites = L.latLngBounds(D.limites);
    mapa = L.map(el, {zoomControl:false, scrollWheelZoom:false, minZoom:14, maxZoom:18, maxBounds:limites.pad(0.05), maxBoundsViscosity:0.9, preferCanvas:true, zoomSnap:0.5});
    L.control.zoom({position:"topright", zoomInTitle:"Aproximar", zoomOutTitle:"Afastar"}).addTo(mapa);
    mapa.attributionControl.setPrefix(false);
    mapa.attributionControl.addAttribution("Dados © colaboradores do OpenStreetMap");

    var canvas = L.canvas({padding:0.5});
    L.polygon(D.parques, {renderer:canvas, stroke:false, fillColor:"#D3E0D3", fillOpacity:1, interactive:false}).addTo(mapa);

    var vias = {p:[], s:[], r:[]};
    D.vias.forEach(function(v){ vias[v[0]].push(v[1]); });
    var lr = L.polyline(vias.r, {renderer:canvas, color:"#FFFFFF", weight:3, lineCap:"round", lineJoin:"round", interactive:false}).addTo(mapa);
    var lsC = L.polyline(vias.s, {renderer:canvas, color:"#DDD4C7", weight:7, lineCap:"round", lineJoin:"round", interactive:false}).addTo(mapa);
    var ls = L.polyline(vias.s, {renderer:canvas, color:"#FFFFFF", weight:5, lineCap:"round", lineJoin:"round", interactive:false}).addTo(mapa);
    var lpC = L.polyline(vias.p, {renderer:canvas, color:"#CFC5B6", weight:10, lineCap:"round", lineJoin:"round", interactive:false}).addTo(mapa);
    var lp = L.polyline(vias.p, {renderer:canvas, color:"#FBF8F3", weight:7.5, lineCap:"round", lineJoin:"round", interactive:false}).addTo(mapa);
    function espessuras(){
      var z = mapa.getZoom(), f = Math.pow(1.45, z - 15);
      lr.setStyle({weight:Math.max(1.2, 3 * f)});
      lsC.setStyle({weight:Math.max(3, 7 * f)}); ls.setStyle({weight:Math.max(2, 5 * f)});
      lpC.setStyle({weight:Math.max(4.5, 10 * f)}); lp.setStyle({weight:Math.max(3, 7.5 * f)});
    }

    L.polygon(D.regiao, {color:"#6F8C7C", weight:1.5, dashArray:"6 6", fillColor:"#8DA597", fillOpacity:0.16, interactive:false}).addTo(mapa);
    var rotRegiao = L.tooltip({permanent:true, direction:"center", className:"rotulo-regiao", interactive:false}).setLatLng(D.regiaoRotulo).setContent("Região hospitalar");
    rotRegiao.addTo(mapa);

    var rotulosHosp1 = L.layerGroup(), rotulosHosp2 = L.layerGroup();
    D.hospitais.forEach(function(h){
      var camada;
      if (h.p){ camada = L.polygon(h.p, {color:"#6F8C7C", weight:1, fillColor:"#B9CABF", fillOpacity:0.95}); }
      else { camada = L.circleMarker(h.c, {radius:5, color:"#6F8C7C", weight:1.5, fillColor:"#B9CABF", fillOpacity:1}); }
      camada.bindPopup("<b>" + h.n + "</b><br><span style='color:#55605C'>Referência de localização</span>");
      camada.addTo(mapa);
      var rot = L.tooltip({permanent:true, direction:"center", className:"rotulo-hosp", interactive:false}).setLatLng(h.c).setContent(h.n);
      (h.t === 1 ? rotulosHosp1 : rotulosHosp2).addLayer(rot);
    });

    var rotulosRuas = L.layerGroup();
    D.ruas.forEach(function(r){
      rotulosRuas.addLayer(L.marker(r.c, {interactive:false, keyboard:false, icon:L.divIcon({className:"", iconSize:[0,0], html:'<div class="rotulo-rua" style="transform:translate(-50%,-50%) rotate(' + r.a + 'deg)">' + r.n + '</div>'})}));
    });

    function camadasPorZoom(){
      var z = mapa.getZoom();
      espessuras();
      var estreito = el.clientWidth < 640;
      if (z >= (estreito ? 16 : 15)) rotulosHosp1.addTo(mapa); else rotulosHosp1.remove();
      if (z >= (estreito ? 17 : 16.5)) rotulosHosp2.addTo(mapa); else rotulosHosp2.remove();
      if (z >= 16) rotulosRuas.addTo(mapa); else rotulosRuas.remove();
      if (z >= 17) rotRegiao.remove(); else rotRegiao.addTo(mapa);
    }
    mapa.on("zoomend", camadasPorZoom);

    D.consultorios.forEach(function(c, i){
      var m = L.marker([c.lat, c.lon], {zIndexOffset:1000, title:c.nome, icon:L.divIcon({className:"", iconSize:[40,40], iconAnchor:[20,46], popupAnchor:[0,-44], tooltipAnchor:[0,-50], html:'<div class="pino-cons"><span>' + (i + 1) + '</span></div>'})});
      m.bindTooltip(c.nome, {permanent:true, direction:"top", className:"rotulo-cons", offset:[0,0]});
      m.bindPopup("<b>" + c.nome + "</b><br>" + c.endereco + "<br><a href='" + c.rota + "' target='_blank' rel='noopener' style='color:#1F4842;font-weight:600'>Como chegar</a>");
      m.on("click", function(){ destacaLocal(i); });
      m.addTo(mapa);
      marcadores.push(m);
    });

    var Centro = L.Control.extend({
      options:{position:"topright"},
      onAdd:function(){
        var div = L.DomUtil.create("div","leaflet-bar");
        div.innerHTML = '<button class="btn-centralizar" type="button" title="Ver os dois consultórios" aria-label="Ver os dois consultórios"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/></svg></button>';
        L.DomEvent.disableClickPropagation(div);
        div.querySelector("button").addEventListener("click", vistaInicial);
        return div;
      }
    });
    mapa.addControl(new Centro());

    function vistaInicial(){
      mapa.fitBounds(L.latLngBounds(D.vista), {padding:[30,30]});
    }
    vistaInicial();
    camadasPorZoom();

    var aviso = document.getElementById("aviso-mapa"), tAviso;
    el.addEventListener("wheel", function(e){
      if (e.ctrlKey || e.metaKey){
        e.preventDefault();
        var z = mapa.getZoom() + (e.deltaY < 0 ? 0.5 : -0.5);
        mapa.setZoomAround(mapa.mouseEventToContainerPoint(e), z);
      } else {
        aviso.classList.add("visivel"); clearTimeout(tAviso);
        tAviso = setTimeout(function(){ aviso.classList.remove("visivel"); }, 1400);
      }
    }, {passive:false});
  }
  function destacaLocal(i){
    document.querySelectorAll(".local").forEach(function(c, j){ c.classList.toggle("ativo", i === j); });
  }
  document.querySelectorAll("[data-ver-local]").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.getAttribute("data-ver-local");
      if (!mapa) return;
      var caixa = document.querySelector(".mapa-caixa"), r = caixa.getBoundingClientRect();
      if (r.top < 90 || r.bottom > window.innerHeight) caixa.scrollIntoView({behavior:"smooth", block:"center"});
      mapa.flyTo(marcadores[i].getLatLng(), 17, {duration:0.8});
      setTimeout(function(){ marcadores[i].openPopup(); }, 850);
      destacaLocal(i);
    });
  });
  function mapaReserva(){
    var el = document.getElementById("mapa"); if (!el || mapa) return;
    el.innerHTML = '<div style="height:100%;min-height:inherit;display:grid;place-content:center;gap:12px;text-align:center;padding:24px;color:#55605C"><b style="font-family:Lora,serif;font-weight:500;font-size:20px;color:#1F4842">Região hospitalar de Belo Horizonte</b><span>Os dois consultórios ficam na Santa Efigênia.</span><a class="btn btn-linha btn-sm" style="justify-self:center" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Rua+Cear%C3%A1+195+Santa+Efig%C3%AAnia+Belo+Horizonte">Abrir no Google Maps</a></div>';
  }
  try { iniciaMapa(); } catch (err) { if (window.console) console.warn("Mapa indisponível", err); }
  if (!mapa) mapaReserva();

  if (!("IntersectionObserver" in window)) return;
  var links = document.querySelectorAll("nav.menu a"), mapaLinks = {};
  links.forEach(function(a){ mapaLinks[a.getAttribute("href").slice(1)] = a; });
  var sec = new IntersectionObserver(function(ents){
    ents.forEach(function(en){
      var a = mapaLinks[en.target.id]; if (!a) return;
      if (en.isIntersecting){ links.forEach(function(l){ l.classList.remove("ativo"); }); a.classList.add("ativo"); }
    });
  }, {rootMargin:"-45% 0px -50% 0px"});
  Object.keys(mapaLinks).forEach(function(id){ var s = document.getElementById(id); if (s) sec.observe(s); });
})();
