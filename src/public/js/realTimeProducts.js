// public/js/realtimeproducts.js
const socket = io();

// Capturamos el formulario de agregar productos
const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('productList');

// Enviar producto al servidor
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productTitle = document.getElementById('productTitle').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productQuantity = parseInt(document.getElementById('productQuantity').value, 10);

    if (productPrice < 0 || productQuantity <= 0) {
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "El precio y la cantidad deben ser números positivos."
        });
        return;
    }

    const newProduct = {
        id: Date.now(),
        title: productTitle,
        price: productPrice,
        quantity: productQuantity
    };

    socket.emit('addProduct', newProduct);  // Emitir el nuevo producto
    addProductForm.reset();  // Limpiar el formulario
});

// Actualizar la lista de productos
socket.on('updateProducts', (products) => {
    productList.innerHTML = '';
    products.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.textContent = `${product.title} - ${product.price} USD - Cantidad: ${product.quantity}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            socket.emit('deleteProduct', product.id);  // Emitir el ID del producto para eliminarlo
        });

        productItem.appendChild(deleteButton);
        productList.appendChild(productItem);
    });
});
