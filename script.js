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
    }

    class Background { }

    class Enemy {
    }

    function handleEnemies() { }

    function displayStatueText() { }

    const input = new InputHandler();
    function animate() { }


});

