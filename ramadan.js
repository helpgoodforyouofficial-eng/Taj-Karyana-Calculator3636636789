// Right-click rokne ke liye
document.addEventListener('contextmenu', event => event.preventDefault());

// Keyboard shortcuts (F12, Ctrl+Shift+I) rokne ke liye
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) || (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
        return false;
    }
};





// --- 2. Ramadan Module Logic ---
const ramadanEnd = "2026-04-10"; 

function checkRamadanStatus() {
    const today = new Date();
    const expiry = new Date(ramadanEnd);
    return today <= expiry; 
}

const isRamadanMode = checkRamadanStatus(); 
let ramadanTimer;

function initRamadanFeature() {
    if (!isRamadanMode) return;

    const nav = document.querySelector('.nav');
    if (!nav) return;

    const ramadanBtn = document.createElement('span');
    ramadanBtn.id = "tab-ramadan";
    ramadanBtn.innerHTML = "🌙";
    ramadanBtn.style.cssText = "color: #f29741; font-size: 1rem; cursor: pointer; padding: 0 15px; display: inline-flex; align-items: center;";
    ramadanBtn.onclick = openRamadanModal;

    const moreOptions = document.querySelector('.more-options');
    if (moreOptions) { 
        moreOptions.parentNode.insertBefore(ramadanBtn, moreOptions); }
    
    createRamadanModal();

    const savedData = localStorage.getItem('tajCalcLocation');
    if (savedData) {
        try {
            const loc = JSON.parse(savedData);
            window.lastFetchedTimings = loc.timings;
            
            setTimeout(() => {
                const cityNameEl = document.getElementById('city-name');
                if (cityNameEl) {
                    cityNameEl.innerText = loc.city;
                    document.getElementById('dist-name').innerText = "🏛 District: " + loc.dist;
                    document.getElementById('prov-name').innerText = "📍 Province: " + loc.prov;
                    document.getElementById('country-name').innerText = "🌍 Country: " + loc.country;
                    
                    if (loc.fullData) {
                        renderCalendarHTML(loc.fullData);
                    }

                    // --- FIX 1: Saved Alerts Load Karo ---
                    const savedAlerts = localStorage.getItem('tajCalcAlerts');
                    if (savedAlerts) {
                        const a = JSON.parse(savedAlerts);
                        if(document.getElementById('sehri-drop-1')) {
                            document.getElementById('sehri-drop-1').value = a.sehri1 || "";
                            document.getElementById('sehri-drop-2').value = a.sehri2 || "";
                            document.getElementById('iftari-drop-1').value = a.iftari1 || "";
                            document.getElementById('iftari-drop-2').value = a.iftari2 || "";
                            handleDropChange();
                        }
                    }

                    document.getElementById('ramadan-display').style.display = 'block';
                    document.getElementById('primary-loc-container').style.display = 'none';
                    document.getElementById('secondary-loc-container').style.display = 'block';
                    
                    const footer = document.getElementById('fiqa-footer-placeholder');
                    const selector = document.getElementById('fiqa-select');
                    if (footer && selector) { footer.appendChild(selector); selector.style.width = "100%"; }

                    startRamadanCountdown(loc.timings);
                }
            }, 300);
        } catch (e) { console.log("Cache Load Error"); }
    }
}

function renderCalendarHTML(data) {
    let html = '';
    const today = new Date().getDate();
    for (let i = today - 6; i <= today + 4; i++) {
        if (data[i]) {
            const day = data[i];
            const active = (i + 1 === today) ? "border: 1px solid #f29741; background: #333;" : "border-bottom: 1px solid #333;";
            html += `<div style="padding: 10px; ${active} display:flex; flex-direction:column; font-size:0.8rem; text-align:left;">
                <div style="display:flex; justify-content:space-between; color:#f29741; font-weight:bold;"><span>${day.date.readable}</span><span>${day.date.hijri.day} ${day.date.hijri.month.en}</span></div>
                <div style="display:flex; justify-content:space-between; margin-top:4px;"><span>🌅 Sehri: ${day.timings.Fajr.split(' ')[0]}</span><span>🌇 Iftari: ${day.timings.Maghrib.split(' ')[0]}</span></div>
            </div>`;
        }
    }
    document.getElementById('calendar-list').innerHTML = html;
}

