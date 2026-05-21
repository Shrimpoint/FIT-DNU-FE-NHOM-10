// --- Data SDK Implementation for MockAPI ---
    (function() {
      // !!! QUAN TRỌNG: Thay thế URL này bằng URL MockAPI endpoint của bạn !!!
      const MOCK_API_ENDPOINT = 'https://69fc3760fce564e2591778d9.mockapi.io/api/v1/ArtWorks';
      let dataChangeCallback = null;

      async function fetchData() {
        try {
          const data = await $.ajax({
            url: MOCK_API_ENDPOINT,
            method: 'GET',
            dataType: 'json'
          });
          // Ánh xạ các trường từ MockAPI schema sang cấu trúc dữ liệu nội bộ của ứng dụng
          const formattedData = data.map(item => ({
            __backendId: item.id,
            title: item.ArtWorksName,
            artist: item.Author,
            style: item.Categories,
            description: item.Description,
            created_at: item.PostingDate,
            resolution: item.Resolution, // Trường mới
            likes: item.likes || 0, // Giả định MockAPI có trường likes
            status: item.status || 'pending', // Giả định MockAPI có trường status
            imageSrc: item.imageSrc || '', // Giả định MockAPI có trường imageSrc
            color1: item.color1, color2: item.color2, color3: item.color3, pattern: item.pattern // Giả định MockAPI có các trường này
          }));
          if (dataChangeCallback) {
            dataChangeCallback(formattedData);
          }
        } catch (error) {
          console.error('Data SDK Error (fetchData):', error.statusText || error);
          // Bạn có thể hiển thị lỗi ra giao diện tại đây nếu cần
        }
      }

      window.dataSdk = {
        init: function(handler) {
          dataChangeCallback = handler.onDataChanged;
          fetchData(); // Tải dữ liệu ban đầu
          return Promise.resolve({ isOk: true });
        },

        create: async function(artworkData) {
          try {
            const { __backendId, ...internalPayload } = artworkData;
            // Ánh xạ cấu trúc dữ liệu nội bộ sang MockAPI schema
            const payload = {
                ArtWorksName: internalPayload.title,
                Author: internalPayload.artist,
                Categories: internalPayload.style,
                Description: internalPayload.description,
                PostingDate: internalPayload.created_at,
                Resolution: internalPayload.resolution, // Trường mới
                likes: internalPayload.likes,
                status: internalPayload.status,
                imageSrc: internalPayload.imageSrc,
                color1: internalPayload.color1, color2: internalPayload.color2, color3: internalPayload.color3, pattern: internalPayload.pattern
            };
            await $.ajax({
              url: MOCK_API_ENDPOINT,
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(payload)
            });
            await fetchData(); // Tải lại dữ liệu sau khi tạo mới
            return { isOk: true };
          } catch (error) { console.error('Data SDK Error (create):', error.statusText || error); return { isOk: false, error }; }
        },

        update: async function(artworkData) {
          try { // Sửa lỗi: Ánh xạ dữ liệu từ cấu trúc nội bộ sang API schema trước khi gửi
            const { __backendId, ...internalPayload } = artworkData;
            if (!__backendId) throw new Error('Missing ID for update');
            const payload = {
                ArtWorksName: internalPayload.title,
                Author: internalPayload.artist,
                Categories: internalPayload.style,
                Description: internalPayload.description,
                PostingDate: internalPayload.created_at,
                Resolution: internalPayload.resolution,
                likes: internalPayload.likes,
                status: internalPayload.status,
                imageSrc: internalPayload.imageSrc,
                color1: internalPayload.color1, color2: internalPayload.color2, color3: internalPayload.color3, pattern: internalPayload.pattern
            };
            await $.ajax({ url: `${MOCK_API_ENDPOINT}/${__backendId}`, method: 'PUT', contentType: 'application/json', data: JSON.stringify(payload) });
            await fetchData(); // Tải lại dữ liệu sau khi cập nhật
            return { isOk: true };
          } catch (error) { console.error('Data SDK Error (update):', error.statusText || error); return { isOk: false, error }; }
        },

        delete: async function(artworkData) {
          try {
            const { __backendId } = artworkData;
            if (!__backendId) throw new Error('Missing ID for delete');
            await $.ajax({ url: `${MOCK_API_ENDPOINT}/${__backendId}`, method: 'DELETE' });
            await fetchData(); // Tải lại dữ liệu sau khi xóa
            return { isOk: true };
          } catch (error) { console.error('Data SDK Error (delete):', error.statusText || error); return { isOk: false, error }; }
        }
      };
    })();
