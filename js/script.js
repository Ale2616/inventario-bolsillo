document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. LIGHT / DARK MODE TOGGLE (Navbar premium toggle switch)
    // ----------------------------------------------------------------------
    const checkboxTheme = document.getElementById('checkboxTheme');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('bolsilloTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (checkboxTheme) {
        checkboxTheme.checked = (savedTheme === 'light');
        checkboxTheme.addEventListener('change', () => {
            const newTheme = checkboxTheme.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('bolsilloTheme', newTheme);
        });
    }

    // ----------------------------------------------------------------------
    // 2. SCROLL REVEAL OBSERVER
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => element.classList.add('active'));
    }

    // ----------------------------------------------------------------------
    // 3. CENTRALIZED AUTHENTICATION MODAL CONTROLLER & FRONTEND VALIDATION
    // ----------------------------------------------------------------------
    const authModal = document.getElementById('authModal');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    const authTriggers = document.querySelectorAll('.auth-trigger');
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    
    const panelLogin = document.getElementById('panelLogin');
    const panelRegister = document.getElementById('panelRegister');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginStatus = document.getElementById('loginStatus');
    const registerStatus = document.getElementById('registerStatus');
    
    const authLoaderScreen = document.getElementById('authLoaderScreen');
    const loaderState = document.getElementById('loaderState');
    const successState = document.getElementById('successState');
    const btnResetAuth = document.getElementById('btnResetAuth');

    // Open Modal
    const openModal = (tab = 'login') => {
        if (!authModal) return;
        authModal.classList.add('active');
        switchFormTab(tab);
        document.body.style.overflow = 'hidden';
    };

    authTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(btn.getAttribute('data-tab'));
        });
    });

    // Close Modal
    const closeModal = () => {
        if (!authModal) return;
        authModal.classList.remove('active');
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
        if (loginStatus) loginStatus.textContent = '';
        if (registerStatus) registerStatus.textContent = '';
        document.body.style.overflow = 'auto';
    };

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', closeModal);
    }
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeModal();
        });
    }

    // Switch Form Tab
    const switchFormTab = (tab) => {
        authTabBtns.forEach(btn => btn.classList.remove('active'));
        if (panelLogin) panelLogin.classList.remove('active');
        if (panelRegister) panelRegister.classList.remove('active');
        
        if (tab === 'login') {
            const btnLogin = document.getElementById('tabBtnLogin');
            if (btnLogin) btnLogin.classList.add('active');
            if (panelLogin) panelLogin.classList.add('active');
        } else {
            const btnReg = document.getElementById('tabBtnRegister');
            if (btnReg) btnReg.classList.add('active');
            if (panelRegister) panelRegister.classList.add('active');
        }
    };

    authTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchFormTab(btn.getAttribute('data-target'));
        });
    });

    // Email validator helper
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Login Form submission validation
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginStatus.textContent = '';
            loginStatus.className = 'status-message';

            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPassword').value;

            if (!isValidEmail(email)) {
                loginStatus.textContent = 'Por favor, introduce un correo corporativo válido.';
                loginStatus.classList.add('invalid');
                return;
            }

            if (pass.length < 8) {
                loginStatus.textContent = 'La contraseña debe contener al menos 8 caracteres.';
                loginStatus.classList.add('invalid');
                return;
            }

            // Launch Simulated Sync loader screen
            startLoaderSimulation();
        });
    }

    // Register Form submission validation
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registerStatus.textContent = '';
            registerStatus.className = 'status-message';

            const company = document.getElementById('regCompany').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const pass = document.getElementById('regPassword').value;

            if (company.length < 3) {
                registerStatus.textContent = 'El nombre de empresa debe ser de mínimo 3 letras.';
                registerStatus.classList.add('invalid');
                return;
            }

            if (!isValidEmail(email)) {
                registerStatus.textContent = 'Por favor, introduce un correo corporativo válido.';
                registerStatus.classList.add('invalid');
                return;
            }

            if (pass.length < 8) {
                registerStatus.textContent = 'La contraseña debe tener al menos 8 caracteres.';
                registerStatus.classList.add('invalid');
                return;
            }

            // Save mock user locally
            localStorage.setItem('bolsilloMockAccount', JSON.stringify({ company, email }));

            // Launch Simulated Sync
            startLoaderSimulation();
        });
    }

    const startLoaderSimulation = () => {
        if (!authLoaderScreen) return;
        authLoaderScreen.classList.add('active');
        loaderState.style.display = 'flex';
        successState.style.display = 'none';

        const title = document.getElementById('loaderTitle');
        const desc = document.getElementById('loaderDesc');

        setTimeout(() => {
            title.textContent = 'Encriptando Intercambio...';
            desc.textContent = 'Cifrando firma asimétrica RSA-4096 bits para sesión efímera.';
        }, 900);

        setTimeout(() => {
            title.textContent = 'Verificando con Supabase...';
            desc.textContent = 'Confirmando credenciales únicas de acceso en la base central.';
        }, 1800);

        setTimeout(() => {
            loaderState.style.display = 'none';
            successState.style.display = 'flex';
        }, 2800);
    };

    if (btnResetAuth) {
        btnResetAuth.addEventListener('click', () => {
            authLoaderScreen.classList.remove('active');
            closeModal();
        });
    }

    // ----------------------------------------------------------------------
    // 4. SIMULATED DOWNLOADS MANAGER
    // ----------------------------------------------------------------------
    const dlTriggers = document.querySelectorAll('.dl-trigger');
    const downloadToast = document.getElementById('downloadToast');
    const toastFilename = document.getElementById('toastFilename');
    const toastProgressFill = document.getElementById('toastProgressFill');
    const toastProgressText = document.getElementById('toastProgressText');
    const toastSpeedText = document.getElementById('toastSpeedText');
    const toastIcon = document.getElementById('toastIcon');

    let isDownloading = false;

    dlTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isDownloading) return;
            isDownloading = true;

            const file = btn.getAttribute('data-file');
            const size = btn.getAttribute('data-size');
            const platform = btn.getAttribute('data-platform');

            if (toastFilename) toastFilename.textContent = `${file} (${size})`;
            if (toastIcon) toastIcon.className = 'fa-solid fa-circle-notch fa-spin';
            if (toastProgressFill) toastProgressFill.style.width = '0%';
            if (toastProgressText) toastProgressText.textContent = '0%';
            if (toastSpeedText) toastSpeedText.textContent = 'Iniciando descarga...';
            
            if (downloadToast) downloadToast.style.display = 'flex';

            let progress = 0;
            const speed = platform === 'Windows' ? 12.8 : 7.2;

            const dlInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 6) + 3;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(dlInterval);
                    
                    // Success state
                    if (toastProgressFill) toastProgressFill.style.width = '100%';
                    if (toastProgressText) toastProgressText.textContent = '100%';
                    if (toastSpeedText) toastSpeedText.textContent = 'Descargado';
                    if (toastIcon) {
                        toastIcon.className = 'fa-solid fa-circle-check';
                        toastIcon.style.color = 'var(--success-color)';
                    }

                    setTimeout(() => {
                        if (downloadToast) downloadToast.style.display = 'none';
                        isDownloading = false;
                        if (toastIcon) toastIcon.style.color = '';
                    }, 2500);
                } else {
                    if (toastProgressFill) toastProgressFill.style.width = `${progress}%`;
                    if (toastProgressText) toastProgressText.textContent = `${progress}%`;
                    if (toastSpeedText) toastSpeedText.textContent = `${(speed + (Math.random() * 2 - 1)).toFixed(1)} MB/s`;
                }
            }, 150);
        });
    });
});
