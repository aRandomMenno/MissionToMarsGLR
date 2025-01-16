function filterSongs() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const songList = document.getElementById('songList');
    const songs = songList.getElementsByTagName('li');

    for (let i = 0; i < songs.length; i++) {
        const songName = songs[i].textContent.toLowerCase();
        if (songName.includes(searchInput)) {
            songs[i].style.display = '';
        } else {
            songs[i].style.display = 'none';
        }
    }
}

const songList = document.getElementById('songList');
const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');

songList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const songFile = event.target.getAttribute('data-song');
        audioSource.src = songFile;
        audioPlayer.load();
        audioPlayer.play();
    }
});