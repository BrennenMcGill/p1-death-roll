/*********************************************************
 * Death Roll
 * @package p1-death-roll
 * @author Jeremy C Collins, Morgan Hansen, Brennen Mcgill, Brandon Jackson
 * @version development
 * @license none (public domain)
 * 
 * ===============[ TABLE OF CONTENTS ]===================
 * 0. Globals
 * 1. Functions
 *   1.1 rollDice()
 *   1.2 slackMessenger()
 *   1.3 srtGame()
 *   1.4 pointSystem()
 *   1.5 giphyAPI()  
 * 
 * 2. Document Ready
 *   2.1 Add click listeners (add, edit, delete, reset)
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/
var slackNameEl = document.querySelector("#modalSlackName");
var playerStatus = {
    points: 100,
    streak: 0,
    totalWins: 0
};
var npcPoints = 100;
var betInputEl = document.querySelector("#bet-input");
var playerPointsEl = document.querySelector("#playerPoints");
var npcPointsEl = document.querySelector("#npcPoints");
var rollDiceBtnEl = document.querySelector("#roll-dice");
var playerResultEl = document.querySelector("#player-roll");
var npcResultEl = document.querySelector("#npc-roll");
var winLoseEl = document.querySelector("#win-or-lose");
var messageEL = document.getElementById("message");
const slackInput = JSON.parse(localStorage.getItem("slackName")) || [];
/* ===============[ 1. Functions ]=========================*/
/**
 * 1.1 rollDice()
 */
var rollDice = function (bet) {

    // generate random number between 1 and 100 for both player and npc
    var playerValue = Math.floor(Math.random() * 100) + 1;
    var npcValue = Math.floor(Math.random() * 100) + 1;

    //create p tag to display player's result
    var displayPlayerValue = document.createElement("p");
    displayPlayerValue.innerHTML = "You rolled " + playerValue;

    //create p tag to display npc's result
    var displayNpcValue = document.createElement("p");
    displayNpcValue.innerHTML = "NPC rolled " + npcValue;

    // append player's and npc's results
    playerResultEl.innerHTML = "";
    playerResultEl.appendChild(displayPlayerValue);
    npcResultEl.innerHTML = "";
    npcResultEl.appendChild(displayNpcValue);

    // DETERMINE ROUND WINNER
    if (playerValue === npcValue) {
        playerValue = "";
        npcValue = "";
        rollDice();
    } else if (playerValue > npcValue) {
        console.log("You win!");
        var displayWin = document.createElement("p");
        displayWin.innerHTML = "Congrats!  You Won!";
        winLoseEl.innerHTML = "";
        winLoseEl.appendChild(displayWin);
        npcPoints = npcPoints - parseInt(bet);
        playerStatus.points = playerStatus.points + parseInt(bet);
        playerStatus.streak = playerStatus.streak + 1;
        playerStatus.totalWins = playerStatus.totalWins + 1;
        pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
    } else {
        console.log("You lose!");
        var displayLose = document.createElement("p");
        displayLose.innerHTML = "Sorry, you lost. Try again.";
        winLoseEl.innerHTML = "";
        winLoseEl.appendChild(displayLose);
        npcPoints = npcPoints + parseInt(bet);
        playerStatus.points = playerStatus.points - bet;
        playerStatus.streak = 0;
        playerStatus.totalWins = playerStatus.totalWins;
        pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
    }

    // DETERMINE GAME WINNER
    (playerStatus.points <= 0 || npcPoints <= 0) ? ((playerStatus.points > 0) ? endGame(true) : endGame(false)) : () => {
        return
    };
};
/**
 * 1.2 slackMessenger()
 */