// State
let allArtworks = [];
let currentFilter = 'all';
let currentView = 'public';
let currentSection = 'dashboard';
let editingArt = null;
let deleteConfirmId = null;
let likedSet = new Set(JSON.parse(localStorage.getItem('liked_arts') || '[]'));

const STYLES = ['Trừu tượng','Ấn tượng','Tối giản','Siêu thực'];
const STYLE_COLORS = {'Trừu tượng':'#6c5ce7','Ấn tượng':'#00b894','Tối giản':'#636e72','Siêu thực':'#e17055'};
const PALETTES = [
  ['#6c5ce7','#a29bfe','#dfe6e9'],['#00b894','#55efc4','#ffeaa7'],
  ['#e17055','#fab1a0','#ffeaa7'],['#0984e3','#74b9ff','#dfe6e9'],
  ['#fdcb6e','#e17055','#6c5ce7'],['#ff7675','#fd79a8','#a29bfe'],
  ['#00cec9','#81ecec','#dfe6e9'],['#e84393','#fd79a8','#ffeaa7']
];
const PATTERNS = ['circles','waves','blocks','diagonal','dots'];

function randomPalette(){ return PALETTES[Math.floor(Math.random()*PALETTES.length)]; }
function randomPattern(){ return PATTERNS[Math.floor(Math.random()*PATTERNS.length)]; }

