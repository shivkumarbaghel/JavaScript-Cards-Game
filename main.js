var cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var suits = ["diamonds", "hearts", "spades", "clubs"];
var deck = new Array();
var players = [
    { name: 'A', cards: [] },
    { name: 'B', cards: [] },
    { name: 'C', cards: [] },
    { name: 'D', cards: [] }
];
var isWin;

/*
 * get deck of cards of 52
 */
function getDeck() {
    var deck = new Array();
    for (var i = 0; i < suits.length; i++) {
        for (var x = 0; x < cards.length; x++) {
            var card = { Value: cards[x], Suit: suits[i] };
            deck.push(card);
        }
    }
    return deck;
}


/*
 * shuffle deck of cards to mix
 */
function shuffle() {
    for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }

    renderDeck();
}


/*
 * render deck of cards
 */
function renderDeck() {
    document.getElementById('deck').innerHTML = '';
    for (var i = 0; i < deck.length; i++) {
        var card = document.createElement("div");
        var value = document.createElement("div");
        var suit = document.createElement("div");
        card.className = "card";
        value.className = "value";
        suit.className = "suit " + deck[i].Suit;

        value.innerHTML = deck[i].Value;
        card.appendChild(value);
        card.appendChild(suit);

        document.getElementById("deck").appendChild(card);
    }
}


/*
 * load a deck of 52 cards
 */
function loadDeck() {
    deck = getDeck();
    shuffle();
    renderDeck();
}


/*
 * assign cards to each  player
 */
function assignCardsToEach() {
    for (var i = 0; i < players.length; i++) {
        for (var k = 0; k < 3; k++) {
            var card = pullCardFromDeck();
            players[i]['cards'].push(card);
        }
    }

    renderPlayerCards();
}

/*
 * render each player's hand of cards
 */
function renderPlayerCards() {
    for (var i = 0; i < players.length; i++) {
        document.getElementById('player-' + (i + 1) + '-deck').innerHTML = '';
        var cards = players[i]['cards'];
        for (var k = 0; k < cards.length; k++) {
            var card = cards[k];
            document.getElementById('player-' + (i + 1) + '-deck').appendChild(createCardElem(card, players[i]));
        }
        isAnyWin(players[i], i + 1);
    }
}

/*
 * pull a random card from deck 
 */
function pullCardFromDeck() {
    var randomCard = deck[Math.floor(Math.random() * deck.length)];
    // remove item from deck Arr
    deck.splice(deck.indexOf(randomCard), 1);
    return randomCard;
}

/*
 * create a card DOM element
 */
function createCardElem(item, player) {
    var card = document.createElement("div");
    var value = document.createElement("div");
    var suit = document.createElement("div");
    card.className = "card";
    value.className = "value";
    suit.className = "suit " + item.Suit;

    value.innerHTML = item.Value;
    card.appendChild(value);
    card.appendChild(suit);

    if (player) {
        card.onclick = function() {
            drawCardOnTable(player, item);
        };
    }

    return card;
}

/*
 * drop card on the center table
 */
function drawCardOnTable(player, card) {
    if (!isWin) {
        //2. add card on the table
        document.getElementById('table').appendChild(createCardElem(card));

        //1. remove card from user's stack
        var indx = players.findIndex(x => x.name === player.name);
        var playerCardIndx = player['cards'].findIndex(x => x.Value === card.Value && x.Suit === card.Suit);
        players[indx]['cards'].splice(playerCardIndx, 1);

        //3. provide a new card again to the player
        var card = pullCardFromDeck();
        players[indx]['cards'].push(card);

        renderPlayerCards();
        renderDeck();

    } else {
        alert('Game finished... Please Refresh the page.')
    }
}

/*
 * check if player has winning cards
 */
