// Esperar a que el DOM esté completamente cargado
        document.addEventListener('DOMContentLoaded', function() {
            // Variables para almacenar credenciales demo
            const credencialesDemo = [
                { usuario: 'admin', contrasena: 'admin123' },
                { usuario: 'cees', contrasena: 'cees' }
            ];

            // Obtener referencias a los elementos del formulario
            const loginForm = document.querySelector('.login-form');
            const usuarioInput = document.getElementById('usuario');
            const contrasenaInput = document.getElementById('contrasena');
            const submitButton = document.querySelector('.login-btn');

            // Función para validar el formulario
            function validarFormulario(usuario, contrasena) {
                // Validar que los campos no estén vacíos
                if (!usuario || !contrasena) {
                    return { valido: false, mensaje: 'Por favor complete todos los campos.' };
                }
                
                // Simulación de autenticación con credenciales demo
                const usuarioEncontrado = credencialesDemo.find(
                    cred => cred.usuario === usuario && cred.contrasena === contrasena
                );
                
                if (usuarioEncontrado) {
                    return { valido: true, mensaje: 'Credenciales válidas!' };
                } else {
                    return { valido: false, mensaje: 'Usuario o contraseña incorrectos.' };
                }
            }

            // Función para mostrar mensajes de error o éxito
            function mostrarMensaje(mensaje, tipo) {
                // Eliminar mensajes anteriores
                const mensajesAnteriores = document.querySelectorAll('.mensaje-alerta');
                mensajesAnteriores.forEach(msg => msg.remove());
                
                // Crear el elemento para el mensaje
                const mensajeElement = document.createElement('div');
                mensajeElement.className = `mensaje-alerta ${tipo}`;
                mensajeElement.textContent = mensaje;
                
                // Insertar el mensaje después del título del formulario
                const formTitle = document.querySelector('.form-title');
                formTitle.insertAdjacentElement('afterend', mensajeElement);
                
                // Estilos para el mensaje
                mensajeElement.style.margin = '15px 0';
                mensajeElement.style.padding = '12px 16px';
                mensajeElement.style.borderRadius = '8px';
                mensajeElement.style.fontSize = '14px';
                mensajeElement.style.textAlign = 'center';
                mensajeElement.style.fontWeight = '500';
                mensajeElement.style.animation = 'slideDown 0.3s ease-out';
                
                // Estilos específicos según el tipo de mensaje
                if (tipo === 'error') {
                    mensajeElement.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                    mensajeElement.style.color = '#dc3545';
                    mensajeElement.style.border = '1px solid rgba(220, 53, 69, 0.3)';
                } else if (tipo === 'exito') {
                    mensajeElement.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                    mensajeElement.style.color = '#28a745';
                    mensajeElement.style.border = '1px solid rgba(40, 167, 69, 0.3)';
                }
                
                // Eliminar el mensaje después de 5 segundos
                setTimeout(() => {
                    if (mensajeElement.parentNode) {
                        mensajeElement.remove();
                    }
                }, 5000);
            }

            // Función para redirigir al sistema después de inicio de sesión exitoso
            function redirigirAlSistema() {
                // Cambiar estado del botón
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Ingresando...';
                
                // Guardar sesión en localStorage
                localStorage.setItem('tecnobuild_session', 'active');
                localStorage.setItem('tecnobuild_user', usuarioInput.value.trim());
                localStorage.setItem('tecnobuild_login_time', new Date().getTime());
                
                // Simulación de carga y luego redirección
                setTimeout(() => {
                    // Redirección a la página del sistema
                    window.location.href = 'Principal/obras.html';
                }, 1500);
            }

            // Manejar el evento de envío del formulario
            loginForm.addEventListener('submit', function(event) {
                // Prevenir el comportamiento predeterminado del formulario
                event.preventDefault();
                
                // Obtener valores de los campos
                const usuario = usuarioInput.value.trim();
                const contrasena = contrasenaInput.value.trim();
                
                // Validar el formulario
                const resultado = validarFormulario(usuario, contrasena);
                
                if (resultado.valido) {
                    mostrarMensaje(resultado.mensaje, 'exito');
                    redirigirAlSistema();
                } else {
                    mostrarMensaje(resultado.mensaje, 'error');
                    // Hacer vibrar el formulario para indicar error
                    loginForm.classList.add('shake');
                    setTimeout(() => {
                        loginForm.classList.remove('shake');
                    }, 500);
                }
            });

            // Funciones para el modal de contacto
            window.showContactModal = function() {
                document.getElementById('contactModal').style.display = 'flex';
            }

            window.closeContactModal = function() {
                document.getElementById('contactModal').style.display = 'none';
            }

            // Cerrar modal al hacer clic fuera de él
            window.onclick = function(event) {
                const modal = document.getElementById('contactModal');
                if (event.target === modal) {
                    closeContactModal();
                }
            }

            // Cerrar modal con la tecla Escape
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeContactModal();
                }
            });

            // Efectos de interacción para los inputs
            document.querySelectorAll('.form-group input').forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'translateY(-2px)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'translateY(0)';
                });
            });

            // Verificar si ya hay una sesión activa al cargar la página
            const sessionActive = localStorage.getItem('tecnobuild_session');
            if (sessionActive === 'active') {
                // Si ya hay sesión, redirigir directamente
                window.location.href = 'Principal/obras.html';
            }
        });