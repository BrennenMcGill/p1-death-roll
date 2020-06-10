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
 *   1.3 function()
 *   1.4 function()
 *   1.5 function()  
 * 
 * 2. Document Ready
 *   2.1 Add click listeners (add, edit, delete, reset)
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/
var playerPoints = 100;
var botPoints = 100;
var slackname = "";
var rollDiceBtnEl = document.querySelector("#roll-dice");
var playerResultEl = document.querySelector("#player-roll");
var npcResultEl = document.querySelector("#npc-roll");
var winLoseEl = document.querySelector("#win-or-lose");
var messageEL = document.getElementById("message");
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 rollDice()
 */
var rollDice = function () {
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
    playerResultEl.appendChild(displayPlayerValue);
    npcResultEl.appendChild(displayNpcValue);
    // determine winner
    if (playerValue === npcValue) {
        playerValue = "";
        npcValue = "";
        rollDice();
    } else if (playerValue > npcValue) {
        console.log("You win!");
        var displayWin = document.createElement("p");
        displayWin.innerHTML = "Congrats!  You Won!";
        winLoseEl.appendChild(displayWin);
    } else {
        console.log("You lose!");
        var displayLose = document.createElement("p");
        displayLose.innerHTML = "Sorry, you lost. Try again.";
        winLoseEl.appendChild(displayLose);
    }
};
/**
 * 1.2 slackMessenger()
 */
var slackMessenger = function (cb, cbError) {
    // curl - X POST - H 'Content-type: application/json'--data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
     if (!cbError) {
         cbError = function () {};
     }
     if (!cb) {
        cb = function (data) {
            console.log("SUCCESS ===", data);
        };
    }
        var settings = {

            url: "https://hooks.slack.com/services/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",
            type: "POST",
            dataType: "json",
            data: {
                "payload":JSON.stringify({"text":$("#message").val()})
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

        $.ajax(settings).done(function(response){
            console.log("response ============", response);
        });

};

/**
 * 1.3 function()
 */


/**
 * 1.4 function()
 */

/* ===============[ 2. Document Ready ]=========================*/


/**
 * 2.1 Add click listeners (add, edit, delete, reset)
 */
rollDiceBtnEl.addEventListener("click", rollDice);
$("#submit-message").on("click", slackMessenger)