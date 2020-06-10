
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
 *   1.2 function()
 *    
 * 
 * 2. Document Ready
 *   2.1 Add click listeners (add, edit, delete, reset)
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/
var slackNameEl = document.querySelector("#modalSlackName");
var playerPoints = 100;
var botPoints = 100;
var rollDiceBtnEl = document.querySelector("#roll-dice");
var playerResultEl = document.querySelector("#player-roll");
var npcResultEl = document.querySelector("#npc-roll");
var winLoseEl = document.querySelector("#win-or-lose");
const slackInput = JSON.parse(localStorage.getItem("slackName")) || [];
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 rollDice()
 */
var srtGame = function(slack){
    //Temporarily log slack name until start game function is done.
    console.log(slack);
}

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
    if(playerValue === npcValue) {
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
 * 1.2 function()
 */

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

// Button to Save Slack Username to Local Storage & Start Game
$('#start-btn').on('click', function(){  
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
rollDiceBtnEl.addEventListener("click", rollDice);


