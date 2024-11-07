document.addEventListener('DOMContentLoaded', function(){
    const loginform = document.getElementById('loginform');
    const registerForm = document.getElementById('registerform');
    const showRegister = document.getElementById('showregister');
    const showLogin = document.getElementById('showlogin');

    showLogin.addEventListener('click', function(e){
        e.preventDefault();
        loginform.classList.remove('active');
        registerForm.classList.add('active');
    });

    showLogin.addEventListener('click', function(e){
        e.preventDefault();
        loginform.classList.add('active');
        registerForm.classList.remove('active');
    });
});

document.getElementById('logoutButton').addEventListener('click', function () {
    // Eliminar el token de autenticación (si está almacenado en localStorage o cookies)
    localStorage.removeItem('token'); // Si usas localStorage para almacenar el token

    // Redirigir a la página de inicio de sesión
    window.location.href = '/html/login.html'; // Cambia la ruta según tu archivo de login
});

























// Selecciona el modal y los elementos del modal
// const modal = document.getElementById("modal");
// const closeModal = document.querySelector(".close");
// const btnComprar = document.querySelectorAll(".btn-comprar");
// const modalEvento = document.getElementById("modal-evento");
// const modalPrecio = document.getElementById("modal-precio");
// const cantidadInput = document.getElementById("cantidad");
// const total = document.getElementById("total");
// const confirmarCompra = document.getElementById("confirmar-compra");

// Abre el modal y configura el contenido al hacer clic en "Comprar Tickets"
// btnComprar.forEach(btn => {
//     btn.addEventListener("click", function() {
//         const evento = this.getAttribute("data-evento");
//         const precio = parseFloat(this.getAttribute("data-precio"));
        
//         modal.style.display = "flex";
//         modalEvento.textContent = `Evento: ${evento}`;
//         modalPrecio.textContent = `Precio por ticket: $${precio}`;
        
//         Calcula y muestra el total
//         cantidadInput.value = 1;
//         actualizarTotal(precio);
//     });
// });

// Calcula y muestra el total de la compra
// cantidadInput.addEventListener("input", function() {
//     const precio = parseFloat(modalPrecio.textContent.split("$")[1]);
//     actualizarTotal(precio);
// });

// function actualizarTotal(precio) {
//     const cantidad = parseInt(cantidadInput.value) || 1;
//     total.textContent = `Total: $${(precio * cantidad).toFixed(2)}`;
// }

// Cierra el modal al hacer clic en "X" o fuera del contenido
// closeModal.onclick = function() {
//     modal.style.display = "none";
// };

// window.onclick = function(event) {
//     if (event.target === modal) {
//         modal.style.display = "none";
//     }
// };

// Confirmación de compra (simulado)
// confirmarCompra.onclick = function() {
//     alert("Compra confirmada! Los tickets serán enviados a su correo.");
//     modal.style.display = "none";
// };

