/*

Final Project
Download the Final Project Zip file below.

The starter project has some HTML and CSS styling to display a static version of the Memory Game project. You'll need to convert this project from a static project to an interactive one. This will require some very light modifications of the HTML and CSS files, but primarily the JavaScript file.



Project Requirements:

- The game randomly shuffles the cards.

- A user wins once all cards have successfully been matched.

- Users should not be able to open more than 2 cards can be open at one time.

- Users should not be able to open a card that is already open or matched.

- A user wins once all cards have successfully been matched.

- Upon winning the game, the user should be presented with a SweetAlert alert, indicating that they have won the game.

- A user can restart the game at any time by pressing the restart button. This will cause all the cards to be hidden again.

- The game should display the current number of moves a user has made. A move is considered to have occured when 2 cards have been shown to the user, and either determined to be a match or a non-match.

- Comments should be present in the code and effectively explain a longer code procedure when necessary.

- Code is formatted with consistent, logical, and easy-to-read formatting including proper indentation, thoughtful 
variable names.

- The game displays a star rating (from 1 to at least 3) that reflects the player's performance. At the beginning of a game, it should display at least 3 stars. After some number of moves, it should change to a lower star rating. After a few more moves, it should change to a even lower star rating (down to 1). The number of moves needed to change the rating is up to you, but it should happen at some point. (A star should be removed every 15 moves)


Submission:

The solution should be submitted as .zip file that includes the HTML, JS and CSS files.
The .zip file should contain your first and last name.
Your .zip file should be uploaded to the course portal, no later than 3:15 PM, Tuesday, October 30th, 2018
Late assignments will be penalized by 10% per 24-hours late.


TIPS:

Adding the .show and .open class will flip a card over and display it's icon.
Adding a .match class to a card and removing the .show and .open classes will cause the card to turn into a match


TO-DO's:

*/

const cardDeckElement = document.querySelector('ul.deck');
const cardDeckNodeList = document.querySelectorAll('ul.deck li');
const moveCounterElement = document.querySelector('span.moves');
const starElement = document.querySelector('section.score-panel ul.stars');
const resetGameElement = document.querySelector('div.restart i.fa-repeat');
const matchingCardsLive = document.getElementsByClassName('match');

const maxCardOpen = 2;
let cardClickUpToTwo = 0;

let totalStarCounter = 3;
let starRemove = 15; 
let moveCounter = 0;

/*
 * Create a list that holds all of your cards
 */
let wholeDeck = Array.from(cardDeckNodeList);
let cardHolder = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

// Game Rules
const gameRules = () => {
    swal({
        title: (`<h3 style="margin: unset;">Match Cards</h3>`),
        html: (`
        <h4 style="text-align: left;">Rules:</h4>
        <ul>
            <li style="text-align: left;">Click on a card to reveal it's icon</li>
            <li style="text-align: left;">You can only have 2 cards open at once</li>
            <li style="text-align: left;">The game is ends when you match all cards on the board</li>
            <li style="text-align: left;">Your score will be rated via stars</li>
            <li style="text-align: left;">3 stars being the best and 0 stars being the worst</li>
        </ul>
        
        <h5 style="margin-top: 2.5px; margin-bottom: 2.5px;">Good Luck!</h5>
        `),
        footer: (`
        <div>
            <p>You can access this pop-up again by pressing the <strong>"Home"</strong> key on you keyboard.</p>
            <p>You can reset the game by pressing the <strong>"Shift"</strong> key on you keyboard.</p>
        </div>
        `),
        width: 600,
    }); 
}
gameRules();

// Asks user if he/she resets the game through swal confirm/cancel button and result is true if confirm is clicked
// .then will activate the following code after the first swal window closes (if user clicks press the background, the result will be false)
const swalResetConfirm = () => {
    swal({
        type: (`warning`),
        title: (`Do you want to reset the game?`),
        html: (`You will lose your progress!`),
        showCancelButton: true,
        confirmButtonText: (`Yes, reset it!`),
        confirmButtonColor: (`red`),
        cancelButtonColor: (`blue`),
    }).then ((result) => {
        if (result.value) {
            swal({
                type: (`success`),
                title: (`Game Reset!`),
                html: (`The game got reset.`),
            });
            // If user clicks through the swal windows to fast then this error appears "Cannot read property 'classList' of undefined".
            // Resets the game before fully going through the animations therefore, the end-ani class gets interrupted via the reset (the deck getting all classes removed except the card class)
            resetGame();
        } else if (!result.value) {
            swal({
                type: (`info`),
                title: (`Game Reset Canceled!`),
                html: (`The game did not reset.`),
            });
        }
    });
}

