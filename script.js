/* TAJ-SYSTEM SECURITY OVERLAY v36  */
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



// --- SERVICE WORKER REGISTRATION ---
// Ye code aap ki main script.js file ke start ya end mein hona chahiye
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js') // Ye sw.js file ka naam hai
            .then(reg => console.log('Service Worker: Registered Successfully'))
            .catch(err => console.log('Service Worker: Registration Failed', err));
    });
}





// --- 1. Master Expiry Logic (Calculator Block) ---
const masterExpiry = "2027-02-20"; 

function validateApp() {
    const today = new Date();
    const expiry = new Date(masterExpiry);

    if (today > expiry) {
        document.body.innerHTML = `
            <div style="height:100vh; background:#000; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px; font-family:sans-serif;">
                <h2 style="color:#f29741;">Service Update Required</h2>
                <p style="font-size:1.1rem;">Aapka calculator version purana ho gaya hai. <br> Istemal jari rakhne ke liye rabta karein:</p>
                <a href="https://wa.me/923346800959" style="margin-top:20px; background:#25D366; color:white; padding:12px 25px; border-radius:50px; text-decoration:none; font-weight:bold;">
                    Contact WasiDevelopers
                </a>
            </div>`;
        document.body.style.background = "#000";
        return false;
    }
    return true;
}

// Ye line calculator check karegi
if (!validateApp()) throw new Error("App Expired");




let currentExp = ""; 
let isFinished = false; 
let lastFullExp = ""; 
let editMode = false;

function switchView(v) {
    document.getElementById('calc-view').classList.toggle('active', v==='calc');
    document.getElementById('conv-view').classList.toggle('active', v==='conv');
    document.getElementById('tab-calc').classList.toggle('active', v==='calc');
    document.getElementById('tab-conv').classList.toggle('active', v==='conv');
    if(v==='conv') { doCurrency(); doLength(); doGeneralWeight(); }
}

function openHistory() { 
    const panel = document.getElementById('history-panel');
    if(panel) { panel.style.display = 'flex'; loadHistory(); }
}

function closeHistory() { 
    if(typeof editMode !== 'undefined' && editMode) {
        editMode = false; 
        const checkboxes = document.querySelectorAll('.select-checkbox');
        const footer = document.getElementById('history-footer');
        const editBtn = document.getElementById('edit-btn');
        checkboxes.forEach(cb => cb.style.display = 'none');
        if(footer) footer.style.display = 'none';
        if(editBtn) editBtn.innerText = 'Clear';
    }
    document.getElementById('history-panel').style.display = 'none'; 
    switchView('calc');
}

function recalculate(exp) { 
    const calcLine = document.getElementById('calculation-line');
    let cleanExp = exp.toString().replace(/,/g, '').replace(/=/g, '').trim(); 
    calcLine.value = cleanExp; 
    isFinished = false; 
    document.getElementById('answer-line').classList.remove('final-answer'); 
    closeHistory(); 
    updateUI(); 
    setTimeout(() => {
        calcLine.focus();
        calcLine.setSelectionRange(calcLine.value.length, calcLine.value.length);
    }, 10);
}

function copyValue(val) {
    let cleanVal = val.replace(/,/g, '').replace('=', '').trim();
    navigator.clipboard.writeText(cleanVal).then(() => {
        let toast = document.createElement("div");
        toast.innerText = "Copied";
        toast.style = "position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#333; color:#fff; padding:10px 24px; border-radius:30px; font-size:14px; z-index:10000; box-shadow:0 4px 12px rgba(0,0,0,0.4); transition:opacity 0.4s ease;";
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 400);
        }, 1500);
    });
}

function toggleEditMode() {
    editMode = !editMode;
    const checkboxes = document.querySelectorAll('.select-checkbox');
    const footer = document.getElementById('history-footer');
    const editBtn = document.getElementById('edit-btn');
    checkboxes.forEach(cb => cb.style.display = editMode ? 'block' : 'none');
    if(footer) footer.style.display = editMode ? 'flex' : 'none';
    if(editBtn) editBtn.innerText = editMode ? 'Cancel' : 'Clear';
}

function saveToHistory(exp, res) {
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    let dateStr = new Date().toLocaleDateString('en-GB'); 
    const id = "ID-" + Date.now();
    history.unshift({ id, exp, res, date: dateStr });
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 100)));
}

