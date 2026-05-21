const productList = document.getElementById("product-list");

async function renderProducts() {

    const products = await getProducts();

    let html = "";

    products.forEach(product => {

        html += `
        
        <div class="col-md-4 mb-4">

            <div class="card h-100 shadow">

                <img 
                    src="${product.image}" 
                    class="card-img-top"
                    style="height:300px; object-fit:cover;"
                >

                <div class="card-body">

                    <h3>${product.name}</h3>

                    <p>${product.category}</p>

                    <p>${product.description}</p>

                    <h5 class="text-danger">
                        ${product.price} VNĐ
                    </h5>

                </div>

            </div>

        </div>
        
        `;
    });

    productList.innerHTML = html;
}

renderProducts();