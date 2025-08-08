// متغيرات عامة
let currentGender = null;
let video = null;
let canvas = null;
let ctx = null;
let holistic = null;
let camera = null;
let currentLanguage = 'ar';

// المراجع للعناصر
const welcomeScreen = document.getElementById('welcome-screen');
const tryOnScreen = document.getElementById('try-on-screen');
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const overlayContainer = document.getElementById('overlay-container');
const cameraPermissionDiv = document.getElementById('camera-permission');
const genderSelectionDiv = document.getElementById('gender-selection');
const requestCameraBtn = document.getElementById('request-camera-btn');

// متغير لتتبع حالة أذونات الكاميرا
let cameraPermissionGranted = false;

// النصوص متعددة اللغات
const translations = {
    ar: {
        welcome: 'مرحباً بك في تجربة الأزياء الإماراتية',
        chooseGender: 'اختر جنسك لبدء التجربة',
        male: 'ذكر',
        female: 'أنثى',
        glasses: 'النظارات',
        watches: 'الساعات',
        bags: 'الحقائب',
        back: 'العودة',
        clearAll: 'إزالة الكل',
        remove: 'إزالة',
        cameraPermissionText: 'للحصول على أفضل تجربة، يرجى السماح بالوصول للكاميرا',
        allowCameraAccess: '🔓 السماح بالوصول للكاميرا',
        demoModeNote: 'يمكنك أيضاً استخدام التطبيق في الوضع التجريبي بدون كاميرا'
    },
    en: {
        welcome: 'Welcome to UAE Fashion Try-On',
        chooseGender: 'Choose your gender to start',
        male: 'Male',
        female: 'Female',
        glasses: 'Glasses',
        watches: 'Watches',
        bags: 'Bags',
        back: 'Back',
        clearAll: 'Clear All',
        remove: 'Remove',
        cameraPermissionText: 'For the best experience, please allow camera access',
        allowCameraAccess: '🔓 Allow Camera Access',
        demoModeNote: 'You can also use the app in demo mode without camera'
    }
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadAssets();
}

// دالة لطلب أذونات الكاميرا
async function requestCameraPermission() {
    try {
        // محاولة الحصول على إذن الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // إيقاف الكاميرا مؤقتاً
        stream.getTracks().forEach(track => track.stop());
        
        // تحديث حالة الأذونات
        cameraPermissionGranted = true;
        
        // إخفاء شاشة طلب الأذونات وإظهار اختيار الجنس
        cameraPermissionDiv.style.display = 'none';
        genderSelectionDiv.style.display = 'flex';
        
        // تحديث النص
        const welcomeContainer = document.querySelector('.welcome-container h1');
        welcomeContainer.textContent = currentLanguage === 'ar' ? 'اختر جنسك لبدء التجربة' : 'Choose your gender to start';
        
        showSuccessMessage(currentLanguage === 'ar' ? 
            'تم منح الإذن بنجاح! يمكنك الآن اختيار جنسك.' : 
            'Permission granted successfully! You can now choose your gender.');
            
    } catch (error) {
        console.log('Camera permission denied or error:', error);
        
        // إظهار رسالة خطأ مع خيار المتابعة في الوضع التجريبي
        showCameraPermissionError(error);
    }
}