function loadHistory() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    let html = ""; let lastDate = "";
    history.forEach(item => {
        if(item.date !== lastDate) { html += `<div class="date-header-row"><span class="date-label">${item.date}</span></div>`; lastDate = item.date; }
        html += `<div class="history-card" id="card-${item.id}"><div class="card-main"><input type="checkbox" class="select-checkbox" value="${item.id}" onchange="updateCardStyle('${item.id}')"><div class="card-content" onclick="toggleCheck('${item.id}')"><div class="hist-exp-text">${item.exp}</div><div class="hist-res-text">${item.res}</div></div></div><div class="card-actions"><button class="action-btn" onclick="copyValue('${item.res}')">Copy</button><button class="action-btn" onclick="recalculate('${item.exp}')">Recalculate</button></div></div>`;
    });
    list.innerHTML = html || "<p style='text-align:center; margin-top:50px; color:#444;'>No records</p>";
}

function toggleCheck(id) { if(!editMode) return; const cb = document.querySelector(`.select-checkbox[value="${id}"]`); cb.checked = !cb.checked; updateCardStyle(id); }
function updateCardStyle(id) { const card = document.getElementById(`card-${id}`); if(card) card.classList.toggle('selected', card.querySelector('.select-checkbox').checked); }

function selectAllHistory() { 
    const checkboxes = document.querySelectorAll('.select-checkbox'); 
    const allChecked = Array.from(checkboxes).every(cb => cb.checked); 
    checkboxes.forEach(cb => { cb.checked = !allChecked; updateCardStyle(cb.value); }); 
}

function deleteSelected() {
    const selectedIds = Array.from(document.querySelectorAll('.select-checkbox:checked')).map(cb => cb.value);
    if(selectedIds.length === 0) return;
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history = history.filter(item => !selectedIds.includes(item.id));
    localStorage.setItem('calcHistory', JSON.stringify(history));
    editMode = false;
    toggleEditMode(); 
    loadHistory();
}

function allClear() { 
    document.getElementById('calculation-line').value = ""; 
    document.getElementById('answer-line').innerText = "0"; 
    document.getElementById('answer-line').classList.remove('final-answer'); 
    isFinished = false;
    updateUI();
}

function back() {
    const calcLine = document.getElementById('calculation-line');
    let start = calcLine.selectionStart;
    let val = calcLine.value;
    if (isFinished) {
        allClear();
    } else if (start > 0) {
        calcLine.value = val.substring(0, start - 1) + val.substring(calcLine.selectionEnd);
        calcLine.setSelectionRange(start - 1, start - 1);
    }
    calcLine.focus();
    updateUI();
}


function addNum(num) {
    const calcLine = document.getElementById('calculation-line');
    if (isFinished || calcLine.value.includes('=')) { 
        calcLine.value = ""; isFinished = false; 
        document.getElementById('answer-line').classList.remove('final-answer'); 
    }
    let start = calcLine.selectionStart;
    let val = calcLine.value;
    if (num === '.') {
        let parts = val.split(/[\+\-×÷%*\/]/);
        let lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
        if (val === "" || /[\+\-×÷%*\/]$/.test(val.substring(0, start))) { num = "0."; }
    }
    calcLine.value = val.substring(0, start) + num + val.substring(calcLine.selectionEnd);
    let nextPos = start + num.length;
    calcLine.setSelectionRange(nextPos, nextPos);
    calcLine.focus();
    updateUI();
}

function addOperator(op) {
    const calcLine = document.getElementById('calculation-line');
    const ansLine = document.getElementById('answer-line');
    if (op === '*') op = '×';
    if (op === '/') op = '÷';
    let val = calcLine.value;
    let start = calcLine.selectionStart;
    if (val.trim() === "") {
        if (op === '-' || op === '+') { calcLine.value = op; } 
        else { calcLine.value = "0" + op; }
    } else if (isFinished || val.includes('=')) {
        isFinished = false;
        let finalAns = ansLine.innerText.replace('=', '').replace(/,/g, '').trim();
        calcLine.value = finalAns + op;
        ansLine.classList.remove('final-answer');
    } else {
        let lastChar = val.slice(-1);
        if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
            calcLine.value = val.slice(0, -1) + op;
        } else {
            calcLine.value = val.substring(0, start) + op + val.substring(calcLine.selectionEnd);
            calcLine.setSelectionRange(start + 1, start + 1);
        }
    }
    calcLine.focus();
    updateUI();
}

