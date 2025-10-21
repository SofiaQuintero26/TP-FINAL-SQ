document.addEventListener('DOMContentLoaded', function() {

    // 1. CONSTANTES
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.navbar a, .botones-inicio a');
    const logoVideo = document.querySelector('.logo-portada'); 
    const botonesContainer = document.querySelector('.botones-inicio');
    const productosContainer = document.querySelector('.contenido-productos');    
    const carritoTableBody = document.querySelector('#lista-carrito tbody');    
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const sectionsAndDivs = document.querySelectorAll('section, #texto-inicio'); 
    
    const scrollThreshold = 100;
    const delayTime = 1500; 

    //array para carrito
    let articulosCarrito = []; 

    // 2. SCROLL
    function checkScroll() {
        
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            if (logoVideo) {
                logoVideo.classList.add('oculto');
            }
        } else {
            if (!header.classList.contains('forced-scrolled')) {
                header.classList.remove('scrolled');
            }

            if (logoVideo) {
                logoVideo.classList.remove('oculto');
            }
        }
    }
    
    // 3. MENU
    function showSection(targetId) {
        sectionsAndDivs.forEach(el => {
            el.style.display = 'none';
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        if (targetId === '#inicio') {
            header.classList.remove('scrolled');
            header.classList.remove('forced-scrolled'); 
            
            const textSection = document.querySelector('#texto-inicio');
            if (textSection) {
                textSection.style.display = 'block';
            }
            if (logoVideo) {
                logoVideo.classList.remove('oculto');
            }

        } else {
            header.classList.add('scrolled');
            header.classList.add('forced-scrolled'); 
            
            if (logoVideo) {
                logoVideo.classList.add('oculto');
            }
        }
        
        checkScroll();
    }
    
    // 4. CARRITO
    function agregarProducto(e) {
        if (e.target.classList.contains('agregar-carrito')) {
            e.preventDefault(); 
            const productoSeleccionado = e.target.closest('.producto');
            leerDatosProducto(productoSeleccionado);
        }
    }

    function limpiarPrecio(precioTexto) {
    return parseFloat(precioTexto.replace('$', '').replace(/\./g, '').replace(',', ''));
    }

    function leerDatosProducto(producto) {
        const precioTexto = producto.querySelector('.precio').textContent;
        const precioNumerico = limpiarPrecio(precioTexto); 

        const infoProducto = {
            imagen: producto.querySelector('img').src,
            nombre: producto.querySelector('h3').textContent,
            precioTexto: precioTexto, 
            precioNumerico: precioNumerico, 
            id: producto.id,
            cantidad: 1 
        };
        
        const existe = articulosCarrito.some(articulo => articulo.id === infoProducto.id);

        if (existe) {
            articulosCarrito = articulosCarrito.map(articulo => {
                if (articulo.id === infoProducto.id) {
                    articulo.cantidad++;
                }
                return articulo;
            });
        } else {
            articulosCarrito = [...articulosCarrito, infoProducto];
        }
        
        carritoHTML();
    }
    
    function eliminarProducto(e) {
        if (e.target.classList.contains('borrar-producto')) {
            const productoId = e.target.getAttribute('data-id');
            
            articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
            
            carritoHTML();
        }
    }

    function gestionarCantidad(e) {
    if (e.target.classList.contains('sumar-unidad') || e.target.classList.contains('restar-unidad')) {
        const productoId = e.target.getAttribute('data-id');
        const esSuma = e.target.classList.contains('sumar-unidad');

        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === productoId) {
                if (esSuma) {
                    producto.cantidad++;
                } else if (producto.cantidad > 1) {
                    producto.cantidad--;
                } else {
                    return null; 
                }
            }
            return producto;
        }).filter(producto => producto !== null); 

        carritoHTML();
    }
}

    function limpiarHTML() {
        while (carritoTableBody.firstChild) {
            carritoTableBody.removeChild(carritoTableBody.firstChild);
        }
    }

    function carritoHTML() {
        limpiarHTML();
        let totalPagar = 0; 
        
        articulosCarrito.forEach(producto => {
            const {imagen, nombre, precioTexto, precioNumerico, cantidad, id} = producto;
            const precioLimpio = parseFloat(precioTexto.replace('$', '').replace('.', ''));

            totalPagar += precioNumerico * cantidad; 

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${imagen}"></td>
                <td>${nombre}</td>
                <td>${precioTexto}</td>
                <td>
                    <button class="restar-unidad" data-id="${id}">-</button>
                    ${cantidad}
                    <button class="sumar-unidad" data-id="${id}">+</button>
                </td>
                <td><a href="#" class="borrar-producto" data-id="${id}">Eliminar</a></td>
            `;
        
        carritoTableBody.appendChild(row);
    });

    const totalElemento = document.getElementById('total-precio');
    if (totalElemento) {
        totalElemento.textContent = `$${totalPagar.toLocaleString('es-AR')}`; 
    }
}

    // 5. LISTENERS
    window.addEventListener('scroll', checkScroll);

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href'); 

            document.getElementById('menu').checked = false;

            if (targetId === '#footer') {
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
            
            return;
            
        } 
        
        else {
            showSection(targetId);
            window.scrollTo(0, 0); 
        }
        });
      
    });

    const procesarCompraBtn = document.querySelector('#procesar-compra');

    if (procesarCompraBtn) {
        procesarCompraBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            mostrarNotificacionCompra();
            document.getElementById('vaciar-carrito').click(); 
        });
    }

    if (productosContainer) {
        productosContainer.addEventListener('click', agregarProducto);
    }
    
    if (carritoTableBody) {
        carritoTableBody.addEventListener('click', eliminarProducto);
    }

    if (carritoTableBody) {
        carritoTableBody.addEventListener('click', gestionarCantidad);
    }

    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', () => {
            articulosCarrito = [];
            carritoHTML();
        });
    }

    setTimeout(() => {
        if (botonesContainer) {
            botonesContainer.classList.add('visible');
        }
    }, delayTime);

    showSection('#inicio'); 
});

    // 6. NOTIFICACION COMPRA
    function mostrarNotificacionCompra() {
            const notificacion = document.getElementById('notificacion-compra');
            const overlay = document.getElementById('overlay-notificacion'); 

            if (notificacion && overlay) {
            notificacion.classList.add('visible');
            overlay.classList.add('visible'); 
            
            setTimeout(() => {
                notificacion.classList.remove('visible');
                overlay.classList.remove('visible'); 
            }, 3000); 
        }
    }