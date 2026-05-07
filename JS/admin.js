lucide.createIcons();

let allArtworks = [];

// Data SDK Handler
const dataHandler = {
    onDataChanged(data) {
        allArtworks = data || [];
        updateAdminDashboard();
    }
};

// Initialize Application
async function initializeApp() {
    if (window.dataSdk) {
        const result = await window.dataSdk.init(dataHandler);
        if (!result.isOk) {
            console.error('Failed to initialize data SDK:', result.error);
        }
    }
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('tab-artworks').addEventListener('click', () => switchAdminTab('artworks'));
    document.getElementById('tab-artists').addEventListener('click', () => switchAdminTab('artists'));
    document.getElementById('tab-analytics').addEventListener('click', () => switchAdminTab('analytics'));
    document.getElementById('artwork-form').addEventListener('submit', handleAddArtwork);
}

function switchAdminTab(tab) {
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('border-pink-600', 'text-pink-600');
        btn.classList.add('border-transparent', 'text-slate-600');
    });
    document.getElementById(`tab-${tab}`).classList.add('border-pink-600', 'text-pink-600');

    document.querySelectorAll('[id$="-tab"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${tab}-tab`).classList.remove('hidden');
}

function updateAdminDashboard() {
    // Artworks list
    const artList = document.getElementById('admin-artworks-list');
    if (allArtworks.length === 0) {
        artList.innerHTML = '<p class="text-slate-500 py-8 text-center">No artworks yet.</p>';
    } else {
        artList.innerHTML = allArtworks.map(art => `
            <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition">
                <div class="flex-1">
                    <h4 class="font-semibold text-slate-900">${art.title}</h4>
                    <p class="text-sm text-slate-600">${art.artist} • ${art.style}</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-pink-600">${art.likes || 0} likes</span>
                    <button class="p-2 hover:bg-red-100 rounded-lg transition text-red-600" onclick="deleteArtwork('${art.__backendId}')">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Artists list
    const artists = [...new Set(allArtworks.map(a => a.artist))];
    const artistsList = document.getElementById('admin-artists-list');
    if (artists.length === 0) {
        artistsList.innerHTML = '<p class="text-slate-500 col-span-2 py-8 text-center">No artists yet.</p>';
    } else {
        artistsList.innerHTML = artists.map(artist => {
            const artworks = allArtworks.filter(a => a.artist === artist);
            const totalLikes = artworks.reduce((sum, a) => sum + (a.likes || 0), 0);
            return `
                <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h4 class="font-heading font-bold text-lg text-slate-900">${artist}</h4>
                    <p class="text-sm text-slate-600 mt-1">${artworks.length} artwork${artworks.length !== 1 ? 's' : ''}</p>
                    <p class="text-sm text-pink-600 mt-2 font-medium">${totalLikes} total likes</p>
                </div>
            `;
        }).join('');
    }

    // Analytics
    const totalLikes = allArtworks.reduce((sum, a) => sum + (a.likes || 0), 0);
    const topArtwork = allArtworks.length > 0 ? allArtworks.reduce((max, a) => (a.likes || 0) > (max.likes || 0) ? a : max) : null;

    document.getElementById('stat-artworks').textContent = allArtworks.length;
    document.getElementById('stat-likes').textContent = totalLikes;
    document.getElementById('stat-top').textContent = topArtwork ? topArtwork.title.substring(0, 20) : '—';

    lucide.createIcons();
}

async function handleAddArtwork(e) {
    e.preventDefault();
    const artworkData = {
        title: document.getElementById('art-title').value,
        artist: document.getElementById('art-artist').value,
        style: document.getElementById('art-style').value,
        year: parseInt(document.getElementById('art-year').value),
        image_url: document.getElementById('art-image').value,
        description: document.getElementById('art-description').value,
        likes: 0,
        is_approved: true
    };

    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Saving...';

    if (window.dataSdk) {
        const result = await window.dataSdk.create(artworkData);
        if (result.isOk) {
            e.target.reset();
        } else {
            alert('Error adding artwork. Please try again.');
        }
    }
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Add Artwork';
    lucide.createIcons();
}

async function deleteArtwork(id) {
    if (confirm('Delete this artwork?')) {
        const artwork = allArtworks.find(a => a.__backendId === id);
        if (artwork && window.dataSdk) {
            const result = await window.dataSdk.delete(artwork);
            if (!result.isOk) {
                alert('Error deleting artwork');
            }
        }
    }
}

// Start the app
initializeApp();