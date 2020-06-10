
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
var playerPoints = 100;
var botPoints = 100;
var slackname = "";
var rollDiceBtnEl = document.querySelector("#roll-dice");
var playerResultEl = document.querySelector("#player-roll");
var npcResultEl = document.querySelector("#npc-roll");
var winLoseEl = document.querySelector("#win-or-lose");
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 function()
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
rollDiceBtnEl.addEventListener("click", rollDice);