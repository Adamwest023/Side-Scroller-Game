window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 720;

    //keeps track of all keys currently pressed and status of game
    class InputHandler {
        constructor() {
            this.keys = [];
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
                console.log(e.key, this.keys);
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
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 10;
            this.y = this.gameHeight - this.height;
            this.image = playerImage;
            this.frameX = 0;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.weight = 0
        }
        draw(ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update() {
           
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            }else if (input.keys.indexOf('ArrowUp') > -1) {
                this.vy -=30;
            }
            else {
                this.speed = 0
            }
            //horizontal movement
            this.x += this.speed;
            //creates left and right boundaries 
            if (this.x < 0 )this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            // vertical movement
            this.y += this.vy;
        }
        //gravity check
        
    }

    class Background { }

    class Enemy {
    }

    function handleEnemies() { }

    function displayStatueText() { }

    //calling each class
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update();
        //call to request build in animation loop
        requestAnimationFrame(animate);
    }

    animate();
});

