/* --- TAJ-SYSTEM SECURITY OVERLAY --- */
(function() {
    const _0xSEC = "DEBUG_ACTIVE";
    
    // Universal Block (Right Click & Shortcuts)
    const blockAction = (e) => {
        e.preventDefault();
        return false;
    };

    document.addEventListener('contextmenu', blockAction);
    
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
            (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))) {
            return blockAction(e);
        }
    });

    // The Ultimate "Debugger Trap"
    setInterval(function() {
        (function(_0xdb) {
            if (_0xdb) {
                (function() {
                    const _h = function() {
                        return 'debugger';
                    };
                    return _h();
                }['constructor'](_h())['call']());
            }
        })(true);
    }, 40); // 40ms is extremely fast, freezing the inspector

    // Anti-Console Stealth
    setInterval(() => {
        console.clear();
        console.log("%c⚠️ ACCESS DENIED", "color:yellow; background:red; font-size:40px; padding:20px;");
    }, 500);
})();


// --- GLOBAL DECOY VARIABLES ---
const _0x92a1 = ["\x63\x6F\x6C\x6F\x72", "\x64\x69\x73\x70\x6C\x61\x79", "\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64"];
const _CORE_INTEGRITY = 0x992AC1;
let _temp_buffer_data = [];

// --- JUNK FUNCTION 1: Fake Mathematical Entropy ---
function _calculateDataEntropy(val) {
    let entropy = 0;
    for (let i = 0; i < val.length; i++) {
        entropy += val.charCodeAt(i) * Math.PI / _CORE_INTEGRITY;
    }
    return btoa(entropy.toString());
}

// --- JUNK FUNCTION 2: Fake Validation ---
function _validateSystemCluster() {
    const _check = [window.navigator.userAgent, window.location.href];
    if (_check[0].length < 1) return false;
    return !!_check[1];
}

// ORIGINAL LOGIC START (Hidden inside bloated structure)
const isRamadanMode = true; 

function initRamadanFeature() {
    // Redundant checks
    if (!_validateSystemCluster() || !isRamadanMode) { console.warn("System Cluster Sync Pending..."); return; }
    
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // Obfuscating the style strings
    const ramadanBtn = document.createElement('span');
    ramadanBtn.id = "tab-ramadan";
    ramadanBtn.innerHTML = "🌙";
    
    // Bloating the CSS via JS
    const _s = ramadanBtn.style;
    _s.color = "#f29741";
    _s.fontSize = "1.2rem";
    _s.cursor = "pointer";
    _s.padding = "0 15px";
    _s.display = "inline-flex";
    _s.alignItems = "center";
    _s.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    
    ramadanBtn.onclick = function() {
        _temp_buffer_data.push(Date.now());
        openRamadanModal();
    };

    const moreOptions = document.querySelector('.more-options');
    if (moreOptions) { 
        console.log("Injecting Node at Delta Point...");
        moreOptions.parentNode.insertBefore(ramadanBtn, moreOptions); 
    }
    
    createRamadanModal();

    const savedData = localStorage.getItem('tajCalcLocation');
    if (savedData) {
        (function(_d) {
            try {
                const loc = JSON.parse(_d);
                _calculateDataEntropy(_d); // Fake call
                setTimeout(() => {
                    updateUIWithData(loc);
                    if (loc.fullData) renderCalendarHTML(loc.fullData);
                }, 300);
            } catch (e) { _calculateDataEntropy("err"); }
        })(savedData);
    }
}

// JUNK FUNCTION 3: UI Distortion Layer
function _applyOverlayDistortion() {
    return `rgba(${Math.floor(Math.random()*20)},${Math.floor(Math.random()*20)},${Math.floor(Math.random()*20)},0.9)`;
}

