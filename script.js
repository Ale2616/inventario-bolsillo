// ==========================================================================
// INVENTARIO DE BOLSILLO INTERACTION SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. SCROLL REVEAL ANIMATIONS (Intersection Observer)
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
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // ----------------------------------------------------------------------
    // 2. ACTIVE NAVIGATION & FLOATING DOCK TRACKER
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    const dockItems = document.querySelectorAll('.dock-item');
    const navbar = document.querySelector('.navbar');

    const updateActiveNav = () => {
        const scrollY = window.pageYOffset;
        
        // Sticky header styling
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Section tracking
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Header navigation
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });

                // Floating iOS Dock navigation
                dockItems.forEach(item => {
                    item.classList.remove('active');
                });

                if (sectionId === 'inicio') {
                    document.getElementById('dockBtnTop')?.classList.add('active');
                } else if (sectionId === 'escanear') {
                    document.getElementById('dockBtnDemo')?.classList.add('active');
                } else if (sectionId === 'precios') {
                    document.getElementById('dockBtnSubscription')?.classList.add('active');
                    document.getElementById('dockBtnPayments')?.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // ----------------------------------------------------------------------
    // 3. SYNTHESIZED BEEP AUDIO (Web Audio API)
    // ----------------------------------------------------------------------
    const playScanBeep = () => {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            
            // Oscillator for the beep tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime); // High pitch beep
            
            // Fast fade out envelope
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {
            console.warn('Web Audio API not supported or blocked by user gesture:', e);
        }
    };

    // ----------------------------------------------------------------------
    // 4. INTERACTIVE PHONE MOCKUP SCANNING SIMULATION
    // ----------------------------------------------------------------------
    const phoneFabScan = document.getElementById('phoneFabScan');
    const mockupScreen = document.querySelector('.iphone-screen');
    const stockList = document.querySelector('.phone-stock-list');

    let scannedItemsCount = 0;

    phoneFabScan.addEventListener('click', () => {
        // Trigger audio beep
        playScanBeep();

        // Visual screen flash effect
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#ffffff';
        flash.style.opacity = '0.4';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '99';
        flash.style.transition = 'opacity 0.25s ease-out';
        
        mockupScreen.appendChild(flash);
        
        // Fade flash out immediately
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 250);
        }, 30);

        // Scan logic: increment an item or add a scanned item at the top
        scannedItemsCount++;
        
        // Let's create a new scanned item dynamically
        const newRow = document.createElement('div');
        newRow.className = 'stock-item-row';
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-10px)';
        newRow.style.borderColor = 'var(--color-primary)';
        newRow.style.transition = 'all 0.4s ease';

        newRow.innerHTML = `
            <div class="item-info">
                <strong class="item-name">Scanner Item #${scannedItemsCount}</strong>
                <span class="item-sku">SKU: SCN-${100 + scannedItemsCount}</span>
            </div>
            <span class="stock-badge in-stock">1 U.</span>
        `;

        // Insert at the top of list (right below header)
        const firstRow = stockList.children[1]; // index 0 is the list header
        stockList.insertBefore(newRow, firstRow);

        // Trigger animation frame
        setTimeout(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
            
            // Remove border highlight after 1 second
            setTimeout(() => {
                newRow.style.borderColor = 'var(--color-border)';
            }, 1000);
        }, 50);

        // Keep maximum 4 items on the screen to avoid overflow
        if (stockList.children.length > 5) {
            const lastRow = stockList.lastElementChild;
            lastRow.style.opacity = '0';
            lastRow.style.transform = 'translateY(10px)';
            setTimeout(() => lastRow.remove(), 400);
        }
    });

    // ----------------------------------------------------------------------
    // 5. SUBSCRIPTION & PAYMENT SIMULATOR MODAL
    // ----------------------------------------------------------------------
    const simModal = document.getElementById('simModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    
    const modalStepForm = document.getElementById('modalStepForm');
    const modalStepProcessing = document.getElementById('modalStepProcessing');
    const modalStepSuccess = document.getElementById('modalStepSuccess');
    
    const selectedPlanName = document.getElementById('selectedPlanName');
    const billingPlanText = document.getElementById('billingPlanText');
    const billingPlanPrice = document.getElementById('billingPlanPrice');
    const paymentForm = document.getElementById('paymentForm');
    
    const successPlanName = document.getElementById('successPlanName');
    const successTxId = document.getElementById('successTxId');
    const successClient = document.getElementById('successClient');
    const successPrice = document.getElementById('successPrice');
    const btnDonePayment = document.getElementById('btnDonePayment');

    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardNumberInput = document.getElementById('cardNumber');

    let currentPlanSelected = 'Pro';
    let currentPlanPriceStr = '$29.00';

    // Open Modal and Setup Values
    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            currentPlanSelected = plan;
            
            let price = '$29.00';
            if (plan === 'Gratuito') price = '$0.00';
            else if (plan === 'Enterprise') price = '$99.00';
            
            currentPlanPriceStr = price;

            // Populate Form Details
            selectedPlanName.textContent = plan;
            billingPlanText.textContent = `Plan ${plan} (Mensual)`;
            billingPlanPrice.textContent = price;

            // Open Modal
            simModal.classList.add('active');
            modalStepForm.classList.add('active');
            modalStepProcessing.classList.remove('active');
            modalStepSuccess.classList.remove('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    // Close Modal Functions
    const closeModal = () => {
        simModal.classList.remove('active');
        paymentForm.reset();
        document.body.style.overflow = 'auto';
    };

    closeModalBtn.addEventListener('click', closeModal);
    btnDonePayment.addEventListener('click', closeModal);

    // Click outside modal to close
    simModal.addEventListener('click', (e) => {
        if (e.target === simModal) {
            closeModal();
        }
    });

    // Formatting Inputs (Card Expire & Number)
    cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        e.target.value = val;
    });

    cardNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        e.target.value = formatted;
    });

    // Submit Payment Form
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cardHolder = document.getElementById('cardName').value.trim();
        
        // Transition to Processing Step
        modalStepForm.classList.remove('active');
        modalStepProcessing.classList.add('active');

        // Simulate secure API request
        setTimeout(() => {
            // Populate Success screen receipt
            successPlanName.textContent = currentPlanSelected;
            successClient.textContent = cardHolder || 'Cliente Pocket';
            successPrice.textContent = `${currentPlanPriceStr}/mes`;
            successTxId.textContent = `#INV-${Math.floor(1000 + Math.random() * 9000)}`;

            // Switch to Success Step
            modalStepProcessing.classList.remove('active');
            modalStepSuccess.classList.add('active');
        }, 2500); // 2.5 seconds encryption & auth simulation delay
    });
});
