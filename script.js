window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;

    //Creating fullscreen element for API 
    const fullScreenButton = document.getElementById('fullScreenButton');

    //keeps track of all keys currently pressed and status of game
    class InputHandler {
        constructor() {
            this.keys = [];
            this.touchY = '';
            this.touchThreshold = 30;
            //creates an instance when a key is pressed with built in method 
            window.addEventListener('keydown', e => {
                //adding only certain keys into array if it is not already present
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
                //calling game restart
                else if (e.key === "Enter" && gameOver) restartGame();
            });
            //creates an instance where when a key is released that key is removed from the array
            window.addEventListener('keyup', e => {
                //adding only certain keys into array if it is not already present
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                console.log(e.key, this.keys);
            });
            //touch functions
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY
            });
            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < - this.touchThreshold && this.keys.indexOf('swipe up') === -1)
                    this.keys.push('swipe up');
                else if (swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down') === -1)
                    this.keys.push('swipe down');
                if (gameOver) restartGame();
            });
            window.addEventListener('touchend', e => {
                //pull keys from array after they have been let go 
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);

            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = playerImage;
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart() {
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        draw(context) {
            // context.lineWidth = 5;
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x + this.width / 2, this.y + this.height / 2 +20, this.width / 3, 0, Math.PI * 2);
            // context.stroke();

            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime, enemies) {

            //collision detection
            enemies.forEach(enemy => {
                //set to offset corners to make the circles centered around the player/enemy
                const dx = (enemy.x + enemy.width / 2- 20) - (this.x + this.width / 2);
                const dy = (enemy.y + enemy.height / 2) - (this.y + this.height / 2 +20);
                //using pythagorean theory to detect collision 
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width / 3 + this.width / 3) {
                    gameOver = true
                }
            })
            //loops through frames for animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
            } else {
                this.frameTimer += deltaTime;
            }
            //controls
            if (input.keys.indexOf('ArrowRight'|| 'ArrowRight' && "ArrowUp") > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft'|| 'ArrowLeft' && "ArrowUp") > -1) {
                this.speed = -5;
            } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) &&
                this.onGround()) {
                this.vy -= 32;
            }
            else {
                this.speed = 0
            }
            //horizontal movement
            this.x += this.speed;
            //creates left and right boundaries 
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            // vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.frameY = 1;
                this.maxFrame = 5;
            } else {
                this.vy = 0;
                this.frameY = 0;
                this.maxFrame = 8;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        }
        //gravity check
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {

        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = backgroundImage;
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 10;

        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
        restart() {
            this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.image = enemy1;
            this.width = 160;
            this.height = 119;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 10000 / this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context) {
            // context.lineWidth = 5;
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x + this.width / 2 -20, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
            // context.stroke();
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    // enemies.push(new Enemy(canvas.width, canvas.height));
    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        }
        else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatueText(context) {
        if (!gameOver) {

            context.font = '40px Helvetica';
            context.fillStyle = 'black';
            context.fillText('Score: ' + score, canvas.width / 15, 80);
            context.fillStyle = 'white';
            context.fillText('Score: ' + score, canvas.width / 15, 82);
        } else {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('Game Over, press Enter or swipe down to try again!', canvas.width / 2, 200);
            context.fillStyle = 'white';
            context.fillText('Game Over, press Enter or swipe down to try again!', canvas.width / 2, 202);
            context.fillStyle = 'black';
            context.fillText('Score: ' + score, canvas.width / 2, 255);
            context.fillStyle = 'white';
            context.fillText('Score: ' + score, canvas.width / 2, 253);
        }

    }

    //game restart
    function restartGame() {
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }
    //toggle fullscreen
    function toggleFullscreen() {
        console.log(document.fullscreenElement);
        //asynchronous, returns a promise 
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click',toggleFullscreen);

    //calling each class
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    //timestamp using deltaTime to set enemy speed
    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //draws our elements and class
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatueText(ctx);
        //call to request build in animation loop
        if (!gameOver) requestAnimationFrame(animate);
    }

    animate(0);
});

