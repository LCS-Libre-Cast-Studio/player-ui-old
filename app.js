// Wir nutzen einen Array von Proxys. Wenn einer blockiert, wird der nächste versucht.
const REGISTRY = "https://media.alexgaming.dev/playlist.json";
const PROXIES = [
    "", // Direkter Versuch (falls CORS doch mal klappt)
    "https://corsproxy.io/?", 
    "https://api.allorigins.win/raw?url="
];

const player = new Plyr('#player', { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
let library = [];

async function init() {
    for (const proxy of PROXIES) {
        try {
            const url = proxy + encodeURIComponent(REGISTRY);
            const res = await fetch(url);
            
            if (res.ok) {
                library = await res.json();
                render('home');
                return; // Erfolg!
            }
        } catch (err) {
            console.warn(`Proxy ${proxy || 'direct'} failed, trying next...`);
        }
    }
    
    // Wenn alles fehlschlägt:
    console.error("LCS Init Error: All registry attempts failed.");
    document.getElementById('content').innerHTML = `
        <div class="col-span-full text-center p-10 text-red-500">
            <p>Error: Could not load media registry.</p>
            <p class="text-xs text-zinc-500">Prüfe, ob die JSON-Datei öffentlich erreichbar ist.</p>
        </div>`;
}

function render(view) {
    const container = document.getElementById('content');
    const filtered = (view === 'home') ? library : library.filter(m => m.type === view);
    
    container.innerHTML = filtered.map(m => `
        <div class="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all cursor-pointer group" onclick="play('${m.url}')">
            <div class="h-40 bg-[#282828] rounded mb-4 flex items-center justify-center font-bold text-zinc-600">
                ${m.type.toUpperCase()}
            </div>
            <h3 class="font-bold truncate">${m.title}</h3>
            <p class="text-sm text-zinc-400 truncate">${m.artist}</p>
        </div>
    `).join('');
}

document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = library.filter(m => {
        if (query.startsWith('title:')) return m.title.toLowerCase().includes(query.replace('title:', ''));
        if (query.startsWith('art:')) return m.artist.toLowerCase().includes(query.replace('art:', ''));
        return m.title.toLowerCase().includes(query) || m.artist.toLowerCase().includes(query);
    });
    
    const container = document.getElementById('content');
    container.innerHTML = filtered.map(m => `
        <div class="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all cursor-pointer group" onclick="play('${m.url}')">
            <div class="h-40 bg-[#282828] rounded mb-4 flex items-center justify-center font-bold text-zinc-600">
                ${m.type.toUpperCase()}
            </div>
            <h3 class="font-bold truncate">${m.title}</h3>
            <p class="text-sm text-zinc-400 truncate">${m.artist}</p>
        </div>
    `).join('');
});

function play(url) {
    player.source = { type: 'audio', sources: [{ src: url, type: 'audio/mp3' }] };
    player.play();
}

init();
