const prevButton = document.getElementById("prev")
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById("repeat")
const shuffleButton = document.getElementById("shuffle")
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')
const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')
const currentProgress = document.getElementById('current-progress')

//index sarki için
let index;

//dongu
let loop = true


//karistirici açık mı?
let isShuffleActive= false;

//sarkı listesi

const songsList = [
    {
        name: "Etme",
        link: "assets/etme.mp3",
        artist: "Yilmaz Erdogan",
        image: "assets/siir.jpg"
    }, 
    {
       name: "Kum Gibi",
       link: "assets/kum_gibi.mp3",
       artist: "Ahmet Kaya",
       image: "assets/Ahmet-Kaya.jpg"
   }, 
   {
       name: "Beni Sen İnandir",
       link: "assets/beni_sen_inandir.mp3",
       artist: "Pinhani",
       image: "assets/siir.jpg"
   },
   {
     name: "Saydim",
     link: "assets/saydim.mp3",
     artist: "Ogün Sanlisoy",
     image: "assets/Ogun-Sanlisoy.jpg"
   }, 
   {
     name: "Zor Günler",
     link: "assets/zor_gunler.mp3",
     artist: "Servet Kocakaya",
     image: "assets/Servet-Kocakaya.jpg"
    }, 
    {
     name: "Bi Daha",
     link: "assets/bi_daha.mp3",
     artist: "Levent Yüksel",
     image: "assets/Levent-Yuksel.jpg"
    }
    
]

//zaman formatı ayarlama
const timeFormatter = (timeInput) => {
    let minute =Math.floor(timeInput/60)
    minute = minute < 10 ? "0"+minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0"+second :second
    return `${minute}:${second}`
}

//sarki atama

 //şarkıyı çalma

 const playAudio = () => {
    audio.play()
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide")
} 



const setSong = (arrayIndex) =>{
    if(loop == true && isShuffleActive == true){
        arrayIndex = Math.floor(Math.random()*100)%5

    }
    let { name, link, artist, image } = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () =>{
        maxDuration.innerText = timeFormatter(audio.duration);
    }
    playListContainer.classList.add("hide")
    playAudio()


}



//sıradakini çal
const nextSong = () =>{
    if(loop) {
        if (index == (songsList.length - 1)) {
            index = 0;
        }else{
            index+=1;
        }
        setSong(index);

    }else{
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex);
    }

}

const pauseAudio = () => {
    audio.pause();
    pauseButton.classList.add('hide');
    playButton.classList.remove('hide');

}

const previounsSong = () => {
    pauseAudio();
    if(index > 0){
        index-=1;
    }else{
        index = songsList.length - 1
    }
    setSong(index);
    playAudio();
}

playListButton.addEventListener(`click` , ()=>{
    playListContainer.classList.remove('hide');
})
closeButton.addEventListener(`click` , ()=>{
    playListContainer.classList.add('hide');
})

setInterval(() =>{
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3))* 100 + "%"
},1000)


//tıklama yakalama

nextButton.addEventListener(`click`,nextSong);
pauseButton.addEventListener(`click` , pauseAudio);
playButton.addEventListener(`click`, playAudio);
prevButton.addEventListener(`click` , previounsSong);
repeatButton.addEventListener(`click` , ()=>{
    if(repeatButton.classList.contains(`active`)) {
        repeatButton.classList.remove(`active`);
        audio.loop = false;
        console.log('tekrar kapatıldı');
    } else{
        repeatButton.classList.add(`active`)
        audio.loop = true;
        console.log('tekrar açıldı');
    }
})

shuffleButton.addEventListener(`click` , ()=>{
    if(shuffleButton.classList.contains(`active`)) {
        isShuffleActive= false
        shuffleButton.classList.remove(`active`);
        audio.loop = true;
    }else{
        isShuffleActive = true;
        shuffleButton.classList.add(`active`)
        audio.loop = false;
        console.log("kapatıldı");
    }
})

progressBar.addEventListener(`click`, (event)=> {
    let coordStart = progressBar.getBoundingClientRect().left
    let coordEnd = event.clientX
    let progress = (coordEnd-coordStart) / progressBar.offsetWidth;
    currentProgress.style.width = progressBar * 100 + "%"

    audio.currentTime = progress * audio.duration
    audio.play();
    pauseButton.classList.remove('hide');
    playButton.classList.add("hide")

})
const initializePlaylist = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"> 
          <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
             ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
        </li>`
    }
}


audio.addEventListener = (`timeupdate` , () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})



//şarkı bittiğinde yakala
audio.onended = () =>{
    nextSong();
}

//ekran yüklenildiğinde

window.onload = () => {
    index = 0;
    setSong(index);
    //durdur ve şarkı listesi olustur
    pauseAudio();
    initializePlaylist();
}







