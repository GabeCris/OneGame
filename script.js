// VARIAVEIS
let id = 0;
let lastColor;
let cardsBot = [];
let cardsPlayer = [];
let cardMid = document.getElementById("mid");
let backMid = document.getElementById("back-mid");
let nickname = document.getElementById("nick-player");
let colors = ["blue", "yellow", "green", "red"];

const timeBotBuy = 0; //EM MILISEGUNDOS
const timeBotPlay = 1000; //EM MILISEGUNDOS

const maxValueCards = 10;
const bot = document.getElementById("bot");
const block = document.getElementById("block");
const player = document.getElementById("player");
const message = document.getElementById('span-message');
const botContainerCards = document.getElementById("bot-cards");
const midContainerCard = document.getElementById("mid-cards");
let countBot = document.getElementById("contadorBot");
const playerContainerCards = document.getElementById("player-cards");
let countPlayer = document.getElementById("contadorPlayer");

let turn = 1;
let qtde = 7;

// MODAIS
let buttons = document.querySelectorAll("button");

buttons.forEach((element) => {
    element.addEventListener(
        "click",
        (openCloseModal = () => {
            const event = element.parentNode.parentNode.parentNode.id;
            document.getElementById(`${event}`).classList.toggle("open-modal");
            document.getElementById(`${event}`).classList.toggle("close-modal");
        })
    );
});

const takeNickPlayer = (e) => {
    const nickInput = document.getElementById("input-nick").value;
    e.preventDefault(true);
    if (!nickInput == "" || !nickInput == null) {
        nickname.innerText = nickInput;
    }
};

const randomNumberGenerator = () => {
    return Math.floor(Math.random() * maxValueCards);
};

const randomColorGenerator = () => {
    return Math.ceil(Math.random() * 4 - 1);
};

const cardsCreateCall = () => {
    createCards(cardsPlayer);
    createCards(cardsBot);
    createMidCard();
    renderCardsPlayer();
    renderCardsBot();
};

const createMidCard = () => {
    let numbermid = randomNumberGenerator();
    let colormid = colors[randomColorGenerator()];
    lastColor = colormid;

    removeColors(cardMid);
    cardMid.dataset.color = colormid;
    cardMid.dataset.number = numbermid;
    cardMid.classList.add(colormid);
    cardMid.innerHTML = `<p data-number="${numbermid}" class='number'>${numbermid}</p>`;

    midContainerCard.appendChild(cardMid);
};

const updateMidCard = (color, number) => {
    backMid.dataset.color = lastColor;
    removeColors(backMid);
    backMid.classList.add(lastColor);

    midContainerCard.removeChild(cardMid);
    cardMid.dataset.color = color;
    cardMid.dataset.number = number;
    removeColors(cardMid);
    cardMid.classList.add(color);
    cardMid.innerHTML = `<p data-number="${number}" class='number'>${number}</p>`;
    midContainerCard.appendChild(cardMid);
    lastColor = color;
};

const verifyWin = (jogador) => {
    jogador = jogador.toUpperCase();
    console.log("JOGADOR +", jogador);
    if (cardsBot.length == 0 || cardsPlayer.length == 0) {
        // reloadGame();
        // turn = 1;
        document.getElementById("modal-win").classList.add("open-modal");
        document.getElementById("modal-win").classList.remove("close-modal");
        document.getElementById("win-message").innerText = `${jogador} VENCEU!`;
        playerContainerCards.innerHTML = "";
        botContainerCards.innerHTML = "";
        countBot.innerText = "0";
        countPlayer.innerText = "0";
        message.classList.remove('show-span-message')
        message.classList.add('hide-span-message')
    }

    
};

function playAgain() {
    reloadGame();
}

const removeColors = (value) => {
    for (let index = 0; index < colors.length; index++) {
        value.classList.remove(colors[index]);
    }
    value.classList.remove('gray');
};

const createCards = (cards) => {
    while (cards.length < qtde) {
        let number = randomNumberGenerator();
        let color = colors[randomColorGenerator()];
        cards.push({
            cor: `${color}`,
            numero: `${number}`,
        });
    }
};

