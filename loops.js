(() => {
  const list = document.getElementById('loop-list');
  const catalog = window.CATALOG;
  if (!list || !catalog || !Array.isArray(catalog.loops)) return;

  const count = document.getElementById('loop-count');
  if (count) count.textContent = catalog.loops.length + ' files';

  const PLAY_LABEL = '\u25B6\uFE0E play';
  const PAUSE_LABEL = '\u275A\u275A pause';

  const audio = new Audio();
  let current = null; // la fila que esta cargada en el audio

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return m + ':' + s;
  }

  function setPlaying(row, playing) {
    row.classList.toggle('is-playing', playing);
    row.querySelector('.loop-play').textContent = playing ? PAUSE_LABEL : PLAY_LABEL;
  }

  function resetRow(row) {
    setPlaying(row, false);
    row.style.setProperty('--played', '0%');
  }

  catalog.loops.forEach(item => {
    const file = item.file.split('/').pop();
    let title = file.replace(/\.[^.]+$/, '');
    try { title = decodeURIComponent(title); } catch (e) {}

    const row = document.createElement('li');
    row.className = 'loop';
    row.innerHTML =
      '<button type="button" class="btn loop-play"></button>' +
      '<span class="loop-name"></span>' +
      '<time>--:--</time>' +
      '<a class="btn" download>download</a>';

    const playBtn = row.querySelector('.loop-play');
    const download = row.querySelector('a');

    row.querySelector('.loop-name').textContent = title;
    playBtn.textContent = PLAY_LABEL;
    playBtn.setAttribute('aria-label', 'play ' + title);
    download.href = item.file;
    download.setAttribute('aria-label', 'download ' + title);

    playBtn.addEventListener('click', () => {
      if (current === row) {
        if (audio.paused) audio.play(); else audio.pause();
        return;
      }
      if (current) resetRow(current);
      current = row;
      audio.src = item.file;
      audio.play().catch(() => {});
    });

    // duracion real del archivo
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = item.file;
    probe.addEventListener('loadedmetadata', () => {
      row.querySelector('time').textContent = formatTime(probe.duration);
    });

    list.appendChild(row);
  });

  audio.addEventListener('play', () => { if (current) setPlaying(current, true); });
  audio.addEventListener('pause', () => { if (current) setPlaying(current, false); });
  audio.addEventListener('ended', () => { if (current) resetRow(current); });

  audio.addEventListener('timeupdate', () => {
    if (!current || !(audio.duration > 0)) return;
    current.style.setProperty('--played', (audio.currentTime / audio.duration) * 100 + '%');
  });
})();