function isAnyWin(player, i) {
    console.log('isAnyWin : ', player ,' - i : ', i);
    var cards = player['cards'];
    var cardVal1 = cards[0]['Value'],
        cardVal2 = cards[1]['Value'],
        cardVal3 = cards[2]['Value'];

    // - A trail (three cards of the same number) is the highest possible combination.
    if (cardVal1 === cardVal2 && cardVal1 === cardVal3 && cardVal1 !== null) {
        isWin = winner(player, i);
    }

    if ((Number.isInteger(parseInt(cardVal1)) && Number.isInteger(parseInt(cardVal2)) && Number.isInteger(parseInt(cardVal3)))) {
        var arr = [parseInt(cardVal1), parseInt(cardVal2), parseInt(cardVal3)];
        arr = arr.sort();
        [cardVal1, cardVal2, cardVal3] = arr;

        // - The next highest is a sequence (numbers in order, e.g., 4,5,6. A is considered to have a value of 1).
        if ((cardVal2 - 1) === cardVal1 && (cardVal3 - 1 === cardVal2)) {
            isWin = winner(player, i);
        }

        if (Math.abs(cardVal1 - cardVal2) === 1 && Math.abs(cardVal2 - cardVal3) === 1) {
            isWin = winner(player, i);
        }
    } else {
        // - The next highest is a pair of cards (e.g.: two Kings or two 10s).
        if (!parseInt(cardVal1) && !parseInt(cardVal2) && !parseInt(cardVal3)) {
            if (hasDuplicates([cardVal1, cardVal2, cardVal3])) {
                isWin = winner(player, i);
            }
        } else {
            if (hasDuplicates([cardVal1, cardVal2, cardVal3])) {
                if ((parseInt(cardVal1) === 10 && parseInt(cardVal2) === 10) && (parseInt(cardVal2) === 10 && parseInt(cardVal3) === 10) || (parseInt(cardVal1) === 10 && parseInt(cardVal3) === 10)) {
                    isWin = winner(player, i);
                } else {
                    if ((isLetter(cardVal1) && isLetter(cardVal2)) || (isLetter(cardVal2) && isLetter(cardVal3)) || (isLetter(cardVal1) && isLetter(cardVal3))) {
                        isWin = winner(player, i);
                    }
                }
            }
        }
    }

}

/*
 * decorate winner Player with green background
 */
function winner(player, i) {
    // alert('player Wins ' + player['name']);
    document.getElementById('player-' + i).className = 'text-light p-3 progress-bar-striped bg-success';
    var txt = document.getElementById('player-' + i).querySelector("h1").innerHTML;
    document.getElementById('player-' + i).querySelector("h1").innerHTML = '';
    document.getElementById('player-' + i).querySelector("h1").innerHTML = player.name  +' - Winner';
    return true;
}

/*
 * check for duplicate values in array
 */
function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

/*
 * check it's a character only
 */
function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
}


/*
 * start the game
 */
function start() {
    loadDeck();
    assignCardsToEach();
}

/*
 * Test the game rules
 */
function test(ruleType) {
    console.log('test', ruleType);
    var card = {} , player = 0;
    if (ruleType === '1') {
        card = { name: "A", cards: [{Value: "10", Suit: "clubs"}, {Value: "10", Suit: "diamonds"}, {Value: "10", Suit: "hearts" }] };
    } else if(ruleType === '2') {
        card = { name: "A", cards: [{Value: "4", Suit: "diamonds"}, {Value: "5", Suit: "hearts"}, {Value: "6", Suit: "hearts"}] };
    } else if(ruleType === '3') {
        card = { name: "A", cards: [{Value: "2", Suit: "spades"}, {Value: "K", Suit: "diamonds"}, {Value: "K", Suit: "hearts"}] };
    }

    players[0]['cards'] = card.cards;
    renderPlayerCards();
        // for (var k = 0; k < card.cards.length; k++) {
        //     document.getElementById('player-' + (player + 1) + '-deck').innerHTML = '';
        //     document.getElementById('player-' + (player + 1) + '-deck').appendChild(createCardElem(cards[k], player+1));
        // }
    // createCardElem(card, player);
    isAnyWin(card, player + 1);
}

/*
 * on page load load the deck of cards and assign the cards to each player
 */
window.onload = function() {
    loadDeck();
    assignCardsToEach();
};