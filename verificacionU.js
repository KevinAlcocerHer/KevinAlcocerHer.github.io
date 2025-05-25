// sessionVerification.js
// Script completo para manejo de sesiones y perfil de usuario en TecnoBuild

(function() {
    'use strict';

    // Configuración de la sesión
    const SESSION_CONFIG = {
        sessionKey: 'tecnobuild_session',
        userKey: 'tecnobuild_user',
        loginTimeKey: 'tecnobuild_login_time',
        sessionDuration: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
        loginPagePath: '/index.html' // Ajusta esta ruta según tu estructura de carpetas
    };

    // Credenciales demo para validación de contraseñas
    const DEMO_CREDENTIALS = [
        { usuario: 'admin', contrasena: 'admin123' },
        { usuario: 'cees', contrasena: 'cees' }
    ];

    // ===== FUNCIONES DE SESIÓN =====

    // Función para verificar si la sesión es válida
    function isSessionValid() {
        const session = localStorage.getItem(SESSION_CONFIG.sessionKey);
        const loginTime = localStorage.getItem(SESSION_CONFIG.loginTimeKey);
        
        // Verificar si existe la sesión
        if (session !== 'active' || !loginTime) {
            return false;
        }
        
        // Verificar si la sesión no ha expirado
        const currentTime = new Date().getTime();
        const sessionAge = currentTime - parseInt(loginTime);
        
        if (sessionAge > SESSION_CONFIG.sessionDuration) {
            // Sesión expirada, limpiar datos
            clearSession();
            return false;
        }
        
        return true;
    }

    // Función para limpiar los datos de sesión
    function clearSession() {
        localStorage.removeItem(SESSION_CONFIG.sessionKey);
        localStorage.removeItem(SESSION_CONFIG.userKey);
        localStorage.removeItem(SESSION_CONFIG.loginTimeKey);
    }

    // Función para redirigir al login
    function redirectToLogin() {
        console.log('Sesión no válida, redirigiendo al login...');
        window.location.href = SESSION_CONFIG.loginPagePath;
    }

    // Función para obtener información del usuario actual
    function getCurrentUser() {
        if (isSessionValid()) {
            return localStorage.getItem(SESSION_CONFIG.userKey);
        }
        return null;
    }

    // Función para actualizar el tiempo de la sesión (renovar sesión)
    function renewSession() {
        if (isSessionValid()) {
            localStorage.setItem(SESSION_CONFIG.loginTimeKey, new Date().getTime());
            return true;
        }
        return false;
    }

    // Función para cerrar sesión manualmente
    function logout() {
        clearSession();
        redirectToLogin();
    }

    // Función principal de verificación
    function verifySession() {
        if (!isSessionValid()) {
            redirectToLogin();
            return false;
        }
        return true;
    }

    // ===== FUNCIONES DE INTERFAZ DE USUARIO =====

    // Función para mostrar información del usuario en la interfaz
    function displayUserInfo() {
        const user = getCurrentUser();
        if (user) {
            const userElements = document.querySelectorAll('[data-user-display]');
            userElements.forEach(element => {
                element.textContent = `Usuario: ${user}`;
            });
        }
    }

    // Función para configurar el botón de logout básico
    function setupBasicLogoutButton() {
        const logoutSelectors = [
            '[data-logout]',
            '.logout-btn',
            '#logout',
            'a[href="#logout"]',
            'a[href*="salir"]'
        ];

        logoutSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Solo configurar si no tiene ya un event listener personalizado
                if (!element.hasAttribute('data-custom-logout')) {
                    element.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (confirm('¿Está seguro que desea cerrar sesión?')) {
                            logout();
                        }
                    });
                }
            });
        });
    }

    // ===== FUNCIONES DE PERFIL DE USUARIO =====

    // Función para mostrar el perfil de usuario
    function showUserProfile() {
        const currentUser = getCurrentUser();
        const loginTime = localStorage.getItem(SESSION_CONFIG.loginTimeKey);
        const profileModal = document.getElementById('profileModal');
        
        if (!profileModal) {
            console.warn('Modal de perfil no encontrado');
            return;
        }

        // Actualizar información en el modal
        const usernameElement = document.getElementById('profileUsername');
        const loginTimeElement = document.getElementById('profileLoginTime');
        const sessionTimeElement = document.getElementById('profileSessionTime');
        
        if (usernameElement) {
            usernameElement.textContent = currentUser || 'Usuario desconocido';
        }
        
        if (loginTime && loginTimeElement) {
            const loginDate = new Date(parseInt(loginTime));
            loginTimeElement.textContent = loginDate.toLocaleString('es-ES');
        }
        
        if (loginTime && sessionTimeElement) {
            const currentTime = new Date().getTime();
            const timeLeft = SESSION_CONFIG.sessionDuration - (currentTime - parseInt(loginTime));
            
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                sessionTimeElement.textContent = `${hours}h ${minutes}m`;
            } else {
                sessionTimeElement.textContent = 'Sesión expirada';
            }
        }
        
        profileModal.style.display = 'flex';
        console.log('Perfil de usuario mostrado');
    }

    // Función para cerrar el modal de perfil
    function closeUserProfile() {
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.style.display = 'none';
        }
    }

    // Función para mostrar modal de cambio de contraseña
    function showChangePasswordModal() {
        const profileModal = document.getElementById('profileModal');
        const changePasswordModal = document.getElementById('changePasswordModal');
        
        if (profileModal) profileModal.style.display = 'none';
        if (changePasswordModal) changePasswordModal.style.display = 'flex';
    }

    // Función para cerrar modal de cambio de contraseña
    function closeChangePasswordModal() {
        const changePasswordModal = document.getElementById('changePasswordModal');
        const changePasswordForm = document.getElementById('changePasswordForm');
        
        if (changePasswordModal) changePasswordModal.style.display = 'none';
        if (changePasswordForm) changePasswordForm.reset();
    }

    // Función para manejar el cambio de contraseña
    function handlePasswordChange(currentPassword, newPassword, confirmPassword) {
        const currentUser = getCurrentUser();
        
        // Validaciones
        if (!currentPassword || !newPassword || !confirmPassword) {
            return { success: false, message: 'Por favor complete todos los campos' };
        }
        
        if (newPassword !== confirmPassword) {
            return { success: false, message: 'Las contraseñas nuevas no coinciden' };
        }
        
        if (newPassword.length < 4) {
            return { success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres' };
        }
        
        // Validar contraseña actual
        const userFound = DEMO_CREDENTIALS.find(cred => 
            cred.usuario === currentUser && cred.contrasena === currentPassword
        );
        
        if (!userFound) {
            return { success: false, message: 'La contraseña actual es incorrecta' };
        }
        
        // En un sistema real, aquí se enviaría al servidor
        return { success: true, message: 'Contraseña cambiada exitosamente' };
    }

    // ===== FUNCIONES DE CONFIGURACIÓN AUTOMÁTICA =====

    // Función para renovar automáticamente la sesión en actividad del usuario
    function setupSessionRenewal() {
        const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        let renewalTimeout;
        
        function scheduleRenewal() {
            clearTimeout(renewalTimeout);
            renewalTimeout = setTimeout(() => {
                renewSession();
            }, 5 * 60 * 1000); // Renovar cada 5 minutos de actividad
        }
        
        activities.forEach(activity => {
            document.addEventListener(activity, scheduleRenewal, true);
        });
    }

    // Función para mostrar tiempo restante de sesión
    function setupSessionTimer() {
        const timerElement = document.querySelector('[data-session-timer]');
        if (timerElement) {
            const updateTimer = () => {
                const loginTime = localStorage.getItem(SESSION_CONFIG.loginTimeKey);
                if (loginTime) {
                    const currentTime = new Date().getTime();
                    const sessionAge = currentTime - parseInt(loginTime);
                    const timeLeft = SESSION_CONFIG.sessionDuration - sessionAge;
                    
                    if (timeLeft > 0) {
                        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                        timerElement.textContent = `${hours}h ${minutes}m`;
                    } else {
                        timerElement.textContent = 'Expirado';
                    }
                }
            };
            
            updateTimer(); // Actualizar inmediatamente
            setInterval(updateTimer, 60000); // Actualizar cada minuto
        }
    }

    // ===== FUNCIONES DE LOGOUT PERSONALIZADO =====

    // Función para mostrar modal de logout personalizado
    function showCustomLogoutModal() {
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) {
            logoutModal.style.display = 'flex';
            const modalContent = logoutModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
            }
        }
    }

    // Función para ocultar modal de logout
    function hideCustomLogoutModal() {
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) {
            logoutModal.style.display = 'none';
        }
    }

    // Función para ejecutar logout con efectos visuales
    function performCustomLogout() {
        const confirmLogout = document.getElementById('confirmLogout');
        if (confirmLogout) {
            confirmLogout.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Cerrando...';
            confirmLogout.disabled = true;
        }
        
        setTimeout(() => {
            clearSession();
            hideCustomLogoutModal();
            
            // Crear overlay de despedida
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--primary-color-light), var(--sidebar-color));
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: var(--text-color);
                font-family: 'Segoe UI', sans-serif;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center; animation: fadeIn 0.5s ease;">
                    <i class='bx bx-check-circle' style="font-size: 4em; color: var(--primary-color); margin-bottom: 20px;"></i>
                    <h2 style="margin-bottom: 10px; color: var(--text-color-dark);">Sesión Cerrada</h2>
                    <p style="color: var(--text-color); margin-bottom: 20px;">Gracias por usar TecnoBuild</p>
                    <div style="display: flex; justify-content: center; align-items: center; color: var(--text-color);">
                        <i class='bx bx-loader-alt bx-spin' style="margin-right: 10px;"></i>
                        Redirigiendo...
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                window.location.href = SESSION_CONFIG.loginPagePath;
            }, 2000);
        }, 800);
    }

    // ===== CONFIGURACIÓN DE EVENT LISTENERS =====

    function setupEventListeners() {
        // Event listeners para perfil de usuario
        const profileBtn = document.getElementById('profileBtn');
        const closeProfile = document.getElementById('closeProfile');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const cancelChangePassword = document.getElementById('cancelChangePassword');
        const changePasswordForm = document.getElementById('changePasswordForm');

        if (profileBtn) {
            profileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showUserProfile();
            });
        }

        if (closeProfile) {
            closeProfile.addEventListener('click', closeUserProfile);
        }

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', showChangePasswordModal);
        }

        if (cancelChangePassword) {
            cancelChangePassword.addEventListener('click', closeChangePasswordModal);
        }

        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                const result = handlePasswordChange(currentPassword, newPassword, confirmPassword);
                
                if (result.success) {
                    alert(result.message);
                    closeChangePasswordModal();
                    closeUserProfile();
                } else {
                    alert(result.message);
                }
            });
        }

        // Event listeners para logout personalizado
        const logoutBtn = document.getElementById('logoutBtn');
        const cancelLogout = document.getElementById('cancelLogout');
        const confirmLogout = document.getElementById('confirmLogout');

        if (logoutBtn) {
            logoutBtn.setAttribute('data-custom-logout', 'true'); // Marcar como personalizado
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showCustomLogoutModal();
            });
        }

        if (cancelLogout) {
            cancelLogout.addEventListener('click', hideCustomLogoutModal);
        }

        if (confirmLogout) {
            confirmLogout.addEventListener('click', performCustomLogout);
        }

        // Cerrar modales con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const profileModal = document.getElementById('profileModal');
                const changePasswordModal = document.getElementById('changePasswordModal');
                const logoutModal = document.getElementById('logoutModal');

                if (profileModal && profileModal.style.display === 'flex') {
                    closeUserProfile();
                }
                if (changePasswordModal && changePasswordModal.style.display === 'flex') {
                    closeChangePasswordModal();
                }
                if (logoutModal && logoutModal.style.display === 'flex') {
                    hideCustomLogoutModal();
                }
            }
        });

        // Cerrar modales haciendo clic fuera
        const modals = ['profileModal', 'changePasswordModal', 'logoutModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });
    }

    // ===== CONFIGURACIÓN DE ESTILOS =====

    function setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            #logoutBtn:hover {
                background-color: rgba(220, 53, 69, 0.1) !important;
            }
            
            #logoutBtn:hover .icon,
            #logoutBtn:hover .text {
                color: #dc3545 !important;
            }
            
            #profileBtn:hover {
                background-color: rgba(68, 189, 50, 0.1) !important;
            }

            #profileBtn:hover .icon,
            #profileBtn:hover .text {
                color: #44bd32 !important;
            }

            #changePasswordBtn:hover {
                background-color: var(--primary-color-dark) !important;
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(style);
    }

    // ===== INICIALIZACIÓN =====

    // Ejecutar verificación al cargar la página
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar sesión principal
        if (verifySession()) {
            // Si la sesión es válida, configurar funcionalidades
            displayUserInfo();
            setupBasicLogoutButton();
            setupSessionRenewal();
            setupSessionTimer();
            setupEventListeners();
            setupStyles();
            
            console.log('TecnoBuild Session System - Inicializado correctamente para:', getCurrentUser());
        }
    });

    // Verificar sesión también cuando la ventana recibe foco
    window.addEventListener('focus', function() {
        verifySession();
    });

    // ===== API PÚBLICA =====

    // Exponer funciones globales para uso en otros scripts
    window.TecnoBuildSession = {
        // Funciones de sesión
        verify: verifySession,
        logout: logout,
        getCurrentUser: getCurrentUser,
        renewSession: renewSession,
        isValid: isSessionValid,
        
        // Funciones de perfil
        showProfile: showUserProfile,
        closeProfile: closeUserProfile,
        
        // Funciones de logout personalizado
        showLogoutModal: showCustomLogoutModal,
        hideLogoutModal: hideCustomLogoutModal,
        performLogout: performCustomLogout,
        
        // Utilidades
        getSessionTimeLeft: function() {
            const loginTime = localStorage.getItem(SESSION_CONFIG.loginTimeKey);
            if (loginTime) {
                const currentTime = new Date().getTime();
                const timeLeft = SESSION_CONFIG.sessionDuration - (currentTime - parseInt(loginTime));
                return timeLeft > 0 ? timeLeft : 0;
            }
            return 0;
        }
    };

})();