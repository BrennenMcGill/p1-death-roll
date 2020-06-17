/*********************************************************
 * Death Roll
 * @package p1-death-roll
 * @author Jeremy C Collins, Morgan Hansen, Brennen Mcgill, Brandon Jackson
 * @version development
 * @license none (public domain)
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
 *   1.8 saveHighScores()
 *   1.9 leaderBoard()
 * 2. Document Ready
 *   2.1 Add click listeners (add, edit, delete, reset)
 *    2.1.1 $('#start-btn').on('click', function ()
 *    2.1.2 $("#roll-dice").on("click",function)
 *    2.1.3 Testing
 *    2.1.4 $("#start-btn").prop('disabled', false)
 *    2.1.5 $("#roll-dice").prop('disabled', false)
 *********************************************************/
/* ===============[ 0. GLOBALS ]=========================*/
var playerStatus = {
    username: "",
    points: 100,
    streak: 0,
    totalWins: 0,
    totalRolls: 0,
    winRatio: 0,
    finalScore: 0
};
var npcPoints = 100;
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
    // restrict user from entering a bet higher than their current gold amount
    if (bet > playerStatus.points) {
        var exceededPlayerPoints = "You can't place a bet higher than your current gold amount"
        $("#bet-input").empty();
        $("#win-or-lose").addClass("bet-error").append(exceededPlayerPoints);
        $('html, body').animate({
            scrollTop: ($('#win-or-lose').offset().top)
        },500);
    } else if (bet > npcPoints) {
        var exceededNpcPoints = "You can't place a bet higher than your opponent's gold amount"
        $("#bet-input").empty();
        $("#win-or-lose").addClass("bet-error").append(exceededNpcPoints);
        $('html, body').animate({
            scrollTop: ($('#win-or-lose').offset().top)
        },500);
    } else {
        // remove error message, if any
        $("#win-or-lose").empty();
        // generate random number between 1 and 100 for both player and npc
        $("#player-rolled").empty().append($("<h4>").text(`Rolled`));
        var playerValue = Math.floor(Math.random() * 100) + 1;
        $("#npc-rolled").empty().append($("<h4>").text(`Rolled`));
        var npcValue = Math.floor(Math.random() * 100) + 1;
        shuffleNums(15, playerValue, $("#player-roll-result"));
        shuffleNums(15, npcValue, $("#npc-roll-result"));
        function shuffleNums(times, final, element) {
            if (times > 1) {
                element.empty().append($("<span>").text(Math.floor(Math.random() * 100) + 1));
                setTimeout(function(){shuffleNums(times-1, final, element);},50);
            } else {
                element.empty().append($("<span>").text(final));
                winner(playerValue, npcValue);
            }
        };
        // DETERMINE ROUND WINNER
        function winner(playerValue, npcValue) {
            if (playerValue === npcValue) {
                rollDice();
                return;
            } else if (playerValue > npcValue) {
                $("#player-box").addClass("box-winner");
                $("#player-result").empty().addClass("result-winner").append($("<h3>").text(`Winner!!!`));
                $("#npc-box").addClass("box-loser");
                $("#npc-result").empty().addClass("result-loser").append($("<h3>").text(`Loser!!!`));
                npcPoints = npcPoints - (parseInt(bet)/2);
                playerStatus.points = playerStatus.points + (parseInt(bet)/2);
                playerStatus.streak++;
                playerStatus.totalWins++;
                pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
                $('#roll-dice').prop('disabled', true);
                playerStatus.winRatio = (playerStatus.totalWins/playerStatus.totalRolls).toFixed(2);
                playerStatus.finalScore = ((playerStatus.winRatio*playerStatus.streak)*100).toFixed(2);
            } else {
                $("#player-box").addClass("box-loser");
                $("#player-result").empty().addClass("result-loser").append($("<h3>").text(`Loser!!!`));
                $("#npc-box").addClass("box-winner");
                $("#npc-result").empty().addClass("result-winner").append($("<h3>").text(`Winner!!!`));
                npcPoints = npcPoints + (parseInt(bet)/2);
                playerStatus.points = playerStatus.points - (parseInt(bet)/2);
                playerStatus.streak = 0;
                pointSystem(playerStatus.points, playerStatus.streak, playerStatus.totalWins);
                $('#roll-dice').prop('disabled', true);
                playerStatus.winRatio = (playerStatus.totalWins/playerStatus.totalRolls).toFixed(2);
                playerStatus.finalScore = ((playerStatus.winRatio*playerStatus.streak)*100).toFixed(2);
            }
            // PUSH ROLL TO LOCAL STORAGE ARRAY
            playerStatus.totalRolls++;
            // DETERMINE GAME WINNER
            (playerStatus.points <= 0 || npcPoints <= 0) ? ((playerStatus.points > 0) ? endGame(true, playerStatus.points, playerStatus.totalWins, playerStatus.streak) : endGame(false, playerStatus.points, playerStatus.totalWins, playerStatus.streak)) : () => {return};
        };
    }
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
 * 1.3 startGame()
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
        $('#final-score').addClass("h4").text(points);
    } else {
        result = "loser";
        $('#final-score').addClass("h4").text(points);
    }
    let message = `You're a ${result}!!!`;
    slackMessenger(message);
    giphyAPI(result, slackMessenger, function () {
        console.log("Error!");
    });
    var popup = new Foundation.Reveal($('#end-game-modal'));
    popup.open();
    $('#end-game-modal').removeClass('invisible')
    $('#final-wins').addClass("h4").text(wins);
    $('#final-streak').addClass("h4").text(streak);
    $('#reset-btn').on('click', function(){
        saveHighScores();
        resetGame();
    });  
    $('#quit-btn').on('click', function() {
        saveHighScores();
        location.reload();
    });
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
    $('#npc-rolled').remove();
    $("#player-box").removeClass();
    $("#player-box").addClass('cell auto box');
    $('#player-result').remove();
    $('#player-rolled').remove();
    $("#player-roll-result").remove();
    $("#npc-roll-result").remove();
    playerStatus.username = "";
    playerStatus.points = 100;
    playerStatus.streak = 0;
    playerStatus.totalWins = 0;
    playerStatus.winRatio = 0;
    playerStatus.finalScore = 0;
    npcPoints = 100;
    $("#playerPoints").empty().append($("<span>").text(playerStatus.points));
    $("#npcPoints").empty().append($("<span>").text(npcPoints));
};
/**
 * 1.8 saveHighScores();
 */
 // function to save top five highest scores to the localStorage
