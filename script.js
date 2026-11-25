/* ===== CONFIGURAÇÃO (edite aqui) ===== */
const CFG={whats:"5561999999999",msg:"Olá! Vim pelo site da Brasil Atacadista.",blackFridayEnd:"2026-11-30T23:59:59-03:00",freteGratisAcima:800,
 /* Integração futura: gateway de pagamento e API de CEP/transportadora */ cepApi:"https://viacep.com.br/ws/{cep}/json/",
 /* PIX: preencha chave (telefone no formato +5561999999999), nome do recebedor e cidade */ pix:{chave:"",nome:"",cidade:""},
 /* Link de pagamento do cartão de crédito (Mercado Pago, Stripe, Asaas etc.) */ cardLink:""};
const CATS=[["Águas","💧"],["Refrigerantes","🥤"],["Sucos","🧃"],["Energéticos","⚡"],["Cervejas","🍺"],["Vinhos","🍷"]];
/* img: coloque o caminho/URL da foto de cada produto (vazio = espaço reservado) */
const P=[
{id:1,code:"AG-001",name:"Água Mineral 500ml — Fardo 12un",cat:"Águas",price:18.9,off:0,stock:300,sold:980,rat:4.8,d:5,img:"",e:"💧"},
{id:2,code:"AG-002",name:"Água com Gás 510ml — Fardo 12un",cat:"Águas",price:24.9,off:10,stock:120,sold:410,rat:4.6,d:9,img:"",e:"💧"},
{id:3,code:"RF-001",name:"Refrigerante Cola 2L — Fardo 6un",cat:"Refrigerantes",price:39.9,off:15,stock:200,sold:1500,rat:4.9,d:2,img:"",e:"🥤"},
{id:4,code:"RF-002",name:"Refrigerante Guaraná 2L — Fardo 6un",cat:"Refrigerantes",price:36.9,off:0,stock:0,sold:870,rat:4.7,d:12,img:"",e:"🥤"},
{id:5,code:"SC-001",name:"Suco de Uva Integral 1L — Caixa 6un",cat:"Sucos",price:54.9,off:20,stock:80,sold:300,rat:4.5,d:3,img:"",e:"🧃"},
{id:6,code:"SC-002",name:"Suco de Laranja 1L — Caixa 6un",cat:"Sucos",price:42.9,off:0,stock:95,sold:260,rat:4.4,d:20,img:"",e:"🧃"},
{id:7,code:"EN-001",name:"Energético 269ml — Caixa 24un",cat:"Energéticos",price:119.9,off:25,stock:60,sold:700,rat:4.7,d:1,img:"",e:"⚡"},
{id:8,code:"EN-002",name:"Isotônico 500ml — Caixa 12un",cat:"Energéticos",price:64.9,off:0,stock:40,sold:220,rat:4.3,d:15,img:"",e:"⚡"},
{id:9,code:"CV-001",name:"Cerveja Pilsen Lata 350ml — Caixa 12un (+18)",cat:"Cervejas",price:44.9,off:12,stock:150,sold:1300,rat:4.8,d:4,img:"",e:"🍺",alc:1},
{id:10,code:"CV-002",name:"Cerveja Long Neck — Caixa 24un (+18)",cat:"Cervejas",price:109.9,off:18,stock:70,sold:640,rat:4.6,d:7,img:"",e:"🍺",alc:1},
{id:11,code:"VN-001",name:"Vinho Tinto Suave 750ml — Caixa 6un (+18)",cat:"Vinhos",price:129.9,off:0,stock:35,sold:150,rat:4.5,d:6,img:"",e:"🍷",alc:1},
{id:12,code:"CH-001",name:"Chá Gelado Limão 1,5L — Caixa 6un",cat:"Sucos",price:47.9,off:10,stock:110,sold:180,rat:4.2,d:1,img:"",e:"🧃"}];
const CUP={BEMVINDO10:{pct:10,min:100,exp:"2027-12-31",lim:500},ATACADO20:{fix:20,min:300,exp:"2027-12-31",lim:500},BLACK15:{pct:15,min:200,exp:"2026-11-30",lim:100}};
const REV=[["Cliente Exemplo 1","São Paulo, SP",5,"Entrega rápida e preço muito bom para revenda.","12/11/2026"],["Cliente Exemplo 2","Goiânia, GO",5,"Atendimento excelente pelo WhatsApp.","08/11/2026"],["Cliente Exemplo 3","Belo Horizonte, MG",4,"Produtos bem embalados e no prazo.","30/10/2026"]];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const R=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let cart=ld("ba_cart",{}),favs=ld("ba_fav",[]),ship=ld("ba_ship",null),cup=ld("ba_cup",null);
let S={q:"",cat:"",max:300,promo:false,nov:false,best:false,av:false,sort:"rel"},co={step:1,d:{}};
const pp=p=>+(p.price*(1-p.off/100)).toFixed(2);
function toast(m,err){const d=document.createElement("div");d.textContent=m;if(err)d.className="e";$("#ts").appendChild(d);setTimeout(()=>d.remove(),2800)}
const wl=()=>"https://wa.me/"+CFG.whats+"?text="+encodeURIComponent(CFG.msg);
["#wa","#wah","#wf"].forEach(s=>{$(s).href=wl()});
/* contador */
function tick(){let s=Math.max(0,(new Date(CFG.blackFridayEnd)-Date.now())/1000|0),d=s/86400|0,h=s%86400/3600|0,m=s%3600/60|0;
 const f=n=>String(n).padStart(2,"0");$("#cd").innerHTML=[d+"d",f(h)+"h",f(m)+"m",f(s%60)+"s"].map(x=>"<span>"+x+"</span>").join("");
 if(!s)$("#bf").innerHTML="Campanha Black Friday encerrada"}
