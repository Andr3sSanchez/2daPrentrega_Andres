const socket = io();

// Capturamos el formulario de agregar productos
const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('productList');

// Enviar producto al servidor
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capturamos los valores del formulario
    const productTitle = document.getElementById('productTitle').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value); // Aseguramos que sea un número
    const productQuantity = parseInt(document.getElementById('productQuantity').value, 10); // Aseguramos que sea un número entero

    // Validamos que los valores no sean negativos
    if (productPrice < 0 || productQuantity <= 0) {
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "El precio y la cantidad deben ser números positivos."
        });
        return; // No enviamos los datos si hay errores
    }

    const newProduct = {
        id: Date.now(), // ID único usando timestamp
        title: productTitle,
        price: productPrice,
        quantity: productQuantity,
    };

    socket.emit('addProduct', newProduct); // Emitir el nuevo producto al servidor
    addProductForm.reset(); // Limpiar el formulario
});

// Recibir la lista de productos y actualizar el DOM
socket.on('updateProducts', (products) => {
    productList.innerHTML = ''; // Limpiar la lista existente
    products.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.textContent = `${product.title} - ${product.price} USD - Cantidad: ${product.quantity}`;

        // Crear un botón para eliminar el producto
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            socket.emit('deleteProduct', product.id); // Emitir el ID del producto a eliminar
        });

        productItem.appendChild(deleteButton);
        productList.appendChild(productItem);
    });
});
