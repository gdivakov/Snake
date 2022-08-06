function Snake() {
	//PLAYER
	var __lenght = 4,
		__dirr = "right",
		__placement = [3, 1],
		__row = 1,
		__column = 1,
		__previousPosition = [],
		__tailQuant = 3,
		__lastTailPlace,
		__isLose = false,
		__previousKey = 39,
		__isAgain,
		__score = 0,
		__squaresQuant = document.getElementsByClassName("square").length - 1;

	var __color = ["#bf57a7", "#e87151", "#3FA9AB", "#ea4848", "#0ddb55", "#28D7D4", "#28700a", "#C3B091", "#76B76C", "#F4FF52"];

		//context
		var _this = this;

	this.showLose = function() {
		clearInterval(timer);
		//win maybe?
		if (_this.checkWin()) return;
		__isLose = true;
		__score = 0;
		_this.getScore();
		console.log("you lose!");
		__isAgain = confirm('Try again?');
		if (__isAgain) {
			location.reload(true);
		} else {
			_this.insertRestartButton();
		}
		return;
	}

//MOVING
	this.move = function() {
		// __placement = [y, x]

		switch (__dirr) {
		//left:
			case 'left':
				__placement[0] -= 1;
				break;
		//right: 
			case 'right':
				__placement[0] += 1;
				break;
		//top:
			case 'top':	
				__placement[1] -= 1;
				break;
		//bottom: 
			case 'bottom':	
				__placement[1] += 1;
		//else - start
			// default:
			// if (lastKey == "left") 
			// 	this.placement[0] += 5;
		}
		_this.moving();
	}

	this.moving = function() {
		// console.log(__placement);
		// console.log(__dirr);

		__column = __placement[0];
		__row = __placement[1];

		var squareNumHead = __row + "_" + __column;
		var parentElem = document.getElementsByClassName(squareNumHead)[0];

		//LOSE
		if (parentElem == undefined) {
			//WALL
			this.showLose();
			return;
		}
		// ELSE - CONTINUE
		
		_this.insertTail(parentElem);

	}

	//inserting tail
	this.insertTail = function(parentElem) {
		var nextElement;
		var oldElement;

		for (var i = 1; i <= __tailQuant; i++) {
			var tailNum = 'tail_' + i;
			// console.log(tailNum);
			var tail = document.getElementsByClassName(tailNum)[0];

			if (i == 1) {
				//inserting first element
				
				if (parentElem.firstElementChild) {
					//is snake moving right
					if (parentElem.firstElementChild.classList.contains("tail")) {
							//snake can't go through herself
							_this.showLose();								
					}

				}

				if (__isLose) return;
				oldElement = tail.parentElement;
				parentElem.appendChild(tail);

				//have we eaten the fruit?
				_this.eatFruit();
				continue;			
			} 
			nextElement = tail.parentElement;
			oldElement.appendChild(tail);
			oldElement = nextElement;

			//for new tails(watch eatFruit function)
			if ( i == __tailQuant) {
				__lastTailPlace = oldElement;
			}
		}
	}

	//LISTENERS:

	document.onkeydown = function(e) {
		var __key = e.keyCode,
			rightKey = _this.checkKey(__key);
			__previousKey = rightKey;

		switch (rightKey) {
			// codeleft:
			case 37:
				__dirr = "left";
				break;

			//coderight:
			case 39:
				__dirr = "right";
				break;

			//codetop: 
			case 38:
				__dirr = "top";
				break;

			//codebottom:
			case 40:
				__dirr = "bottom";
				break;
			}
	}

	this.checkKey = function(__key) {
		// right
		if ( (__key == 37) && (__previousKey == 39) ) {
			return 39;
		}
		// left
		if ( (__key == 39) && (__previousKey == 37) ) {
			return 37;
		}
		//bottom
		if ( (__key == 38) && (__previousKey == 40) ) {
			return 40;
		}
		//top
		if ( (__key == 40) && (__previousKey == 38) ) {
			return 38;
		}

		return __key;
	}		

	//FRUIT
	var __place;

	this.generateNewSpace = function() {
		var spaceForFruit = _this.getRandomNum() + "_" + _this.getRandomNum();

		return spaceForFruit;
	}

	this.getRandomNum = function() {
		var num = Math.round(Math.random() * 10);

		if (num == 0) num += 1;
		return num;
	}

	this.getRandomColor = function() {
		var num = Math.floor(Math.random() * 10); //only 10 colors

		return num;
	}


	this.checkFreeSpace = function() {
		var squares = document.getElementsByClassName("square");
		var free = [];
		for (var i = 0; squares.length > i; i++) {
			if (!squares[i].firstElementChild) {
				free.push(squares[i]);
			}
		}
		return free;
	}

	//is free?
	//yes - get new space
	this.checkSpace = function() {
		var squareNum = _this.generateNewSpace();
		var spaceElement = document.getElementsByClassName(squareNum)[0];
		if ((spaceElement.firstElementChild) || (spaceElement.classList.contains("1_4"))) { //<--requires revision
			console.log("searching for free space");
			var free = _this.checkFreeSpace();
			console.log("done");
			var rand = Math.floor(Math.random() * free.length);
			spaceElement = free[rand];
		}

		return spaceElement;
	}

	this.createFruit = function() {
		__place = _this.checkSpace();

		__place.classList.add('fruit');
		console.log("fruit added");

		// picks random color

		var color = __color[_this.getRandomColor()];
		__place.style.backgroundColor = color;
	}

	this.eatFruit = function() {

		var head = document.getElementsByClassName("tail_1")[0];
		var fruit = document.getElementsByClassName("fruit")[0];
		var headParent = head.parentElement;
		if (headParent.classList.contains("fruit")) {
			__tailQuant++;

			var newTailElem = document.createElement('div');
			var newTailElemName = "tail_" + __tailQuant;

			newTailElem.classList.add("tail");
			newTailElem.classList.add(newTailElemName);

			__lastTailPlace.appendChild(newTailElem);

			//delete eated fruit 
			fruit.classList.remove("fruit");
			fruit.style.backgroundColor = "#dce4f2";
			console.log("fruit deleted");
			__score++;
			_this.getScore();
			// generate new fruit
			_this.createFruit();
		}
	}

	this.getScore = function() {
		document.getElementById("score").innerHTML = __score;
	}

	this.checkWin = function() {
		if (__score == (__squaresQuant - 3)) {
			alert("You win!, congrats!");
			return true;
		}

		return false;
	}

	this.insertRestartButton = function() {
		button = document.createElement("input");
		button.setAttribute("type", "button");
		button.setAttribute("value", "again");
		button.setAttribute("onclick", "location.reload(true);");
		button.classList.add("button");

		document.getElementById("score").appendChild(button);
	}
}

var snake = new Snake();
snake.createFruit();
var timer = setInterval(snake.move, 300);