tick();setInterval(tick,1000);
/* cartão de produto */
function card(p){const o=p.off,fv=favs.includes(p.id);
 return `<div class="card"><div class="img">${p.img?`<img src="${p.img}" alt="${p.name}">`:`${p.e}<small>Sua imagem aqui</small>`}${o?`<span class="tag">-${o}%</span>`:""}<button class="fav" data-f="${p.id}" aria-label="Favoritar">${fv?"♥":"♡"}</button></div>
 <span class="mut">Cód. ${p.code} · ${p.cat}</span><b>${p.name}</b><span class="st">${"★".repeat(Math.round(p.rat))} <span class="mut">${p.rat}</span></span>
 <div class="pr">${o?`<s>${R(p.price)}</s> `:""}<b>${R(pp(p))}</b></div>
 <span class="${p.stock?"ok":"no"}">${p.stock?"Disponível ("+p.stock+" em estoque)":"Indisponível"}</span>
 <div class="q"><input type="number" min="1" value="1" id="n${p.id}" aria-label="Quantidade"><button class="btn" style="flex:1" data-a="${p.id}" ${p.stock?"":"disabled"}>Adicionar</button></div></div>`}
function list(){let a=P.filter(p=>(!S.cat||p.cat===S.cat)&&pp(p)<=S.max&&(!S.promo||p.off)&&(!S.nov||p.d<=7)&&(!S.best||p.sold>=600)&&(!S.av||p.stock)&&(!S.q||(p.name+p.cat).toLowerCase().includes(S.q.toLowerCase())));
 const o={pa:(x,y)=>pp(x)-pp(y),pd:(x,y)=>pp(y)-pp(x),bs:(x,y)=>y.sold-x.sold,rt:(x,y)=>y.rat-x.rat,nw:(x,y)=>x.d-y.d}[S.sort];return o?a.sort(o):a}
