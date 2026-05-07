lucide.createIcons();

const defaultConfig = {
  gallery_title: 'ArtGallery',
  gallery_subtitle: 'Discover Contemporary Art',
  admin_password: '',
  primary_color: '#ec4899',
  secondary_color: '#8338ec',
  accent_color: '#3a86ff',
  font_family: 'Playfair Display',
  font_size: 16
};

let allArtworks = [];
let currentFilter = 'all';
let searchQuery = '';
let isDarkTheme = false;

// Data SDK Handler
const dataHandler = {
  onDataChanged(data) {
    allArtworks = data.filter(art => art.is_approved);
    renderGallery();
  }
};

// Initialize Data SDK
async function initializeApp() {
  const result = await window.dataSdk.init(dataHandler);
  if (!result.isOk) {
    console.error('Failed to initialize data SDK:', result.error);
  }
  setupEventListeners();
}

function setupEventListeners() {
  // Search functionality
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderGallery();
  });

  // Filter buttons
  document.querySelectorAll('.filter-tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.style;
      renderGallery();
    });
  });

  // Modal controls
  document.getElementById('close-modal').addEventListener('click', closeDetailModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeDetailModal);
  document.getElementById('modal-like-btn').addEventListener('click', handleModalLike);

  // Theme toggle
  document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
}

function renderGallery() {
  const gallery = document.getElementById('gallery-container');
  const emptyState = document.getElementById('empty-state');
  
  let filtered = currentFilter === 'all' 
    ? allArtworks 
    : allArtworks.filter(art => art.style === currentFilter);

  if (searchQuery) {
    filtered = filtered.filter(art => 
      art.title.toLowerCase().includes(searchQuery) ||
      art.artist.toLowerCase().includes(searchQuery) ||
      (art.description && art.description.toLowerCase().includes(searchQuery))
    );
  }

  if (filtered.length === 0) {
    gallery.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  gallery.innerHTML = filtered.map((art, idx) => `
    <div class="art-card glass-light cursor-pointer card-entrance" style="animation-delay:${idx * 0.1}s" data-id="${art.__backendId}">
      <div class="relative h-64 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        <img src="${art.image_url}" alt="${art.title}" class="art-card-img w-full h-full object-cover" onerror="this.style.background='linear-gradient(135deg, #ff006e, #8338ec)'; this.alt='Image unavailable'">
      </div>
      <div class="p-6">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <h3 class="font-heading font-bold text-lg text-slate-900">${art.title}</h3>
            <p class="text-sm text-slate-600">${art.artist}</p>
          </div>
          <span class="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-medium">${art.style}</span>
        </div>
        <p class="text-sm text-slate-600 mb-4 line-clamp-2">${art.description || 'Contemporary artwork'}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500">${art.year}</span>
          <button class="like-btn flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-pink-50 transition" data-id="${art.__backendId}">
            <i data-lucide="heart" class="w-4 h-4"></i>
            <span class="text-sm font-medium">${art.likes}</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();

  // Add card click listeners for modal
  document.querySelectorAll('.art-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.like-btn')) {
        const id = card.dataset.id;
        const artwork = allArtworks.find(a => a.__backendId === id);
        if (artwork) openDetailModal(artwork);
      }
    });
  });

  // Add like button listeners
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const artwork = allArtworks.find(a => a.__backendId === id);
      
      if (artwork) {
        artwork.likes++;
        btn.classList.add('liked');
        setTimeout(() => btn.classList.remove('liked'), 300);
        const result = await window.dataSdk.update(artwork);
        if (!result.isOk) {
          artwork.likes--;
        }
      }
    });
  });
}

function openDetailModal(artwork) {
  document.getElementById('modal-title').textContent = artwork.title;
  document.getElementById('modal-artist').textContent = artwork.artist;
  document.getElementById('modal-style').textContent = artwork.style;
  document.getElementById('modal-description').textContent = artwork.description || 'A contemporary artwork';
  document.getElementById('modal-year').textContent = `Year: ${artwork.year}`;
  document.getElementById('modal-likes').textContent = artwork.likes;
  
  const modalImage = document.getElementById('modal-image').querySelector('img');
  modalImage.src = artwork.image_url;
  modalImage.alt = artwork.title;
  
  document.getElementById('modal-like-btn').dataset.id = artwork.__backendId;
  document.getElementById('detail-modal').classList.remove('hidden');
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.add('hidden');
}

async function handleModalLike() {
  const id = document.getElementById('modal-like-btn').dataset.id;
  const artwork = allArtworks.find(a => a.__backendId === id);
  
  if (artwork) {
    artwork.likes++;
    document.getElementById('modal-likes').textContent = artwork.likes;
    const result = await window.dataSdk.update(artwork);
    if (!result.isOk) {
      artwork.likes--;
      document.getElementById('modal-likes').textContent = artwork.likes;
    }
  }
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  if (isDarkTheme) {
    document.documentElement.classList.add('dark');
    document.body.classList.remove('bg-gradient-to-br', 'from-white', 'via-slate-50', 'to-blue-50', 'text-slate-900');
    document.body.classList.add('dark:bg-slate-950', 'dark:text-white');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

async function onConfigChange(config) {
  document.getElementById('gallery-title').textContent = config.gallery_title || defaultConfig.gallery_title;
  document.getElementById('gallery-subtitle').textContent = config.gallery_subtitle || defaultConfig.gallery_subtitle;
  document.getElementById('nav-title').textContent = config.gallery_title || defaultConfig.gallery_title;
}

function mapToCapabilities(config) {
  return {
    recolorables: [
      { get: () => config.primary_color || defaultConfig.primary_color, set: (v) => { config.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); } },
      { get: () => config.secondary_color || defaultConfig.secondary_color, set: (v) => { config.secondary_color = v; window.elementSdk.setConfig({ secondary_color: v }); } },
      { get: () => config.accent_color || defaultConfig.accent_color, set: (v) => { config.accent_color = v; window.elementSdk.setConfig({ accent_color: v }); } }
    ],
    borderables: [],
    fontEditable: { get: () => config.font_family || defaultConfig.font_family, set: (v) => { config.font_family = v; window.elementSdk.setConfig({ font_family: v }); } },
    fontSizeable: { get: () => config.font_size || defaultConfig.font_size, set: (v) => { config.font_size = v; window.elementSdk.setConfig({ font_size: v }); } }
  };
}

function mapToEditPanelValues(config) {
  return new Map([
    ['gallery_title', config.gallery_title || defaultConfig.gallery_title],
    ['gallery_subtitle', config.gallery_subtitle || defaultConfig.gallery_subtitle],
    ['admin_password', config.admin_password || defaultConfig.admin_password]
  ]);
}

window.elementSdk.init({ defaultConfig, onConfigChange, mapToCapabilities, mapToEditPanelValues });
initializeApp();