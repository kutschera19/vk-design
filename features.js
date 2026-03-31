/* features.js â VK Design: Pedidos, Briefing & Entregas */
(function(){
'use strict';

// ââ Helpers âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function vkFmtDate(ts){
  if(!ts) return 'â';
  var d=ts.toDate?ts.toDate():new Date(ts);
  return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function vkFmtCurrency(v){
  return 'R$ '+(+v||0).toFixed(2).replace('.',',');
}
function vkFmtStatus(s){
  var m={pending:'â³ Pendente',paid:'ð³ Pago',in_progress:'ð¨ Em criaÃ§Ã£o',review:'ð RevisÃ£o',completed:'â ConcluÃ­do',failed:'â Falha'};
  return m[s]||s;
}
function vkUid(){
  return Date.now().toString(36)+Math.random().toString(36).slice(2);
}
function vkFileIcon(t){
  if(!t) return 'ð';
  if(t.startsWith('image')) return 'ð¼ï¸';
  if(t.includes('pdf')) return 'ð';
  if(t.includes('zip')||t.includes('rar')) return 'ðï¸';
  return 'ð';
}
function vkServices(arr){
  if(!arr||!arr.length) return 'â';
  return arr.map(function(s){return s.nome||s.name||s;}).join(', ');
}

// ââ Toast âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function vkToast(msg,type){
  type=type||'info';
  var t=document.getElementById('vkToast');
  if(!t){t=document.createElement('div');t.id='vkToast';document.body.appendChild(t);}
  t.className='vk-toast vk-toast--'+type;
  t.textContent=msg;
  t.style.display='block';
  clearTimeout(t._to);
  t._to=setTimeout(function(){t.style.display='none';},3200);
}

// ââ Modal helpers âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function vkShowModal(id){var m=document.getElementById(id);if(m)m.style.display='flex';}
function vkCloseModal(id){var m=document.getElementById(id);if(m)m.style.display='none';}

// ââ Admin: render orders table ââââââââââââââââââââââââââââââââââââââââââââââââ
function renderAdminOrders(filter){
  filter=filter||'all';
  window.currentAdminFilter=filter;
  var tbody=document.getElementById('allOrdersBody');
  if(!tbody) return;
  var orders=(window.DB&&DB.orders)||[];
  if(filter!=='all') orders=orders.filter(function(o){return o.status===filter;});
  if(!orders.length){
    tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:#666;padding:2rem">Nenhum pedido encontrado</td></tr>';
    return;
  }
  tbody.innerHTML=orders.map(function(o){
    return '<tr onclick="vkOpenOrder(\''+o.id+'\')" style="cursor:pointer">'+
      '<td>'+o.id.slice(-6).toUpperCase()+'</td>'+
      '<td>'+(o.user_name||o.customer_name||'â')+'</td>'+
      '<td>'+vkServices(o.services)+'</td>'+
      '<td>'+vkFmtCurrency(o.total_price)+'</td>'+
      '<td><span class="status-badge status-'+o.status+'">'+vkFmtStatus(o.status)+'</span></td>'+
      '<td>'+vkFmtDate(o.created_at)+'</td>'+
    '</tr>';
  }).join('');
}

window.filtrarPedidos=function(filter){
  renderAdminOrders(filter);
  document.querySelectorAll('.tab-btn').forEach(function(b){
    b.classList.toggle('active',b.dataset.filter===filter);
  });
};

// ââ Admin: order detail modal âââââââââââââââââââââââââââââââââââââââââââââââââ
window.vkOpenOrder=function(orderId){
  var orders=(window.DB&&DB.orders)||[];
  var o=orders.find(function(x){return x.id===orderId;});
  if(!o) return;
  var deliveries=(window.DB&&DB.deliveries)||[];
  var myFiles=deliveries.filter(function(d){return d.order_id===orderId;});
  var bf=o.briefing||{};
  var bfHtml=Object.keys(bf).length?(
    '<div class="vk-section-title">ð Briefing</div>'+
    (bf.nome_projeto?'<p><b>Projeto:</b> '+bf.nome_projeto+'</p>':'')+
    (bf.segmento?'<p><b>Segmento:</b> '+bf.segmento+'</p>':'')+
    (bf.publico_alvo?'<p><b>PÃºblico:</b> '+bf.publico_alvo+'</p>':'')+
    (bf.mensagem?'<p><b>Mensagem:</b> '+bf.mensagem+'</p>':'')+
    (bf.objetivo?'<p><b>Objetivo:</b> '+bf.objetivo+'</p>':'')+
    (bf.referencias?'<p><b>Refs:</b> '+bf.referencias+'</p>':'')+
    (bf.cores?'<p><b>Cores:</b> '+bf.cores+'</p>':'')+
    (bf.tipografia?'<p><b>Tipografia:</b> '+bf.tipografia+'</p>':'')+
    (bf.estilo?'<p><b>Estilo:</b> '+bf.estilo+'</p>':'')+
    (bf.observacoes?'<p><b>Obs:</b> '+bf.observacoes+'</p>':'')
  ):'<p style="color:#888">Briefing nÃ£o preenchido ainda.</p>';
  var filesHtml=myFiles.length?myFiles.map(function(f){
    return '<div class="vk-file-row"><span>'+vkFileIcon(f.file_type)+' '+f.file_name+'</span>'+
      '<a href="'+f.file_url+'" target="_blank" class="btn-small">â¬ Download</a></div>';
  }).join(''):'<p style="color:#888">Nenhum arquivo entregue ainda.</p>';
  var canStart=o.status==='paid';
  var canFinish=o.status==='in_progress'||o.status==='review';
  document.getElementById('vkModalTitle').textContent='Pedido #'+o.id.slice(-6).toUpperCase();
  document.getElementById('vkModalBody').innerHTML=
    '<p><b>Cliente:</b> '+(o.user_name||o.customer_name||'â')+'</p>'+
    '<p><b>Email:</b> '+(o.user_email||o.customer_email||'â')+'</p>'+
    '<p><b>ServiÃ§os:</b> '+vkServices(o.services)+'</p>'+
    '<p><b>Total:</b> '+vkFmtCurrency(o.total_price)+'</p>'+
    '<p><b>Status:</b> <span class="status-badge status-'+o.status+'">'+vkFmtStatus(o.status)+'</span></p>'+
    '<p><b>Criado em:</b> '+vkFmtDate(o.created_at)+'</p>'+
    '<hr style="border-color:#333;margin:1rem 0">'+
    bfHtml+
    '<hr style="border-color:#333;margin:1rem 0">'+
    '<div class="vk-section-title">ð¦ Arquivos Entregues</div>'+
    filesHtml+
    '<div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">'+
    (canStart?'<button class="btn-vk" onclick="vkChangeStatus(\''+o.id+'\',\'in_progress\')">ð Iniciar Projeto</button>':'')+
    (canFinish?'<button class="btn-vk btn-green" onclick="vkChangeStatus(\''+o.id+'\',\'completed\')">â Finalizar</button>':'')+
    '<button class="btn-vk btn-outline" onclick="vkOpenUpload(\''+o.id+'\')">ð¤ Enviar Arquivo</button>'+
    '<button class="btn-vk btn-ghost" onclick="vkCloseModal(\'vkOrderModal\')">Fechar</button>'+
    '</div>';
  vkShowModal('vkOrderModal');
};

window.vkChangeStatus=function(orderId,newStatus){
  if(!window.db||!window.SUPABASE_READY){vkToast('Firebase nÃ£o conectado','error');return;}
  db.collection('orders').doc(orderId).update({
    status:newStatus,
    updated_at:firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(){
    var o=(DB.orders||[]).find(function(x){return x.id===orderId;});
    if(o) o.status=newStatus;
    vkToast('Status atualizado!','success');
    vkCloseModal('vkOrderModal');
    renderAdminOrders(window.currentAdminFilter||'all');
  }).catch(function(e){vkToast('Erro: '+e.message,'error');});
};

// ââ Admin: file upload ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
var _uploadOrderId=null;
window.vkOpenUpload=function(orderId){
  _uploadOrderId=orderId;
  var u=document.getElementById('vkUploadUrl');
  var n=document.getElementById('vkUploadName');
  if(u)u.value='';if(n)n.value='';
  vkShowModal('vkUploadModal');
};

window.vkHandleUpload=function(){
  var url=(document.getElementById('vkUploadUrl')||{}).value||'';
  var name=(document.getElementById('vkUploadName')||{}).value||'';
  url=url.trim();name=name.trim();
  if(!url){vkToast('Cole o link do arquivo','warning');return;}
  if(!name)name=url.split('/').pop()||'arquivo';
  if(!window.db||!SUPABASE_READY){vkToast('Firebase nao conectado','error');return;}
  var uid=(window.session&&session.user)?session.user.uid:'admin';
  var delivery={id:vkUid(),order_id:_uploadOrderId,user_id:uid,file_url:url,file_path:url,file_name:name,file_type:'link',file_size:0,version:1,created_at:firebase.firestore.FieldValue.serverTimestamp()};
  db.collection('deliveries').doc(delivery.id).set(delivery).then(function(){
    if(!DB.deliveries)DB.deliveries=[];
    DB.deliveries.push(delivery);
    vkToast('Link salvo!','success');
    vkCloseModal('vkUploadModal');
    vkOpenOrder(_uploadOrderId);
  }).catch(function(e){vkToast('Erro: '+e.message,'error');});
};

// ââ Client: render orders âââââââââââââââââââââââââââââââââââââââââââââââââââââ
function renderClientOrders(){
  var grid=document.getElementById('clienteOrdersGrid');
  if(!grid) return;
  var uid=window.session&&session.user?session.user.uid:null;
  var orders=(DB.orders||[]).filter(function(o){return !uid||o.user_id===uid;});
  if(!orders.length){
    grid.innerHTML='<div class="empty-state"><p>VocÃª ainda nÃ£o possui pedidos.</p></div>';
    return;
  }
  var deliveries=DB.deliveries||[];
  grid.innerHTML=orders.map(function(o){
    var myFiles=deliveries.filter(function(d){return d.order_id===o.id;});
    var filesHtml=(myFiles.length&&o.status==='completed')?(
      '<div class="order-files"><h4>ð¦ Arquivos disponÃ­veis</h4>'+
      myFiles.map(function(f){
        return '<a href="'+f.file_url+'" target="_blank" class="btn-download">'+vkFileIcon(f.file_type)+' '+f.file_name+'</a>';
      }).join('')+'</div>'
    ):'';
    var bf=o.briefing||{};
    var bfBtn=(o.status==='paid'&&!bf.nome_projeto)?
      '<button class="btn-vk" style="margin-top:.75rem" onclick="vkStartBriefing(\''+o.id+'\')">ð Preencher Briefing</button>':'';
    return '<div class="order-card">'+
      '<div class="order-card-header">'+
        '<span class="order-id">#'+o.id.slice(-6).toUpperCase()+'</span>'+
        '<span class="status-badge status-'+o.status+'">'+vkFmtStatus(o.status)+'</span>'+
      '</div>'+
      '<p class="order-services">'+vkServices(o.services)+'</p>'+
      '<p class="order-price">'+vkFmtCurrency(o.total_price)+'</p>'+
      '<p class="order-date">'+vkFmtDate(o.created_at)+'</p>'+
      filesHtml+bfBtn+
    '</div>';
  }).join('');
}

// ââ Briefing multi-step âââââââââââââââââââââââââââââââââââââââââââââââââââââââ
var BF={step:0,orderId:null,data:{}};
var BF_STEPS=[
  {id:'projeto',title:'1. Projeto',fields:[
    {name:'nome_projeto',label:'Nome do projeto',type:'text',ph:'Ex: Marca pessoal Vitor K'},
    {name:'segmento',label:'Segmento / Nicho',type:'text',ph:'Ex: Moda, Tecnologia, SaÃºde'},
    {name:'publico_alvo',label:'PÃºblico-alvo',type:'textarea',ph:'Descreva quem Ã© o seu cliente ideal'}
  ]},
  {id:'objetivo',title:'2. Objetivo',fields:[
    {name:'mensagem',label:'Mensagem principal',type:'textarea',ph:'O que vocÃª quer comunicar?'},
    {name:'objetivo',label:'Objetivo do projeto',type:'text',ph:'Ex: Aumentar autoridade, lanÃ§ar produto'}
  ]},
  {id:'referencias',title:'3. ReferÃªncias',fields:[
    {name:'referencias',label:'Links de referÃªncia',type:'textarea',ph:'Cole links de marcas ou trabalhos que admira'},
    {name:'nao_gosta',label:'O que vocÃ  NÃO quer',type:'textarea',ph:'Estilos, cores ou elementos a evitar'}
  ]},
  {id:'visual',title:'4. Visual',fields:[
    {name:'cores',label:'Cores preferidas',type:'text',ph:'Ex: Preto, dourado, branco'},
    {name:'tipografia',label:'Tipografia',type:'text',ph:'Ex: Moderna, serifada, manuscrita'},
    {name:'estilo',label:'Estilo visual',type:'text',ph:'Ex: Minimalista, luxo, urbano'},
    {name:'observacoes',label:'ObservaÃ§Ãµes extras',type:'textarea',ph:'Qualquer informaÃ§Ã£o adicional importante'}
  ]},
  {id:'revisao',title:'5. RevisÃ£o',fields:[]}
];

window.vkStartBriefing=function(orderId){
  BF.orderId=orderId||BF.orderId;
  BF.step=0;
  BF.data={};
  if(typeof mostrarTela==='function') mostrarTela('pageBriefing');
  vkRenderBriefingStep();
};

function vkRenderBriefingStep(){
  var container=document.getElementById('briefingStepsContainer');
  if(!container) return;
  var total=BF_STEPS.length;
  var s=BF_STEPS[BF.step];
  if(s.id==='revisao'){vkRenderBriefingReview(container);return;}
  var progress=((BF.step)/(total-1)*100).toFixed(0);
  var dotsHtml=BF_STEPS.map(function(_,i){
    return '<div class="bf-dot '+(i===BF.step?'active':i<BF.step?'done':'')+'"></div>';
  }).join('');
  container.innerHTML=
    '<div class="bf-progress-bar"><div class="bf-progress-fill" style="width:'+progress+'%"></div></div>'+
    '<div class="bf-dots">'+dotsHtml+'</div>'+
    '<h2 class="bf-step-title">'+s.title+'</h2>'+
    '<div class="bf-fields">'+
    s.fields.map(function(f){
      var inp=f.type==='textarea'
        ?'<textarea id="bf_'+f.name+'" class="bf-input bf-textarea" placeholder="'+f.ph+'">'+(BF.data[f.name]||'')+'</textarea>'
        :'<input id="bf_'+f.name+'" class="bf-input" type="text" placeholder="'+f.ph+'" value="'+(BF.data[f.name]||'')+'">';
      return '<div class="bf-field"><label class="bf-label">'+f.label+'</label>'+inp+'</div>';
    }).join('')+
    '</div>'+
    '<div class="bf-nav">'+
    (BF.step>0?'<button class="btn-vk btn-ghost" onclick="vkBfPrev()">â Anterior</button>':'<div></div>')+
    '<button class="btn-vk" onclick="vkBfNext()">PrÃ³ximo â</button>'+
    '</div>';
}

function vkSaveBriefingStep(){
  var s=BF_STEPS[BF.step];
  s.fields.forEach(function(f){
    var el=document.getElementById('bf_'+f.name);
    if(el) BF.data[f.name]=el.value.trim();
  });
}

window.vkBfNext=function(){
  vkSaveBriefingStep();
  if(BF.step<BF_STEPS.length-1){BF.step++;vkRenderBriefingStep();}
};
window.vkBfPrev=function(){
  vkSaveBriefingStep();
  if(BF.step>0){BF.step--;vkRenderBriefingStep();}
};

function vkRenderBriefingReview(container){
  var d=BF.data;
  var items=Object.keys(d).filter(function(k){return d[k];}).map(function(k){
    return '<div class="bf-review-item">'+
      '<span class="bf-review-key">'+k.replace(/_/g,' ')+'</span>'+
      '<span class="bf-review-val">'+d[k]+'</span></div>';
  }).join('');
  container.innerHTML=
    '<h2 class="bf-step-title">â RevisÃ£o Final</h2>'+
    '<div class="bf-review-grid">'+items+'</div>'+
    '<div class="bf-nav">'+
    '<button class="btn-vk btn-ghost" onclick="vkBfPrev()">â Editar</button>'+
    '<button class="btn-vk btn-gold" onclick="vkSubmitBriefing()">Enviar Briefing â¨</button>'+
    '</div>';
}

window.vkSubmitBriefing=function(){
  if(!window.db||!SUPABASE_READY){vkToast('Firebase nÃ£o conectado','error');return;}
  if(!BF.orderId){vkToast('Pedido nÃ£o identificado','error');return;}
  db.collection('orders').doc(BF.orderId).update({
    briefing:BF.data,
    updated_at:firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(){
    var o=(DB.orders||[]).find(function(x){return x.id===BF.orderId;});
    if(o) o.briefing=BF.data;
    vkToast('Briefing enviado! ð','success');
    if(typeof mostrarTela==='function') mostrarTela('pageCliente');
    renderClientOrders();
  }).catch(function(e){vkToast('Erro: '+e.message,'error');});
};

// ââ Load deliveries âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
window.loadDeliveries=function(){
  if(!window.db||!window.SUPABASE_READY) return;
  db.collection('deliveries').orderBy('created_at','desc').get().then(function(snap){
    DB.deliveries=snap.docs.map(function(d){return Object.assign({id:d.id},d.data());});
    renderClientOrders();
  });
};

// ââ Patch loadOrders to also refresh UI ââââââââââââââââââââââââââââââââââââââ
var _origLoadOrders=window.loadOrders;
window.loadOrders=function(){
  if(typeof _origLoadOrders==='function') _origLoadOrders();
  setTimeout(function(){
    renderAdminOrders(window.currentAdminFilter||'all');
    renderClientOrders();
  },900);
};

// ââ CSS injection âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
(function injectCSS(){
  var css=
'.vk-toast{position:fixed;bottom:2rem;right:2rem;z-index:9999;padding:.75rem 1.5rem;border-radius:8px;font-size:.9rem;font-weight:600;display:none;max-width:320px}'+
'.vk-toast--success{background:#1a472a;color:#4ade80;border:1px solid #22c55e}'+
'.vk-toast--error{background:#450a0a;color:#f87171;border:1px solid #ef4444}'+
'.vk-toast--warning{background:#451a03;color:#fb923c;border:1px solid #f97316}'+
'.vk-toast--info{background:#1e3a5f;color:#60a5fa;border:1px solid #3b82f6}'+
'.status-badge{display:inline-block;padding:.2rem .6rem;border-radius:4px;font-size:.78rem;font-weight:600}'+
'.status-pending{background:#2a2100;color:#fbbf24}'+
'.status-paid{background:#0a2a1f;color:#34d399}'+
'.status-in_progress{background:#1a1f3d;color:#818cf8}'+
'.status-review{background:#1f1a3d;color:#c084fc}'+
'.status-completed{background:#0a2a0a;color:#4ade80}'+
'.status-failed{background:#2a0a0a;color:#f87171}'+
'.vk-modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:8000;align-items:center;justify-content:center;padding:1rem}'+
'.vk-modal{background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:2rem;max-width:640px;width:100%;max-height:82vh;overflow-y:auto}'+
'.vk-modal h3{margin:0 0 1.5rem;font-size:1.25rem;color:#f5f5f5}'+
'.vk-section-title{font-weight:700;color:#d4af37;margin:1rem 0 .5rem;font-size:.82rem;text-transform:uppercase;letter-spacing:.05em}'+
'.vk-file-row{display:flex;align-items:center;justify-content:space-between;padding:.5rem;background:#1a1a1a;border-radius:6px;margin:.3rem 0}'+
'.btn-vk{padding:.6rem 1.2rem;border-radius:6px;border:none;cursor:pointer;font-weight:600;font-size:.85rem;background:#d4af37;color:#000;transition:.2s}'+
'.btn-vk:hover{background:#f0cc60}'+
'.btn-vk.btn-green{background:#16a34a;color:#fff}'+
'.btn-vk.btn-gold{background:#d4af37;color:#000}'+
'.btn-vk.btn-outline{background:transparent;border:1px solid #d4af37;color:#d4af37}'+
'.btn-vk.btn-ghost{background:transparent;border:1px solid #444;color:#aaa}'+
'.btn-small{padding:.3rem .8rem;border-radius:4px;background:#d4af37;color:#000;font-size:.75rem;font-weight:600;text-decoration:none;cursor:pointer;border:none}'+
'.btn-download{display:inline-block;margin:.25rem;padding:.4rem .9rem;background:#0a2010;color:#4ade80;border:1px solid #22c55e;border-radius:6px;text-decoration:none;font-size:.82rem}'+
'.order-card{background:#111;border:1px solid #222;border-radius:10px;padding:1.25rem;transition:.2s}'+
'.order-card:hover{border-color:#d4af37}'+
'.order-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem}'+
'.order-id{font-weight:700;color:#d4af37;font-size:.85rem}'+
'.order-services{color:#ccc;font-size:.9rem;margin:.25rem 0}'+
'.order-price{font-weight:700;font-size:1.1rem;color:#f5f5f5;margin:.25rem 0}'+
'.order-date{color:#666;font-size:.78rem}'+
'.order-files{margin-top:.75rem;padding-top:.75rem;border-top:1px solid #222}'+
'.order-files h4{font-size:.82rem;color:#aaa;margin:0 0 .5rem;font-weight:600}'+
'.bf-progress-bar{height:4px;background:#222;border-radius:2px;margin-bottom:1.5rem}'+
'.bf-progress-fill{height:100%;background:#d4af37;border-radius:2px;transition:width .4s}'+
'.bf-dots{display:flex;gap:.5rem;justify-content:center;margin-bottom:2rem}'+
'.bf-dot{width:10px;height:10px;border-radius:50%;background:#333;transition:.2s}'+
'.bf-dot.active{background:#d4af37;transform:scale(1.3)}'+
'.bf-dot.done{background:#65451f}'+
'.bf-step-title{font-size:1.3rem;font-weight:700;color:#f5f5f5;margin:0 0 1.5rem}'+
'.bf-field{margin-bottom:1.25rem}'+
'.bf-label{display:block;font-size:.78rem;color:#aaa;font-weight:600;margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.04em}'+
'.bf-input{width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:.75rem;color:#f5f5f5;font-size:.95rem;outline:none;box-sizing:border-box;transition:.2s}'+
'.bf-input:focus{border-color:#d4af37}'+
'.bf-textarea{min-height:100px;resize:vertical;font-family:inherit}'+
'.bf-nav{display:flex;justify-content:space-between;margin-top:2rem;padding-top:1rem;border-top:1px solid #222}'+
'.bf-review-grid{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem}'+
'.bf-review-item{display:flex;gap:1rem;background:#1a1a1a;border-radius:6px;padding:.6rem .9rem}'+
'.bf-review-key{color:#888;font-size:.78rem;text-transform:capitalize;min-width:120px;font-weight:600}'+
'.bf-review-val{color:#f5f5f5;font-size:.88rem}'+
'progress#vkUploadProgress{width:100%;height:8px;border-radius:4px;margin-top:.75rem;accent-color:#d4af37}';
  var el=document.createElement('style');
  el.id='vkFeatureCSS';
  el.textContent=css;
  document.head.appendChild(el);
})();

// ââ Expose globals ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
window.renderAdminOrders=renderAdminOrders;
window.renderClientOrders=renderClientOrders;
window.vkToast=vkToast;
window.vkShowModal=vkShowModal;
window.vkCloseModal=vkCloseModal;

})();
