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
    // remove winner and loser classes, if any
    if ($("#player-box").hasClass("box-winner")) {
        $("#player-box").removeClass("box-winner");
        $("#player-result").removeClass("result-winner");
        $("#npc-box").removeClass("box-loser");
        $("#npc-result").removeClass("result-loser");
    }
    if ($("#player-box").hasClass("box-loser")) {
        $("#player-box").removeClass("box-loser");
        $("#player-result").removeClass("result-loser");
        $("#npc-box").removeClass("box-winner");
        $("#npc-result").removeClass("result-winner");
    }
    // generate random number between 1 and 100 for both player and npc
    var playerValue = Math.floor(Math.random() * 100) + 1;
    var npcValue = Math.floor(Math.random() * 100) + 1;

    // create p tag to display player/npc result
    $("#player-rolled").empty().append($("<h4>").text(`Rolled`));
    $("#player-roll-result").empty().append($("<span>").text(`${playerValue}`));
    $("#npc-rolled").empty().append($("<h4>").text(`Rolled`));
    $("#npc-roll-result").empty().append($("<span>").text(`${npcValue}`));


    // DETERMINE ROUND WINNER
    if (playerValue === npcValue) {
        rollDice();
        return;
    } else if (playerValue > npcValue) {
        $("#player-box").addClass("box-winner");
        $("#player-result").empty().addClass("result-winner").append($("<h3>").text(`Winner!!!`));
        $("#npc-box").addClass("box-loser");
        $("#npc-result").empty().addClass("result-loser").append($("<h3>").text(`Loser!!!`));
        npcPoints = npcPoints - parseInt(bet);
        playerStatus.points = playerStatus.points + parseInt(bet);
        playerStatus.streak++;
        playerStatus.totalWins++;
        pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
    } else {
        $("#player-box").addClass("box-loser");
        $("#player-result").empty().addClass("result-loser").append($("<h3>").text(`Loser!!!`));
        $("#npc-box").addClass("box-winner");
        $("#npc-result").empty().addClass("result-winner").append($("<h3>").text(`Winner!!!`));
        npcPoints = npcPoints + parseInt(bet);
        playerStatus.points = playerStatus.points - parseInt(bet);
        playerStatus.streak = 0;
        pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
    }

    // DETERMINE GAME WINNER
    (playerStatus.points <= 0 || npcPoints <= 0) ? ((playerStatus.points > 0) ? endGame(true, playerStatus.points, playerStatus.totalWins, playerStatus.streak) : endGame(false, playerStatus.points, playerStatus.totalWins, playerStatus.streak)) : () => {return};     
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
var startGame = function (playerName) {
    $("#user-name").empty().append($("<h3>").text(playerName));
    $("#playerPoints").empty().append($("<span>").text(playerStatus.points));
    $("#npcPoints").empty().append($("<span>").text(npcPoints));
    
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
var endGame = function (win_lose, points, wins, streak) {
    if (win_lose) {
        result = "winner";
        $('#final-score').removeClass().text(points).addClass('result-winner');
    } else {
        result = "loser";
        $('#final-score').removeClass().text(points).addClass('result-loser');
    }

    let message = `You're a ${result}!!!`;

    slackMessenger(message);
    giphyAPI(result, slackMessenger, function () {
        console.log("Error!");
    });


    var popup = new Foundation.Reveal($('#end-game-modal'));
    popup.open();
    $('#end-game-modal').removeClass('invisible')
    $('#final-wins').text(wins);
    $('#final-streak').text(streak);
    // SAVE DATA TO LOCAL STORAGE

    $('#reset-btn').on('click', resetGame);

};

/**
 * 1.7 resetGame()
 */
var resetGame = function () {
    $('#win-or-lose').empty();
    $('#end-game-modal').addClass('invisible')
    $("#npc-box").removeClass();
    $("#npc-box").addClass('cell auto box');
    $('#npc-result').remove();
    $('#npc-roll').remove();
    $("#player-box").removeClass();
    $("#player-box").addClass('cell auto box');
    $('#player-result').remove();
    $('#player-roll').remove();
    playerStatus.points = 100;
    playerStatus.streak = 0;
    playerStatus.totalWins = 0;
    npcPoints = 100;
    $("#playerPoints").empty().append($("<h5>").text(playerStatus.points));
    $("#npcPoints").empty().append($("<h5>").text(npcPoints));
    console.log(playerStatus.points, playerStatus.streak, playerStatus.totalWins, npcPoints);
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

             if (playerName) {
                $('#user-modal').foundation('close')
                $("#modalInputName").val("")
                $("#main-container").removeClass("invisible")
                $("#modal-btn").addClass("invisible")
                startGame(playerName)
             } else {
                $("#modal-footer").empty().append($("<p>").text("Please Enter a Username!"))
             }
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