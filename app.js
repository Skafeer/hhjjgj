// app.js
document.addEventListener('DOMContentLoaded', function() {
    // تأكد من وجود بيانات المعلمين
    if (typeof teacherData2026 !== 'undefined' && teacherData2026.teachers) {
        setupEventListeners();
        renderSubjects();
    }
    
    // إضافة حدث القائمة المتنقلة
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }
});

// متغيرات عالمية
let hls = null;
const PROXY_URL = "https://abwaab-proxy.ss9758026.workers.dev"; // رابط Cloudflare Worker الخاص بك

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // العودة إلى المواد الدراسية
    document.getElementById('back-to-subjects').addEventListener('click', function() {
        showSection('subjects-section');
    });
    
    // العودة إلى المعلمين
    document.getElementById('back-to-teachers').addEventListener('click', function() {
        showSection('teachers-section');
    });
    
    // العودة إلى الفصول
    document.getElementById('back-to-classes').addEventListener('click', function() {
        showSection('classes-section');
    });
    
    // إغلاق مشغل الفيديو
    document.getElementById('close-video').addEventListener('click', function() {
        closeVideoPlayer();
    });
    
    // التحكم في مشغل الفيديو
    setupVideoControls();
    
    // البحث
    document.getElementById('search-btn').addEventListener('click', searchContent);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchContent();
        }
    });
    
    // التنقل
    document.getElementById('nav-teachers').addEventListener('click', function(e) {
        e.preventDefault();
        renderTeachers();
        showSection('teachers-section');
    });
    
    document.getElementById('nav-classes').addEventListener('click', function(e) {
        e.preventDefault();
        renderClasses();
        showSection('classes-section');
    });
}

// إظهار قسم معين وإخفاء الأقسام الأخرى
function showSection(sectionId) {
    const sections = [
        'subjects-section', 
        'teachers-section', 
        'classes-section', 
        'lectures-section',
        'features-section'
    ];
    
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = id === sectionId ? 'block' : 'none';
        }
    });
}

