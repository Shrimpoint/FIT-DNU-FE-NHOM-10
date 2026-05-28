// Nút tải dữ liệu từ MockAPI trong admin panel
const reloadDataButton = document.getElementById('reloadDataBtn');
if (reloadDataButton) {
  reloadDataButton.addEventListener('click', async function() {
    const statusDiv = document.getElementById('reloadStatus');
    const btn = this;

    try {
      btn.disabled = true;
      statusDiv.innerHTML = '<span style="color:#0066cc">Đang tải...</span>';

      const response = await fetch('https://69fc3760fce564e2591778d9.mockapi.io/api/v1/ArtWorks');
      if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu: ' + response.statusText);
      }

      const artworks = await response.json();
      if (!artworks || artworks.length === 0) {
        statusDiv.innerHTML = '<span style="color:#ff9933">⚠️ MockAPI trống</span>';
        btn.disabled = false;
        return;
      }

      const formattedData = artworks.map(item => ({
        __backendId: item.id,
        title: item.ArtWorksName,
        artist: item.Author,
        authorImage: item.AuthorImage || item.AuthorAvatar || item.authorImage || item.authorAvatar || '',
        style: item.Categories,
        description: item.Description,
        created_at: item.PostingDate,
        resolution: item.Resolution,
        likes: parseInt(item.likes, 10) || 0,
        status: item.status || 'approved',
        imageSrc: item.imageSrc || '',
        color1: item.color1,
        color2: item.color2,
        color3: item.color3,
        pattern: item.pattern
      }));

      allArtworks = formattedData;
      if (typeof renderAdmin === 'function') renderAdmin();
      if (typeof renderGallery === 'function') renderGallery();

      const artistsResponse = await fetch('https://69fc3760fce564e2591778d9.mockapi.io/api/v1/Artists');
      if (artistsResponse.ok) {
        allArtists = await artistsResponse.json();
        if (typeof currentSection !== 'undefined' && currentSection === 'artists' && typeof renderArtistsTable === 'function') {
          renderArtistsTable();
        }
      }

      statusDiv.innerHTML = '<span style="color:#00b894">✓ Tải thành công!</span>';
      console.log('Loaded artworks:', formattedData);
    } catch (error) {
      statusDiv.innerHTML = `<span style="color:#d63031">✗ ${error.message}</span>`;
      console.error('Load error:', error);
    } finally {
      btn.disabled = false;
    }
  });
}