function createRamadanModal() {
    const modalHTML = `
    <div id="ramadan-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; justify-content: center; align-items: center; font-family: sans-serif;">
        <div style="background: #1e1e1e; padding: 15px; border-radius: 15px; width: 90%; max-width: 380px; color: white; text-align: center; border: 1px solid #333;">
            <h3 style="color: #f29741; margin-bottom: 10px;">Ramadan Calendar</h3>
            <div id="primary-loc-container">
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <select id="fiqa-select" style="flex: 1; padding: 10px; background: #333; color: white; border: 1px solid #444; border-radius: 8px; font-size: 0.85rem;">
                        <option value="1">Fiqa Hanfi (Karachi)</option>
                        <option value="2">Fiqa Shafi (ISNA)</option>
                        <option value="3">Muslim World League</option>
                    </select>
                    <button id="loc-btn" onclick="fetchLocation()" style="flex: 1.5; padding: 10px; background: #f29741; color: black; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">📍 Detect Location</button>
                </div>
            </div>
            <div id="ramadan-display" style="display:none;">
                <div id="location-header" style="background: #252525; border-radius: 8px; padding: 10px; margin-bottom: 10px; border: 1px solid #444;">
                    <div onclick="toggleLocDetails()" style="display: flex; justify-content: center; align-items: center; cursor: pointer; gap: 8px;">
                        <span id="city-name" style="font-weight:bold; color:#f29741; font-size: 1.1rem;"></span>
                        <span id="drop-icon" style="font-size: 0.7rem; color: #888;">▼</span>
                    </div>
                    <div id="loc-details" style="display: none; margin-top: 10px; font-size: 0.85rem; color: #bbb; border-top: 1px solid #333; padding-top: 8px; text-align: left;">
                        <p id="dist-name" style="margin: 4px 0;"></p>
                        <p id="prov-name" style="margin: 4px 0;"></p>
                        <p id="country-name" style="margin: 4px 0;"></p>
                    </div>
                </div>
                <div id="calendar-list" style="max-height: 180px; overflow-y: auto; background: #252525; border-radius: 10px; padding: 5px; border: 1px solid #444; margin-bottom: 15px;"></div>
            </div>
            <div id="alert-section" style="border-top: 1px solid #333; padding-top: 10px;">
                <p style="font-size: 0.8rem; color: #f29741; font-weight:bold; margin-bottom: 8px;">⏰ Set Reminders</p>
                <div style="display: flex; gap: 8px; justify-content: space-between;">
                    <div style="flex:1; background:#222; padding:5px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#bbb;">🌙 Sehri</span>
                        <select id="sehri-drop-1" onchange="handleDropChange()" style="width:100%; padding:3px; background:#111; color:white; border:none; margin-top:3px;"><option value="">None</option><option value="60">1 Hour</option><option value="30">30m</option><option value="15">15m</option><option value="5">5m</option></select>
                        <select id="sehri-drop-2" onchange="handleDropChange()" style="width:100%; padding:3px; background:#111; color:white; border:none; margin-top:3px;"><option value="">None</option><option value="60">1 Hour</option><option value="30">30m</option><option value="15">15m</option><option value="5">5m</option></select>
                    </div>
                    <div style="flex:1; background:#222; padding:5px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#bbb;">☀️ Iftari</span>
                        <select id="iftari-drop-1" onchange="handleDropChange()" style="width:100%; padding:3px; background:#111; color:white; border:none; margin-top:3px;"><option value="">None</option><option value="60">1 Hour</option><option value="30">30m</option><option value="15">15m</option><option value="5">5m</option></select>
                        <select id="iftari-drop-2" onchange="handleDropChange()" style="width:100%; padding:3px; background:#111; color:white; border:none; margin-top:3px;"><option value="">None</option><option value="60">1 Hour</option><option value="30">30m</option><option value="15">15m</option><option value="5">5m</option></select>
                    </div>
                </div>
                <button onclick="saveAllAlerts()" style="width:100%; margin-top:10px; padding:8px; background:#28a745; color:white; border:none; border-radius:8px; font-size:0.8rem;">Save Alerts</button>
            </div>
            <div id="secondary-loc-container" style="margin-top: 10px; display:none;">
                <div id="fiqa-footer-placeholder"></div>
                <button onclick="fetchLocation()" style="width:100%; margin-top:8px; padding:8px; background:transparent; color:#f29741; border:1px solid #f29741; border-radius:8px; font-size:0.8rem; cursor:pointer;">🔄 Update Location/Fiqa</button>
            </div>
            <button onclick="closeRamadanModal()" style="width:100%; padding:8px; background:#333; color:#888; border:none; border-radius:8px; margin-top:8px; cursor:pointer;">Dismiss</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function fetchLocation() {
    const mainBtn = document.getElementById('loc-btn');
    const cityNameEl = document.getElementById('city-name');
    const fiqaVal = document.getElementById('fiqa-select').value;
    mainBtn.innerText = "Finding...";
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            const addr = geoData.address;
            const finalCity = addr.city || addr.town || addr.village || addr.suburb || "Your Area";

            const now = new Date();

            // Default humne -1 rakha hai taake aaj 29 Sha'ban nazar aaye
            const adj = localStorage.getItem('hijriAdj') || -1; 

            // Adjustment variable ko URL mein use kar liya hai
            const response = await fetch(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=${fiqaVal}&month=${now.getMonth()+1}&year=${now.getFullYear()}&adjustment=${adj}`);

            const data = await response.json();
            
            if(data.code === 200) {
                const todayIndex = now.getDate() - 1;
                window.lastFetchedTimings = data.data[todayIndex].timings;
                const locationToSave = { 
                    city: finalCity, 
                    dist: addr.county || addr.district || "N/A", 
                    prov: addr.state || "N/A", 
                    country: addr.country || "N/A", 
                    timings: data.data[todayIndex].timings, 
                    fullData: data.data 
                };
                
                localStorage.setItem('tajCalcLocation', JSON.stringify(locationToSave));
                cityNameEl.innerText = finalCity;
                document.getElementById('dist-name').innerText = "🏛 District: " + locationToSave.dist;
                document.getElementById('prov-name').innerText = "📍 Province: " + locationToSave.prov;
                document.getElementById('country-name').innerText = "🌍 Country: " + locationToSave.country;
                
                renderCalendarHTML(data.data);
                
                document.getElementById('ramadan-display').style.display = 'block';
                document.getElementById('primary-loc-container').style.display = 'none';
                document.getElementById('secondary-loc-container').style.display = 'block';
                
                const footer = document.getElementById('fiqa-footer-placeholder');
                const selector = document.getElementById('fiqa-select');
                if (footer && selector) { 
                    footer.appendChild(selector); 
                    selector.style.width = "100%"; 
                }
                
                mainBtn.innerText = "📍 Detect Location";
                startRamadanCountdown(window.lastFetchedTimings);
            }
        } catch (error) { 
            console.error(error); 
            mainBtn.innerText = "Try Again"; 
        }
    }, (e) => { 
        alert("Enable GPS/Location"); 
        mainBtn.innerText = "📍 Detect Location"; 
    });
}


