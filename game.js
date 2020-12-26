var myGamePiece;
var myScore;
var mySupply;
var myObstacles = [];
var myLine0; // Price Range
var myLine1; // Target Price
var myLine2; // Y Axis
var myLine3; // X Axis
var myLabel1; // X Axis Label
var myLabel2; // Y Axis Label
var myLabel3; // Price Range upper
var myLabel4; // Target Price
var myLabel5; // Price Range lower
var myRebase; // Rebase text
var myRandom; // Random Market changes

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function startGame() {
    myGamePiece = new component(10, 10, "black", 100, 145);
    myScore = new component("16px", "Helvetica", "black", 400, 340, "text");
    mySupply = new component("16px", "Helvetica", "black", 400, 320, "text");
    myLabel1 = new component("10px", "Helvetica", "black", 32, 300, "text");
    myLabel2 = new component("10px", "Helvetica", "black", 5, 288, "text");
    myLabel3 = new component("10px", "Helvetica", "black", 0.5, 138, "text");
    myLabel4 = new component("10px", "Helvetica", "black", 0.5, 153, "text");
    myLabel5 = new component("10px", "Helvetica", "black", 0.5, 168, "text");
    myRebase = new component("10px", "Helvetica", "black", 100, 300, "text");
    myLine0 = new component(600, 30, "#F0FFF0", 30, 135, "line");
    myLine1 = new component(600, 3, "#E0EEE0", 30, 148.5, "line");
    myLine2 = new component(1, 310, "grey", 30, 0, "line");
    myLine3 = new component(600, 1, "grey", 0, 290, "line");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.getElementById("myCanvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 350;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.myRandom = 0;


    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "line") {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.y += this.speedY;
        this.y += this.myRandom;
        this.hitedge();
    }

    this.hitedge = function() {
        var rockbottom = (myGameArea.canvas.height - this.height) - 60;
        var topout = 0;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.speedy = 0;
        } else if (this.y < topout) {
            this.y = topout
            this.speedy = 0;
        }
    }
}

function updateGameArea() {
    var x;
    myGameArea.clear();
    myLine0.update();
    myLine1.update();
    myLine2.update();
    myLine3.update();

    myGameArea.frameNo += 1;
    myGameArea.count = 0;
    random_boost = 1;

    // Set undefined variable values
    if (typeof score === 'undefined') {
        score = 0;
    } 
    if (typeof myGameArea.myRebase === 'undefined') {
        myGameArea.myRebase = "";
    } 
    if (typeof myGameArea.supply === 'undefined') {
        myGameArea.supply = 50000000;
    }

    // Create brebase lines every 150 and reset previous rebase text
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        myObstacles.push(new component(2, myGameArea.canvas.height - 50, "black", x, 0));
    }
    if (everyinterval(150)) {
        myGameArea.myRebase = "";
    }
    
    // Obstacle Effects
    for (i = 0; i < myObstacles.length; i += 1) {
        // Obstacle movement
        myObstacles[i].x += -1;
        // When the rebase line hits the obstacle
        if (myObstacles[i].x == myGamePiece.x) {
            supplyDelta = Math.abs((myGamePiece.y-148.5)*myGameArea.supply/148.5) / myGameArea.supply;
            if (myGamePiece.y > 165 && myGameArea.supply > 0) {
                myGameArea.supply -= Math.floor((myGameArea.supply*supplyDelta));
                myGameArea.myRebase = "-ive Rebase";
                random_boost =  getRandomArbitrary(1, 2);
            } else if (myGamePiece.y < 135) {
                myGameArea.supply += Math.floor((myGameArea.supply*supplyDelta));
                myGameArea.myRebase = "+ive Rebase";
                random_boost =  getRandomArbitrary(1, 2);
            } else {
                myGameArea.myRebase = "No Rebase";
            }
            myGameArea.count = (myGameArea.frameNo + 20);
            
        }
        myObstacles[i].update();
    }

    // Move market price without control of player
    if (everyinterval(Math.floor(getRandomArbitrary(20,60))) && myGamePiece.y < 135) {
        if (myGamePiece.y < 100 && myGamePiece.y > 50) {
            random_boost = random_boost*2;
        } else if (myGamePiece.y < 50) {
            random_boost = random_boost*4;
        }
        myGamePiece.myRandom = (getRandomArbitrary(0, 1.5)*random_boost);
    } else if (everyinterval(Math.floor(getRandomArbitrary(20,60))) && myGamePiece.y > 165) {
        if (myGamePiece.y > 200 && myGamePiece.y < 249) {
            random_boost = random_boost*2;
        } else if (myGamePiece.y > 250) {
            random_boost = random_boost*4;
        }
        myGamePiece.myRandom = 1-(getRandomArbitrary(0, 1.5)*random_boost);
    } else if (everyinterval(Math.floor(getRandomArbitrary(50,100)))) {
        myGamePiece.myRandom = getRandomArbitrary(-1, 1)*getRandomArbitrary(0, 0.5)*random_boost;
    }

    // Scoring for hitting target price
    if (myGamePiece.y < 165 && myGamePiece.y > 135){
        score +=10;
    }
    

    myLabel1.text="Time ";
    myLabel1.update();
    myLabel2.text="Price";
    myLabel2.update();
    myLabel3.text="$1.063";
    myLabel3.update();
    myLabel4.text="$1.012";
    myLabel4.update();
    myLabel5.text="$0.961";
    myLabel5.update();
    myScore.text="SCORE: " + score;
    myScore.update();
    myRebase.text = myGameArea.myRebase;
    myRebase.update();
    mySupply.text="SUPPLY: " + myGameArea.supply;
    mySupply.update();
    myGamePiece.newPos();
    myGamePiece.update();
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}


function moveup(move) {
    myGamePiece.myRandom = 0;
    myGamePiece.speedY = move; 
}

function movedown(move) {
    myGamePiece.myRandom = 0;
    myGamePiece.speedY = move; 
}


function clearmove() {
    myGamePiece.myRandom = 0;
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}