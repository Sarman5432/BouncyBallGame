//canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); //ctx means context

const width = canvas.width = window.innerWidth; //sets width and canvas.width to window.innerWidth in one line
const height = canvas.height = window.innerHeight;

//generate rnadom number
function rand(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

//constructor for shape
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

//constructor for the ball
function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

//constructor for evil circle
function evilCircle(x, y, exists){
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white'
    this.size = 10;
}

//correcting prototype
Ball.prototype = Object.create(Shape.prototype);
Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false,
    writable: true
});

evilCircle.prototype = Object.create(Shape.prototype);
Object.defineProperty(evilCircle.prototype, 'constructor',{
    value: evilCircle,
    enumerable: false,
    writable: true
})

/**ball methods**/

//creates circle
Ball.prototype.draw = function () {
    //tells we will start a new drawing
    ctx.beginPath();

    //makes the drawing
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); //	context.arc(x,y,r,startAngle,endAngle,counterclockwise /*default*/);

    //actually complies the drawing started by beginDrawing()
    ctx.fill();
}

//updates location (ie moves circle)
Ball.prototype.update = function () {
    //flips horizontal direction when ball hits the left or right of canvas
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    } else if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    //flips vertical direction when ball hits top or bottom of canvas
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    } else if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    //increments x and y position by velocity
    this.x += this.velX;
    this.y += this.velY;
}

//ball collision detection between each other
Ball.prototype.collisionDetection = function () {
    for (let j = 0; j < balls.length; j++) {
        //this=current ball (the instatiated ball that is its own object)
        //balls[j] runs through all balls (including the current ball) to make sure collision with others, not itself
        if ((this != balls[j])) { 
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            //changes color of ball on collision
            if (distance <= this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + rand(0, 255) + ',' + rand(0, 255) + ',' + rand(0, 255) + ')';
            }
        }
    }
}

/**Evil Circle Methods**/
evilCircle.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color; //only border
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke(); //creates only ring instead of filling the circle
}

evilCircle.prototype.checkBounds = function(){
    //test
}

/**creating the balls and storing them in an array**/
let balls = [];
while (balls.length < 25) {
    let size = rand(10, 20);
    let x = rand(0 + size, width - size);
    let y = rand(0 + size, height - size);
    let velX = rand(-7, 7);
    let velY = rand(-7, 7);
    let exists = true;
    let color = 'rgb(' + rand(0, 255) + ',' + rand(0, 255) + ',' + rand(0, 255) + ')'

    let ball = new Ball(x, y, velX, velY, exists, color, size);

    balls.push(ball);
}

/**Looping the animation**/
function loop() {
    //canvas background
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; //Sets the canvas fill color to semi-transparent black
    ctx.fillRect(0, 0, width, height); //draws a rectangle of the color across the whole width and height of the canvas

    //looping through each ball to draw and update it
    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].collisionDetection();
        balls[i].update();
    }
    requestAnimationFrame(loop);//runs function again (ie loop is continuously called recursively)
}

loop();

/*
Sets the canvas fill color to semi-transparent black, then draws a rectangle of the color across the whole width and height of the canvas, using fillRect() (the four parameters provide a start coordinate, and a width and height for the rectangle drawn). This serves to cover up the previous frame's drawing before the next one is drawn. If you don't do this, you'll just see long snakes worming their way around the canvas instead of balls moving! The color of the fill is set to semi-transparent, rgba(0,0,0,0.25), to allow the previous few frames to shine through slightly, producing the little trails behind the balls as they move. If you changed 0.25 to 1, you won't see them at all any more.

*/