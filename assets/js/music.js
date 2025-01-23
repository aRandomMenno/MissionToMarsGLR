function changeSong(songName) {
    const audioPlayer = document.querySelector('audio');
    const source = document.getElementById('playingSong');
    source.src = `../assets/media/audio/${songName}`;
    audioPlayer.load();
    audioPlayer.play();
}

function filterSongs() {
    const input = document.getElementById('search');
    const filter = input.value.toLowerCase();
    const songList = document.getElementById('songList');
    const songs = songList.getElementsByTagName('li');

    for (let i = 0; i < songs.length; i++) {
        const text = songs[i].textContent || songs[i].innerText;
        if (text.toLowerCase().indexOf(filter) > -1) {
            songs[i].style.display = "";
        } else {
            songs[i].style.display = "none";
        }
    }
}