let flag = 0
function countCards() {
    countPlayer.innerText = cardsPlayer.length;
    countBot.innerText = cardsBot.length;
    
    if(cardsPlayer.length == 1 || cardsBot.length == 1){
        message.classList.add('show-span-message')
        message.classList.remove('hide-span-message')
    }

    if(cardsPlayer.length > 1 && cardsBot.length > 1){
        message.classList.remove('show-span-message')
        message.classList.add('hide-span-message')
    }
}

const renderCardsPlayer = () => {
    let index = 0;

    while (index < qtde) {
        const card = document.createElement("li");
        const color = cardsPlayer[index].cor;
        const number = cardsPlayer[index].numero;
        card.dataset.identify = id;
        card.addEventListener(
            "click",
            (verifyPlay = () => {
                if (
                    card.dataset.color == cardMid.dataset.color ||
                    card.dataset.number == cardMid.dataset.number
                ) {
                    updateMidCard(color, number);
                    playerContainerCards.removeChild(card);
                    qtde--;
                    cardsPlayer.splice(card.dataset.identify, 1);
                    playerContainerCards.innerHTML = "";
                    turnPlayer();
                    renderCardsPlayer();
                }
            })
        );

        card.dataset.color = color;
        card.dataset.number = number;
        card.classList.add("cards", color);
        card.innerHTML = `<p data-number="${number}" class='number'>${number}</p>`;
        playerContainerCards.appendChild(card);
        id++;
        index++;
    }
    id = 0;
    verifyWin(nickname.innerText);
    countCards();
};

const renderCardsBot = (qtde = 7) => {
    let index = 0;

    while (index < qtde) {
        const card = document.createElement("li");
        card.classList.add("cards", "gray");
        card.innerHTML = `<img src="./imgs/one-card.svg" alt="card logo">`;
        botContainerCards.appendChild(card);
        index++;
    }
    verifyWin("bot");
    countCards();
};

const buyNewCard = () => {
    let number = randomNumberGenerator();
    let color = colors[randomColorGenerator()];
    playerContainerCards.innerHTML = "";
    cardsPlayer.push({
        cor: `${color}`,
        numero: `${number}`,
    });
    qtde++;
    turnPlayer();
    renderCardsPlayer();
};

const buyNewCardBot = () => {
    let number = randomNumberGenerator();
    let color = colors[randomColorGenerator()];
    botContainerCards.innerHTML = "";
    cardsBot.push({
        cor: `${color}`,
        numero: `${number}`,
    });
    renderCardsBot(cardsBot.length);
    turnPlayer();
    block.classList.remove("block");
    block.classList.add("unblock");
};

function reloadGame() {
    let index = 0;
    while (index < qtde) {
        playerContainerCards.innerHTML = "";
        botContainerCards.innerHTML = "";
        cardsPlayer.shift();
        cardsBot.shift();
        index++;
    }
    turn = 1;
    qtde = 7;
    cardsCreateCall();
}

function botPlayed() {
    let flag = 0;
    cardsBot.forEach((element, index) => {
        if (flag == 0) {
            if (
                element.cor == cardMid.dataset.color ||
                element.numero == cardMid.dataset.number
            ) {
                updateMidCard(element.cor, element.numero);
                cardsBot.splice(index, 1);
                flag++;
                turnPlayer();
                botContainerCards.innerHTML = "";
                block.classList.remove("block");
                block.classList.add("unblock");
                renderCardsBot(cardsBot.length);
            }
        }
    });

    if (flag == 0) {
        buyNewCardBot();
    }
}

const turnPlayer = () => {
    if (cardsPlayer.length != 0) {
        
        turn == 1
            ? (player.classList.toggle("player-wait"),
              bot.classList.toggle("player-wait"),
              (turn = 2),
              block.classList.remove("unblock"),
              block.classList.add("block"),
              setTimeout(botPlayed, timeBotPlay)) // 2000
            : (player.classList.toggle("player-wait"),
              bot.classList.toggle("player-wait"),
              (turn = 1));
    }

    
};