function updateUI() {
    const ansLine = document.getElementById('answer-line');
    const calcLine = document.getElementById('calculation-line');
    let start = calcLine.selectionStart;
    let oldVal = calcLine.value;
    try {
        if (oldVal) {
            let cleanExp = oldVal.replace(/,/g, '').replace(/=/g, '');
            let formattedDisplay = cleanExp.replace(/-?\d+\.?\d*/g, (num) => {
                if (num === '-') return '-';
                if (num.includes('.')) {
                    let parts = num.split('.');
                    return Number(parts[0]).toLocaleString() + '.' + (parts[1] || '');
                }
                return Number(num).toLocaleString();
            });
            if (formattedDisplay !== oldVal) {
                calcLine.value = formattedDisplay;
                let diff = formattedDisplay.length - oldVal.length;
                calcLine.setSelectionRange(start + diff, start + diff);
            }

            // PERCENTAGE FIX: Yahan logic badla hai
            let mathReady = cleanExp.replace(/×/g, '*').replace(/÷/g, '/');
            // Advanced Percentage Logic: 1000 + 10% -> 1000 + (1000 * 10/100)
            mathReady = mathReady.replace(/(\d+\.?\d*)\s*([\+\-])\s*(\d+\.?\d*)%/g, "($1 $2 ($1 * $3 / 100))");
            // Simple Percentage Logic: 20% -> (20/100)
            mathReady = mathReady.replace(/(\d+\.?\d*)%/g, "($1/100)");

            let evalFriendly = mathReady.trim();
            if (evalFriendly !== "" && !['+', '-', '*', '/', '%'].includes(evalFriendly.slice(-1))) {
                let res = eval(evalFriendly);
                ansLine.innerText = res.toLocaleString(undefined, { maximumFractionDigits: 10 });
            }
        } else { ansLine.innerText = "0"; }
    } catch(e) {}
    calcLine.style.height = 'auto';
    calcLine.style.height = calcLine.scrollHeight + 'px';
}


function calculate() {
    const calcLine = document.getElementById('calculation-line');
    const ansLine = document.getElementById('answer-line');
    let exp = calcLine.value;
    if (!exp || exp.includes('=') || isFinished) return;
    try {
        let cleanExp = exp.replace(/,/g, '');
        let mathExp = cleanExp.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Advanced Percentage Logic (Same as above)
        mathExp = mathExp.replace(/(\d+\.?\d*)\s*([\+\-])\s*(\d+\.?\d*)%/g, "($1 $2 ($1 * $3 / 100))");
        mathExp = mathExp.replace(/(\d+\.?\d*)%/g, "($1/100)");

        while(['+', '-', '*', '/'].includes(mathExp.slice(-1).trim())) {
            mathExp = mathExp.slice(0, -1);
        }

        let res = eval(mathExp);
        let formattedRes = res.toLocaleString(undefined, { maximumFractionDigits: 10 });
        
        calcLine.value = calcLine.value + "=";
        ansLine.innerText = "=" + formattedRes;
        ansLine.classList.add('final-answer');
        saveToHistory(calcLine.value, formattedRes);
        isFinished = true;
    } catch(e) { console.log("Math Error"); }
}




        
    async function doCurrency() {
        const f = document.getElementById('c-from').value;
        const t = document.getElementById('c-to').value;
        const amt = document.getElementById('c-amt').value;
        try {
            const r = await fetch(`https://open.er-api.com/v6/latest/${f}`);
            const d = await r.json();
            const rate = d.rates[t];
            document.getElementById('c-res').value = (amt * rate).toFixed(2);
            document.getElementById('c-info').innerText = `Live: 1 ${f} = ${rate.toFixed(2)} ${t}`;
        } catch(e) { document.getElementById('c-info').innerText = "Offline"; }
    }


function doGoldWeight() {
    // Standard conversion units (base unit: Gram)
    const units = {
        g: 1,
        tola: 11.664,
        masha: 0.972, // (11.664 / 12)
        ratti: 0.1215 // (11.664 / 96)
    };

    const val = document.getElementById('g-val').value;
    const fromUnit = document.getElementById('g-from').value;
    const toUnit = document.getElementById('g-to').value;
    const resField = document.getElementById('g-res');

    if (!val || val < 0) {
        resField.value = "";
        return;
    }

    // Pehle gram mein convert karo, phir target unit mein
    const inGrams = val * units[fromUnit];
    const finalRes = inGrams / units[toUnit];

    // Result ko 3 decimal tak dikhana taake sona sahi napa jaye
    resField.value = finalRes.toFixed(3);
}



