var game = {
    state: "newGame",
};

var overlay = {
    counter: -1,
    title: "foo",
    subtitle: "bar",
	controls5: "",
	controls6: "",
};

var newOverlay ={
	counter: -1,
    title: "foo",
	controls1: "",
	controls2: "",
	controls3: "",
	controls4: "",
	controls5: "",
	controls6: "",
	nextButton: "",
};

var hudOverlay = {
	counter: -1,
	timePlayed: 0,
	gameScore: 0,
	level: 0,
}

var state1 = 0
var cShip = 0
var health = 0
var pause = false

var timePlayed = 0
var score = 0
var level = 1

var player = {
	x:100,
	y:350,
	width: 20,
	height: 50,
	counter: 0,
};
var ses = false
var kek = false
var sss = false 


var keyboard = { };
var playerBullets = [];
var enemies = [];
var enemyBullets = [];

async function update(){
	ses = true
}
async function update1(){
	kek = true
}

var tick = 0
var gameTime = 0
var timer = 0
var timer1 = 0

// =========== game   ============
async function updateGame() {
	if (health <0){
		health = 0
	}
	if (keyboard[27] && ses == false && timer == 0){
		timer = setInterval(update,150);
		if (!pause){
			if (game.state != "newGame" && game.state != "newGame1" && game.state != "over"){
				pause = true
			}
		}
		else{
			overlay.counter = -1;
			pause = false
		}
	}
	else if (timer != 0 && ses == true){
			ses = false
			clearInterval(timer)
			timer = 0
	}
	if (pause){
		overlay.counter = 100;
		overlay.title = "Time to stop";
		overlay.subtitle = "";
	}
    if(game.state == "playing" && enemies.length == 0) {
        game.state = "won";
        score+=200
		level+=1
        overlay.counter = 100;
    }
    if(game.state == "over" && keyboard[32]) {
        game.state = "start";
		tick = 0
		score = 0
		level = 1
        player.state = "alive";
        overlay.counter = -1;
		
		hudOverlay.counter = -1;
    }
    if(game.state == "won") {
        game.state = "start";
        player.state = "alive";
        overlay.counter = -1;
		newOverlay.counter = -1;
    }
	
	
	if(game.state == "playing" && sss == false && gameTime == 0){
		gameTime = setInterval(gameTick,1000);
		hudOverlay.counter = 100;
		var h = tick/3600 ^ 0 ;
		var m = (tick-h*3600)/60 ^ 0 ;
		var s = tick-h*3600-m*60 ;
		hudOverlay.timePlayed = "time: "+((m<10?m:m)+":"+(s<10?"0"+s:s))
		hudOverlay.gameScore = "your score: "+score
		hudOverlay.level = "level: "+level
	}
	else if (game.state == "playing" && sss == true && gameTime !=0){
		sss = false 
		clearInterval(gameTime)
		gameTime = 0
	}
	
	if (game.state == "newGame1"){
		if ((keyboard[37] || keyboard[65]) && ses == false && timer == 0){
			// left
			timer = setInterval(update,150);
			
			if (cShip==0){
				cShip=3	
			}
			else{
				cShip-=1	
			}
		}
		else if (timer != 0 && ses == true){
			ses = false
			clearInterval(timer)
			timer = 0
		}
		if ((keyboard[39] || keyboard[68]) && kek == false && timer1 == 0){
			//right
			timer1 = setInterval(update1,150);
			if (cShip==3){
				cShip=0
			}
			else{
				cShip+=1	
			}
		}
		else if (timer1 != 0 && kek == true){
			kek = false
			clearInterval(timer1)
			timer1 = 0
		}

	}
	
    if(overlay.counter >= 0) {
        overlay.counter++;
    }
	if(newOverlay.counter >= 0) {
        newOverlay.counter++;
    }
    
}
function gameTick(){
	if (!pause){
		tick+=1
		sss = true
	}
}
function updatePlayer() {
  if (!pause){	
    if(player.state == "dead") return;
    //left arrow
	if(keyboard[37] || keyboard[65])  { 
	    player.x -= 10; 
	    if(player.x < 0) player.x = 0;
	}	
	//right arrow
	if(keyboard[39] || keyboard[68]) { 
	    player.x += 10;	
	    var right = canvas.width - player.width;
	    if(player.x > right) player.x = right;
	}	
	
	//space bar
	if(keyboard[32]) {
		if(!keyboard.fired) { 
			if (!health == 0){
				firePlayerBullet(); 
				keyboard.fired = true;
			}
		}
		
	} else {
		keyboard.fired = false;
	}
	
	if(player.state == "hit" && health == 0) {
			console.log("hit")
			player.counter++;
			var h = tick/3600 ^ 0 ;
			var m = (tick-h*3600)/60 ^ 0 ;
			var s = tick-h*3600-m*60 ;
			timePlayed = ((m<10?m:m)+":"+(s<10?"0"+s:s))
			if(player.counter >= 40) {
						
				hudOverlay.counter = -1;
				player.counter = 0;
				player.state = "dead";
				game.state = "over";
				overlay.title = "You are Dead";
				overlay.subtitle = "press space to play again";
				overlay.counter = 100;
				overlay.controls5 = "time: "+timePlayed
				overlay.controls6 = "your score: "+ score
				
		}
	}
  }	
}


