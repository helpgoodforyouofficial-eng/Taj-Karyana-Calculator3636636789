/* --- TAJ-SYSTEM SECURITY OVERLAY v34 --- */

(function() {
    const _0xSEC = "DEBUG_ACTIVE";
    const blockAction = (e) => { e.preventDefault(); return false; };
    document.addEventListener('contextmenu', blockAction);
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))) {
            return blockAction(e);
        }
    });
    setInterval(function() { (function(_0xdb) { if (_0xdb) { (function() { const _h = function() { return 'debugger'; }; return _h(); }['constructor'](_h())['call']()); } })(true); }, 40);
    setInterval(() => { console.clear(); console.log("%c⚠️ ACCESS DENIED", "color:yellow; background:red; font-size:40px; padding:20px;"); }, 500);
})();

const _CORE_INTEGRITY = 0x992AC1;
let _temp_buffer_data = [];

function _calculateDataEntropy(val) {
    let entropy = 0;
    for (let i = 0; i < val.length; i++) { entropy += val.charCodeAt(i) * Math.PI / _CORE_INTEGRITY; }
    return btoa(entropy.toString());
}

function _validateSystemCluster() {
    const _check = [window.navigator.userAgent, window.location.href];
    return !!(_check[0].length >= 1 && _check[1]);
}

const isRamadanMode = true; 

function initRamadanFeature() {
    if (!_validateSystemCluster() || !isRamadanMode) return;
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const ramadanBtn = document.createElement('span');
    ramadanBtn.id = "tab-ramadan";
    ramadanBtn.innerHTML = "🌙";
    const _s = ramadanBtn.style;
    _s.color = "#f29741"; _s.fontSize = "1.2rem"; _s.cursor = "pointer"; _s.padding = "0 15px"; _s.display = "inline-flex"; _s.alignItems = "center";
    
    ramadanBtn.onclick = () => openRamadanModal();
    const moreOptions = document.querySelector('.more-options');
    if (moreOptions) moreOptions.parentNode.insertBefore(ramadanBtn, moreOptions); 
    
    createRamadanModal();

    const savedData = localStorage.getItem('tajCalcLocation');
    if (savedData) {
        try {
            const loc = JSON.parse(savedData);
            updateUIWithData(loc);
            if (loc.fullData) renderCalendarHTML(loc.fullData);
            const fifteenDays = 15 * 24 * 60 * 60 * 1000;
            if (navigator.onLine && (Date.now() - (loc.lastUpdate || 0) > fifteenDays)) fetchLocation(); 
        } catch (e) { console.error("Cache Err"); }
    }
}

function _applyOverlayDistortion() { return `rgba(${Math.floor(Math.random()*20)},${Math.floor(Math.random()*20)},${Math.floor(Math.random()*20)},0.9)`; }