var saveHighScores = function() {
    const playerArray = playerStatus;
    const playerHistory = JSON.parse(localStorage.getItem("storedScores")) || [];
    playerHistory.push(playerArray);
    playerHistory.sort((a, b)=> b.finalScore - a.finalScore);
    playerHistory.splice(5);
    localStorage.setItem("storedScores", JSON.stringify(playerHistory));
}
/**
 * 1.9 leaderBoard()
 */
var leaderBoard = function() {
    const playerHistory = JSON.parse(localStorage.getItem("storedScores")) || [];
    topFiveScores.innerHTML = playerHistory
        .map(playerArray => {
            return `<li id = "topFiveScores"><b>Username:</b> ${playerArray.username}</li> 
                        <ul> <li> <b>Winning Ratio:</b> ${playerArray.winRatio}</li>
                             <li> <b>Streak:</b> ${playerArray.streak}</li>
                             <li> <b>Final Score:</b> ${playerArray.finalScore}</li>
                                            </ul>`;
        })
        .join("");
}
/* ===============[ 2. Document Ready ]=========================*/
$(function () {

    /**
     * 2.1 Add click listeners (add, edit, delete, reset)
     */
    /**
     * 2.1.1 $('#start-btn').on('click', function ()
     */
    $('#start-btn').on('click', function () {
        playerStatus.username = $("#modalInputName").val().trim();
             if (playerStatus.username) {
                $('#user-modal').foundation('close')
                $("#modalInputName").val("")
                $("#main-container").removeClass("invisible")
                $("#modal-btn").addClass("invisible")
                $("#leader-btn").addClass("invisible")
                startGame(playerStatus.username)
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
    /**
     * 2.1.4 $("#start-btn").prop('disabled', false)
     */
    // disable the Begin Game btn until the user enters a username
    $('#start-btn').prop('disabled', true);
    $('#modalInputName').keyup(function() {
        if ($(this).val() !='') {
            $('#start-btn').prop('disabled', false);
        }
    });
    /**
     * 2.1.5 $("#roll-dice").prop('disabled', false)
     */
    // disable the Roll btn until the user enters a bet > 0
    $('#roll-dice').prop('disabled', true);
    $('#bet-input').keyup(function() {
        if ($(this).val() != '' && $(this).val() > 0) {
            $('#roll-dice').prop('disabled', false);
        }
    });
    /**
     * 2.1.6 $("#leader-btn").on("click",function)
     */
    $('#leader-btn').on('click', function(){
        leaderBoard();
    });  
});