// عرض المواد الدراسية
function renderSubjects() {
    const subjectsContainer = document.getElementById('subjects-container');
    subjectsContainer.innerHTML = '';
    
    // تعريف المواد الدراسية
    const subjects = [
        { 
            name: "الرياضيات", 
            icon: "fas fa-calculator",
            teachers: teacherData2026.teachers.filter(t => t.subject.includes('الرياضيات'))
        },
        { 
            name: "الفيزياء", 
            icon: "fas fa-atom",
            teachers: teacherData2026.teachers.filter(t => t.subject.includes('الفيزياء'))
        },
        { 
            name: "الكيمياء", 
            icon: "fas fa-flask",
            teachers: teacherData2026.teachers.filter(t => t.subject.includes('الكيمياء'))
        },
        { 
            name: "الأحياء", 
            icon: "fas fa-dna",
            teachers: teacherData2026.teachers.filter(t => t.subject.includes('الأحياء'))
        },
        { 
            name: "اللغة العربية", 
            icon: "fas fa-book",
            teachers: teacherData2026.teachers.filter(t => t.subject.includes('اللغة العربية'))
        },
        { 
            name: "اللغة الانكليزية", 
            icon: "fas fa-language",
            teachers: teacherData2026.teachers.filter(t => t.subject.includes('اللغة الانكليزية'))
        }
    ];
    
    // عرض المواد الدراسية
    subjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <i class="${subject.icon}"></i>
            <h3>${subject.name}</h3>
            <p>${subject.teachers.length} مدرس متخصص</p>
            <div class="teachers-count">${subject.teachers.length} مدرس</div>
        `;
        
        // حدث النقر على المادة الدراسية
        subjectCard.addEventListener('click', function() {
            showTeachersBySubject(subject.name, subject.teachers);
        });
        
        subjectsContainer.appendChild(subjectCard);
    });
}

// عرض جميع المعلمين
function renderTeachers() {
    const teachersContainer = document.getElementById('teachers-container');
    const subjectTitle = document.getElementById('subject-title');
    
    // تحديث العنوان
    subjectTitle.textContent = `جميع المعلمين`;
    
    // إظهار قسم المعلمين وإخفاء الأقسام الأخرى
    showSection('teachers-section');
    
    // مسح المحتوى السابق
    teachersContainer.innerHTML = '';
    
    // عرض المعلمين
    teacherData2026.teachers.forEach(teacher => {
        const teacherCard = document.createElement('div');
        teacherCard.className = 'teacher-card';
        
        teacherCard.innerHTML = `
            <div class="teacher-header">
                <div class="teacher-avatar">
                    <img src="${teacher.image}" alt="${teacher.name}">
                </div>
                <div class="teacher-info">
                    <h3>${teacher.name}</h3>
                    <p>${teacher.subject}</p>
                </div>
            </div>
        `;
        
        // حدث النقر على المعلم
        teacherCard.addEventListener('click', function() {
            showClassesByTeacher(teacher);
        });
        
        teachersContainer.appendChild(teacherCard);
    });
}

// عرض جميع الفصول
function renderClasses() {
    const classesContainer = document.getElementById('classes-container');
    const teacherTitle = document.getElementById('teacher-title');
    
    // تحديث العنوان
    teacherTitle.textContent = `جميع الفصول الدراسية`;
    
    // إظهار قسم الفصول وإخفاء الأقسام الأخرى
    showSection('classes-section');
    
    // مسح المحتوى السابق
    classesContainer.innerHTML = '';
    
    // عرض الفصول
    teacherData2026.teachers.forEach(teacher => {
        teacher.classes.forEach((classItem, index) => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            
            classCard.innerHTML = `
                <i class="fas fa-book-open"></i>
                <h3>${classItem.name}</h3>
                <p>${teacher.name}</p>
                <div class="lectures-count">${classItem.lectures.length} محاضرة</div>
            `;
            
            // حدث النقر على الفصل
            classCard.addEventListener('click', function() {
                showLecturesByClass(teacher, classItem, index);
            });
            
            classesContainer.appendChild(classCard);
        });
    });
}

// عرض المعلمين حسب المادة الدراسية
function showTeachersBySubject(subjectName, teachers) {
    const teachersContainer = document.getElementById('teachers-container');
    const subjectTitle = document.getElementById('subject-title');
    
    // تحديث العنوان
    subjectTitle.textContent = `معلمو مادة ${subjectName}`;
    
    // إظهار قسم المعلمين وإخفاء الأقسام الأخرى
    showSection('teachers-section');
    
    // مسح المحتوى السابق
    teachersContainer.innerHTML = '';
    
    // عرض المعلمين
    teachers.forEach(teacher => {
        const teacherCard = document.createElement('div');
        teacherCard.className = 'teacher-card';
        
        teacherCard.innerHTML = `
            <div class="teacher-header">
                <div class="teacher-avatar">
                    <img src="${teacher.image}" alt="${teacher.name}">
                </div>
                <div class="teacher-info">
                    <h3>${teacher.name}</h3>
                    <p>${teacher.subject}</p>
                </div>
            </div>
        `;
        
        // حدث النقر على المعلم
        teacherCard.addEventListener('click', function() {
            showClassesByTeacher(teacher);
        });
        
        teachersContainer.appendChild(teacherCard);
    });
}

// عرض الفصول الدراسية حسب المعلم
function showClassesByTeacher(teacher) {
    const classesContainer = document.getElementById('classes-container');
    const teacherTitle = document.getElementById('teacher-title');
    
    // تحديث العنوان
    teacherTitle.textContent = `فصول الأستاذ ${teacher.name}`;
    
    // إظهار قسم الفصول وإخفاء الأقسام الأخرى
    showSection('classes-section');
    
    // مسح المحتوى السابق
    classesContainer.innerHTML = '';
    
    // عرض الفصول
    teacher.classes.forEach((classItem, index) => {
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        
        classCard.innerHTML = `
            <i class="fas fa-book-open"></i>
            <h3>${classItem.name}</h3>
            <div class="lectures-count">${classItem.lectures.length} محاضرة</div>
        `;
        
        // حدث النقر على الفصل
        classCard.addEventListener('click', function() {
            showLecturesByClass(teacher, classItem, index);
        });
        
        classesContainer.appendChild(classCard);
    });
}

// عرض المحاضرات حسب الفصل
function showLecturesByClass(teacher, classItem, classIndex) {
    const lecturesContainer = document.getElementById('lectures-container');
    const classTitle = document.getElementById('class-title');
    
    // تحديث العنوان
    classTitle.textContent = `المحاضرات - ${classItem.name}`;
    
    // إظهار قسم المحاضرات وإخفاء الأقسام الأخرى
    showSection('lectures-section');
    
    // مسح المحتوى السابق
    lecturesContainer.innerHTML = '';
    
    // عرض المحاضرات
    classItem.lectures.forEach(lecture => {
        const lectureCard = document.createElement('div');
        lectureCard.className = 'lecture-card';
        
        lectureCard.innerHTML = `
            <div class="lecture-thumb">
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="lecture-content">
                <h3 class="lecture-title">${lecture.title}</h3>
                <div class="lecture-meta">
                    <div class="lecture-duration">
                        <i class="fas fa-clock"></i>
                        <span>${lecture.duration || 'غير محدد'}</span>
                    </div>
                </div>
                <button class="watch-btn" data-url="${lecture.url}" data-title="${lecture.title}">
                    <i class="fas fa-play"></i> مشاهدة المحاضرة
                </button>
            </div>
        `;
        
        // حدث النقر على مشاهدة المحاضرة
        const watchBtn = lectureCard.querySelector('.watch-btn');
        watchBtn.addEventListener('click', function() {
            playLecture(this.dataset.url, this.dataset.title);
        });
        
        lecturesContainer.appendChild(lectureCard);
    });
}

// تشغيل المحاضرة باستخدام البروكسي
function playLecture(url, title) {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('lecture-video');
    const videoTitle = document.getElementById('video-title');
    
    // تحديث عنوان المحاضرة
    videoTitle.textContent = title;
    
    // إظهار مشغل الفيديو
    videoModal.classList.add('active');
    
    // تدمير مشغل HLS السابق إذا كان موجودًا
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    // إنشاء رابط البروكسي
    const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    
    // تهيئة مشغل HLS الجديد
    if (Hls.isSupported()) {
        hls = new Hls({
            debug: false,
            xhrSetup: function(xhr) {
                xhr.setRequestHeader('Cache-Control', 'no-cache');
                xhr.setRequestHeader('Pragma', 'no-cache');
            }
        });
        
        hls.loadSource(proxyUrl);
        hls.attachMedia(videoPlayer);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            videoPlayer.play().catch(e => {
                console.error('خطأ في التشغيل التلقائي:', e);
            });
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        closeVideoPlayer();
                        break;
                }
            }
        });
    } 
    // دعم المتصفحات التي تدعم HLS بشكل أصلي (مثل Safari)
    else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = proxyUrl;
        videoPlayer.addEventListener('loadedmetadata', function() {
            videoPlayer.play().catch(e => {
                console.error('خطأ في التشغيل التلقائي:', e);
            });
        });
    } else {
        alert('عذرًا، متصفحك لا يدعم تشغيل هذا النوع من الفيديوهات.');
    }
    
    // تحديث عناصر التحكم
    setupVideoControls();
}

// إغلاق مشغل الفيديو
function closeVideoPlayer() {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('lecture-video');
    
    videoPlayer.pause();
    videoModal.classList.remove('active');
    
    // تدمير مشغل HLS عند الإغلاق
    if (hls) {
        hls.destroy();
        hls = null;
    }
}

// إعداد عناصر التحكم بالفيديو
function setupVideoControls() {
    const video = document.getElementById('lecture-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const rewindBtn = document.getElementById('rewind-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const speedSelect = document.getElementById('speed-select');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const closeBtn = document.getElementById('close-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const progressTime = document.getElementById('progress-time');
    
    // زر التشغيل/الإيقاف المؤقت
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // تحديث أيقونة التشغيل/الإيقاف
    video.addEventListener('play', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    video.addEventListener('pause', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // الترجيع 10 ثواني
    rewindBtn.addEventListener('click', function() {
        video.currentTime -= 10;
    });
    
    // التقديم 10 ثواني
    forwardBtn.addEventListener('click', function() {
        video.currentTime += 10;
    });
    
    // تغيير سرعة التشغيل
    speedSelect.addEventListener('change', function() {
        video.playbackRate = parseFloat(this.value);
    });
    
    // التحكم في مستوى الصوت
    volumeSlider.addEventListener('input', function() {
        video.volume = this.value;
        if (this.value > 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // كتم الصوت
    volumeBtn.addEventListener('click', function() {
        if (video.volume > 0) {
            video.volume = 0;
            volumeSlider.value = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            video.volume = 1;
            volumeSlider.value = 1;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });
    
    // وضع ملء الشاشة
    fullscreenBtn.addEventListener('click', function() {
        const videoContainer = document.querySelector('.video-container');
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });
    
    // زر إغلاق الفيديو
    closeBtn.addEventListener('click', function() {
        closeVideoPlayer();
    });
    
    // شريط التقدم
    video.addEventListener('timeupdate', function() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
    });
    
    // النقر على شريط التقدم
    progressContainer.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });
    
    // عرض وقت التقدم عند تحريك الماوس
    progressContainer.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const time = pos * video.duration;
        
        // تحويل الوقت إلى دقائق وثواني
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        
        progressTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        progressTime.style.left = `${e.clientX - rect.left}px`;
    });
}

// وظيفة البحث
function searchContent() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    if (!searchTerm) return;
    
    // جمع نتائج البحث
    const results = {
        teachers: [],
        classes: [],
        lectures: []
    };
    
    // البحث في المعلمين
    teacherData2026.teachers.forEach(teacher => {
        if (teacher.name.toLowerCase().includes(searchTerm) || 
            teacher.subject.toLowerCase().includes(searchTerm)) {
            results.teachers.push(teacher);
        }
        
        // البحث في الفصول
        teacher.classes.forEach(classItem => {
            if (classItem.name.toLowerCase().includes(searchTerm)) {
                results.classes.push({
                    teacher,
                    classItem
                });
            }
            
            // البحث في المحاضرات
            classItem.lectures.forEach(lecture => {
                if (lecture.title.toLowerCase().includes(searchTerm) || 
                    (lecture.description && lecture.description.toLowerCase().includes(searchTerm))) {
                    results.lectures.push({
                        teacher,
                        classItem,
                        lecture
                    });
                }
            });
        });
    });
    
    // عرض نتائج البحث
    displaySearchResults(results);
}

// عرض نتائج البحث
function displaySearchResults(results) {
    // إظهار قسم المعلمين وإخفاء الأقسام الأخرى
    showSection('teachers-section');
    
    const teachersContainer = document.getElementById('teachers-container');
    const subjectTitle = document.getElementById('subject-title');
    
    // تحديث العنوان
    subjectTitle.textContent = `نتائج البحث`;
    
    // مسح المحتوى السابق
    teachersContainer.innerHTML = '';
    
    // عرض نتائج البحث
    if (results.teachers.length > 0) {
        const heading = document.createElement('h3');
        heading.textContent = 'المعلمون:';
        heading.style.margin = '20px 0';
        heading.style.color = 'var(--primary)';
        teachersContainer.appendChild(heading);
        
        results.teachers.forEach(teacher => {
            const teacherCard = document.createElement('div');
            teacherCard.className = 'teacher-card';
            
            teacherCard.innerHTML = `
                <div class="teacher-header">
                    <div class="teacher-avatar">
                        <img src="${teacher.image}" alt="${teacher.name}">
                    </div>
                    <div class="teacher-info">
                        <h3>${teacher.name}</h3>
                        <p>${teacher.subject}</p>
                    </div>
                </div>
            `;
            
            teachersContainer.appendChild(teacherCard);
        });
    }
    
    if (results.classes.length > 0) {
        const heading = document.createElement('h3');
        heading.textContent = 'الفصول الدراسية:';
        heading.style.margin = '20px 0';
        heading.style.color = 'var(--primary)';
        teachersContainer.appendChild(heading);
        
        results.classes.forEach(result => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            
            classCard.innerHTML = `
                <i class="fas fa-book-open"></i>
                <h3>${result.classItem.name}</h3>
                <p>${result.teacher.name}</p>
                <div class="lectures-count">${result.classItem.lectures.length} محاضرة</div>
            `;
            
            teachersContainer.appendChild(classCard);
        });
    }
    
    if (results.lectures.length > 0) {
        const heading = document.createElement('h3');
        heading.textContent = 'المحاضرات:';
        heading.style.margin = '20px 0';
        heading.style.color = 'var(--primary)';
        teachersContainer.appendChild(heading);
        
        results.lectures.forEach(result => {
            const lectureCard = document.createElement('div');
            lectureCard.className = 'lecture-card';
            
            lectureCard.innerHTML = `
                <div class="lecture-thumb">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="lecture-content">
                    <h3 class="lecture-title">${result.lecture.title}</h3>
                    <div class="lecture-meta">
                        <div class="lecture-duration">
                            <i class="fas fa-clock"></i>
                            <span>${result.lecture.duration || 'غير محدد'}</span>
                        </div>
                    </div>
                    <button class="watch-btn" data-url="${result.lecture.url}" data-title="${result.lecture.title}">
                        <i class="fas fa-play"></i> مشاهدة المحاضرة
                    </button>
                </div>
            `;
            
            const watchBtn = lectureCard.querySelector('.watch-btn');
            watchBtn.addEventListener('click', function() {
                playLecture(this.dataset.url, this.dataset.title);
            });
            
            teachersContainer.appendChild(lectureCard);
        });
    }
    
    if (results.teachers.length === 0 && results.classes.length === 0 && results.lectures.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px;"></i>
            <h3>لا توجد نتائج</h3>
            <p>لم نعثر على أي نتائج تطابق بحثك</p>
        `;
        teachersContainer.appendChild(noResults);
    }
}

// تبديل القائمة المتنقلة
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
