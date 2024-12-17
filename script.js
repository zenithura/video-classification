// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Uygulama Durumunu Başlatma
    const state = initializeState();

    // 2. Yerleşim Ayarlarını Yapma
    prepareLayout(elements);

    // 3. Pencere Ölçeklendirmesini Yönetme
    handleScale(elements);
    window.onresize = () => handleScale(elements);

    // 4. Animasyon Zaman Çizelgelerini Oluşturma
    const emailTimeline = createEmailTimeline(elements, state);
    const gearsTimelines = createGearsTimelines(elements, state);
    const pullingTimeline = createPullingTimeline(elements, state);

    // 5. Event Listener'ları Ayarlama
    setupEventListeners(elements, gearsTimelines, emailTimeline, state);

    // 6. Animasyonları Başlatma
    startAnimations(gearsTimelines, emailTimeline);
});


/**
 * 1. Uygulama Durumunu Başlatma Fonksiyonu
 * Uygulamanın genel durumunu yöneten bir nesne oluşturur.
 */
function initializeState() {
    return {
        sprayRepeatCounter: 0,
        handClosed: false,
        submitBtnOnPlace: false,
        submitBtnTextOpacity: 0,
        pullProgress: 0,
        nameValid: false,
        emailValid: false
    };
}

/**
 * 2. Yerleşim Ayarlarını Yapma Fonksiyonu
 * Başlangıç konumlarını ve stil ayarlarını yapar.
 */
function prepareLayout(elements) {
    gsap.set(elements.containerEl, { color: "rgba(0, 0, 0, 0)", rotation: -90  });
    gsap.set(elements.submitBtn, { color: "rgba(0, 0, 0, 0)", rotation: -90 });
   
}

/**
 * 3. Pencere Ölçeklendirmesini Yönetme Fonksiyonu
 * Pencere boyutuna göre ölçeklendirmeyi yönetir.
 */
function handleScale(elements) {
    const baseHeight = 800;
    if (window.innerHeight < baseHeight) {
        gsap.set(elements.containerEl, {
            scale: window.innerHeight / baseHeight,
            transformOrigin: "50% 75%"
        });
    }
}

/**
 * 4. Animasyon Zaman Çizelgelerini Oluşturma Fonksiyonları
 */

// E-posta Doğrulama Animasyonu
function createEmailTimeline(elements, state) {
    const timeline = gsap.timeline({ paused: true })
        .to(elements.spiralPath, { rotation: -360, duration: 2 })
        .to(elements.car, { x: 100, duration: 1 }, "-=1");
    return timeline;
}

// Dişliler İçin Animasyonlar
function createGearsTimelines(elements, state) {
    const timelines = [];
    elements.gearsContainer.querySelectorAll('g').forEach((gear) => {
        const tl = gsap.timeline({ repeat: -1, paused: true })
            .to(gear, { rotation: 360, duration: 5, ease: "none" });
        timelines.push(tl);
    });
    return timelines;
}

// Çekme Sistemi Animasyonu
function createPullingTimeline(elements, state) {
    const timeline = gsap.timeline({ paused: true })
        .to(elements.submitBtn, { rotation: 0, duration: 1 })
        .to(elements.submitBtn, { opacity: 1, duration: 0.5 });
    return timeline;
}

/**
 * 5. Event Listener'ları Ayarlama Fonksiyonu
 * Form etkileşimleri için gerekli event listener'ları ayarlar.
 */
function setupEventListeners(elements, gearsTimelines, emailTimeline, state) {
    // Checkbox Değişikliği
    elements.checkboxEl.addEventListener('change', () => {
        pullingTimeline.play();
    });

    // İsim Girişi
    elements.nameEl.addEventListener('input', () => {
        state.nameValid = elements.nameEl.value.length > 3;
        toggleValidation(elements.nameEl, state.nameValid);
        toggleGears(gearsTimelines, state.nameValid);
    });

    // E-posta Girişi
    elements.emailEl.addEventListener('input', () => {
        state.emailValid = validateEmail(elements.emailEl.value);
        toggleValidation(elements.emailEl, state.emailValid);
        state.emailValid ? emailTimeline.play() : emailTimeline.reverse();
    });

    // Submit Butonuna Tıklanma
    elements.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.nameValid && state.emailValid && elements.checkboxEl.checked) {
            animateFormSubmission(elements);
        }
    });
}

/**
 * 6. Animasyonları Başlatma Fonksiyonu
 * Oluşturulan animasyon zaman çizelgelerini başlatır.
 */
function startAnimations(gearsTimelines, emailTimeline) {
    gearsTimelines.forEach(tl => tl.play());
    emailTimeline.play();
}

/**
 * Yardımcı Fonksiyonlar
 */

// E-posta Doğrulama
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Doğrulama Durumunu Güncelleme
function toggleValidation(element, isValid) {
    if (isValid) {
        element.classList.add("valid");
    } else {
        element.classList.remove("valid");
    }
}

// Dişlileri Kontrol Etme
function toggleGears(gearsTimelines, shouldPlay) {
    gearsTimelines.forEach(tl => {
        shouldPlay ? tl.play() : tl.pause();
    });
}

// Form Gönderimini Animasyonla İşleme
function animateFormSubmission(elements) {
    gsap.to(elements.containerEl, { opacity: 0, duration: 1 });
    gsap.to(elements.submitBtn, { opacity: 0, duration: 1, delay: 0.5 });
}
