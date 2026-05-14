var API_BASE_URL = "https://69fc3760fce564e2591778d9.mockapi.io/api/v1";
// API của mockAPI

var ENDPOINTS = {
  Artists: API_BASE_URL + "/Artists",
  ArtWorks: API_BASE_URL + "/ArtWorks",
};// các giá trị trên mockAPI

function handleResponse(response, errorMessage)
{ 
  if (!response.ok) 
  {
    throw new Error(errorMessage || "Yêu cầu thất bại");
  }
  return response.json();
}

function getArtists() {
  return fetch(ENDPOINTS.Artists)
    .then(function (response) {
      return handleResponse(response, "Không thể lấy danh sách nghệ sĩ");
    })
    .catch(function (error) {
      throw error;
    });
}

function getArtworks() {
  return fetch(ENDPOINTS.ArtWorks)
    .then(function (response) {
      return handleResponse(response, "Không thể lấy danh sách tác phẩm");
    })
    .catch(function (error) {
      throw error;
    });
}

function getArtworkById(id) {
  return fetch(ENDPOINTS.ArtWorks + "/" + id)
    .then(function (response) {
      return handleResponse(response, "Không thể lấy tác phẩm");
    })
    .catch(function (error) {
      throw error;
    });
}

function createArtwork(data) {
  return fetch(ENDPOINTS.ArtWorks, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return handleResponse(response, "Không thể thêm tác phẩm");
    })
    .catch(function (error) {
      throw error;
    });
}

function updateArtwork(id, data) {
  return fetch(ENDPOINTS.ArtWorks + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return handleResponse(response, "Không thể cập nhật tác phẩm");
    })
    .catch(function (error) {
      throw error;
    });
}

function deleteArtwork(id) {
  return fetch(ENDPOINTS.ArtWorks + "/" + id, {
    method: "DELETE",
  })
    .then(function (response) {
      return handleResponse(response, "Không thể xóa tác phẩm");
    })
    .catch(function (error) {
      throw error;
    });
}