const BASE_URL = "https://682abc.mockapi.io/products";

// lấy toàn bộ sản phẩm
async function getProducts() {
    const response = await fetch(BASE_URL);
    return await response.json();
}

// thêm sản phẩm
async function addProduct(product) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    return await response.json();
}

// xoá sản phẩm
async function deleteProduct(id) {
    await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });
}

// lấy 1 sản phẩm
async function getProductById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return await response.json();
}

// cập nhật sản phẩm
async function updateProduct(id, product) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    return await response.json();
}