const catGrid=()=>`<div class="grid">${CATS.map(c=>`<div class="cat" data-c="${c[0]}"><div class="e">${c[1]}</div><b>${c[0]}</b><span class="btn o sm">Ver produtos</span></div>`).join("")}</div>`;
const V={
inicio:()=>`<section class="hero"><h1>OFERTAS EXCLUSIVAS PARA REVENDEDORES</h1><p>Preços especiais, qualidade e praticidade para seu negócio.</p><div class="r"><a class="btn" style="background:#fff;color:var(--gd)" href="#produtos">VER PRODUTOS</a><a class="btn o" href="#ofertas">CONHECER OFERTAS</a></div></section>
 <section class="bk"><h2>BLACK FRIDAY — OFERTAS ESPECIAIS</h2><p>Até 25% OFF em itens selecionados. Use o cupom <b>BLACK15</b> no carrinho.</p><a class="btn" href="#ofertas">APROVEITAR OFERTAS</a></section>
 <h2>Categorias</h2>${catGrid()}<h2>Mais vendidos</h2><div class="grid">${[...P].sort((a,b)=>b.sold-a.sold).slice(0,4).map(card).join("")}</div>
 <h2>CLIENTES QUE CONFIAM NA NOSSA EMPRESA</h2><p class="mut">Confira as experiências de quem já comprou conosco.</p><div class="grid">${REV.map(r=>`<div class="rv"><span class="st">${"★".repeat(r[2])}${"☆".repeat(5-r[2])}</span> <span class="ex">Exemplo demonstrativo</span><p>“${r[3]}”</p><b>${r[0]}</b><div class="mut">${r[1]} · ${r[4]}</div></div>`).join("")}</div>
 <div class="box" style="margin-top:30px;text-align:center"><h2 style="margin-top:0">Precisa de ajuda?</h2><p>Nossa equipe está pronta para atender você.</p><a class="btn" href="${wl()}" target="_blank" rel="noopener">FALAR COM ATENDIMENTO</a></div>`,
produtos:()=>`<h2>Produtos</h2><div class="lay"><div class="fl"><b>Filtros</b><select id="fc2"><option value="">Todas as categorias</option>${CATS.map(c=>`<option ${S.cat==c[0]?"selected":""}>${c[0]}</option>`).join("")}</select>
 <label>Preço até <b id="mv">${R(S.max)}</b></label><input type="range" id="fm" min="20" max="300" step="10" value="${S.max}">
 ${[["promo","Promoções"],["best","Mais vendidos"],["nov","Novidades"],["av","Somente disponíveis"]].map(f=>`<label><input type="checkbox" data-k="${f[0]}" ${S[f[0]]?"checked":""}>${f[1]}</label>`).join("")}
 <select id="so">${[["rel","Relevância"],["pa","Menor preço"],["pd","Maior preço"],["bs","Mais vendidos"],["rt","Mais avaliados"],["nw","Mais recentes"]].map(o=>`<option value="${o[0]}" ${S.sort==o[0]?"selected":""}>${o[1]}</option>`).join("")}</select>
 <button class="btn o sm" id="clr">Limpar filtros</button></div><div><p class="mut" id="cnt"></p><div class="grid" id="pl"></div></div></div>`,
ofertas:()=>`<section class="bk"><h2>BLACK FRIDAY — OFERTAS ESPECIAIS</h2><p>Descontos de até 25%. Termina em <span class="cd" id="cd2"></span></p></section><div class="grid">${P.filter(p=>p.off).sort((a,b)=>b.off-a.off).map(card).join("")}</div>`,
atacado:()=>`<h2>Compre no atacado</h2><div class="grid"><div class="box"><b>📦 Vendas por fardo e caixa</b><p>Quantidades pensadas para revenda.</p></div><div class="box"><b>🚚 Frete grátis</b><p>Em pedidos acima de ${R(CFG.freteGratisAcima)}.</p></div><div class="box"><b>🏷️ Cupom BEMVINDO10</b><p>10% na primeira compra acima de R$ 100.</p></div></div><h2>Categorias</h2>${catGrid()}`,
sobre:()=>`<h2>Sobre a Brasil Atacadista</h2><div class="grid">${[["História","Texto de exemplo: conte aqui a história da empresa."],["Missão","Abastecer o seu negócio com bebidas de qualidade e preço justo."],["Visão","Ser referência nacional em distribuição de bebidas."],["Valores","Confiança, transparência e compromisso com o cliente."],["Qualidade","Produtos selecionados e armazenados corretamente."],["Atendimento","Equipe pronta para ajudar pelo WhatsApp."],["Logística","Entrega para todo o Brasil com rastreio."]].map(x=>`<div class="box"><b>${x[0]}</b><p>${x[1]}</p></div>`).join("")}</div><p class="mut">Políticas de privacidade, envio, trocas e reembolso: substitua por seus textos oficiais.</p>`,
contato:()=>`<h2>Contato</h2><div class="box"><p>Fale com a gente pelo WhatsApp ou envie uma mensagem.</p><form id="ct" class="fm"><input placeholder="Nome" required><input type="email" placeholder="E-mail" required><textarea class="full" rows="4" placeholder="Mensagem" required style="font:inherit;padding:10px;border-radius:10px;border:1px solid var(--b);background:var(--c);color:var(--t)"></textarea><button class="btn">Enviar</button><a class="btn o" href="${wl()}" target="_blank" rel="noopener">WhatsApp</a></form></div>`,
checkout:()=>checkout()};
/* totais */
function calc(){const it=Object.entries(cart).map(([id,q])=>({p:P.find(x=>x.id==id),q})).filter(x=>x.p);let sub=it.reduce((s,x)=>s+pp(x.p)*x.q,0),full=it.reduce((s,x)=>s+x.p.price*x.q,0),d=0;
 if(cup){const c=CUP[cup];if(c&&sub>=c.min)d=c.pct?sub*c.pct/100:c.fix}
 let f=ship?(sub-d>=CFG.freteGratisAcima&&ship.id!="ret"?0:ship.v):0;return{it,sub,disc:full-sub,cup:d,f,tot:Math.max(0,sub-d+f)}}