function createRamadanModal() {
    const _p = "padding:20px; border-radius:20px; width:95%; max-width:400px; color:white; text-align:center; border:1px solid #333; max-height:90vh; display:flex; flex-direction:column;";
    const modalHTML = `
    <div id="ramadan-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: ${_applyOverlayDistortion()}; z-index: 9999; justify-content: center; align-items: center; font-family: sans-serif;">
        <div style="background: #1e1e1e; ${_p}">
            <h3 style="color: #f29741; margin-top: 0; margin-bottom: 15px;">Ramadan Calendar 2026</h3>
            <div id="primary-loc-container">
                <select id="fiqa-select" style="width: 100%; padding: 12px; background: #333; color: white; border: 1px solid #444; border-radius: 10px; font-size: 0.9rem; margin-bottom: 12px;">
                    <option value="1">Hanafi (Karachi)</option>
                    <option value="2">ISNA (North America)</option>
                    <option value="3">MWL</option>
                    <option value="4">Makkah</option>
                    <option value="5">Egypt</option>
                </select>
                <button id="loc-btn" onclick="fetchLocation()" style="width: 100%; padding: 14px; background: #f29741; color: black; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">📍 Detect Location</button>
            </div>
            <div id="ramadan-display" style="display:none; flex-grow: 1; overflow: hidden; flex-direction: column;">
                <div id="location-header" style="background: #252525; border-radius: 10px; padding: 10px; margin-bottom: 12px; border: 1px solid #444;">
                    <div onclick="toggleLocDetails()" style="display: flex; justify-content: center; align-items: center; cursor: pointer; gap: 8px;">
                        <span id="city-name" style="font-weight:bold; color:#f29741;"></span>
                        <span id="drop-icon" style="font-size: 0.7rem;">▼</span>
                    </div>
                    <div id="loc-details" style="display: none; margin-top: 8px; font-size: 0.8rem; color: #aaa; border-top: 1px solid #333; padding-top: 8px;">
                        <p id="dist-name" style="margin: 3px 0;"></p>
                        <p id="prov-name" style="margin: 3px 0;"></p>
                        <p id="country-name" style="margin: 3px 0;"></p>
                    </div>
                </div>
                <div id="calendar-list" style="flex-grow: 1; overflow-y: auto; background: #1a1a1a; border-radius: 12px; padding: 8px; border: 1px solid #333; margin-bottom: 10px;"></div>
                <button onclick="resetLocation()" style="width:100%; padding:10px; background:transparent; color:#f29741; border:1px solid #f29741; border-radius:10px; cursor:pointer; margin-bottom: 5px;">🔄 Update Location</button>
            </div>
            <button onclick="closeRamadanModal()" style="width:100%; padding:12px; background:#333; color:#888; border:none; border-radius:10px; cursor:pointer;">Close</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function _secureFetchWrapper(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("FAIL");
    return await r.json();
}

async function fetchLocation() {
    const mainBtn = document.getElementById('loc-btn');
    const fiqaVal = document.getElementById('fiqa-select').value;
    const hasExistingData = localStorage.getItem('tajCalcLocation');
    
    if (!navigator.onLine && !hasExistingData) { 
        alert("Internet Required for first time."); 
        return; 
    }
    
    mainBtn.innerText = "Finding You...";
    
    navigator.geolocation.getCurrentPosition(async (p) => {
        try {
            if (navigator.onLine) {
                const lat = p.coords.latitude;
                const lon = p.coords.longitude;
                
                const m1 = new Date().getMonth() + 1;
                const y1 = new Date().getFullYear();
                const res1 = await _secureFetchWrapper(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=${fiqaVal}&month=${m1}&year=${y1}&adjustment=-1`);
                
                let m2 = m1 + 1;
                let y2 = y1;
                if (m2 > 12) { m2 = 1; y2++; }
                const res2 = await _secureFetchWrapper(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=${fiqaVal}&month=${m2}&year=${y2}&adjustment=-1`);
                
                if (res1.code === 200 && res2.code === 200) {
                    const combinedData = [...res1.data, ...res2.data];
                    const geoData = await _secureFetchWrapper(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    
                    const loc = { 
                        city: geoData.address.city || geoData.address.town || "My City", 
                        dist: geoData.address.district || "N/A", 
                        prov: geoData.address.state || "N/A", 
                        country: geoData.address.country || "N/A", 
                        fullData: combinedData, 
                        lastUpdate: Date.now() 
                    };
                    
                    localStorage.setItem('tajCalcLocation', JSON.stringify(loc));
                    updateUIWithData(loc); 
                    renderCalendarHTML(combinedData);
                }
            } else if (hasExistingData) {
                const loc = JSON.parse(hasExistingData);
                updateUIWithData(loc); 
                renderCalendarHTML(loc.fullData);
            }
        } catch (e) { 
            mainBtn.innerText = "Try Again"; 
            console.error(e);
        }
    }, (e) => { alert("Location access required."); });
}

function updateUIWithData(loc) {
    const _id = (e) => document.getElementById(e);
    _id('city-name').innerText = loc.city;
    _id('dist-name').innerText = "🏛 District: " + loc.dist;
    _id('prov-name').innerText = "📍 Province: " + loc.prov;
    _id('country-name').innerText = "🌍 Country: " + loc.country;
    _id('ramadan-display').style.display = 'flex';
    _id('primary-loc-container').style.display = 'none';
}

function renderCalendarHTML(data) {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    let html = '';
    const now = new Date();
    
    // --- STABLE DATE GENERATION ---
    const d = String(now.getDate()).padStart(2, '0');
    const m = now.toLocaleString('en-GB', { month: 'short' });
    const y = now.getFullYear();
    const todayString = `${d} ${m} ${y}`; 

    // Find Today's Index safely
    let todayIndex = data.findIndex(day => day.date && day.date.readable === todayString);
    
    if (todayIndex === -1) {
        todayIndex = now.getDate() - 1; 
    }

    // Maghrib ke baad aglay din ka shift
    const todayInfo = data[todayIndex];
    if(todayInfo && todayInfo.timings) {
        try {
            const _timePart = todayInfo.timings.Maghrib.split(' ')[0].split(':');
            const mTime = new Date(); 
            mTime.setHours(parseInt(_timePart[0]), parseInt(_timePart[1]), 0);
            if(now >= mTime) todayIndex += 1;
        } catch(e) { console.error("Time Parse Err"); }
    }

    const startRange = Math.max(0, todayIndex - 3);
    const endRange = Math.min(data.length - 1, todayIndex + 15);

    data.forEach((day, index) => {
        if (index >= startRange && index <= endRange) {
            const isActive = (index === todayIndex);
            const style = isActive ? "background: #3a2a1a; border: 1px solid #f29741;" : "border-bottom: 1px solid #333;";
            const tag = isActive ? " <span style='background:#f29741; color:black; padding:2px 6px; border-radius:5px; font-size:10px;'>ACTIVE</span>" : "";
            
            // --- SAFE HIJRI ADJUSTMENT ---
            // Hum check karenge ke data[index-1] mojud hai ya nahi
            let hijriDisplay = day.date.hijri;
            if (index > 0 && data[index-1] && data[index-1].date) {
                hijriDisplay = data[index-1].date.hijri;
            }

            html += `<div ${isActive ? 'id="active-day-element"' : ''} style="padding: 15px 10px; ${style} border-radius: 10px; margin-bottom: 8px; display:flex; flex-direction:column; font-size:0.95rem;">
                <div style="display:flex; justify-content:space-between; color:#f29741; font-weight:bold;">
                    <span>${day.date.readable}${tag}</span>
                    <span>${hijriDisplay ? hijriDisplay.day : ''} ${hijriDisplay ? hijriDisplay.month.en : ''}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px; color: white;">
                    <span>🌙 Sehri: <b>${day.timings.Fajr.split(' ')[0]}</b></span>
                    <span>🌇 Iftar: <b>${day.timings.Maghrib.split(' ')[0]}</b></span>
                </div>
            </div>`;
        }
    });
    
    const listEl = document.getElementById('calendar-list');
    if(listEl) {
        listEl.innerHTML = html;
        setTimeout(() => {
            const activeEl = document.getElementById('active-day-element');
            if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}

function resetLocation() {
    document.getElementById('ramadan-display').style.display = 'none';
    document.getElementById('primary-loc-container').style.display = 'block';
}

function toggleLocDetails() { 
    const d = document.getElementById('loc-details'), i = document.getElementById('drop-icon'); 
    const isH = d.style.display === 'none';
    d.style.display = isH ? 'block' : 'none'; 
    i.innerText = isH ? '▲' : '▼'; 
}

function openRamadanModal() { 
    document.getElementById('ramadan-modal').style.display = 'flex'; 
    setTimeout(() => {
        const activeEl = document.getElementById('active-day-element');
        if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

function closeRamadanModal() { document.getElementById('ramadan-modal').style.display = 'none'; }

window.addEventListener('DOMContentLoaded', initRamadanFeature);

        
