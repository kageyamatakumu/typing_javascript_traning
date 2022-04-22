const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typesound = new Audio("./audio/audio_typing-sound.mp3")
const wrongsound = new Audio("./audio/audio_wrong.mp3")
const crearsound = new Audio("./audio/audio_correct.mp3")



//inputテキスト入力。合っているのかどうか判定
typeInput.addEventListener("input",() => {

    // タイプ音をつける
    typesound.play();
    typesound.currentTime = 0;

    const sentenceArray = typeDisplay.querySelectorAll("span");
    const arrayValue = typeInput.value.split("");
    let crear = true;
    sentenceArray.forEach((characterSpan, index) => {
        if((arrayValue[index] == null)){
            characterSpan.classList.remove("incorrect");
            characterSpan.classList.remove("correct");
            crear = false
        }
        else if(characterSpan.innerText == arrayValue[index]){
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");

            wrongsound.volume = 0.3;
            wrongsound.play();
            wrongsound.currentTime = 0;

            crear = false;
        }
    });

    if(crear == true){
        crearsound.play();
        crearsound.currentTime = 0;
        RenderNextSentence();
    }
})

//非同期処理でランダムな文章を取得する
function RandomSentence(){
    return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

// ランダムな文章を取得して、表示する
async function RenderNextSentence(){
    const sentence = await RandomSentence();
    typeDisplay.innerText = "";

    //文章を１文字ずつ分解して、spanタグを生成する
    let onetext = sentence.split("");
    onetext.map((character) => {
        const characterSpan = document.createElement("span")
        characterSpan.innerText = character;
        typeDisplay.appendChild(characterSpan);
    });

    //テキストの中を空にする
    typeInput.value = "";

    StartTimer();
}

let startTime;
let originTime = 90;
function StartTimer() {
    timer.innerText = originTime;
    startTime = new Date();

    setInterval(() => {
        timer.innerText = originTime - getTimerTime();
        if(timer.innerText <= 0) TimeUp();
    }, 1000)
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp(){
    RenderNextSentence();
}

RenderNextSentence();