function startRamadanCountdown(timings) {
    if (ramadanTimer) clearInterval(ramadanTimer);

    // --- FIX 2: Check Alerts (Agar alerts set hain to hi timer chalega) ---
    const savedAlerts = localStorage.getItem('tajCalcAlerts');
    if (!savedAlerts) return;
    const a = JSON.parse(savedAlerts);
    if (!a.sehri1 && !a.sehri2 && !a.iftari1 && !a.iftari2) return;

    ramadanTimer = setInterval(() => {
        const now = new Date();
        const target = getNextTarget(timings.Fajr.split(' ')[0], timings.Maghrib.split(' ')[0]);
        const diff = target.time - now;
        if (diff > 0) {
            const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
            updateLiveNotification(`${target.name} Alert`, `${h}h ${m}m ${s}s remaining`);
        } else {
            playAlarmSound();
            clearInterval(ramadanTimer);
            startRamadanCountdown(timings);
        }
    }, 1000);
}

function updateLiveNotification(targetName, bodyText) {
    if (Notification.permission === "granted" && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("Taj Calculator", {
                body: `${targetName}: ${bodyText}`,
                icon: './ramadan-icon.png',
                badge: './ramadan-icon.png',
                tag: 'ramadan-live-alert',
                renotify: false,
                silent: true,
                requireInteraction: true
            });
        });
    }
}