// Generate abstract art SVG
function generateArtSVG(c1,c2,c3,pattern,seed){
  const h = 160 + (seed ? (seed.charCodeAt(0)%8)*20 : Math.random()*80);
  let shapes = '';
  const s = seed || '';
  const r = (i) => ((s.charCodeAt(i%s.length)||42)*17+i*31)%100;

  if(pattern==='circles'){
    for(let i=0;i<6;i++){
      const cx=r(i)*2.5, cy=r(i+3)*h/100, rad=20+r(i+7)*.6;
      const col=[c1,c2,c3][i%3];
      shapes+=`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${col}" opacity="${.3+r(i+1)/200}"/>`;
    }
  } else if(pattern==='waves'){
    for(let i=0;i<4;i++){
      const y1=r(i)*h/100, y2=r(i+2)*h/100;
      const col=[c1,c2,c3][i%3];
      shapes+=`<path d="M0 ${y1} Q62 ${y2} 125 ${y1} Q187 ${r(i+4)*h/100} 250 ${y1}" fill="none" stroke="${col}" stroke-width="${4+r(i+1)/15}" opacity="${.4+r(i+3)/250}"/>`;
    }
  } else if(pattern==='blocks'){
    for(let i=0;i<8;i++){
      const x=r(i)*2.2, y=r(i+2)*h/100, w=20+r(i+5)*.4, hh=20+r(i+7)*.4;
      const col=[c1,c2,c3][i%3];
      shapes+=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="4" fill="${col}" opacity="${.3+r(i+1)/200}"/>`;
    }
  } else if(pattern==='diagonal'){
    for(let i=0;i<5;i++){
      const x1=r(i)*2.5, y1=r(i+1)*h/100, x2=r(i+3)*2.5, y2=r(i+5)*h/100;
      const col=[c1,c2,c3][i%3];
      shapes+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${6+r(i+2)/12}" stroke-linecap="round" opacity="${.4+r(i)/250}"/>`;
    }
  } else {
    for(let i=0;i<12;i++){
      const cx=r(i)*2.5, cy=r(i+2)*h/100, rad=3+r(i+4)/20;
      const col=[c1,c2,c3][i%3];
      shapes+=`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${col}" opacity="${.5+r(i)/250}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 ${h}" style="width:100%;display:block;background:${c1}22"><rect width="250" height="${h}" fill="${c3}" opacity=".15"/>${shapes}</svg>`;
}

// Toast
function showToast(msg, type='success'){
  const icon = type === 'success' ? 'check-circle' : 'alert-circle';
  const $toast = $(`<div class="toast-msg ${type}"></div>`)
    .html(`<i data-lucide="${icon}" style="width:16px;height:16px"></i>${msg}`)
    .appendTo('#toastContainer');

  lucide.createIcons();
  $toast.delay(3000).fadeOut(300, function() {
    $(this).remove();
  });
}

// Render public gallery
function renderGallery(){
  const approved = allArtworks.filter(a=>a.status==='approved');
  const filtered = currentFilter==='all' ? approved : approved.filter(a=>a.style===currentFilter);
  const $grid = $('#masonryGrid');

  if(filtered.length===0){
    $grid.empty();
    $('#publicEmpty').show();
    return;
  }
  $('#publicEmpty').hide();

  const existingIds = new Set();
  $grid.children().each(function(){ existingIds.add($(this).data('id')); });
  const newIds = new Set(filtered.map(a=>a.__backendId));

  // Remove gone
  $grid.children().each(function(){
    if(!newIds.has($(this).data('id'))) $(this).remove();
  });

  filtered.forEach(art=>{
    const id = art.__backendId;
    let $card = $grid.find(`[data-id="${id}"]`);
    const liked = likedSet.has(id);
    
    let artDisplayHtml;
    if (art.imageSrc) {
      artDisplayHtml = `<img src="${esc(art.imageSrc)}" alt="${esc(art.title)}" style="width:100%; display:block; object-fit:cover; aspect-ratio: 3/4;">`;
    } else {
      artDisplayHtml = generateArtSVG(art.color1||'#6c5ce7',art.color2||'#a29bfe',art.color3||'#dfe6e9',art.pattern||'circles',art.title);
    }

    if($card.length){
      if($card.find('.art-thumb-inner').html() !== artDisplayHtml) $card.find('.art-thumb-inner').html(artDisplayHtml);
      $card.find('.like-count').text(art.likes||0);
      $card.find('.like-btn').toggleClass('liked',liked);
      if(liked) $card.find('.heart-icon').attr('fill','#e74c3c').attr('stroke','#e74c3c');
      else $card.find('.heart-icon').removeAttr('fill').attr('stroke','currentColor');
    } else {
      const html = `<div class="art-card" data-id="${id}" data-style="${art.style}">
        <div class="art-thumb"><div class="art-thumb-inner">${artDisplayHtml}</div></div>
        <div class="art-info">
          <h3>${esc(art.title)}</h3>
          <div class="art-artist">${esc(art.artist)}</div>
          <span class="art-style-tag" style="background:${STYLE_COLORS[art.style]||'#6c5ce7'}22;color:${STYLE_COLORS[art.style]||'#6c5ce7'}">${esc(art.style)}</span>
        </div>
        <div class="art-actions">
          <button class="like-btn ${liked?'liked':''}" data-id="${id}">
            <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" ${liked?'fill="#e74c3c" stroke="#e74c3c"':'fill="none" stroke="currentColor"'} stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="like-count">${art.likes||0}</span>
          </button>
        </div>
      </div>`;
      $grid.append(html);
    }
  });
}

function esc(s){ return $('<span>').text(s||'').html(); }

// Admin render
function renderAdmin(){
  const total = allArtworks.length;
  const approved = allArtworks.filter(a=>a.status==='approved');
  const pending = allArtworks.filter(a=>a.status==='pending');
  const totalLikes = allArtworks.reduce((s,a)=>s+(a.likes||0),0);

  $('#statTotal').text(total);
  $('#statApproved').text(approved.length);
  $('#statPending').text(pending.length);
  $('#statLikes').text(totalLikes);
  $('#pendingDot').toggle(pending.length>0);

  renderBarChart();
  renderDonut();
  renderTable();
  renderPending();
}

function renderBarChart(){
  const $bar = $('#barChart').empty();
  const styleLikes = {};
  STYLES.forEach(s=>styleLikes[s]=0);
  allArtworks.forEach(a=>{ if(styleLikes[a.style]!==undefined) styleLikes[a.style]+=(a.likes||0); });
  const max = Math.max(...Object.values(styleLikes),1);
  STYLES.forEach(s=>{
    const pct = (styleLikes[s]/max)*100;
    $bar.append(`<div class="bar-col"><div class="bar" style="height:${Math.max(pct,4)}%;background:${STYLE_COLORS[s]}"></div><div class="bar-label">${s.substring(0,4)}</div></div>`);
  });
}

function renderDonut(){
  const counts = {};
  STYLES.forEach(s=>counts[s]=0);
  allArtworks.forEach(a=>{ if(counts[a.style]!==undefined) counts[a.style]++; });
  const total = Math.max(allArtworks.length,1);
  let offset = 0;
  const $svg = $('#donutChart').empty();
  const $legend = $('#donutLegend').empty();
  const r=50, cx=60, cy=60, circ=2*Math.PI*r;

  STYLES.forEach(s=>{
    const pct = counts[s]/total;
    const dash = pct*circ;
    const gap = circ-dash;
    $svg.append(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STYLE_COLORS[s]}" stroke-width="16" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`);
    offset+=dash;
    $legend.append(`<div class="legend-item"><div class="legend-dot" style="background:${STYLE_COLORS[s]}"></div>${s}: ${counts[s]}</div>`);
  });
  if(allArtworks.length===0){
    $svg.append(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2a2735" stroke-width="16"/>`);
  }
}

function renderTable(){
  const $tbody = $('#artTableBody').empty();
  const arts = currentSection==='artworks' ? allArtworks : allArtworks.filter(a=>a.status==='pending');
  
  if(arts.length===0){
    if(currentSection==='artworks') $('#adminEmpty').show();
    return;
  }
  $('#adminEmpty').hide();

  arts.forEach(a=>{
    const id = a.__backendId;
    const statusCls = a.status==='approved'?'status-approved':a.status==='pending'?'status-pending':'status-rejected';
    const statusTxt = a.status==='approved'?'Đã duyệt':a.status==='pending'?'Chờ duyệt':'Từ chối';

    if(deleteConfirmId===id){
      $tbody.append(`<tr><td colspan="6"><div class="delete-confirm"><span>Xác nhận xóa "${esc(a.title)}"?</span><button class="btn-confirm-del" data-id="${id}">Xóa</button><button class="btn-cancel-del" data-id="${id}">Hủy</button></div></td></tr>`);
      $tbody.append(`<tr><td colspan="7"><div class="delete-confirm"><span>Xác nhận xóa "${esc(a.title)}"?</span><button class="btn-confirm-del" data-id="${id}">Xóa</button><button class="btn-cancel-del" data-id="${id}">Hủy</button></div></td></tr>`);
    } else {
      const resolutionDisplay = a.resolution ? `<span style="font-size:11px;color:#7a7390;margin-left:8px;">(${esc(a.resolution)})</span>` : '';
      $tbody.append(`<tr>
        <td style="font-weight:600">${esc(a.title)}</td>
        <td>${esc(a.artist)}</td>
        <td>${esc(a.resolution) || ''}</td>
        <td><span class="art-style-tag" style="background:${STYLE_COLORS[a.style]||'#6c5ce7'}22;color:${STYLE_COLORS[a.style]||'#6c5ce7'}">${esc(a.style)}</span></td>
        <td>${a.likes||0}</td>
        <td><span class="status-badge ${statusCls}">${statusTxt}</span></td>
        <td>
          <button class="action-btn edit-btn" data-id="${id}" title="Sửa"><i data-lucide="edit-2" style="width:15px;height:15px"></i></button>
          <button class="action-btn delete action-del" data-id="${id}" title="Xóa"><i data-lucide="trash-2" style="width:15px;height:15px"></i></button>
          ${a.status==='pending'?`<button class="action-btn approve-btn" data-id="${id}" title="Duyệt" style="color:#55efc4"><i data-lucide="check" style="width:15px;height:15px"></i></button>`:''}
        </td>
      </tr>`);
    }
  });
  lucide.createIcons();
}

function renderPending(){
  const pending = allArtworks.filter(a=>a.status==='pending');
  const $list = $('#pendingList').empty();
  if(pending.length===0){ $('#pendingEmpty').show(); return; }
  $('#pendingEmpty').hide();

  pending.forEach(a=>{
    let artDisplayHtml;
    if (a.imageSrc) {
      artDisplayHtml = `<img src="${esc(a.imageSrc)}" alt="${esc(a.title)}" style="width:100%; height:100%; display:block; object-fit: cover;">`;
    } else {
      artDisplayHtml = generateArtSVG(a.color1||'#6c5ce7',a.color2||'#a29bfe',a.color3||'#dfe6e9',a.pattern||'circles',a.title);
    }
    $list.append(`<div style="background:#1a1726;border:1px solid #2a2735;border-radius:14px;padding:16px;margin-bottom:12px;display:flex;gap:16px;align-items:center">
      <div style="width:80px; height: 60px; border-radius:10px;overflow:hidden;flex-shrink:0; background:#2a2735;">${artDisplayHtml}</div>
      <div style="flex:1">
        <div style="font-weight:600;color:#f0ece4;font-size:14px">${esc(a.title)}</div>
        <div style="color:#7a7390;font-size:12px;margin-top:2px">${esc(a.artist)} · ${esc(a.style)}</div>
      </div>
      <button class="btn-submit approve-btn" data-id="${a.__backendId}" style="padding:7px 14px;font-size:12px"><i data-lucide="check" style="width:14px;height:14px"></i> Duyệt</button>
      <button class="btn-cancel reject-btn" data-id="${a.__backendId}" style="padding:7px 14px;font-size:12px">Từ chối</button>
    </div>`);
  });
  lucide.createIcons();
}

// View switching
$(document).on('click','#viewToggle button',function(){
  const view = $(this).data('view');
  currentView = view;
  $('#viewToggle button').removeClass('active');
  $(this).addClass('active');
  
  if(view==='public'){
    $('#galleryView').show(); $('#adminView').hide();
    $('#topNav').removeClass('dark'); $('#navBrand').removeClass('dark');
    $('#viewToggle').removeClass('dark');
    $('.nav-link-btn').removeClass('dark').show();
    renderGallery();
  } else {
    $('#galleryView').hide(); $('#adminView').show();
    $('#topNav').addClass('dark'); $('#navBrand').addClass('dark');
    $('#viewToggle').addClass('dark');
    $('.nav-link-btn').addClass('dark').hide();
    renderAdmin();
  }
});

// Sidebar navigation
$(document).on('click','.sidebar-item',function(){
  currentSection = $(this).data('section');
  $('.sidebar-item').removeClass('active');
  $(this).addClass('active');
  $('#sectionDashboard,#sectionArtworks,#sectionPending').hide();
  if(currentSection==='dashboard') $('#sectionDashboard').show();
  else if(currentSection==='artworks'){ $('#sectionArtworks').show(); renderTable(); }
  else if(currentSection==='pending'){ $('#sectionPending').show(); renderPending(); }
});

// Filter
$(document).on('click','.filter-chip,.nav-link-btn',function(){
  const f = $(this).data('filter');
  if(!f) return;
  currentFilter = f;
  $('.filter-chip,.nav-link-btn').removeClass('active');
  $(`.filter-chip[data-filter="${f}"],.nav-link-btn[data-filter="${f}"]`).addClass('active');
  renderGallery();
});

// Like
$(document).on('click','.like-btn',async function(e){
  e.stopPropagation();
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  const $btn = $(this);
  $btn.prop('disabled',true);

  const wasLiked = likedSet.has(id);
  const newLikes = wasLiked ? Math.max((art.likes||0)-1,0) : (art.likes||0)+1;
  
  if(wasLiked) likedSet.delete(id); else likedSet.add(id);
  localStorage.setItem('liked_arts', JSON.stringify([...likedSet]));

  const res = await window.dataSdk.update({...art, likes: newLikes});
  $btn.prop('disabled',false);
  if(!res.isOk){ showToast('Lỗi khi thích','error'); if(wasLiked) likedSet.add(id); else likedSet.delete(id); localStorage.setItem('liked_arts',JSON.stringify([...likedSet])); }
});

// Detail modal
$(document).on('click','.art-card',function(e){
  if($(e.target).closest('.like-btn').length) return;
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  let artDisplayHtml;
  if (art.imageSrc) {
    artDisplayHtml = `<img src="${esc(art.imageSrc)}" alt="${esc(art.title)}" style="width:100%; display:block;">`;
  } else {
    artDisplayHtml = generateArtSVG(art.color1||'#6c5ce7',art.color2||'#a29bfe',art.color3||'#dfe6e9',art.pattern||'circles',art.title);
  }
  $('#detailArtDisplay').html(`<div class="art-thumb-inner" style="min-height:200px; background:#f0f0f0;">${artDisplayHtml}</div>`);
  $('#detailTitle').text(art.title);
  $('#detailArtist').text(art.artist);
  $('#detailStyleTag').html(`<span class="art-style-tag" style="background:${STYLE_COLORS[art.style]||'#6c5ce7'}22;color:${STYLE_COLORS[art.style]||'#6c5ce7'}">${esc(art.style)}</span>`);
  $('#detailResolution').text(art.resolution ? `Độ phân giải: ${esc(art.resolution)}` : '');
  $('#detailDesc').text(art.description||'Không có mô tả.');
  $('#detailLikeCount').text(art.likes||0);
  $('#detailLikeBtn').toggleClass('liked',likedSet.has(id)).data('id',id);
  $('#detailModal').addClass('show');
});

$(document).on('click','#detailLikeBtn',async function(){
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  $(this).prop('disabled',true);
  const wasLiked = likedSet.has(id);
  const newLikes = wasLiked ? Math.max((art.likes||0)-1,0) : (art.likes||0)+1;
  if(wasLiked) likedSet.delete(id); else likedSet.add(id);
  localStorage.setItem('liked_arts',JSON.stringify([...likedSet]));
  const res = await window.dataSdk.update({...art, likes: newLikes});
  $(this).prop('disabled',false);
  if(res.isOk){ $('#detailLikeCount').text(newLikes); $(this).toggleClass('liked',!wasLiked); }
  else { showToast('Lỗi','error'); if(wasLiked) likedSet.add(id); else likedSet.delete(id); localStorage.setItem('liked_arts',JSON.stringify([...likedSet])); }
});

$('#btnCloseDetail').on('click',()=>$('#detailModal').removeClass('show'));
$('#detailModal').on('click',function(e){ if(e.target===this) $(this).removeClass('show'); });

// Add/Edit modal
$('#btnAddArt').on('click',()=>{
  editingArt = null;
  $('#modalTitle').text('Thêm tác phẩm mới');
  $('#artForm')[0].reset();
  $('#artModal').addClass('show');
});

$('#btnCancelModal').on('click',()=>$('#artModal').removeClass('show'));
$('#artModal').on('click',function(e){ if(e.target===this) $(this).removeClass('show'); });

// Nút Tự động thêm vào MockAPI
$('#btnAutoAddArt').on('click', async function() {
  const $btn = $(this);
  $btn.prop('disabled', true).html('<span class="spinner"></span>');

  if (allArtworks.length >= 999) { 
    showToast('Đã đạt giới hạn 999 tác phẩm', 'error'); 
    $btn.prop('disabled', false).html('<i data-lucide="zap" style="width:14px;height:14px"></i> Tự động thêm');
    lucide.createIcons();
    return; 
  }

  const randomPal = randomPalette();
  const newArtData = {
    title: 'Tác phẩm tự động ' + Math.floor(Math.random() * 10000),
    artist: 'Họa sĩ ảo ' + Math.floor(Math.random() * 100),
    style: STYLES[Math.floor(Math.random() * STYLES.length)],
    description: 'Tác phẩm này được tạo ngẫu nhiên để kiểm thử tính năng hiển thị.',
    imageSrc: '',
    resolution: '1920x1080',
    likes: Math.floor(Math.random() * 200),
    status: 'pending', // Bạn có thể đổi sang 'approved' nếu muốn hiển thị luôn
    created_at: new Date().toISOString(),
    color1: randomPal[0], color2: randomPal[1], color3: randomPal[2], pattern: randomPattern()
  };

  const res = await window.dataSdk.create(newArtData);
  
  $btn.prop('disabled', false).html('<i data-lucide="zap" style="width:14px;height:14px"></i> Tự động thêm');
  lucide.createIcons();
  
  if (res.isOk) showToast('Đã tự động tạo và thêm tác phẩm thành công!');
  else showToast('Lỗi khi tự động thêm', 'error');
});

// Edit
$(document).on('click','.edit-btn',function(){
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  editingArt = art;
  $('#modalTitle').text('Chỉnh sửa tác phẩm');
  $('#fTitle').val(art.title);
  $('#fArtist').val(art.artist);
  $('#fStyle').val(art.style);
  $('#fDesc').val(art.description||'');
  $('#fResolution').val(art.resolution||'');
  $('#fImageSrc').val(art.imageSrc||'');
  $('#artModal').addClass('show');
});

// Submit form
$('#artForm').on('submit', async function(e){
  e.preventDefault();
  const $btn = $('#btnSubmitArt');
  $btn.prop('disabled',true).html('<span class="spinner"></span>');
  
  const data = {
    title: $('#fTitle').val().trim(),
    artist: $('#fArtist').val().trim(),
    style: $('#fStyle').val(),
    description: $('#fDesc').val().trim(),
    imageSrc: $('#fImageSrc').val().trim(),
    resolution: $('#fResolution').val().trim() // Lấy giá trị độ phân giải
  };

  if(editingArt){
    const res = await window.dataSdk.update({...editingArt, ...data});
    $btn.prop('disabled',false).text('Lưu');
    if(res.isOk){ showToast('Đã cập nhật!'); $('#artModal').removeClass('show'); }
    else showToast('Lỗi cập nhật','error');
  } else {
    if(allArtworks.length>=999){ showToast('Đã đạt giới hạn 999 tác phẩm','error'); $btn.prop('disabled',false).text('Lưu'); return; }
    let newArtData = {
        ...data,
        likes: 0,
        status: 'pending',
        created_at: new Date().toISOString()
    };
    // Chỉ tạo art-gen nếu không có link ảnh
    if (!data.imageSrc) {
        const pal = randomPalette();
        newArtData = {...newArtData, color1: pal[0], color2: pal[1], color3: pal[2], pattern: randomPattern()};
    }
    const res = await window.dataSdk.create(newArtData);
    $btn.prop('disabled',false).text('Lưu');
    if(res.isOk){ showToast('Đã thêm tác phẩm (chờ duyệt)!'); $('#artModal').removeClass('show'); }
    else showToast('Lỗi thêm tác phẩm','error');
  }
});

// Delete
$(document).on('click','.action-del',function(){ deleteConfirmId = $(this).data('id'); renderTable(); });
$(document).on('click','.btn-cancel-del',function(){ deleteConfirmId = null; renderTable(); });
$(document).on('click','.btn-confirm-del',async function(){
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  $(this).prop('disabled',true).html('<span class="spinner"></span>');
  const res = await window.dataSdk.delete(art);
  if(res.isOk){ showToast('Đã xóa!'); deleteConfirmId=null; }
  else showToast('Lỗi xóa','error');
});

// Approve / Reject
$(document).on('click','.approve-btn',async function(){
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  $(this).prop('disabled',true).html('<span class="spinner"></span>');
  const res = await window.dataSdk.update({...art, status:'approved'});
  if(res.isOk) showToast('Đã duyệt tác phẩm!');
  else showToast('Lỗi duyệt','error');
});

$(document).on('click','.reject-btn',async function(){
  const id = $(this).data('id');
  const art = allArtworks.find(a=>a.__backendId===id);
  if(!art) return;
  $(this).prop('disabled',true).html('<span class="spinner"></span>');
  const res = await window.dataSdk.update({...art, status:'rejected'});
  if(res.isOk) showToast('Đã từ chối!');
  else showToast('Lỗi','error');
});

// Element SDK
const defaultConfig = {
  gallery_name: 'Galerie',
  gallery_tagline: 'Khám phá những tác phẩm nghệ thuật đương đại từ các họa sĩ tài năng',
  background_color: '#fafaf8',
  surface_color: '#ffffff',
  text_color: '#1a1a1a',
  primary_action: '#6c5ce7',
  secondary_action: '#666666',
  font_family: 'Playfair Display',
  font_size: 16
};

function applyConfig(cfg){
  const c = {...defaultConfig, ...cfg};
  const font = c.font_family || defaultConfig.font_family;
  const base = c.font_size || defaultConfig.font_size;

  $('#brandName').text(c.gallery_name);
  $('#heroTitle').text(c.gallery_name).css({'fontFamily':`${font}, serif`, fontSize: base*2.6+'px'});
  $('#heroTagline').text(c.gallery_tagline).css({fontSize: base*.94+'px'});
  
  $('.gallery-container').css('background-color', c.background_color);
  $('.gallery-hero').css('background', `linear-gradient(180deg, ${c.surface_color} 0%, ${c.background_color} 100%)`);
  $('.art-card').css('background-color', c.surface_color);
  $('.art-info h3').css({
    'color': c.text_color,
    'font-family': `${font}, serif`,
    'font-size': (base * 0.94) + 'px'
  });
  $('.art-artist').css('font-size', (base * 0.75) + 'px');
  $('.filter-chip.active').css({
    'background-color': c.primary_action,
    'border-color': c.primary_action
  });
}

window.elementSdk.init({
  defaultConfig,
  onConfigChange: async (cfg) => applyConfig(cfg),
  mapToCapabilities: (cfg) => ({
    recolorables: [
      {get:()=>cfg.background_color||defaultConfig.background_color, set:v=>{cfg.background_color=v; window.elementSdk.setConfig({background_color:v})}},
      {get:()=>cfg.surface_color||defaultConfig.surface_color, set:v=>{cfg.surface_color=v; window.elementSdk.setConfig({surface_color:v})}},
      {get:()=>cfg.text_color||defaultConfig.text_color, set:v=>{cfg.text_color=v; window.elementSdk.setConfig({text_color:v})}},
      {get:()=>cfg.primary_action||defaultConfig.primary_action, set:v=>{cfg.primary_action=v; window.elementSdk.setConfig({primary_action:v})}},
      {get:()=>cfg.secondary_action||defaultConfig.secondary_action, set:v=>{cfg.secondary_action=v; window.elementSdk.setConfig({secondary_action:v})}}
    ],
    borderables: [],
    fontEditable: {get:()=>cfg.font_family||defaultConfig.font_family, set:v=>{cfg.font_family=v; window.elementSdk.setConfig({font_family:v})}},
    fontSizeable: {get:()=>cfg.font_size||defaultConfig.font_size, set:v=>{cfg.font_size=v; window.elementSdk.setConfig({font_size:v})}}
  }),
  mapToEditPanelValues: (cfg) => new Map([
    ['gallery_name', cfg.gallery_name||defaultConfig.gallery_name],
    ['gallery_tagline', cfg.gallery_tagline||defaultConfig.gallery_tagline]
  ])
});

// Data SDK
const dataHandler = {
  onDataChanged(data){
    allArtworks = data;
    if(currentView==='public') renderGallery();
    renderAdmin();
  }
};

(async()=>{
  const res = await window.dataSdk.init(dataHandler);
  if(!res.isOk) console.error('Data SDK init failed');
  lucide.createIcons();
})();