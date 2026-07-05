// Proxy-URL um die Browser-Sicherheitsbeschränkungen (CORS) zu umgehen
const API_URL = "https://corsproxy.io/?https://media.alexgaming.dev/playlist.json";
const player = new Plyr('#player', { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
let library = [];

async function init() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        library = await res.json();
        render('home');
    } catch (err) {
        console.error("LCS Load Error (Details):", err);
        document.getElementById('content').innerHTML = `
            <div class="col-span-full text-center p-10 text-red-500">
                <p>Error: Could not load media registry.</p>
                <p class="text-xs text-zinc-500">Check Konsole (F12) für Details.</p>
            </div>`;
    }
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
    // Direktes Rendern der gefilterten Liste
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