function getNextTarget(sehri, iftari) {
    const now = new Date(), sDate = new Date(), iDate = new Date();
    const [sH, sM] = sehri.split(':'), [iH, iM] = iftari.split(':');
    sDate.setHours(sH, sM, 0); iDate.setHours(iH, iM, 0);
    if (now < sDate) return { name: "Sehri", time: sDate };
    if (now < iDate) return { name: "Iftari", time: iDate };
    return { name: "Sehri", time: new Date(sDate.getTime() + 86400000) };
}

function playAlarmSound() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Sound error:", e));
}

function handleDropChange() {
    ['sehri', 'iftari'].forEach(t => {
        const d1 = document.getElementById(`${t}-drop-1`), d2 = document.getElementById(`${t}-drop-2`);
        if(!d1 || !d2) return;
        [d1, d2].forEach(s => Array.from(s.options).forEach(o => o.disabled = false));
        if (d1.value) { const o = Array.from(d2.options).find(x => x.value === d1.value); if(o && d1.value !== "") o.disabled = true; }
        if (d2.value) { const o = Array.from(d1.options).find(x => x.value === d2.value); if(o && d2.value !== "") o.disabled = true; }
    });
}

function saveAllAlerts() {
    Notification.requestPermission().then(p => {
        if(p === 'granted') {
            const alerts = {
                sehri1: document.getElementById('sehri-drop-1').value,
                sehri2: document.getElementById('sehri-drop-2').value,
                iftari1: document.getElementById('iftari-drop-1').value,
                iftari2: document.getElementById('iftari-drop-2').value
            };
            localStorage.setItem('tajCalcAlerts', JSON.stringify(alerts));

            // --- FIX 3: Agar sab "None" hain to notification band karo ---
            if (!alerts.sehri1 && !alerts.sehri2 && !alerts.iftari1 && !alerts.iftari2) {
                if (ramadanTimer) clearInterval(ramadanTimer);
                navigator.serviceWorker.ready.then(reg => {
                    reg.getNotifications({tag: 'ramadan-live-alert'}).then(notifs => notifs.forEach(n => n.close()));
                });
                alert("Success! Alerts Disabled.");
            } else {
                alert("Success! Alerts saved.");
                if(window.lastFetchedTimings) startRamadanCountdown(window.lastFetchedTimings);
            }
            closeRamadanModal();
        } else { alert("Allow notification permission."); }
    });
}

function toggleLocDetails() { const d = document.getElementById('loc-details'), i = document.getElementById('drop-icon'); d.style.display = (d.style.display==='none')?'block':'none'; i.innerText = (d.style.display==='none')?'▼':'▲'; }
function openRamadanModal() { document.getElementById('ramadan-modal').style.display = 'flex'; }
function closeRamadanModal() { document.getElementById('ramadan-modal').style.display = 'none'; }
window.addEventListener('DOMContentLoaded', initRamadanFeature);
