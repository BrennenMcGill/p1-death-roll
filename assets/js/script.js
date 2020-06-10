
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
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 function()
 */
var rollDice = function () {
    var playerValue = Math.floor(Math.random() * 100) + 1;
    var npcValue = Math.floor(Math.random() * 100) + 1;
    console.log("Player rolled: " + playerValue);
    console.log("NPC rolled: " + npcValue);
    if(playerValue === npcValue) {
        rollDice();
    } else if (playerValue > npcValue) {
        console.log("You win!");
    } else {
        console.log("You lose!")
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
 rollDice();