(() => {
  const audio = document.getElementById('audio');
  if (!audio) return;

  // si la lista pide un origen, arma las filas desde catalog.js
  const list = document.querySelector('.track-list');
  const source = list && list.dataset.source;
  const catalog = window.CATALOG;
  if (source && catalog && Array.isArray(catalog[source])) {
    catalog[source].forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'track';
      button.dataset.src = item.file;
      list.appendChild(button);
    });
  }

  const tracks = [...document.querySelectorAll('.track')];
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const downloadBtn = document.getElementById('download-btn');
  const progress = document.getElementById('progress');
  const currentTime = document.getElementById('current-time');
  const totalTime = document.getElementById('total-time');
  const status = document.getElementById('now-playing');
  const trackCount = document.getElementById('track-count');

  if (trackCount) {
    trackCount.textContent = String(tracks.length).padStart(2, '0') + ' tracks';
  }
  if (tracks.length === 0) return;

  const PLAY_LABEL = '\u25B6\uFE0E play';
  const PAUSE_LABEL = '\u275A\u275A pause';

  let active = 0;
  let seeking = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return m + ':' + s;
  }

  function setProgress(percent) {
    const value = Math.max(0, Math.min(100, percent || 0));
    progress.value = value;
    progress.style.setProperty('--played', value + '%');
  }

  function updatePlayButton() {
    const playing = !audio.paused && !audio.ended;
    playBtn.textContent = playing ? PAUSE_LABEL : PLAY_LABEL;
    playBtn.setAttribute('aria-label', playing ? 'pause sample' : 'play sample');
  }

  function selectTrack(index, autoplay) {
    active = (index + tracks.length) % tracks.length;
    const track = tracks[active];

    tracks.forEach((t, i) => {
      t.classList.toggle('is-active', i === active);
      t.setAttribute('aria-current', i === active ? 'true' : 'false');
    });

    audio.src = track.dataset.src;
    if (downloadBtn) downloadBtn.href = track.dataset.src;
    status.textContent = 'previewing: ' + track.dataset.title;
    totalTime.textContent = track.dataset.duration || '0:00';
    currentTime.textContent = '0:00';
    setProgress(0);

    if (autoplay) {
      audio.play().catch(() => {
        status.textContent = 'could not play: check the audio file path';
      });
    } else {
      audio.pause();
    }
    updatePlayButton();
  }

  // arma cada fila con el nombre y la duracion reales del archivo
  tracks.forEach((track, i) => {
    const file = track.dataset.src.split('/').pop();
    let title = file.replace(/\.[^.]+$/, '');
    try { title = decodeURIComponent(title); } catch (e) {}
    track.dataset.title = title;

    track.innerHTML =
      '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<b class="name"></b>' +
      '<time>--:--</time>';
    track.querySelector('.name').textContent = title;

    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = track.dataset.src;
    probe.addEventListener('loadedmetadata', () => {
      track.dataset.duration = formatTime(probe.duration);
      track.querySelector('time').textContent = track.dataset.duration;
      if (i === active) totalTime.textContent = track.dataset.duration;
    });
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        status.textContent = 'could not play: check the audio file path';
      });
    } else {
      audio.pause();
    }
  });

  prevBtn.addEventListener('click', () => selectTrack(active - 1, true));
  nextBtn.addEventListener('click', () => selectTrack(active + 1, true));
  tracks.forEach((t, i) => t.addEventListener('click', () => selectTrack(i, true)));

  audio.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audio.currentTime);
    if (!seeking && audio.duration > 0) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  });

  audio.addEventListener('play', updatePlayButton);
  audio.addEventListener('pause', updatePlayButton);

  audio.addEventListener('ended', () => {
    if (active < tracks.length - 1) {
      selectTrack(active + 1, true);
    } else {
      updatePlayButton();
    }
  });

  progress.addEventListener('input', () => {
    seeking = true;
    setProgress(Number(progress.value));
  });

  progress.addEventListener('change', () => {
    if (audio.duration > 0) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }
    seeking = false;
  });

  selectTrack(0, false);
})();