function updatePlayerBullets() {
  if (!pause){	
	//move each bullet
	for(i in playerBullets) {
		var bullet = playerBullets[i];
		bullet.y -= 8;
		bullet.counter++;
	}
	//remove the ones that are off the screen
	playerBullets = playerBullets.filter(function(bullet){
		return bullet.y > 0;
	});
  }	
}

function updateBackground() {
}

// ============== Enemy =============
function updateEnemies() {
  if (!pause){  
	if(game.state == "newGame") {
		newOverlay.counter = 100;
			player.state = "dead"
			newOverlay.title = "Space Gachi"
			newOverlay.controls1 = "controls:"
			newOverlay.controls2 = "A/left  - move left"
			newOverlay.controls3 = "D/right  - move right"
			newOverlay.controls4 = "space - shot | ESC - pause"
			newOverlay.nextButton = ""
			state1 = 1
		
	}
	
	if(game.state == "newGame1") {
			newOverlay.counter = 100
			player.state = "dead"
			newOverlay.title = "Space Gachi"
			newOverlay.controls1 = "choose letherman:"
			newOverlay.controls2 = "A/left  | D/right "
			newOverlay.controls3 = ""
			newOverlay.controls4 = ""
			newOverlay.nextButton = ""
			state1 = 2
			
	}
	
    //create 10 new enemies the first time through
    if(game.state == "start") {
		if (health == 0){
			health = 3	
			state1 = 0
		}
        enemies = [];
        enemyBullets = [];
        for(var i=0; i<10; i++) {
            enemies.push({
                    x: 50+ i*50,
                    y: 10,
                    width: 40,
                    height: 40,
                    state: "alive", // the starting state of enemies
                    counter: 0, // a counter to use when calculating effects in each state
                    phase: Math.floor(Math.random()*50), //make the enemies not be identical
                    shrink: 20,
            });
        }
        game.state = "playing";
    }
    
    
    //for each enemy
    for(var i=0; i<10; i++) {
        var enemy = enemies[i];
        if(!enemy) continue;
        
        //float back and forth when alive
        if(enemy && enemy.state == "alive") {
            enemy.counter++;
            enemy.x += Math.sin(enemy.counter*Math.PI*2/100);
            //fire a bullet every 50 ticks
            //use 'phase' so they don't all fire at the same time
            if((enemy.counter + enemy.phase) % (100-(level*2)) == 0) {
				console.log(game.state)
                enemyBullets.push(createEnemyBullet(enemy));
            }
        }
        
        //enter the destruction state when hit
        if(enemy && enemy.state == "hit") {
            enemy.counter++;
            
            //finally be dead so it will get cleaned up
            if(enemy.counter >= 20) {
                enemy.state = "dead";
                enemy.counter = 0;
            }
        }
    }
    
    //remove the dead ones
    enemies = enemies.filter(function(e) {
            if(e && e.state != "dead") return true;
            return false;
    });
  }	
}


function updateEnemyBullets() {
  if(!pause){	
    for(var i in enemyBullets) {
        var bullet = enemyBullets[i];
		bullet.y += 1+level/2;
        bullet.counter++;
    }
  }	
}

// =========== check for collisions ===

function checkCollisions() {
    for(var i in playerBullets) {
        var bullet = playerBullets[i];
        for(var j in enemies) {
            var enemy = enemies[j];
            if(collided(bullet,enemy)) {
				score+=1
                bullet.state = "hit";
                enemy.state = "hit";
                enemy.counter = 0;
            }
			score-3
        }
    }
    
    if(player.state == "dead") return;
    for(var i in enemyBullets) {
        var bullet = enemyBullets[i];
        if(collided(bullet,player)) {
				health -=1
				enemyBullets[i] = 0
				bullet.state = "hit";
				player.state = "hit";
				player.counter = 0;
        }
    }
}

function collided(a, b) {
    
    //check for horz collision
    if(b.x + b.width >= a.x && b.x < a.x + a.width) {
        //check for vert collision
        if(b.y + b.height >= a.y && b.y < a.y + a.height) {
            return true;
        }
    }
    
    //check a inside b
    if(b.x <= a.x && b.x + b.width >= a.x+a.width) {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
            return true;
        }
    }
    
    //check b inside a
    if(a.x <= b.x && a.x + a.width >= b.x+b.width) {
        if(a.y <= b.y && a.y + a.height >= b.y+b.height) {
            return true;
        }
    }
    
    return false;
}

//====================================


function doSetup() {
	attachEvent(document, "keydown", function(e) {
		keyboard[e.keyCode] = true;
	});
	attachEvent(document, "keyup", function(e) {
		keyboard[e.keyCode] = false;
	});
	
}

function attachEvent(node,name,func) {
    if(node.addEventListener) {
        node.addEventListener(name,func,false);
    } else if(node.attachEvent) {
        node.attachEvent(name,func);
    }
};