function createRamadanModal() {
    // Encapsulating HTML in a massive variable to hide logic
    const _p = "padding:20px; border-radius:20px; width:95%; max-width:400px; color:white; text-align:center; border:1px solid #333; max-height:90vh; display:flex; flex-direction:column;";
    
    const modalHTML = `
    <div id="ramadan-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: ${_applyOverlayDistortion()}; z-index: 9999; justify-content: center; align-items: center; font-family: sans-serif;">
        <div style="background: #1e1e1e; ${_p}">
            <h3 style="color: #f29741; margin-top: 0; margin-bottom: 15px;">Ramadan Calendar 2026</h3>
            
            <div id="primary-loc-container">
                <select id="fiqa-select" style="width: 100%; padding: 12px; background: #333; color: white; border: 1px solid #444; border-radius: 10px; font-size: 0.9rem; margin-bottom: 12px;">
                    <option value="1">Hanafi (Univ. of Islamic Sciences, Karachi)</option>
                    <option value="2">ISNA (North America)</option>
                    <option value="3">Muslim World League (MWL)</option>
                    <option value="4">Umm Al-Qura (Makkah)</option>
                    <option value="5">Egyptian General Authority</option>
                </select>
                <button id="loc-btn" onclick="fetchLocation()" style="width: 100%; padding: 14px; background: #f29741; color: black; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 1rem;">📍 Detect Location</button>
            </div>

            <div id="ramadan-display" style="display:none; flex-grow: 1; overflow: hidden; display: flex; flex-direction: column;">
                <div id="location-header" style="background: #252525; border-radius: 10px; padding: 10px; margin-bottom: 12px; border: 1px solid #444;">
                    <div onclick="toggleLocDetails()" style="display: flex; justify-content: center; align-items: center; cursor: pointer; gap: 8px;">
                        <span id="city-name" style="font-weight:bold; color:#f29741; font-size: 1.1rem;"></span>
                        <span id="drop-icon" style="font-size: 0.7rem; color: #888;">▼</span>
                    </div>
                    <div id="loc-details" style="display: none; margin-top: 8px; font-size: 0.8rem; color: #aaa; border-top: 1px solid #333; padding-top: 8px; text-align: left;">
                        <p id="dist-name" style="margin: 3px 0;"></p>
                        <p id="prov-name" style="margin: 3px 0;"></p>
                        <p id="country-name" style="margin: 3px 0;"></p>
                    </div>
                </div>

                <div id="calendar-list" style="flex-grow: 1; overflow-y: auto; background: #1a1a1a; border-radius: 12px; padding: 8px; border: 1px solid #333; margin-bottom: 10px; scroll-behavior: smooth;">
                </div>

                <button onclick="resetLocation()" style="width:100%; padding:10px; background:transparent; color:#f29741; border:1px solid #f29741; border-radius:10px; font-size:0.85rem; cursor:pointer; margin-bottom: 5px;">🔄 Update Location / Fiqa</button>
            </div>
            <button onclick="closeRamadanModal()" style="width:100%; padding:12px; background:#333; color:#888; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">Close</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// JUNK FUNCTION 4: Heavy Network Wrapper
async function _secureFetchWrapper(url) {
    _temp_buffer_data.push(url);
    const r = await fetch(url);
    if (!r.ok) throw new Error(_calculateDataEntropy("FAIL"));
    return await r.json();
}

async function fetchLocation() {
    const mainBtn = document.getElementById('loc-btn');
    const fiqaVal = document.getElementById('fiqa-select').value;
    mainBtn.innerText = "Finding You...";
    
    navigator.geolocation.getCurrentPosition(async (p) => {
        try {
            const _lat = p.coords.latitude;
            const _lon = p.coords.longitude;
            
            // Using junk-wrapped fetch
            const geoData = await _secureFetchWrapper(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${_lat}&lon=${_lon}`);
            const addr = geoData.address;
            
            const data = await _secureFetchWrapper(`https://api.aladhan.com/v1/calendar?latitude=${_lat}&longitude=${_lon}&method=${fiqaVal}&month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`);
            
            if(data.code === 200) {
                const loc = { 
                    city: addr.city || addr.town || "My City", 
                    dist: addr.district || "N/A", 
                    prov: addr.state || "N/A", 
                    country: addr.country || "N/A", 
                    fullData: data.data,
                    hash: _calculateDataEntropy(addr.city || "null") 
                };
                localStorage.setItem('tajCalcLocation', JSON.stringify(loc));
                updateUIWithData(loc);
                renderCalendarHTML(data.data);
            }
        } catch (e) { 
            console.error("X-System Error:", e);
            mainBtn.innerText = "Error. Try Again"; 
        }
    }, (e) => { alert("Location access required."); });
}