function doGeneralWeight() {
    // Sab units ko Gram (g) ke hisab se set kiya gaya hai
    const u = { 
        g: 1, 
        kg: 1000, 
        ton: 907184.74, // US Ton (Short Ton)
        mton: 1000000   // Metric Ton (1000 KG) - Jo aapne pucha tha
    };

    const f = document.getElementById('w-from').value;
    const t = document.getElementById('w-to').value;
    const v = document.getElementById('w-val').value;

    if (!v) {
        document.getElementById('w-res').value = "";
        return;
    }

    // Calculation logic
    document.getElementById('w-res').value = ((v * u[f]) / u[t]).toFixed(3);
}

    
    
    function doLength() {
        const u = { m:1, km:1000, ft:0.3048, in:0.0254, cm:0.01 };
        const f = document.getElementById('l-from').value;
        const t = document.getElementById('l-to').value;
        const v = document.getElementById('l-val').value;
        if (!v) return;
        document.getElementById('l-res').value = ((v * u[f]) / u[t]).toFixed(3);
    }

    function togglePopup() {
        const popup = document.getElementById('custom-popup');
        popup.style.display = (popup.style.display === 'flex') ? 'none' : 'flex';
    }

    window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    
    // Sirf 1.2 second ka wait (User experience behtar karne ke liye)
    setTimeout(() => {
        if(splash) {
            splash.style.transition = "opacity 0.5s ease, visibility 0.5s";
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            
            // Splash hatne ke baad background mein update check shuru karo
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(reg => reg.update());
            }
        }
    }, 1200); 
});



// --- AUTO-INSTALL POPUP LOGIC ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtnContainer = document.getElementById('install-container'); 
    if(installBtnContainer) {
        installBtnContainer.style.display = 'block';
        const installIcon = document.getElementById('install-icon-id');
        if(installIcon) installIcon.innerHTML = "<i>📥</i>"; 
        const installText = document.getElementById('install-text-id');
        if(installText) installText.innerText = "";
    }

    setTimeout(() => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
        if (!isInstalled && typeof togglePopup === "function") {
            const popup = document.getElementById('custom-popup');
            if (popup && popup.style.display !== 'flex') {
                togglePopup(); 
                
                const pTitle = document.getElementById('popup-title');
                if(pTitle) pTitle.innerText = ""; // Title set kiya
                
                const pDev = document.getElementById('dev-info');
                if(pDev) {
                    // FIX: Pehle instruction line, phir line break, phir Developer ka naam
                    pDev.innerHTML = "Behtareen experience aur offline use karne ke liye app install karein.<br><br><span style='color:#f29741; font-weight:bold;'></span>";
                }
            }
        }
    }, 2000);
});

// Install Button ka click function (Wahi purana)
function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            const installBtnContainer = document.getElementById('install-container');
            if(installBtnContainer) installBtnContainer.style.display = 'none';
            if(typeof togglePopup === "function") togglePopup();
        }
        deferredPrompt = null;
    });
}

// end Notifications 





// WhatsApp link ko clickable banane ke liye
const waEl = document.getElementById('wa-info');
if(waEl) {
    waEl.onclick = () => {
        window.open("https://wa.me/923346800959?text=Hi%20WasiDevelopers,%20I%20have%20a%20query%20about%20the%20Calculator%20for%20my%20Business.", "_blank");
    };
}


// Splash Screen ka Private Data
const splashData = {
    name: "Taj Karyana \n & Mobile Shop",
    phone: "0334-6800959",
    address: "Taj Chowk National Highway Saidq Abad"
};

function initSplash() {
    const shopName = document.getElementById('shop-name-id');
    const whatsapp = document.getElementById('whatsapp-id');
    const address = document.getElementById('address-id');

    // JS ke zariye CSS content mein data bhejna
    if(shopName) shopName.setAttribute('data-text', splashData.name);
    if(whatsapp) whatsapp.setAttribute('data-num', splashData.phone);
    if(address) address.setAttribute('data-addr', splashData.address);
}

// Jab page load ho jaye tab data fill karo
document.addEventListener('DOMContentLoaded', initSplash);


// Central Data (Inko Obfuscate karne se sab hide ho jayega)
const appInfoData = {
    developer: "Wasi Developers",
    devWA: "0334-6800959",
    version: "v2.0.34",
    installText: "Install Taj Karyana Calculator",
    closeText: "Close"
};

function initAppInfo() {
    const devEl = document.getElementById('dev-info');
    const waEl = document.getElementById('wa-info');
    const verEl = document.getElementById('version-info');
    const insTextEl = document.getElementById('install-text-id');
    const closeBtnEl = document.getElementById('close-popup-btn');

    // Data load karna (Attributes ke zariye)
    if(devEl) devEl.setAttribute('data-dev', appInfoData.developer);
    if(waEl) waEl.setAttribute('data-wa', appInfoData.devWA);
    if(verEl) verEl.setAttribute('data-ver', appInfoData.version);
    if(insTextEl) insTextEl.setAttribute('data-ins', appInfoData.installText);
    
    // Close button ka direct text
   
}

// Pehle wale initSplash ke sath isay bhi call karein
document.addEventListener('DOMContentLoaded', () => {
    initSplash(); // Agar splash wala function pehle se hai
    initAppInfo();
});