function ups(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$("#cc").textContent=n;$("#fc").textContent=favs.length;sv("ba_cart",cart);sv("ba_fav",favs);sv("ba_ship",ship);sv("ba_cup",cup)}
const SH=cep=>{const r=+cep[0]||0,k=r>=7?1.4:r>=4?1.2:1;return[{id:"eco",n:"Econômica",d:"5 a 8 dias úteis",v:+(29*k).toFixed(2)},{id:"exp",n:"Expressa",d:"2 a 3 dias úteis",v:+(59*k).toFixed(2)},{id:"ret",n:"Retirar na loja",d:"Hoje",v:0}]};
async function cepLookup(c){c=c.replace(/\D/g,"");if(c.length!=8)return null;try{const r=await fetch(CFG.cepApi.replace("{cep}",c));const j=await r.json();return j.erro?null:j}catch(e){return null}}
function drawer(){const c=calc(),d=$("#dr");
 d.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">Carrinho</h3><button class="ic" id="x">✕</button></div>`+(!c.it.length?`<p style="text-align:center;padding:30px 0">🛒<br>Seu carrinho está vazio.</p><button class="btn" id="cont">CONTINUAR COMPRANDO</button>`:
 c.it.map(x=>`<div class="it"><div class="img">${x.p.e}</div><div><b style="font-size:13px">${x.p.name}</b><div class="q"><button class="btn sm" data-m="${x.p.id}">−</button><b style="padding:6px">${x.q}</b><button class="btn sm" data-p="${x.p.id}">+</button><button class="btn o sm" data-r="${x.p.id}">Remover</button></div></div><b>${R(pp(x.p)*x.q)}</b></div>`).join("")+
 `<div class="q"><input id="cp" placeholder="Cupom" value="${cup||""}"><button class="btn sm" id="ac">Aplicar</button></div>
 <div class="q"><input id="cep" placeholder="CEP" maxlength="9" value="${ld("ba_cep","")}"><button class="btn sm" id="bc">Calcular frete</button></div>
 <div id="so2">${ship?"":""}${(ld("ba_cep","")?SH(ld("ba_cep","")):[]).map(o=>`<label class="opt"><input type="radio" name="sh" value="${o.id}" ${ship&&ship.id==o.id?"checked":""}><span style="flex:1">${o.n}<br><span class="mut">${o.d}</span></span><b>${R(o.v)}</b></label>`).join("")}</div>
 <div class="tot"><div><span>Subtotal</span><span>${R(c.sub)}</span></div>${c.disc?`<div><span>Descontos de oferta</span><span>−${R(c.disc)}</span></div>`:""}${c.cup?`<div><span>Cupom ${cup}</span><span>−${R(c.cup)}</span></div>`:""}<div><span>Frete</span><span>${ship?(c.f?R(c.f):"Grátis"):"—"}</span></div><div class="f"><span>Total</span><span>${R(c.tot)}</span></div></div>
 <button class="btn" id="fin">FINALIZAR PEDIDO</button><button class="btn o" id="cont">CONTINUAR COMPRANDO</button>`)}