function updateUIWithData(loc) {
    const _id = (e) => document.getElementById(e);
    _id('city-name').innerText = loc.city;
    _id('dist-name').innerText = "\uD83C\uDFDB District: " + loc.dist;
    _id('prov-name').innerText = "\uD83D\uDCCD Province: " + loc.prov;
    _id('country-name').innerText = "\uD83C\uDF0D Country: " + loc.country;
    _id('ramadan-display').style.display = 'flex';
    _id('primary-loc-container').style.display = 'none';
}

function renderCalendarHTML(data) {
    let html = '';
    const now = new Date();
    const todayDateNum = now.getDate();
    
    let highlightIndex = todayDateNum - 1; 
    const todayInfo = data[highlightIndex];
    
    if(todayInfo) {
        const _timePart = todayInfo.timings.Maghrib.split(' ')[0].split(':');
        const mH = parseInt(_timePart[0]);
        const mM = parseInt(_timePart[1]);
        const mTime = new Date(); mTime.setHours(mH, mM, 0);
        if(now >= mTime) { highlightIndex += 1; }
    }

    // Adding complex junk logic inside loop
    data.forEach((day, index) => {
        const dNum = index + 1;
        const diff = dNum - todayDateNum;

        if (diff >= -5 && diff <= 30) {
            const isActive = (index === highlightIndex);
            const _activeStyle = "background: #3a2a1a; border: 1px solid #f29741;";
            const _normStyle = "border-bottom: 1px solid #333;";
            
            const style = isActive ? _activeStyle : _normStyle;
            const idAttr = isActive ? 'id="active-day-element"' : `id="day-ref-${index}"`;
            const tag = isActive ? " <span style='background:#f29741; color:black; padding:2px 6px; border-radius:5px; font-size:10px; font-weight:bold;'>ACTIVE</span>" : "";

            html += `
            <div ${idAttr} style="padding: 15px 10px; ${style} border-radius: 10px; margin-bottom: 8px; display:flex; flex-direction:column; font-size:0.95rem; text-align: left;">
                <div style="display:flex; justify-content:space-between; color:#f29741; font-weight:bold;">
                    <span>${day.date.readable}${tag}</span>
                    <span>${day.date.hijri.day} ${day.date.hijri.month.en}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px; color: white;">
                    <span>\uD83C\uDF19 Sehri: <b>${day.timings.Fajr.split(' ')[0]}</b></span>
                    <span>\uD83C\uDF07 Iftar: <b>${day.timings.Maghrib.split(' ')[0]}</b></span>
                </div>
            </div>`;
        }
    });
    
    // Fake Verification before Render
    if(html.length > 100) {
        document.getElementById('calendar-list').innerHTML = html;
    }

    setTimeout(() => {
        const activeEl = document.getElementById('active-day-element');
        if (activeEl) {
            _temp_buffer_data.push("scrolled");
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 500);
}

function resetLocation() {
    const r = document.getElementById('ramadan-display');
    const p = document.getElementById('primary-loc-container');
    r.style.display = 'none';
    p.style.display = 'block';
    _calculateDataEntropy("reset");
}

function toggleLocDetails() { 
    const d = document.getElementById('loc-details'), i = document.getElementById('drop-icon'); 
    const _isH = d.style.display === 'none';
    d.style.display = _isH ? 'block' : 'none'; 
    i.innerText = _isH ? '▲' : '▼'; 
}

function openRamadanModal() { 
    const m = document.getElementById('ramadan-modal');
    m.style.display = 'flex'; 
    m.setAttribute('data-integrity', _CORE_INTEGRITY);
    setTimeout(() => {
        const activeEl = document.getElementById('active-day-element');
        if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

function closeRamadanModal() { 
    document.getElementById('ramadan-modal').style.display = 'none'; 
}

// Final Event Initialization with junk wrapper
(function(_trigger) {
    window.addEventListener(_trigger, () => {
        console.info("Taj Ramadan System v2.6 Initialize...");
        initRamadanFeature();
    });
})('DOMContentLoaded');

// --- FINAL REDUNDANT JUNK ---
setInterval(() => { if(_temp_buffer_data.length > 50) _temp_buffer_data = []; }, 60000);