// Checks the two cards that user selected compares the two via their "i" classes
const doCardsMatch = (twoCards) => {
    const card1Classes = twoCards[0].firstElementChild.classList;
    const card2Classes = twoCards[1].firstElementChild.classList;

    // Removes the "fa fa-" so the output matches the Symbol Name of the matched cards
    let cardSymbolName = card2Classes.toString();
    cardSymbolName = cardSymbolName.slice(6);

    // Gets rid of the "-o" on the end of "paper-plane-o" to get "paper-plane"
    if (cardSymbolName === "paper-plane-o") {
        cardSymbolName = cardSymbolName.slice(0,11);
    }

    // Checks both cards (compares two "i" element's classes) returns true or false according to if a match is found.
    // Only Alerts player if a match was found.
    if (card1Classes.value === card2Classes.value) {
        setTimeout(() => {
            swal({
                position: (`top-end`),
                type: (`success`),
                title: (`MATCH!`),
                html: (`<p id="card2SymbolNameElement">${cardSymbolName}</p>`),
                showConfirmButton: false,
                width: 250,
                timer: 1000,
            });
        }, 1000);
        return true;
    } else {
        return false;
    }
}

// Prevents three cards from showing by removing listener then re-adding it after the delay
// Checks for if all cards have match(if true then the player won) by comparing the length of the deck to the length of the live matching cards.
const clickedCard = (e) => {

    // (Only when a closed card is clicked) The clicked card will flip to open/show, "pushed" on to the card holder Array and every 15 moves one star will get removed
    if (e.target.classList.contains('card') && !e.target.classList.contains('match') && !e.target.classList.contains('open')) {

        e.target.classList.add('open', 'show');
        cardHolder.push(e.target);
        cardClickUpToTwo++;

        // This "if" will prevent 3 cards from showing via removal of the listener and this will add to the move counter (because a move doesn't add after each click. It adds after the user clicks two cards)
        if (cardHolder.length === maxCardOpen) {
            moveCounter++;
            moveCounterElement.innerHTML = moveCounter;
            isCardsMatching = doCardsMatch(cardHolder);
            cardDeckElement.removeEventListener('click', clickedCard);
            setTimeout(() => {
                // If the cards match, the class "match" gets added and the cardClickUpToTwo gets reset and the cardHolder Array gets reset
                if (isCardsMatching) {
                    cardHolder.forEach((card) => {
                        card.classList.add('match');
                    });
                    setTimeout(() => {
                        cardHolder = [];
                        cardClickUpToTwo = 0;
                        cardDeckElement.addEventListener('click', clickedCard);
                    }, 850);

                    // Alerts player if he/she won the game via deck length to card matches length
                    // Also displays players rating
                    if (cardDeckNodeList.length === matchingCardsLive.length) {
                        setTimeout(() => {
                            let starAlert = (``);
                            for (let i = 1; i <= totalStarCounter; i++) {
                                starAlert += (`<i class="fa fa-star"></i>`);
                            }
                            swal({
                                type: (`success`),
                                title: (`You Won!!!`),
                                html: (`
                                <p>Your Match Rating is ${starAlert}.</p>
                                <p>Your Total Moves = ${moveCounter}</p>
                                `),
                            });
                        }, 850);
                    }

                // If the cards don't match, the cards will flip closed and the array will be reset
                // Adds the end-ani class for the open to closed animation
                } else if (!isCardsMatching) {
                    cardHolder[0].classList.add('end-ani');
                    cardHolder[1].classList.add('end-ani');
                    setTimeout(() => {
                        cardHolder[0].classList.remove('end-ani');
                        cardHolder[1].classList.remove('end-ani');
                        cardHolder[0].classList.remove('open', 'show');
                        cardHolder[1].classList.remove('open', 'show');
                        cardHolder = [];
                        cardClickUpToTwo = 0;
                        cardDeckElement.addEventListener('click', clickedCard);
                    }, 850);
                }
            }, 850);

            // Removes a star every 15 moves the user makes
            if (moveCounter === starRemove) {
                totalStarCounter--;
                starRemove += 15;
                starElement.lastElementChild.remove();
            }
        }
    }
}
cardDeckElement.addEventListener('click', clickedCard);

// Shuffles all cards, resets counters (including the html span), and resets the stars back to three
const resetGame = () => {
    cardHolder = [];
    cardClickUpToTwo = 0;
    moveCounter = 0;
    moveCounterElement.innerHTML = (`0`);
    totalStarCounter = 3;
    starRemove = 15;
    starElement.innerHTML = (`
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    `);
    createShuffledDeck();
    cardDeckElement.addEventListener('click', clickedCard);
}
resetGameElement.addEventListener('click', swalResetConfirm);

// Shuffles then builds deck of cards (all card's classes are reset to only contain card)
const createShuffledDeck = () => {
    shuffle(wholeDeck);
    cardDeckElement.innerHTML = (``);
    for (const card of wholeDeck) {
        card.className = "card";// .className to only have one given class
        cardDeckElement.appendChild(card);
    }
}

resetGame();// This Shuffles the game at the start

// Keyboard Shortcuts for gameRules and Resetting the Game
document.body.addEventListener('keydown', (e) => {
    if (e.key === "Home") {
        gameRules();
    } else if (e.key === "Shift") {
        swalResetConfirm();

    // For Testing the game (Reveals all card icons. Even when not opened. You have to refresh page to revert to hidden icons)
    } else if (e.key === "F2") {
        cardDeckNodeList.forEach((card) => {
            card.style.fontSize = "35px";
        });
    }
});