var slackMessenger = function (message, WebHook, cb, cbError) {
    if (!cbError) {
        cbError = function () {};
    }
    if (!cb) {
        cb = function (data) {
            console.log("SUCCESS ===", data);
        };
    }

    if (!WebHook) {
        $.getJSON("../../keys.json", function (responseData) {
                return slackMessenger(message, responseData.SLACK_WEB_HOOK);
            })
            .done(function () {
                console.log("WEB HOOK FOUND!");
                return;
            })
            .fail(function () {
                $("<img>", {
                    src: message,
                    error: function () {
                        var messageHeader = $("<h3>").text(message);
                        $("#win-or-lose").append(messageHeader);
                    },
                    load: function () {
                        var gif = $("<img>").addClass("").attr("src", message);
                        $("#win-or-lose").append(gif);
                    }
                });
                console.log("WEB HOOK NOT FOUND!");
                return;
            })
    }
    var settings = {

        url: WebHook,
        type: "POST",
        dataType: "application/json",
        data: {
            "payload": JSON.stringify({
                "text": message
            })
        },
        success: function (data) {
            cb(data);
        },
        error: function (xhr, status, error) {
            console.log("Response ======", xhr)
            console.log("TextStatus ======", status)
            console.log("ErrorThough ======", error)
            cbError();
        }
    }
    console.log("settings ======", settings);

    $.ajax(settings).done(function (response) {
        console.log("response ============", response);
    });

};


/**
 * 1.3 srtGame()
 */
var srtGame = function (slack) {
    //Temporarily log slack name until start game function is done.
    console.log(slack);
}
/**
 * 1.4 pointSystem()
 */
var pointSystem = function (points, streak, wins) {
    playerPointsEl.textContent = points;
    npcPointsEl.textContent = npcPoints;
    console.log(streak);
    console.log(wins);
}

/**
 * 1.5 giphyAPI()
 */
var giphyAPI = function (result, cb, cbError) {
    if (!cbError) {
        cbError = function () {};
    }
    if (!cb) {
        cb = function (data) {
            console.log("SUCCESS ===", data);
        };
    }
    var api_key = "sFsVukTCR6VSVrbN8OzUnJuANd3yiBET";

    var apiURL = `https://api.giphy.com/v1/gifs/search?q=${result}&api_key=${api_key}`;
    var randomIndex = Math.floor(Math.random() * Math.floor(24));
    console.log("APIURL========", apiURL);

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (gifResponse) {
                        console.log("giphy===", gifResponse)
                        return cb(gifResponse.data[randomIndex].images.fixed_height_downsampled.url);
                    })
            } else {
                cbError();
            }
        })
};

/**
 * 1.6 endGame()
 */
var endGame = function (win_lose) {
    if (win_lose) {
        result = "winner";
    } else {
        result = "loser";
    }

    let message = `You're a ${result}!!!`;


    slackMessenger(message);
    giphyAPI(result, slackMessenger, function () {
        console.log("Error!");
    });


    // SAVE DATA TO LOCAL STORAGE

    // CALL RESET FUNCTION 


};

/* ===============[ 2. Document Ready ]=========================*/
$(function () {






    /**
     * 2.1 Add click listeners (add, edit, delete, reset)
     */
    //rollDiceBtnEl.addEventListener("click", rollDice);
    $("#submit-message").on("click", function () {
        endGame(false);
    })

    // Button to Save Slack Username to Local Storage & Start Game
    $('#start-btn').on('click', function () {
        // Get User Input for Slack Username
        slackName = document.querySelector("#modalSlackName").value.trim();
        // Push Username to Array (Array gives option of pushing other things)
        const userArray = {
            username: slackName
        };
        slackInput.push(userArray);
        // Save User Input to Local Storage
        localStorage.setItem("slackName", JSON.stringify(slackInput));
        // Pass Slack Username to Start Game Function, or return error.
        var slack = slackNameEl.value.trim();
        if (slack) {
            $('#user-modal').foundation('close');
            srtGame(slack);
            slackNameEl.value = "";
        } else {
            alert("Please enter a valid username.");
        }
    });


    // Button to Roll Dice
    rollDiceBtnEl.addEventListener("click", function () {
        event.preventDefault();
        rollDice(betInputEl.value);
        betInputEl.value = "";
    });


})