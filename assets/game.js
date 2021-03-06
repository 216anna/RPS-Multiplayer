// Initialize Firebase
var playerName;
var wins;
var losses;
var choice;
var config = {
    apiKey: "AIzaSyA8VUWEEWCN-Vr91r3hRjxLPHQT3whsjtA",
    authDomain: "rps-multiplayer-93292.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-93292.firebaseio.com",
    projectId: "rps-multiplayer-93292",
    storageBucket: "rps-multiplayer-93292.appspot.com",
    messagingSenderId: "547764691876"
};
firebase.initializeApp(config);
var database = firebase.database();
var players = database.ref('players');
var player1 = database.ref('players/1');
player1.on("value", updatePlayer1);

var player2 = database.ref('players/2');
player2.on("value", updatePlayer2);

var thisPlayer = 0;
var player1choice = "";
var player2choice = "";

function init() {
    players.once('value')
        .then(function (snapshot) {
            if (snapshot.val() !== null && snapshot.numChildren() > 1) {
                $("#messageTitle").text("There are already two players for this game. Try again later.");
                $("#choiceOptions1").hide();
                $("#choiceOptions2").hide();
            }
        }
        );
    //get reference to database
    //determine how many players there are
    //if already two players display a message and disable page

}
function addWin(player) {
    if (thisPlayer === 1) {
        var p1 = database.ref('players/1').once('value').then(function (snapshot) {
            if (player === 1) {
                var wins = snapshot.child('wins').val();
                players.child(1).child('wins').set(wins + 1);
            }
            else {
                var losses = snapshot.child('losses').val();
                players.child(1).child('losses').set(losses + 1);
            }

        })
        var p2 = database.ref('players/2').once('value').then(function (snapshot) {
            if (player === 2) {
                var wins = snapshot.child('wins').val();
                players.child(2).child('wins').set(wins + 1);
            }
            else {
                var losses = snapshot.child('losses').val();
                players.child(2).child('losses').set(losses + 1);
            }

        })
    }
    //if player = this player

    //increment this player wins
}

function checkForWinner() {

    if (player1choice !== null && player1choice !== ""
        && player2choice !== null && player2choice !== "") {
        var winner = 0;
        var msg = "";
        player1choice = player1choice === null ? "" : player1choice.toLowerCase();
        player2choice = player2choice === null ? "" : player2choice.toLowerCase();
        if ((player1choice === "rock") && (player2choice === "scissors")) {
            winner = 1;
            msg = "Rock breaks scissors."
        } else if ((player1choice === "rock") && (player2choice === "paper")) {
            winner = 2;
            msg = "Paper covers rock."
        } else if ((player1choice === "scissors") && (player2choice === "rock")) {
            winner = 2;
            msg = "Rock breaks scissors."
        } else if ((player1choice === "scissors") && (player2choice === "paper")) {
            winner = 1;
            msg = "Scissors cuts paper."
        } else if ((player1choice === "paper") && (player2choice === "rock")) {
            winner = 1;
            msg = "Paper covers rock."
        } else if ((player1choice === "paper") && (player2choice === "scissors")) {
            winner = 2;
            msg = "Scissors cuts paper."
        } else if (player1choice === player2choice) {
            $("#messageTitle").text("It's a tie!");
        }
        if (winner === 1) {
            addWin(1);
            $("#messageTitle").text(msg + " " + $("#player1").text() + " wins");
        }
        else if (winner === 2) {
            addWin(2);
            $("#messageTitle").text(msg + " " + $("#player2").text() + " wins");
        }
        setTimeout(function () {
            $("#messageTitle").text("");
        }, 5000);
        players.child(1).child('choice').set("");
        players.child(2).child('choice').set("");
    }
}


$("#start").on("click", function () {
    // Don't refresh the page!
    event.preventDefault();
    var name = $("#addUser").val();
    var choice = "";
    var wins = 0;
    var losses = 0;
    players.once('value')
        .then(function (snapshot) {
            console.log(snapshot.val());

            if (snapshot.numChildren() === 0) {
                thisPlayer = 1;
                $("#choiceOptions1 p").on("click", setChoice);
                $("#choiceOptions2").hide();
                $("#choice2").hide();

            }
            else if (snapshot.numChildren() === 1) {
                thisPlayer = 2;
                $("#choiceOptions2 p").on("click", setChoice);
                $("#choiceOptions1").hide();
                $("#choice1").hide();
            }
            else {
                //too many players
                //can turn this into a function...
                $("#messageTitle").text("There are already two players for this game. Try again later.");
                $("#choiceOptions1").hide();
                $("#choiceOptions2").hide();
            }
            $("#newPlayer").hide();
            database.ref('players/' + thisPlayer).set({
                name: name,
                choice: choice,
                wins: wins,
                losses: losses
            });
        });
});
//disable start button so they can't start again
//hook up an event handler for choice clicks

//both of these can go to the same function - hook up in start button 
function setChoice(event) {

    // database.ref('players/' + thisPlayer )
    players.child(thisPlayer).child('choice').set(event.target.innerText)
}

function updatePlayer1(snapshot) {
    $("#player1").text(snapshot.child('name').val());
    $("#choice1").text(snapshot.child('choice').val());
    $("#wins1").text("Wins: " + snapshot.child('wins').val());
    $("#losses1").text("Losses: " + snapshot.child('losses').val());
    player1choice = snapshot.child('choice').val();
    checkForWinner();
}

function updatePlayer2(snapshot) {
    $("#player2").text(snapshot.child('name').val());
    $("#choice2").text(snapshot.child('choice').val());
    $("#wins2").text("Wins: " + snapshot.child('wins').val());
    $("#losses2").text("Losses: " + snapshot.child('losses').val());
    player2choice = snapshot.child('choice').val();
    checkForWinner();
}

function unloadPlayer() {
    database.ref('players/' + thisPlayer).remove();
};
$(window).on("beforeunload", unloadPlayer);
$(document).ready(init);