const openD=()=>{drawer();$("#dr").classList.add("on");$("#ov").classList.add("on")},closeD=()=>{$("#dr").classList.remove("on");$("#ov").classList.remove("on")};
const hasAlc=()=>Object.keys(cart).some(id=>(P.find(p=>p.id==id)||{}).alc);
/* checkout */
const cpfOk=c=>{c=c.replace(/\D/g,"");if(c.length!=11||/^(\d)\1+$/.test(c))return false;for(let t=9;t<11;t++){let s=0;for(let i=0;i<t;i++)s+=c[i]*(t+1-i);if((s*10%11%10)!=c[t])return false}return true};
function crc(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,"0")}
function pixCode(v,txid){const f=(i,x)=>i+String(x.length).padStart(2,"0")+x,x=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase(),k=CFG.pix;
 const p=f("00","01")+f("26",f("00","BR.GOV.BCB.PIX")+f("01",k.chave))+f("52","0000")+f("53","986")+f("54",v.toFixed(2))+f("58","BR")+f("59",x(k.nome).slice(0,25))+f("60",x(k.cidade).slice(0,15))+f("62",f("05",txid))+"6304";return p+crc(p)}
function payBox(){const d=co.d;
 if(d.pg=="pix"){if(!CFG.pix.chave)return`<p>Nossa equipe enviará a chave Pix pelo WhatsApp.</p>`;co.code=pixCode(co.tot,co.num);return`<div class="box" style="margin:12px 0"><b>Pague com Pix: ${R(co.tot)}</b><div id="qr" style="display:grid;place-items:center;margin:10px 0"></div><input readonly id="pxc" value="${co.code}"><br><br><button class="btn" id="cpx">Copiar Pix copia e cola</button><p class="mut">Após pagar, envie o comprovante pelo WhatsApp para confirmarmos o pedido.</p><a class="btn o sm" href="${wl()}" target="_blank" rel="noopener">Enviar comprovante</a></div>`}
 if(d.pg=="cc"){if(!CFG.cardLink)return`<p>Nossa equipe enviará o link de pagamento pelo WhatsApp.</p>`;return`<p><a class="btn" href="${CFG.cardLink}" target="_blank" rel="noopener">PAGAR COM CARTÃO DE CRÉDITO</a></p><p class="mut">Você será levado ao ambiente seguro do provedor. Valor do pedido: ${R(co.tot)}.</p>`}return""}
function pixUi(){if($("#qr")&&window.QRCode)new QRCode($("#qr"),{text:co.code,width:180,height:180});const b=$("#cpx");if(b)b.onclick=()=>{navigator.clipboard.writeText(co.code).then(()=>toast("Código Pix copiado"),()=>{$("#pxc").select();toast("Selecione e copie o código",1)})}}
function checkout(){const c=calc();if(!c.it.length&&co.step<5)return`<h2>Checkout</h2><p>Seu carrinho está vazio.</p><a class="btn" href="#produtos">Ver produtos</a>`;
 const st=["Identificação","Entrega","Pagamento","Revisão","Confirmação"],d=co.d,sh=ship?`${ship.n} (${ship.d})`:"";
 let b="";
 if(co.step==1)b=`<form id="f1" class="fm"><div class="full"><label>Nome completo</label><input name="nome" required value="${d.nome||""}"></div><div><label>CPF</label><input name="cpf" required placeholder="000.000.000-00" value="${d.cpf||""}"></div><div><label>E-mail</label><input name="email" type="email" required value="${d.email||""}"></div><div><label>Telefone</label><input name="tel" required value="${d.tel||""}"></div><div><label>WhatsApp</label><input name="zap" required value="${d.zap||""}"></div><div class="full"><button class="btn">Continuar</button></div></form>`;
 if(co.step==2)b=`<form id="f2" class="fm"><div><label>CEP</label><input name="cep" id="ccep" required maxlength="9" value="${d.cep||ld("ba_cep","")}"></div><div><label>Rua</label><input name="rua" required value="${d.rua||""}"></div><div><label>Número</label><input name="num" required value="${d.num||""}"></div><div><label>Complemento</label><input name="comp" value="${d.comp||""}"></div><div><label>Bairro</label><input name="bairro" required value="${d.bairro||""}"></div><div><label>Cidade</label><input name="cid" required value="${d.cid||""}"></div><div><label>Estado</label><input name="uf" required maxlength="2" value="${d.uf||""}"></div>
  <div class="full"><label>Método de entrega</label><div id="so3">${SH(d.cep||ld("ba_cep","0")||"0").map(o=>`<label class="opt"><input type="radio" name="sh" value="${o.id}" ${ship&&ship.id==o.id?"checked":""}><span style="flex:1">${o.n}<br><span class="mut">${o.d}</span></span><b>${R(o.v)}</b></label>`).join("")}</div></div><div class="full"><button type="button" class="btn o" data-go="1">Voltar</button> <button class="btn">Continuar</button></div></form>`;
 if(co.step==3)b=`<form id="f3"><p class="mut">Interface pronta para um gateway autorizado. Nenhum dado de cartão é coletado ou guardado neste site.</p>${[["pix","PIX"],["cc","Cartão de crédito"]].map(o=>`<label class="opt"><input type="radio" name="pg" value="${o[0]}" ${d.pg==o[0]?"checked":""}> ${o[1]}</label>`).join("")}<p class="mut">Ao conectar o gateway, o cliente será levado a um ambiente seguro para concluir o pagamento.</p><button type="button" class="btn o" data-go="2">Voltar</button> <button class="btn">Continuar</button></form>`;
 if(co.step==4)b=`<div class="box">${c.it.map(x=>`<div class="tot"><div><span>${x.q}× ${x.p.name}</span><span>${R(pp(x.p)*x.q)}</span></div></div>`).join("")}<div class="tot"><div><span>Descontos</span><span>−${R(c.disc+c.cup)}</span></div><div><span>Frete</span><span>${c.f?R(c.f):"Grátis"}</span></div><div class="f"><span>Total</span><span>${R(c.tot)}</span></div></div><p><b>Entrega:</b> ${d.rua}, ${d.num} — ${d.bairro}, ${d.cid}/${d.uf} · ${sh}</p><p><b>Pagamento:</b> ${{pix:"PIX",cc:"Cartão de crédito",cd:"Cartão de débito"}[d.pg]}</p>${hasAlc()?`<label><input type="checkbox" id="age" style="width:auto"> Declaro ter 18 anos ou mais.</label>`:""}</div><br><button class="btn o" data-go="3">Voltar</button> <button class="btn" id="conf">Confirmar pedido</button>`;
 if(co.step==5)b=`<div class="box" style="text-align:center"><div style="font-size:48px">✅</div><h2 style="margin:0">Pedido confirmado!</h2><p>Número do pedido: <b>${co.num}</b></p>${payBox()}<p>Enviaremos o acompanhamento do pedido para ${d.email} e WhatsApp ${d.zap}.</p><a class="btn" href="#inicio">Voltar à loja</a></div>`;
 return`<h2>Finalizar pedido</h2><div class="steps">${st.map((s,i)=>`<span class="${co.step==i+1?"on":""}">${i+1}. ${s}</span>`).join("")}</div>${b}`}
