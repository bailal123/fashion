# تطبيق تجربة الأزياء الإماراتية
# UAE Fashion Try-On Application

## نظرة عامة / Overview

تطبيق ويب تفاعلي يتيح للمستخدمين تجربة الأزياء الإماراتية التقليدية والإكسسوارات باستخدام الكاميرا وتقنية تتبع الوجه.

An interactive web application that allows users to try on traditional UAE fashion and accessories using camera and face tracking technology.

## المتطلبات / Requirements

- متصفح ويب حديث يدعم WebRTC / Modern web browser with WebRTC support
- كاميرا ويب / Webcam
- اتصال إنترنت لتحميل مكتبات MediaPipe / Internet connection for MediaPipe libraries

## كيفية التشغيل / How to Run

1. افتح ملف `index.html` في متصفح الويب
   Open `index.html` in a web browser

2. اسمح للتطبيق بالوصول للكاميرا
   Allow camera access when prompted

3. اختر الجنس لبدء التجربة
   Select gender to start the experience

## إضافة عناصر جديدة / Adding New Items

### النظارات / Glasses
ضع ملفات PNG في مجلد `assets/glasses/`
Place PNG files in `assets/glasses/` folder

### الساعات / Watches
ضع ملفات PNG في مجلد `assets/watches/`
Place PNG files in `assets/watches/` folder

### الحقائب / Bags
ضع ملفات PNG في مجلد `assets/bags/`
Place PNG files in `assets/bags/` folder

## هيكل المشروع / Project Structure

```
ProjectFashion/
├── index.html          # الملف الرئيسي / Main HTML file
├── style.css           # ملف التنسيق / CSS styles
├── script.js           # منطق التطبيق / Application logic
├── README.md           # هذا الملف / This file
└── assets/             # مجلد العناصر / Assets folder
    ├── glasses/        # النظارات / Glasses
    ├── watches/        # الساعات / Watches
    ├── bags/           # الحقائب / Bags
    └── traditional/    # الأزياء التقليدية / Traditional outfits
```

## الميزات / Features

- ✅ دعم اللغتين العربية والإنجليزية / Arabic and English support
- ✅ تتبع الوجه في الوقت الفعلي / Real-time face tracking
- ✅ تجربة الأزياء التقليدية الإماراتية / UAE traditional fashion try-on
- ✅ تجربة النظارات والساعات والحقائب / Glasses, watches, and bags try-on
- ✅ واجهة مستخدم تدعم اللمس / Touch-friendly interface
- ✅ تحميل العناصر ديناميكياً من المجلدات / Dynamic loading from folders

## التقنيات المستخدمة / Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- MediaPipe Holistic
- WebRTC

## حل مشاكل الكاميرا / Camera Troubleshooting

### إذا ظهرت رسالة "خطأ في الوصول للكاميرا" / If you see "Camera Access Error":

1. **تأكد من وجود كاميرا متصلة** / **Ensure camera is connected**
   - تحقق من أن الكاميرا متصلة بالجهاز
   - Check that camera is connected to your device

2. **السماح بالوصول للكاميرا** / **Allow camera access**
   - اضغط على "السماح" عند ظهور طلب الإذن
   - Click "Allow" when permission prompt appears
   - في Chrome: اذهب لإعدادات الموقع وفعل الكاميرا
   - In Chrome: Go to site settings and enable camera

3. **إغلاق التطبيقات الأخرى** / **Close other applications**
   - أغلق أي تطبيقات أخرى تستخدم الكاميرا
   - Close other apps using the camera

4. **إعادة تحميل الصفحة** / **Refresh the page**
   - اضغط F5 أو Ctrl+R لإعادة التحميل
   - Press F5 or Ctrl+R to refresh

5. **استخدام متصفح مختلف** / **Try different browser**
   - جرب Chrome أو Firefox أو Edge
   - Try Chrome, Firefox, or Edge

### الوضع التجريبي / Demo Mode
- إذا لم تعمل الكاميرا، سيعمل التطبيق في الوضع التجريبي
- If camera doesn't work, the app will run in demo mode
- يمكنك تجربة العناصر بدون كاميرا
- You can still try items without camera

## ملاحظات / Notes

- التطبيق يعمل بدون اتصال إنترنت بعد التحميل الأولي
  The app works offline after initial loading

- يمكن إضافة المزيد من العناصر بوضع ملفات PNG في المجلدات المناسبة
  More items can be added by placing PNG files in appropriate folders

- التطبيق محسن للشاشات التي تعمل باللمس
  The app is optimized for touch screens

## الدعم / Support

للحصول على المساعدة أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.
For help or to report issues, please contact the development team.