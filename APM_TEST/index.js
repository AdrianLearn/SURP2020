const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const circleR = 25; //radius of the targets
let time = document.getElementById("time");
document.body.addEventListener("mousemove", updateMouse);
let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
let currTarget = 10;  // tracks what target you are currently clicking
let finished = false; // tracks if you have finished the target array
let first = true; // tracks if this is the first target you have clicked
let timef = null; //tracks the number of milliseconds leading up to the start

//Function called by p5.js in the beginning to set the canvas
function setup() {
    frameRate(100);
    noStroke();
    ctx.fillStyle = 'grey';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    targets.length = 5;
    time.innerHTML = 0;
    stack = new Stack;
    stack.populate(currTarget);// populates the stack at the length of the largets target in the board
    //something wrong with this
    targets = [
      new Target(random(canvas.width),random(canvas.height),stack.pop()),
      new Target(random(canvas.width),random(canvas.height),stack.pop()),
      new Target(random(canvas.width),random(canvas.height),stack.pop()),
      new Target(random(canvas.width),random(canvas.height),stack.pop()),
      new Target(random(canvas.width),random(canvas.height),stack.pop()),
    ];
    targets.forEach(target => target.show());
    moveTargets();
}

function random(range){
  return Math.floor(Math.random() * (range - 30) + 30);
}

function restart(){
  let button = document.getElementById("start");
  button.value = 'restart';
  let indicator = document.getElementById("indicator");
  indicator.innerHTML = 'Real Test';
  targets = [];
  finished = false;
  currTarget = 50;
  first = true;
  setup();
}
/*
* function to check and move targets if they overlap
*/
function moveTargets(){
  for (let i = 0; i < targets.length; i++) {
    for (let j = i+1; j < targets.length; j++) {
      pushOff(targets[i], targets[j]);
    }
  }
}

/*
* Function to push two targets off each other if they happen to spawn on one another
*/
function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = 50 - L;
  if (distToMove > 0) {
    dx /= L;
    dy /= L;
    c1.x -= dx * distToMove / 2;
    c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2;
    c2.y += dy * distToMove / 2;
  }
  clearBackground();
  targets.forEach(target => target.draw());
}

/*
* Function to clear the background to avoid clutter of previous targets
*/
function clearBackground() {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0,0,canvas.width, canvas.height);
}

/*
* Function to check if the mouse is within the area of the target
*/
function mouseBounds(){
  return mouse.x <= targets[0].x + circleR && mouse.x >= targets[0].x - circleR && mouse.y <= targets[0].y +circleR && mouse.y >= targets[0].y-circleR;
}

canvas.addEventListener("mousedown", () => {
  if(targets[0].index == currTarget && mouseBounds()){
    console.log('click');
    if(currTarget <= 5){
      targets.shift();
      clearBackground();
      targets.forEach(target => target.draw());
    }else{
      targets.shift();
      targets.push(new Target(random(780), random(580),stack.pop()));
      clearBackground();
      targets.forEach(target => target.draw());
      first = false;
    }
    currTarget--;
  }
});


/*
* function to increment the timer, chopping off everything past the hundredth of a second, and update the span
*/
function increaseTime(){
  if(!finished){
    const t = millis()/1000-timef;
    const x = t.toFixed(2);
    time.innerHTML = x;
    time = document.getElementById("time");
  }
}

/*
* function called by the framerate, handles time, moving of targets if necessary, and when the program is finished
*/
function draw(){
  if(first){
    timef = millis()/1000;
  }
  increaseTime();
  moveTargets();
  if(currTarget == 0){
    finished = true;
    ctx.font = "30px Avenir";
    ctx.fillStyle = "white";
    ctx.fillText(`Finished`, ((canvas.width/2)-35), canvas.height / 2);//35 is to shift the text over
  }
}
/*
* Function to track mouse movement
*/
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}


// Subclasses for stack and target
class Stack{
  constructor(){
    this.data = [];
    this.top = 1;
  }
  populate(num){
    for(let i = 1; i < num+1; i++){
      this.data.push(i);
    }
  }
  push(element) {
   this.data[this.top] = element;
   this.top = this.top + 1;
  }
  length() {
   return this.top;
  }
  pop() {
     this.top = this.top -1;
     return this.data.pop();
   }
   isEmpty(){
     return this.data.length == 0;
   }
}
class Target{
  constructor(x,y,index){
    Object.assign(this, {x,y,index});
  }
  draw(){
    noStroke();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x,this.y, circleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = "12px Avenir";
    ctx.strokeText(this.index,this.x-5,this.y+4);
    ctx.stroke();
  }
  show(){
    console.log(this.index, this.x,this.y);
  }
}
//I dont know why I need this but it doesn't work without it
targets = [
  new Target(random(canvas.width),random(canvas.height)),
  new Target(random(canvas.width),random(canvas.height)),
  new Target(random(canvas.width),random(canvas.height)),
  new Target(random(canvas.width),random(canvas.height)),
  new Target(random(canvas.width),random(canvas.height)),
];
