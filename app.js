const API_URL = "./playlist.json";
const player = new Plyr('#player', { controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] });
let library = [];

async function init() {
    try {
        const res = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        library = await res.json();
        render('home');
    } catch (err) { console.error("Load Error:", err); }
}

function render(view) {
    const container = document.getElementById('content');
    const filtered = (view === 'home') ? library : library.filter(m => m.type === view);
    
    container.innerHTML = filtered.map(m => `
        <div class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all cursor-pointer group flex flex-col gap-2" onclick="play('${m.url}', '${m.type}')">
            <div class="w-full h-32 bg-[#282828] rounded flex items-center justify-center overflow-hidden">
                ${m.icon ? `<img src="${m.icon}" class="w-full h-full object-cover">` : `<span class="text-xs text-zinc-500 uppercase">${m.type}</span>`}
            </div>
            <div class="mt-1">
                <h3 class="font-semibold text-sm truncate">${m.title}</h3>
                <p class="text-xs text-zinc-400 truncate">${m.artist}</p>
            </div>
        </div>
    `).join('');
}

function play(url, type) {
    player.source = { type: type === 'video' ? 'video' : 'audio', sources: [{ src: url, type: type === 'video' ? 'video/mp4' : 'audio/mp3' }] };
    player.play();
}

init();