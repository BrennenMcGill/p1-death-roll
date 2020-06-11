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
 *   1.6 endGame()
 *   1.7 resetGame() 
 * 
 * 2. Document Ready
 *   2.1 Add click listeners (add, edit, delete, reset)
 *    2.1.1 $('#start-btn').on('click', function ()
 *    2.1.2 $("#roll-dice").on("click",function)
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/
var playerStatus = {
    points: 100,
    streak: 0,
    totalWins: 0
};
var npcPoints = 100;
const slackInput = JSON.parse(localStorage.getItem("slackName")) || [];
/* ===============[ 1. Functions ]=========================*/
/**
 * 1.1 rollDice()
 */
var rollDice = function (bet) {
    // generate random number between 1 and 100 for both player and npc
    var playerValue = Math.floor(Math.random() * 100) + 1;
    var npcValue = Math.floor(Math.random() * 100) + 1;

    //create p tag to display player/npc result
    $("#player-roll").empty().append($("<p>").text(`You rolled ${playerValue}`));
    $("#npc-roll").empty().append($("<p>").text(`NPC rolled ${npcValue}`));


    // DETERMINE ROUND WINNER
    if (playerValue === npcValue) {
        rollDice();
        return;
    } else if (playerValue > npcValue) {
        $("#win-or-lose").text("").append($("<p>").text(`Congrats! You Won!`));
        npcPoints = npcPoints - bet;
        playerStatus.points = playerStatus.points + parseInt(bet);
        playerStatus.streak++;
        playerStatus.totalWins++;
        pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
    } else {
        $("#win-or-lose").text("").append($("<p>").text(`Sorry, you lost. Try again.`));
        npcPoints = npcPoints + parseInt(bet);
        playerStatus.points = playerStatus.points - bet;
        playerStatus.streak = 0;
        pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
    }

    // DETERMINE GAME WINNER
    (playerStatus.points <= 0 || npcPoints <= 0) ? ((playerStatus.points > 0) ? endGame(true) : endGame(false)) : () => {return};     
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
                const regex = /^(?:You\'re\ a)/g;

                if (message.search(regex) === -1) {
                    var gif = $("<img>").addClass("").attr("src", message);
                    $("#win-or-lose").append(gif);

                } else {
                    var messageHeader = $("<h3>").text(message);
                    $("#win-or-lose").append(messageHeader);

                }
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
var startGame = function (slack) {
    //Temporarily log slack name until start game function is done.
    console.log(slack);
}
/**
 * 1.4 pointSystem()
 */
var pointSystem = function (points, streak, wins) {
    $("#playerPoints").text(points);
    $("#npcPoints").text(npcPoints);
    console.log("streak", streak);
    console.log("wins", wins);
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

    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (gifResponse) {
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

/**
 * 1.7 resetGame()
 */
var resetGame = function () {

};

/* ===============[ 2. Document Ready ]=========================*/
$(function () {

    /**
     * 2.1 Add click listeners (add, edit, delete, reset)
     */
    /**
     * 2.1.1 $('#start-btn').on('click', function ()
     */
    // Button to Save Slack Username to Local Storage & Start Game
    $('#start-btn').on('click', function () {
        var playerName = $("#modalInputName").val().trim();
        const userArray = {
                 username: playerName
             }; 
             (playerName) ? $('#user-modal').foundation('close') && startGame(playerName) && $("#modalInputName").val("") : $("#modal-footer").empty().append($("<p>").text("Please Enter a Username!"))
    });


    /**
     * 2.1.2 $("#roll-dice").on("click",function)
     */
    $("#roll-dice").on("click", () => {
        rollDice(parseInt($("#bet-input").val()) > 0 ? $("#bet-input").val() : 0);
        $("#bet-input").val("");
    });

    /**
     * 2.1.3 Testing
     */
    $("#submit-message").on("click", function () {
        endGame(false);
    });

});