function bindCo(){const g=n=>$(n);
 $$("[data-go]").forEach(b=>b.onclick=()=>{co.step=+b.dataset.go;route()});
 const fd=f=>Object.fromEntries(new FormData(f));
 if(g("#f1"))g("#f1").onsubmit=e=>{e.preventDefault();const x=fd(e.target);if(!cpfOk(x.cpf))return toast("CPF inválido",1);Object.assign(co.d,x);co.step=2;route()};
 if(g("#f2")){const cp=g("#ccep");cp.onblur=async()=>{const j=await cepLookup(cp.value);if(j){const f=g("#f2");f.rua.value=j.logradouro;f.bairro.value=j.bairro;f.cid.value=j.localidade;f.uf.value=j.uf;toast("Endereço preenchido")}else toast("Preencha o endereço manualmente",1);sv("ba_cep",cp.value.replace(/\D/g,""))};
  g("#f2").onsubmit=e=>{e.preventDefault();const x=fd(e.target);const o=SH(x.cep.replace(/\D/g,"")||"0").find(s=>s.id==x.sh);if(!o)return toast("Escolha a entrega",1);ship=o;sv("ba_cep",x.cep.replace(/\D/g,""));ups();Object.assign(co.d,x);co.step=3;route()}}
 if(g("#f3"))g("#f3").onsubmit=e=>{e.preventDefault();const x=fd(e.target);if(!x.pg)return toast("Escolha o pagamento",1);co.d.pg=x.pg;co.step=4;route()};
 if(g("#conf"))g("#conf").onclick=()=>{if(g("#age")&&!g("#age").checked)return toast("Confirme que é maior de 18 anos",1);const c=calc(),n="BA"+Date.now().toString().slice(-8);const o=ld("ba_orders",[]);o.push({n,d:co.d,tot:c.tot,at:new Date().toISOString()});sv("ba_orders",o);co.num=n;co.tot=c.tot;cart={};cup=null;ups();co.step=5;route();toast("Pedido registrado")}}