// دالة لإظهار رسالة نجاح
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <p>${message}</p>
        </div>
    `;
    
    // إضافة الأنماط
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // إزالة الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// دالة لإظهار خطأ أذونات الكاميرا
function showCameraPermissionError(error) {
    let errorMessage = '';
    let arabicMessage = '';
    
    if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied. You can still use demo mode.';
        arabicMessage = 'تم رفض الوصول للكاميرا. يمكنك استخدام الوضع التجريبي.';
    } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. You can use demo mode.';
        arabicMessage = 'لم يتم العثور على كاميرا. يمكنك استخدام الوضع التجريبي.';
    } else {
        errorMessage = 'Camera error occurred. You can use demo mode.';
        arabicMessage = 'حدث خطأ في الكاميرا. يمكنك استخدام الوضع التجريبي.';
    }
    
    const finalMessage = currentLanguage === 'ar' ? arabicMessage : errorMessage;
    
    // إخفاء شاشة طلب الأذونات وإظهار اختيار الجنس
    cameraPermissionDiv.style.display = 'none';
    genderSelectionDiv.style.display = 'flex';
    
    // تحديث النص
    const welcomeContainer = document.querySelector('.welcome-container h1');
    welcomeContainer.textContent = currentLanguage === 'ar' ? 
        'اختر جنسك لبدء التجربة (الوضع التجريبي)' : 
        'Choose your gender to start (Demo Mode)';
    
    // إظهار رسالة الخطأ
    showErrorMessage(finalMessage);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر طلب أذونات الكاميرا
    requestCameraBtn.addEventListener('click', requestCameraPermission);
    
    // أزرار اختيار الجنس
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentGender = this.dataset.gender;
            startTryOn();
        });
    });

    // زر تبديل اللغة
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

    // زر العودة
    document.getElementById('back-btn').addEventListener('click', goBack);

    // زر إزالة الكل
    document.getElementById('clear-all-btn').addEventListener('click', clearAllItems);
}

// تبديل اللغة
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    document.body.className = currentLanguage === 'en' ? 'en' : '';
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    updateTexts();
}

// تحديث النصوص
function updateTexts() {
    const t = translations[currentLanguage];
    
    const welcomeTitle = document.querySelector('.welcome-container h1');
    if (welcomeTitle) {
        welcomeTitle.textContent = t.welcome;
    }
    
    const welcomeSubtitle = document.querySelector('.welcome-container p');
    if (welcomeSubtitle) {
        welcomeSubtitle.textContent = t.chooseGender;
    }
    
    // تحديث نص طلب أذونات الكاميرا
    const permissionText = document.querySelector('.permission-info p');
    if (permissionText) {
        permissionText.textContent = t.cameraPermissionText;
    }
    
    const permissionBtn = document.querySelector('#request-camera-btn span');
    if (permissionBtn) {
        permissionBtn.textContent = t.allowCameraAccess;
    }
    
    const permissionNote = document.querySelector('.permission-note');
    if (permissionNote) {
        permissionNote.textContent = t.demoModeNote;
    }
    
    // تحديث أزرار الجنس
    const maleBtn = document.querySelector('[data-gender="male"] span');
    const femaleBtn = document.querySelector('[data-gender="female"] span');
    if (maleBtn) maleBtn.textContent = t.male;
    if (femaleBtn) femaleBtn.textContent = t.female;
    
    document.querySelector('#lang-toggle').textContent = currentLanguage === 'ar' ? 'English' : 'العربية';
    
    // تحديث نصوص شاشة التجربة
    const sections = document.querySelectorAll('.control-section h3');
    if (sections[0]) sections[0].textContent = t.glasses;
    if (sections[1]) sections[1].textContent = t.watches;
    if (sections[2]) sections[2].textContent = t.bags;
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.textContent = t.back;
    
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) clearAllBtn.textContent = t.clearAll;
}

// بدء تجربة الأزياء
async function startTryOn() {
    welcomeScreen.classList.remove('active');
    tryOnScreen.classList.add('active');
    
    // إظهار قسم الحقائب للنساء فقط
    const bagsSection = document.getElementById('bags-section');
    if (currentGender === 'female') {
        bagsSection.style.display = 'block';
    } else {
        bagsSection.style.display = 'none';
    }
    
    // عرض الزي التقليدي أولاً
    showTraditionalOutfit();
    
    // تحميل الأصول (النظارات، الساعات، الحقائب)
    await loadAssets();
    
    // محاولة تهيئة الكاميرا
    try {
        await initializeCamera();
        await initializeMediaPipe();
    } catch (error) {
        console.error('فشل في تهيئة الكاميرا أو MediaPipe:', error);
        // يمكن للمستخدم الاستمرار بدون كاميرا (وضع تجريبي)
        showDemoMode();
    }
}

// تهيئة الكاميرا
async function initializeCamera() {
    try {
        video = videoElement;
        canvas = canvasElement;
        ctx = canvas.getContext('2d');
        
        // فحص دعم المتصفح
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('المتصفح لا يدعم الوصول للكاميرا');
        }
        
        // طلب الأذونات أولاً
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' });
            console.log('حالة أذونات الكاميرا:', permissionStatus.state);
        } catch (e) {
            console.log('لا يمكن فحص أذونات الكاميرا');
        }
        
        // فحص الأجهزة المتاحة
        let devices;
        try {
            devices = await navigator.mediaDevices.enumerateDevices();
        } catch (e) {
            console.warn('فشل في فحص الأجهزة:', e);
            devices = [];
        }
        
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('الكاميرات المتاحة:', videoDevices.length);
        console.log('تفاصيل الكاميرات:', videoDevices);
        
        // خيارات مختلفة للاتصال بالكاميرا (من الأبسط للأعقد)
        const constraints = [
            // محاولة بسيطة
            { video: true },
            // محاولة مع تحديد المستخدم
            { video: { facingMode: 'user' } },
            // محاولة مع دقة منخفضة
            { video: { width: 320, height: 240 } },
            // محاولة مع دقة متوسطة
            { video: { width: 640, height: 480, facingMode: 'user' } },
            // محاولة مع دقة عالية
            { video: { width: 1280, height: 720, facingMode: 'user' } }
        ];
        
        // إضافة محاولات مع deviceId إذا توفرت
        if (videoDevices.length > 0) {
            for (const device of videoDevices) {
                if (device.deviceId) {
                    constraints.push({ video: { deviceId: { exact: device.deviceId } } });
                    constraints.push({ video: { deviceId: device.deviceId } });
                }
            }
        }
        
        let stream = null;
        let lastError = null;
        
        // محاولة الاتصال مع كل خيار
        for (let i = 0; i < constraints.length; i++) {
            const constraint = constraints[i];
            try {
                console.log(`محاولة ${i + 1}/${constraints.length} مع الإعدادات:`, constraint);
                stream = await navigator.mediaDevices.getUserMedia(constraint);
                console.log('نجح الاتصال مع الإعدادات:', constraint);
                break;
            } catch (err) {
                lastError = err;
                console.warn(`فشلت المحاولة ${i + 1}:`, err.name, err.message);
                
                // إذا كان الخطأ NotAllowedError، لا نحتاج لمحاولة المزيد
                if (err.name === 'NotAllowedError') {
                    break;
                }
                continue;
            }
        }
        
        if (!stream) {
            throw lastError || new Error('فشل في الاتصال بالكاميرا مع جميع الإعدادات المتاحة');
        }
        
        video.srcObject = stream;
        
        // إضافة معالج للأخطاء
        video.addEventListener('error', (e) => {
            console.error('خطأ في عنصر الفيديو:', e);
        });
        
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            console.log('تم تهيئة الكاميرا بنجاح:', video.videoWidth + 'x' + video.videoHeight);
        });
        
        // التأكد من تشغيل الفيديو
        try {
            await video.play();
            console.log('تم تشغيل الفيديو بنجاح');
        } catch (playError) {
            console.error('خطأ في تشغيل الفيديو:', playError);
            throw playError;
        }
        
    } catch (error) {
        console.error('خطأ في الوصول للكاميرا:', error);
        
        let errorMessage = 'لا يمكن الوصول للكاميرا. ';
        let troubleshootingTips = '';
        
        if (error.name === 'NotFoundError') {
            errorMessage += 'لم يتم العثور على كاميرا.';
            troubleshootingTips = '\n\n• تأكد من توصيل الكاميرا بالجهاز\n• تأكد من تشغيل الكاميرا\n• أعد تشغيل المتصفح';
        } else if (error.name === 'NotAllowedError') {
            errorMessage += 'تم رفض الوصول للكاميرا.';
            troubleshootingTips = '\n\n• اضغط على رمز الكاميرا في شريط العنوان\n• اختر "السماح" أو "Allow"\n• أعد تحميل الصفحة';
        } else if (error.name === 'NotReadableError') {
            errorMessage += 'الكاميرا مستخدمة من تطبيق آخر.';
            troubleshootingTips = '\n\n• أغلق تطبيقات الفيديو الأخرى\n• أغلق Zoom, Teams, Skype\n• أعد تشغيل المتصفح';
        } else if (error.name === 'OverconstrainedError') {
            errorMessage += 'إعدادات الكاميرا غير مدعومة.';
            troubleshootingTips = '\n\n• جرب متصفح مختلف\n• تحديث تعريفات الكاميرا';
        } else {
            errorMessage += 'خطأ: ' + error.message;
            troubleshootingTips = '\n\n• جرب متصفح Chrome\n• تأكد من تحديث المتصفح\n• أعد تشغيل الجهاز';
        }
        
        // عرض رسالة خطأ مفصلة
        showErrorMessage(errorMessage + troubleshootingTips);
        
        // العودة للشاشة الرئيسية
        setTimeout(() => {
            goBack();
        }, 8000);
        
        throw error;
    }
}

// تهيئة MediaPipe
async function initializeMediaPipe() {
    holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
    });
    
    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    holistic.onResults(onResults);
    
    camera = new Camera(video, {
        onFrame: async () => {
            await holistic.send({ image: video });
        },
        width: 1280,
        height: 720
    });
    
    camera.start();
}

// معالجة نتائج تتبع الوجه
function onResults(results) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم الفيديو
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    
    if (results.faceLandmarks) {
        positionGlasses(results.faceLandmarks);
    }
    
    if (results.poseLandmarks) {
        positionWatch(results.poseLandmarks);
        if (currentGender === 'female') {
            positionBag(results.poseLandmarks);
        }
    }
    
    ctx.restore();
}

// عرض الزي الإماراتي
function showTraditionalOutfit() {
    const outfit = document.getElementById('traditional-outfit');
    const outfitPath = currentGender === 'male' ? 
        'assets/traditional/kandura.png' : 
        'assets/traditional/abaya.png';
    
    outfit.src = outfitPath;
    outfit.style.display = 'block';
    outfit.style.width = '100%';
    outfit.style.height = '100%';
    outfit.style.objectFit = 'cover';
}

// تحديد موضع النظارات
function positionGlasses(faceLandmarks) {
    const glasses = document.getElementById('glasses');
    if (glasses.style.display === 'none') return;
    
    // نقاط العينين
    const leftEye = faceLandmarks[33];
    const rightEye = faceLandmarks[263];
    
    if (leftEye && rightEye) {
        const centerX = (leftEye.x + rightEye.x) / 2 * canvas.width;
        const centerY = (leftEye.y + rightEye.y) / 2 * canvas.height;
        const eyeDistance = Math.abs(rightEye.x - leftEye.x) * canvas.width;
        
        glasses.style.left = (centerX - eyeDistance * 0.8) + 'px';
        glasses.style.top = (centerY - eyeDistance * 0.3) + 'px';
        glasses.style.width = (eyeDistance * 1.6) + 'px';
        glasses.style.height = (eyeDistance * 0.8) + 'px';
    }
}

// تحديد موضع الساعة
function positionWatch(poseLandmarks) {
    const watch = document.getElementById('watch');
    if (watch.style.display === 'none') return;
    
    // نقطة المعصم الأيسر
    const leftWrist = poseLandmarks[15];
    
    if (leftWrist && leftWrist.visibility > 0.5) {
        const x = leftWrist.x * canvas.width;
        const y = leftWrist.y * canvas.height;
        
        watch.style.left = (x - 30) + 'px';
        watch.style.top = (y - 30) + 'px';
        watch.style.width = '60px';
        watch.style.height = '60px';
    }
}

// تحديد موضع الحقيبة
function positionBag(poseLandmarks) {
    const bag = document.getElementById('bag');
    if (bag.style.display === 'none') return;
    
    // نقطة الكتف الأيمن
    const rightShoulder = poseLandmarks[12];
    
    if (rightShoulder && rightShoulder.visibility > 0.5) {
        const x = rightShoulder.x * canvas.width;
        const y = rightShoulder.y * canvas.height;
        
        bag.style.left = (x + 20) + 'px';
        bag.style.top = (y + 50) + 'px';
        bag.style.width = '80px';
        bag.style.height = '100px';
    }
}

// تحميل العناصر من المجلدات
async function loadAssets() {
    await loadGlasses();
    await loadWatches();
    await loadBags();
}

// تحميل النظارات
async function loadGlasses() {
    const container = document.getElementById('glasses-options');
    const glassesPath = 'assets/glasses/';
    
    // إضافة زر الإزالة
    const removeBtn = createRemoveButton('glasses');
    container.appendChild(removeBtn);
    
    // تحميل النظارات (محاكاة - في التطبيق الحقيقي ستحتاج API لقراءة المجلد)
    const glassesItems = ['glasses1.png', 'glasses2.png', 'glasses3.png'];
    
    glassesItems.forEach((item, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.innerHTML = `<img src="${glassesPath}${item}" alt="نظارة ${index + 1}">`;
        optionDiv.addEventListener('click', () => selectGlasses(glassesPath + item));
        container.appendChild(optionDiv);
    });
}

// تحميل الساعات
async function loadWatches() {
    const container = document.getElementById('watches-options');
    const watchesPath = 'assets/watches/';
    
    // إضافة زر الإزالة
    const removeBtn = createRemoveButton('watch');
    container.appendChild(removeBtn);
    
    // تحميل الساعات
    const watchesItems = ['watch1.png', 'watch2.png', 'watch3.png'];
    
    watchesItems.forEach((item, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.innerHTML = `<img src="${watchesPath}${item}" alt="ساعة ${index + 1}">`;
        optionDiv.addEventListener('click', () => selectWatch(watchesPath + item));
        container.appendChild(optionDiv);
    });
}

// تحميل الحقائب
async function loadBags() {
    const container = document.getElementById('bags-options');
    const bagsPath = 'assets/bags/';
    
    // إضافة زر الإزالة
    const removeBtn = createRemoveButton('bag');
    container.appendChild(removeBtn);
    
    // تحميل الحقائب
    const bagsItems = ['bag1.png', 'bag2.png', 'bag3.png'];
    
    bagsItems.forEach((item, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.innerHTML = `<img src="${bagsPath}${item}" alt="حقيبة ${index + 1}">`;
        optionDiv.addEventListener('click', () => selectBag(bagsPath + item));
        container.appendChild(optionDiv);
    });
}

// إنشاء زر الإزالة
function createRemoveButton(itemType) {
    const removeBtn = document.createElement('div');
    removeBtn.className = 'option-item remove-btn';
    removeBtn.textContent = translations[currentLanguage].remove;
    removeBtn.addEventListener('click', () => removeItem(itemType));
    return removeBtn;
}

// اختيار النظارات
function selectGlasses(src) {
    const glasses = document.getElementById('glasses');
    glasses.src = src;
    glasses.style.display = 'block';
    updateActiveOption('glasses-options', event.target.closest('.option-item'));
}

// اختيار الساعة
function selectWatch(src) {
    const watch = document.getElementById('watch');
    watch.src = src;
    watch.style.display = 'block';
    updateActiveOption('watches-options', event.target.closest('.option-item'));
}

// اختيار الحقيبة
function selectBag(src) {
    const bag = document.getElementById('bag');
    bag.src = src;
    bag.style.display = 'block';
    updateActiveOption('bags-options', event.target.closest('.option-item'));
}

// إزالة عنصر
function removeItem(itemType) {
    const item = document.getElementById(itemType);
    item.style.display = 'none';
    
    // إزالة التحديد النشط
    const container = document.getElementById(itemType + (itemType === 'watch' ? 'es' : 's') + '-options');
    container.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('active'));
}

// تحديث الخيار النشط
function updateActiveOption(containerId, selectedOption) {
    const container = document.getElementById(containerId);
    container.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('active'));
    if (selectedOption && !selectedOption.classList.contains('remove-btn')) {
        selectedOption.classList.add('active');
    }
}

// إزالة جميع العناصر
function clearAllItems() {
    document.getElementById('glasses').style.display = 'none';
    document.getElementById('watch').style.display = 'none';
    document.getElementById('bag').style.display = 'none';
    
    // إزالة جميع التحديدات النشطة
    document.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('active'));
}

// عرض رسالة خطأ
function showErrorMessage(message) {
    // إنشاء خلفية شفافة
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // إنشاء عنصر رسالة الخطأ
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 2.5rem;
        border-radius: 15px;
        text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};
        max-width: 90%;
        max-height: 80%;
        overflow-y: auto;
        font-size: 1.1rem;
        line-height: 1.6;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);
        direction: ${currentLanguage === 'ar' ? 'rtl' : 'ltr'};
    `;
    
    // تنسيق الرسالة مع أيقونات
    const formattedMessage = message
        .replace(/•/g, '📌')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 1rem; font-size: 1.3rem; font-weight: bold;">
            <span style="font-size: 2rem; margin-${currentLanguage === 'ar' ? 'left' : 'right'}: 0.5rem;">📷</span>
            ${currentLanguage === 'ar' ? 'مشكلة في الكاميرا' : 'Camera Issue'}
        </div>
        <div style="margin-bottom: 1.5rem;">
            ${formattedMessage}
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'"
                    onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                ${currentLanguage === 'ar' ? '✅ فهمت' : '✅ Got it'}
            </button>
        </div>
    `;
    
    overlay.appendChild(errorDiv);
    document.body.appendChild(overlay);
    
    // إزالة الرسالة بعد 10 ثوان
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 10000);
    
    // إزالة الرسالة عند النقر على الخلفية
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// العودة للشاشة الرئيسية
function goBack() {
    // إيقاف الكاميرا
    if (camera) {
        camera.stop();
    }
    
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
    
    // إخفاء جميع العناصر
    clearAllItems();
    document.getElementById('traditional-outfit').style.display = 'none';
    
    // العودة للشاشة الرئيسية
    tryOnScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    
    currentGender = null;
}

// عرض الوضع التجريبي
function showDemoMode() {
    // رسالة الوضع التجريبي
    const demoDiv = document.createElement('div');
    demoDiv.id = 'demo-mode-banner';
    demoDiv.style.cssText = `
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #FF6B35, #F7931E);
        color: white;
        padding: 1rem 2rem;
        border-radius: 15px;
        text-align: center;
        z-index: 100;
        font-size: 1.1rem;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        animation: pulse 2s infinite;
    `;
    
    const demoText = currentLanguage === 'ar' ? 
        '🎭 الوضع التجريبي - يمكنك تجربة الأزياء بدون كاميرا' : 
        '🎭 Demo Mode - Try outfits without camera';
    
    demoDiv.textContent = demoText;
    
    document.getElementById('try-on-screen').appendChild(demoDiv);
    
    // إخفاء الفيديو وإظهار صورة تجريبية
    const video = document.getElementById('video');
    video.style.display = 'none';
    
    // إنشاء صورة تجريبية محسنة
    const demoImage = document.createElement('div');
    demoImage.id = 'demo-placeholder';
    demoImage.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        text-align: center;
        position: relative;
        border-radius: 15px;
        margin: 10px;
    `;
    
    const placeholderText = currentLanguage === 'ar' ? 
        '👤<br><br>صورة تجريبية<br><small>يمكنك تجربة الأزياء والإكسسوارات</small>' : 
        '👤<br><br>Demo Image<br><small>You can try outfits and accessories</small>';
    
    demoImage.innerHTML = placeholderText;
    
    const cameraContainer = document.querySelector('.camera-container');
    cameraContainer.appendChild(demoImage);
    
    // إضافة تأثير النبض للرسالة
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
            100% { transform: translateX(-50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// تحديث النصوص عند التحميل
updateTexts();