/* ============================================
   APP.JS — ถึงฉัน... ในวันที่ฝนตก
   Full-featured emotional journal app
   ============================================ */

(function () {
    'use strict';

    /* ─── CONFIG & DATA ─── */
    const STORAGE_KEY = 'rainyday_data_v2';
    const MOODS = [
        { id: 'hug', label: '🤍 กอดตัวเอง', css: 'mood-hug', color: '#3da3e0' },
        { id: 'release', label: '🍃 ปล่อยวาง', css: 'mood-release', color: '#22c55e' },
        { id: 'tired', label: '🌧️ เหนื่อยจัง', css: 'mood-tired', color: '#94a0ae' },
        { id: 'hope', label: '🌱 ความหวัง', css: 'mood-hope', color: '#eab308' },
        { id: 'miss', label: '💭 คิดถึง', css: 'mood-miss', color: '#7c3aed' },
        { id: 'grateful', label: '☕ ขอบคุณ', css: 'mood-grateful', color: '#9c836a' },
        { id: 'angry', label: '🔥 หงุดหงิด', css: 'mood-angry', color: '#dc2626' }
    ];

    const AFFIRMATIONS = [
        'ทุกวันมีเมฆ แต่ไม่ใช่ทุกวันที่ฝนตก — ค่อยๆ ผ่านไปทีละวันนะ',
        'ไม่ต้องเก่งที่สุด แค่เป็นตัวเองก็พอแล้ว',
        'ฝนที่ตกหนัก เดี๋ยวก็หยุด... เหมือนความเศร้าที่จะค่อยๆ จางลง',
        'คนเก่งไม่ใช่คนที่ไม่เคยร้องไห้ แต่คือคนที่ลุกขึ้นมาอีกครั้ง',
        'เธอทำดีที่สุดแล้วในวันนี้ — อย่าลืมชื่นชมตัวเอง',
        'ให้ความรู้สึกมันไหลไปเหมือนสายน้ำ อย่ากั้นมันไว้',
        'ร่มคันเล็กๆ ก็ปกป้องหัวใจได้ — ข้อความนี้คือร่มของเธอ',
        'พักผ่อนไม่ได้แปลว่าขี้เกียจ แปลว่ารักตัวเอง',
        'วันนี้จะผ่านไปได้ เหมือนทุกวันที่ผ่านมา',
        'กอดตัวเองให้แน่นๆ นะ เพราะเธอสำคัญ',
        'บางทีแค่นั่งเฉยๆ ฟังเสียงฝนก็เยียวยาหัวใจได้',
        'ความกล้าหาญที่แท้จริงคือการยอมรับว่าเราไม่โอเค'
    ];

    const WRITING_PROMPTS = [
        'ลองเขียนเรื่องที่อยากบอกตัวเองวันนี้...',
        'ถ้าเขียนจดหมายถึงตัวเองในอนาคต จะบอกอะไร?',
        'วันนี้มีเรื่องอะไรที่ทำให้ยิ้มได้บ้างไหม?',
        'สิ่งที่อยากปล่อยวาง ณ ตอนนี้คืออะไร?',
        'ถ้าฝนตกแล้วล้างความเศร้าออกไปได้ อยากล้างเรื่องไหน?',
        'คนที่คิดถึงที่สุดตอนนี้คือใคร?',
        'สิ่งเล็กๆ ที่ทำให้หัวใจอุ่นในวันนี้คืออะไร?',
        'อะไรที่อยากบอกตัวเองเมื่อ 5 ปีก่อน?',
        'ถ้าพรุ่งนี้ทุกอย่างดีขึ้น สิ่งแรกที่อยากทำคืออะไร?'
    ];

    const INITIAL_MESSAGES = [
        { id: genId(), text: 'กางร่มให้หัวใจตัวเองบ้างนะ ไม่ต้องแบกรับทุกอย่างไว้คนเดียว', mood: 'hug', likes: 18, bookmarked: false, time: 'เมื่อสักครู่', timestamp: Date.now() - 60000 },
        { id: genId(), text: 'ฝนตกซาลงเมื่อไหร่ รุ้งกินน้ำงามๆ จะมาทักทายแน่นอน', mood: 'hope', likes: 29, bookmarked: true, time: '5 นาทีที่แล้ว', timestamp: Date.now() - 300000 },
        { id: genId(), text: 'ถ้าวันนี้เหนื่อยเกินไป ถอนหายใจยาวๆ แล้วพักผ่อนนะ', mood: 'tired', likes: 12, bookmarked: false, time: '8 นาทีที่แล้ว', timestamp: Date.now() - 480000 },
        { id: genId(), text: 'ปล่อยความเศร้าไหลไปกับหยดฝน แล้วเริ่มต้นใหม่ในวันพรุ่งนี้', mood: 'release', likes: 24, bookmarked: false, time: '14 นาทีที่แล้ว', timestamp: Date.now() - 840000 },
        { id: genId(), text: 'คิดถึงรอยยิ้มสดใสของตัวเองในวันที่แดดออกจัง', mood: 'miss', likes: 15, bookmarked: false, time: '20 นาทีที่แล้ว', timestamp: Date.now() - 1200000 },
        { id: genId(), text: 'ขอบคุณที่ยังสู้อยู่ ขอบคุณที่ยังไม่ยอมแพ้', mood: 'grateful', likes: 33, bookmarked: true, time: '30 นาทีที่แล้ว', timestamp: Date.now() - 1800000 }
    ];

    /* ─── STATE ─── */
    let state = loadState();
    let selectedMood = MOODS[0].id;
    let isBookmarkNew = false;
    let currentActiveItem = null;
    let isDarkMode = state.darkMode || false;
    let audioCtx = null;
    let isAudioPlaying = false;
    let audioNodes = {};
    let spawnIndex = 0;
    let galleryFilter = 'all';
    let gallerySearch = '';

    /* ─── HELPERS ─── */
    function genId() {
        return '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed;
            }
        } catch (e) { /* ignore */ }
        return {
            messages: [...INITIAL_MESSAGES],
            darkMode: false,
            streak: { count: 0, lastDate: null },
            activity: {} // { 'YYYY-MM-DD': count }
        };
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* ignore */ }
    }

    function getMood(id) {
        return MOODS.find(m => m.id === id) || MOODS[0];
    }

    function todayStr() {
        return new Date().toISOString().split('T')[0];
    }

    function getTimeGreeting() {
        const h = new Date().getHours();
        if (h < 6) return '🌙 ดึกแล้วนะ พักผ่อนบ้างนะ';
        if (h < 12) return '🌤️ สวัสดีตอนเช้า วันใหม่ที่สดใส';
        if (h < 17) return '☀️ สวัสดีตอนบ่าย เติมพลังให้ตัวเอง';
        if (h < 21) return '🌅 สวัสดีตอนเย็น ผ่านมาอีกวัน';
        return '🌙 ค่ำแล้วนะ พักผ่อนให้สบายใจ';
    }

    function relativeTime(ts) {
        const diff = Date.now() - ts;
        const min = Math.floor(diff / 60000);
        if (min < 1) return 'เมื่อสักครู่';
        if (min < 60) return `${min} นาทีที่แล้ว`;
        const hr = Math.floor(min / 60);
        if (hr < 24) return `${hr} ชม.ที่แล้ว`;
        const d = Math.floor(hr / 24);
        return `${d} วันที่แล้ว`;
    }

    /* ─── RAIN CANVAS ─── */
    const canvas = document.getElementById('rainCanvas');
    const ctx = canvas.getContext('2d');
    let raindrops = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class RainDrop {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.length = Math.random() * 20 + 6;
            this.speed = Math.random() * 6 + 3;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.width = Math.random() * 0.6 + 0.8;
        }
        update() {
            this.y += this.speed;
            this.x -= this.speed * 0.08; // slight wind
            if (this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - 0.8, this.y + this.length);
            const baseColor = isDarkMode ? '126, 195, 240' : '61, 163, 224';
            ctx.strokeStyle = `rgba(${baseColor}, ${this.opacity})`;
            ctx.lineWidth = this.width;
            ctx.stroke();
        }
    }

    for (let i = 0; i < 60; i++) raindrops.push(new RainDrop());

    function animateRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raindrops.forEach(d => { d.update(); d.draw(); });
        requestAnimationFrame(animateRain);
    }
    animateRain();

    /* ─── AUDIO SYSTEM ─── */
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function createPinkNoise(volume) {
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.02;
            b6 = white * 0.115926;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 700;
        const gain = audioCtx.createGain();
        gain.gain.value = volume;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        source.start();
        return { source, gain, filter };
    }

    function createBrownNoise(volume) {
        const bufferSize = audioCtx.sampleRate * 2;
        const buf = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buf;
        source.loop = true;
        const gain = audioCtx.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(audioCtx.destination);
        source.start();
        return { source, gain };
    }

    function createWhiteNoiseBurst(volume) {
        // Simulated thunder rumble
        const bufferSize = audioCtx.sampleRate * 4;
        const buf = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 2;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buf;
        source.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        const gain = audioCtx.createGain();
        gain.gain.value = volume;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        source.start();
        return { source, gain, filter };
    }

    function startAllSounds() {
        initAudio();
        const rainVol = parseInt(document.getElementById('rainVolume').value) / 100;
        const thunderVol = parseInt(document.getElementById('thunderVolume').value) / 100;
        const windVol = parseInt(document.getElementById('windVolume').value) / 100;

        audioNodes.rain = createPinkNoise(rainVol * 0.5);
        audioNodes.thunder = createWhiteNoiseBurst(thunderVol * 0.3);
        audioNodes.wind = createBrownNoise(windVol * 0.15);
        isAudioPlaying = true;
    }

    function stopAllSounds() {
        Object.values(audioNodes).forEach(n => {
            try { n.source.stop(); } catch (e) { /* */ }
        });
        audioNodes = {};
        isAudioPlaying = false;
    }

    function updateSoundVolume(type, val) {
        if (!audioNodes[type]) return;
        const multipliers = { rain: 0.5, thunder: 0.3, wind: 0.15 };
        audioNodes[type].gain.gain.setValueAtTime(val * (multipliers[type] || 0.3), audioCtx.currentTime);
    }

    // Sound button (header)
    document.getElementById('soundBtn').addEventListener('click', () => {
        const panel = document.getElementById('soundPanel');
        panel.classList.toggle('hidden-panel');
    });

    document.getElementById('closeSoundPanel').addEventListener('click', () => {
        document.getElementById('soundPanel').classList.add('hidden-panel');
    });

    const toggleSoundBtn = document.getElementById('toggleAllSound');
    toggleSoundBtn.addEventListener('click', () => {
        if (isAudioPlaying) {
            stopAllSounds();
            toggleSoundBtn.innerHTML = '<i class="fa-solid fa-play"></i> เปิดเสียง';
            toggleSoundBtn.classList.remove('playing');
            document.getElementById('soundIcon').className = 'fa-solid fa-volume-xmark';
        } else {
            startAllSounds();
            toggleSoundBtn.innerHTML = '<i class="fa-solid fa-pause"></i> ปิดเสียง';
            toggleSoundBtn.classList.add('playing');
            document.getElementById('soundIcon').className = 'fa-solid fa-volume-high';
        }
    });

    // Volume sliders
    ['rain', 'thunder', 'wind'].forEach(type => {
        const slider = document.getElementById(`${type}Volume`);
        const valEl = document.getElementById(`${type}VolVal`);
        slider.addEventListener('input', () => {
            const v = parseInt(slider.value);
            valEl.textContent = `${v}%`;
            if (isAudioPlaying) updateSoundVolume(type, v / 100);
        });
    });

    /* ─── DARK MODE ─── */
    const darkModeBtn = document.getElementById('darkModeBtn');
    const darkModeIcon = document.getElementById('darkModeIcon');

    function applyDarkMode(dark) {
        isDarkMode = dark;
        document.body.classList.toggle('dark-mode', dark);
        darkModeIcon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        state.darkMode = dark;
        saveState();
    }

    applyDarkMode(isDarkMode);

    darkModeBtn.addEventListener('click', () => {
        applyDarkMode(!isDarkMode);
    });

    /* ─── TIME GREETING ─── */
    const greetingEl = document.getElementById('greetingText');
    if (greetingEl) greetingEl.textContent = getTimeGreeting();

    /* ─── AFFIRMATION ─── */
    let currentAffirmation = 0;
    function showAffirmation() {
        const affEl = document.getElementById('affirmationText');
        if (affEl) {
            currentAffirmation = Math.floor(Math.random() * AFFIRMATIONS.length);
            affEl.textContent = AFFIRMATIONS[currentAffirmation];
        }
    }
    showAffirmation();
    const refreshAffBtn = document.getElementById('refreshAffirmation');
    if (refreshAffBtn) refreshAffBtn.addEventListener('click', showAffirmation);

    /* ─── WRITING PROMPT ─── */
    let currentPrompt = 0;
    function showPrompt() {
        const promptEl = document.getElementById('promptText');
        if (promptEl) {
            currentPrompt = Math.floor(Math.random() * WRITING_PROMPTS.length);
            promptEl.textContent = WRITING_PROMPTS[currentPrompt];
        }
    }
    showPrompt();
    const nextPromptBtn = document.getElementById('nextPromptBtn');
    if (nextPromptBtn) nextPromptBtn.addEventListener('click', showPrompt);

    /* ─── MOOD TAGS ─── */
    const moodContainer = document.getElementById('moodContainer');
    if (moodContainer) {
        MOODS.forEach((m, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `mood-tag${i === 0 ? ' selected' : ''}`;
            btn.dataset.id = m.id;
            btn.textContent = m.label;
            btn.addEventListener('click', () => {
                selectedMood = m.id;
                moodContainer.querySelectorAll('.mood-tag').forEach(el => el.classList.remove('selected'));
                btn.classList.add('selected');
            });
            moodContainer.appendChild(btn);
        });
    }

    /* ─── CHAR COUNT ─── */
    const messageInput = document.getElementById('messageInput');
    const charCount = document.getElementById('charCount');
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            charCount.textContent = `${messageInput.value.length} / 200`;
        });
    }

    /* ─── BOOKMARK TOGGLE (compose) ─── */
    const bookmarkToggle = document.getElementById('bookmarkToggle');
    if (bookmarkToggle) {
        bookmarkToggle.addEventListener('click', () => {
            isBookmarkNew = !isBookmarkNew;
            bookmarkToggle.classList.toggle('active', isBookmarkNew);
            bookmarkToggle.querySelector('i').className = isBookmarkNew ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
        });
    }

    /* ─── STREAK ─── */
    function updateStreak() {
        const today = todayStr();
        if (state.streak.lastDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (state.streak.lastDate === yesterday) {
            state.streak.count++;
        } else if (state.streak.lastDate !== today) {
            state.streak.count = 1;
        }
        state.streak.lastDate = today;
        saveState();
        renderStreak();
    }

    function renderStreak() {
        const streakEl = document.getElementById('streakCount');
        if (streakEl) streakEl.textContent = state.streak.count;
    }
    renderStreak();

    /* ─── FALLING MESSAGES ─── */
    const rainContainer = document.getElementById('rainContainer');

    function createFallingMessage(data) {
        const mood = getMood(data.mood);
        const el = document.createElement('div');
        el.className = `falling-card`;

        const startLeft = Math.random() * 78 + 6;
        const duration = Math.random() * 12 + 20;
        const delay = Math.random() * 2.5;

        el.style.left = `${startLeft}%`;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${delay}s`;
        el.style.zIndex = Math.floor(Math.random() * 20) + 10;

        const displayText = data.text.length > 40 ? data.text.substring(0, 40) + '...' : data.text;

        el.innerHTML = `
            <div class="falling-card-header">
                <span class="falling-card-mood ${mood.css}">${mood.label}</span>
                <span class="falling-card-likes">
                    ${data.bookmarked ? '<i class="fa-solid fa-bookmark" style="color:var(--brown-400);margin-right:3px"></i>' : ''}
                    <i class="fa-solid fa-heart"></i> ${data.likes || 0}
                </span>
            </div>
            <p class="falling-card-text">${displayText}</p>
        `;

        el.addEventListener('click', () => openReadModal(data));
        rainContainer.appendChild(el);

        setTimeout(() => { if (el.parentNode) el.remove(); }, (duration + delay) * 1000);
    }

    // Initial spawn
    state.messages.forEach((msg, i) => {
        setTimeout(() => createFallingMessage(msg), i * 1600);
    });

    // Continuous rain loop
    setInterval(() => {
        if (state.messages.length > 0) {
            createFallingMessage(state.messages[spawnIndex % state.messages.length]);
            spawnIndex++;
        }
    }, 4200);

    /* ─── READ MODAL ─── */
    const readModal = document.getElementById('readModal');
    const readModalCard = document.getElementById('readModalCard');

    function openReadModal(data) {
        currentActiveItem = data;
        const mood = getMood(data.mood);

        document.getElementById('modalContent').textContent = `"${data.text}"`;
        document.getElementById('modalMoodBadge').className = `mood-badge-lg ${mood.css}`;
        document.getElementById('modalMoodBadge').textContent = mood.label;
        document.getElementById('modalTime').textContent = data.time || relativeTime(data.timestamp);
        document.getElementById('likeCount').textContent = data.likes || 0;
        document.getElementById('likeIcon').className = 'fa-regular fa-heart';
        document.getElementById('bookmarkMsgIcon').className = data.bookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';

        readModal.classList.remove('hidden-modal');
    }

    function closeReadModal() {
        readModal.classList.add('hidden-modal');
    }

    document.getElementById('closeModalBtn').addEventListener('click', closeReadModal);
    readModal.addEventListener('click', e => { if (e.target === readModal) closeReadModal(); });

    // Like
    document.getElementById('likeBtn').addEventListener('click', () => {
        if (!currentActiveItem) return;
        const icon = document.getElementById('likeIcon');
        if (icon.classList.contains('fa-regular')) {
            icon.className = 'fa-solid fa-heart';
            icon.style.color = '#e74c3c';
            document.getElementById('likeBtn').classList.add('liked');
            currentActiveItem.likes = (currentActiveItem.likes || 0) + 1;
            document.getElementById('likeCount').textContent = currentActiveItem.likes;
            saveState();

            // Animate
            icon.style.transform = 'scale(1.3)';
            setTimeout(() => icon.style.transform = 'scale(1)', 200);
        }
    });

    // Bookmark in modal
    document.getElementById('bookmarkMsgBtn').addEventListener('click', () => {
        if (!currentActiveItem) return;
        currentActiveItem.bookmarked = !currentActiveItem.bookmarked;
        document.getElementById('bookmarkMsgIcon').className = currentActiveItem.bookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
        saveState();
        showToast(currentActiveItem.bookmarked ? 'บุ๊กมาร์คแล้ว 📌' : 'ยกเลิกบุ๊กมาร์ค');
    });

    // Share
    document.getElementById('shareMsgBtn').addEventListener('click', () => {
        if (!currentActiveItem) return;
        const mood = getMood(currentActiveItem.mood);
        document.getElementById('shareText').textContent = `"${currentActiveItem.text}"`;
        document.getElementById('shareMood').textContent = mood.label;
        document.getElementById('shareModal').classList.remove('hidden-modal');
    });

    /* ─── SHARE MODAL ─── */
    document.getElementById('closeShareBtn').addEventListener('click', () => {
        document.getElementById('shareModal').classList.add('hidden-modal');
    });
    document.getElementById('shareModal').addEventListener('click', e => {
        if (e.target.id === 'shareModal') document.getElementById('shareModal').classList.add('hidden-modal');
    });

    document.getElementById('copyShareBtn').addEventListener('click', () => {
        if (!currentActiveItem) return;
        const mood = getMood(currentActiveItem.mood);
        const text = `☂️ ถึงฉัน... ในวันที่ฝนตก\n\n"${currentActiveItem.text}"\n\n${mood.label}`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('คัดลอกข้อความแล้ว ✨');
        }).catch(() => {
            showToast('ไม่สามารถคัดลอกได้');
        });
    });

    document.getElementById('downloadCardBtn').addEventListener('click', () => {
        if (!currentActiveItem) return;
        // Create a canvas-based image card
        const c = document.createElement('canvas');
        c.width = 600;
        c.height = 400;
        const cx = c.getContext('2d');

        // Background gradient
        const grad = cx.createLinearGradient(0, 0, 600, 400);
        grad.addColorStop(0, isDarkMode ? '#1a202c' : '#f0f7ff');
        grad.addColorStop(1, isDarkMode ? '#17202d' : '#faf6f1');
        cx.fillStyle = grad;
        cx.roundRect(0, 0, 600, 400, 0);
        cx.fill();

        // Border
        cx.strokeStyle = isDarkMode ? 'rgba(61,163,224,0.2)' : 'rgba(184,220,248,0.5)';
        cx.lineWidth = 2;
        cx.roundRect(16, 16, 568, 368, 20);
        cx.stroke();

        // Brand
        cx.fillStyle = isDarkMode ? '#94a0ae' : '#94a0ae';
        cx.font = '14px sans-serif';
        cx.textAlign = 'center';
        cx.fillText('☂️ ถึงฉัน... ในวันที่ฝนตก', 300, 60);

        // Text
        cx.fillStyle = isDarkMode ? '#e2e5e9' : '#2d3748';
        cx.font = '20px sans-serif';
        cx.textAlign = 'center';
        const words = currentActiveItem.text.split('');
        let lines = [];
        let line = '';
        for (const ch of words) {
            if (cx.measureText(line + ch).width > 480) {
                lines.push(line);
                line = ch;
            } else {
                line += ch;
            }
        }
        if (line) lines.push(line);
        const startY = 200 - (lines.length * 15);
        lines.forEach((l, i) => {
            cx.fillText(`"${i === 0 ? '' : ''}${l}${i === lines.length - 1 ? '"' : ''}`, 300, startY + i * 34);
        });

        // Mood
        const mood = getMood(currentActiveItem.mood);
        cx.fillStyle = isDarkMode ? '#6b7a8d' : '#94a0ae';
        cx.font = '13px sans-serif';
        cx.fillText(mood.label, 300, 340);

        // Download
        const link = document.createElement('a');
        link.download = 'rainy-day-message.png';
        link.href = c.toDataURL('image/png');
        link.click();
        showToast('บันทึกเป็นรูปแล้ว 🖼️');
    });

    /* ─── SUBMIT NEW MESSAGE ─── */
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!messageInput) return;
            const text = messageInput.value.trim();
            if (!text) return;

            const newMsg = {
                id: genId(),
                text,
                mood: selectedMood,
                likes: 1,
                bookmarked: isBookmarkNew,
                time: 'เมื่อสักครู่นี้',
                timestamp: Date.now()
            };

            state.messages.unshift(newMsg);
            createFallingMessage(newMsg);

            // Track activity
            const today = todayStr();
            state.activity[today] = (state.activity[today] || 0) + 1;

            // Update streak
            updateStreak();

            saveState();

            messageInput.value = '';
            if (charCount) charCount.textContent = '0 / 200';
            isBookmarkNew = false;
            if (bookmarkToggle) {
                bookmarkToggle.classList.remove('active');
                bookmarkToggle.querySelector('i').className = 'fa-regular fa-bookmark';
            }

            updateGalleryBadge();
            showToast('ส่งข้อความลงในสายฝนแล้ว ☂️');
        });
    }

    /* ─── GALLERY ─── */
    const galleryModal = document.getElementById('galleryModal');
    const galleryList = document.getElementById('galleryList');
    const msgCountBadge = document.getElementById('msgCountBadge');

    function updateGalleryBadge() {
        if (msgCountBadge) msgCountBadge.textContent = state.messages.length;
    }
    updateGalleryBadge();

    function getFilteredMessages() {
        let msgs = [...state.messages];

        if (galleryFilter === 'bookmarked') {
            msgs = msgs.filter(m => m.bookmarked);
        } else if (galleryFilter !== 'all') {
            msgs = msgs.filter(m => m.mood === galleryFilter);
        }

        if (gallerySearch) {
            const q = gallerySearch.toLowerCase();
            msgs = msgs.filter(m => m.text.toLowerCase().includes(q));
        }

        return msgs;
    }

    function renderGallery() {
        galleryList.innerHTML = '';
        const msgs = getFilteredMessages();

        if (msgs.length === 0) {
            galleryList.innerHTML = `
                <div class="gallery-empty">
                    <i class="fa-solid fa-umbrella"></i>
                    <p>${gallerySearch ? 'ไม่พบข้อความที่ค้นหา' : 'ยังไม่มีข้อความ เขียนข้อความแรกได้เลยนะ'}</p>
                </div>
            `;
            return;
        }

        msgs.forEach(msg => {
            const mood = getMood(msg.mood);
            const card = document.createElement('div');
            card.className = 'gallery-item';

            card.innerHTML = `
                <div class="gallery-item-header">
                    <span class="gallery-item-mood ${mood.css}">${mood.label}</span>
                    <span class="gallery-item-time">${msg.time || relativeTime(msg.timestamp)}</span>
                </div>
                <p class="gallery-item-text">${msg.text}</p>
                <div class="gallery-item-footer">
                    ${msg.bookmarked ? '<span class="bookmark-indicator"><i class="fa-solid fa-bookmark"></i> บุ๊กมาร์ค</span>' : ''}
                    <span><i class="fa-solid fa-heart"></i> ${msg.likes || 0}</span>
                    <button class="gallery-delete-btn" data-id="${msg.id}" title="ลบ"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.gallery-delete-btn')) {
                    e.stopPropagation();
                    const id = e.target.closest('.gallery-delete-btn').dataset.id;
                    state.messages = state.messages.filter(m => m.id !== id);
                    saveState();
                    updateGalleryBadge();
                    renderGallery();
                    showToast('ลบข้อความแล้ว');
                    return;
                }
                openReadModal(msg);
            });

            galleryList.appendChild(card);
        });
    }

    // Gallery filter tabs - build mood filter tabs
    const filterTabs = document.getElementById('filterTabs');
    MOODS.forEach(m => {
        const tab = document.createElement('button');
        tab.className = 'filter-tab';
        tab.dataset.filter = m.id;
        tab.textContent = m.label.split(' ')[0]; // Just emoji
        tab.title = m.label;
        filterTabs.appendChild(tab);
    });

    filterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        galleryFilter = tab.dataset.filter;
        filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderGallery();
    });

    document.getElementById('gallerySearch').addEventListener('input', (e) => {
        gallerySearch = e.target.value;
        renderGallery();
    });

    document.getElementById('openGalleryBtn').addEventListener('click', () => {
        renderGallery();
        galleryModal.classList.remove('hidden-modal');
    });

    document.getElementById('closeGalleryBtn').addEventListener('click', () => {
        galleryModal.classList.add('hidden-modal');
    });

    galleryModal.addEventListener('click', e => {
        if (e.target === galleryModal) galleryModal.classList.add('hidden-modal');
    });

    /* ─── EXPORT ─── */
    document.getElementById('exportBtn').addEventListener('click', () => {
        const lines = state.messages.map(m => {
            const mood = getMood(m.mood);
            return `[${mood.label}] ${m.text} | ❤️ ${m.likes || 0} | ${m.time || relativeTime(m.timestamp)}${m.bookmarked ? ' 📌' : ''}`;
        });

        const content = `☂️ ถึงฉัน... ในวันที่ฝนตก — คลังข้อความทั้งหมด\n${'─'.repeat(50)}\n\n${lines.join('\n\n')}\n\n${'─'.repeat(50)}\nส่งออกเมื่อ: ${new Date().toLocaleString('th-TH')}`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.download = `rainy-day-messages-${todayStr()}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('ส่งออกข้อความเรียบร้อยแล้ว 📄');
    });

    /* ─── STATS MODAL ─── */
    const statsModal = document.getElementById('statsModal');

    function renderStats() {
        // Totals
        document.getElementById('totalMessages').textContent = state.messages.length;
        document.getElementById('totalLikes').textContent = state.messages.reduce((sum, m) => sum + (m.likes || 0), 0);
        document.getElementById('totalBookmarks').textContent = state.messages.filter(m => m.bookmarked).length;
        document.getElementById('currentStreak').textContent = state.streak.count;

        // Mood bars
        const moodBars = document.getElementById('moodBars');
        moodBars.innerHTML = '';
        const moodCounts = {};
        MOODS.forEach(m => moodCounts[m.id] = 0);
        state.messages.forEach(m => {
            if (moodCounts[m.mood] !== undefined) moodCounts[m.mood]++;
        });
        const maxCount = Math.max(...Object.values(moodCounts), 1);

        MOODS.forEach(m => {
            const count = moodCounts[m.id];
            const pct = (count / maxCount) * 100;
            const row = document.createElement('div');
            row.className = 'mood-bar-row';
            row.innerHTML = `
                <span class="mood-bar-label">${m.label}</span>
                <div class="mood-bar-track">
                    <div class="mood-bar-fill" style="width:${pct}%;background:${m.color}"></div>
                </div>
                <span class="mood-bar-count">${count}</span>
            `;
            moodBars.appendChild(row);
        });

        // Activity grid (last 7 days)
        const activityGrid = document.getElementById('activityGrid');
        activityGrid.innerHTML = '';
        const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(Date.now() - i * 86400000);
            const key = d.toISOString().split('T')[0];
            const count = state.activity[key] || 0;
            const cell = document.createElement('div');
            cell.className = `activity-cell${count > 0 ? ' has-entry' : ''}`;
            cell.innerHTML = `
                <span class="activity-cell-day">${dayNames[d.getDay()]}</span>
                <span class="activity-cell-count">${count > 0 ? count : '·'}</span>
            `;
            activityGrid.appendChild(cell);
        }
    }

    document.getElementById('openStatsBtn').addEventListener('click', () => {
        renderStats();
        statsModal.classList.remove('hidden-modal');
    });

    document.getElementById('closeStatsBtn').addEventListener('click', () => {
        statsModal.classList.add('hidden-modal');
    });

    statsModal.addEventListener('click', e => {
        if (e.target === statsModal) statsModal.classList.add('hidden-modal');
    });

    /* ─── TOAST ─── */
    function showToast(text) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${text}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    /* ─── KEYBOARD SHORTCUTS ─── */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeReadModal();
            galleryModal.classList.add('hidden-modal');
            statsModal.classList.add('hidden-modal');
            document.getElementById('shareModal').classList.add('hidden-modal');
            document.getElementById('soundPanel').classList.add('hidden-panel');
        }
    });

    /* ─── PERIODIC SAVE ─── */
    setInterval(saveState, 30000);

})();