/* rotas */
function route(){let v=location.hash.slice(1)||"inicio";if(!V[v])v="inicio";$("#app").innerHTML=V[v]();$$("nav a").forEach(a=>a.classList.toggle("on",a.hash=="#"+v));$("#nv").classList.remove("open");
 if(v=="produtos")fill();if(v=="checkout"){bindCo();pixUi()}if(v=="ofertas"){const t=setInterval(()=>{const e=$("#cd2");if(!e)return clearInterval(t);e.innerHTML=$("#cd").innerHTML},500)}
 if(v=="contato")$("#ct").onsubmit=e=>{e.preventDefault();e.target.reset();toast("Mensagem enviada! Retornaremos em breve.")};window.scrollTo(0,0)}
function fill(){const a=list();$("#cnt").textContent=a.length+" produto(s) encontrado(s)"+(S.q?` para “${S.q}”`:"");$("#pl").innerHTML=a.length?a.map(card).join(""):"<p>Nenhum produto encontrado. Tente limpar os filtros.</p>"}
addEventListener("hashchange",route);
document.addEventListener("click",e=>{const t=e.target.closest("button,.cat");if(!t)return;const D=t.dataset;
 if(D.a){const n=Math.max(1,+$("#n"+D.a).value||1),p=P.find(x=>x.id==D.a);cart[D.a]=Math.min((cart[D.a]||0)+n,p.stock);ups();toast("Adicionado ao carrinho")}
 if(D.f){const i=+D.f;favs=favs.includes(i)?favs.filter(x=>x!=i):[...favs,i];ups();t.textContent=favs.includes(i)?"♥":"♡"}
 if(D.c){S.cat=D.c;S.max=300;location.hash="produtos";route()}
 if(D.p){cart[D.p]=Math.min(cart[D.p]+1,P.find(x=>x.id==D.p).stock);ups();drawer()}
 if(D.m){cart[D.m]--;if(cart[D.m]<1)delete cart[D.m];ups();drawer()}
 if(D.r){delete cart[D.r];ups();drawer()}
 if(t.id=="x"||t.id=="cont")closeD();
 if(t.id=="ac"){const k=$("#cp").value.trim().toUpperCase(),c=CUP[k],s=calc().sub;if(!c||new Date(c.exp+"T23:59:59")<new Date())toast("Cupom inválido ou expirado",1);else if(s<c.min)toast("Valor mínimo do cupom: "+R(c.min),1);else{cup=k;ups();drawer();toast("Cupom aplicado")}}
 if(t.id=="bc"){const c=$("#cep").value.replace(/\D/g,"");if(c.length!=8)return toast("CEP inválido",1);sv("ba_cep",c);drawer();cepLookup(c).then(j=>j&&toast(j.localidade+"/"+j.uf))}
 if(t.id=="fin"){if(!ship)return toast("Calcule e escolha o frete",1);closeD();co={step:1,d:{}};location.hash="checkout";route()}
 if(t.id=="clr"){S={q:"",cat:"",max:300,promo:false,nov:false,best:false,av:false,sort:"rel"};route()}});
document.addEventListener("change",e=>{const t=e.target;if(t.name=="sh"&&t.closest("#dr")){ship=SH(ld("ba_cep","0")).find(o=>o.id==t.value);ups();drawer()}
 if(t.id=="fc2"){S.cat=t.value;fill()}if(t.id=="so"){S.sort=t.value;fill()}if(t.dataset.k){S[t.dataset.k]=t.checked;fill()}});
document.addEventListener("input",e=>{if(e.target.id=="fm"){S.max=+e.target.value;$("#mv").textContent=R(S.max);fill()}});
$("#sf").onsubmit=e=>{e.preventDefault();S.q=$("#q").value.trim();S.cat="";S.max=300;location.hash="produtos";route()};
$("#cb").onclick=openD;$("#ov").onclick=closeD;$("#ham").onclick=()=>$("#nv").classList.toggle("open");
$("#favb").onclick=()=>{S={...S,q:"",cat:""};toast(favs.length?"Favoritos: "+P.filter(p=>favs.includes(p.id)).map(p=>p.code).join(", "):"Você ainda não favoritou produtos")};
$("#acc").onclick=()=>toast("Área do cliente: requer backend (veja a lista de próximos passos)");
ups();route();
