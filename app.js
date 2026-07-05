const API_URL = "https://corsproxy.io/?https://media.alexgaming.dev/playlist.json";
const player = new Plyr('#player', { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
let library = [];

async function init() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Registry unreachable');
        library = await res.json();
        render(library);
    } catch (err) {
        console.error("LCS Init Error:", err);
        document.getElementById('content').innerHTML = `<p class="p-6 text-red-500">Error: Could not load media registry.</p>`;
    }
}

function render(data) {
    const container = document.getElementById('content');
    container.innerHTML = data.map(m => `
        <div class="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all cursor-pointer" onclick="play('${m.url}')">
            <div class="h-32 bg-[#282828] rounded mb-4 flex items-center justify-center font-bold text-zinc-600">${m.type.toUpperCase()}</div>
            <h3 class="font-bold truncate">${m.title}</h3>
            <p class="text-sm text-zinc-400 truncate">${m.artist}</p>
        </div>
    `).join('');
}

document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = library.filter(m => {
        if (query.startsWith('title:')) return m.title.toLowerCase().includes(query.split(':')[1]);
        if (query.startsWith('art:')) return m.artist.toLowerCase().includes(query.split(':')[1]);
        return m.title.toLowerCase().includes(query) || m.artist.toLowerCase().includes(query);
    });
    render(filtered);
});

function play(url) {
    player.source = { type: 'audio', sources: [{ src: url, type: 'audio/mp3' }] };
    player.play();
}

init();