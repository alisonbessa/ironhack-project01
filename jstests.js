//Food update
function foodUpdate(){
    food.newPos();
    food.update();
    checkGotFood();
}
// // Check if the player touched the food
function checkGotFood() {
    if(player.crashWith(food)){
        score += 1;
        food = new Component(10, 15, "blue", Math.random()*400, Math.random()*700);
        console.log(score);
    }
}

    //     });
    
//     if (gotFood) {
//         myGameArea.stop();
//         alert("You have killed a space puppy!");
//     }
//     console.log("food" + player.crashWith(food));
// }








// THINGS TO DO:
// print score
// print timeleft
// get some skins
// sound
// add time bonus
// add a super power
