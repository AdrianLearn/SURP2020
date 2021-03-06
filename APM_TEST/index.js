const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const circleR = 25; //radius of the targets
let time = document.getElementById("time");
document.body.addEventListener("mousemove", updateMouse);
let subjectID = prompt("Please enter your subject ID");
let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
let targets = []; // Array to track the targets
let currTarget = 10;  // tracks what target you are currently clicking
let finished = false; // tracks if you have finished the target array
let first = true; // tracks if this is the first target you have clicked
let test = false; // tracks if this is the trial or real
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
    targets = [
      new Target(randomInt(circleR,canvas.width),randomInt(circleR,canvas.height),stack.pop()),
      new Target(randomInt(circleR,canvas.width),randomInt(circleR,canvas.height),stack.pop()),
      new Target(randomInt(circleR,canvas.width),randomInt(circleR,canvas.height),stack.pop()),
      new Target(randomInt(circleR,canvas.width),randomInt(circleR,canvas.height),stack.pop()),
      new Target(randomInt(circleR,canvas.width),randomInt(circleR,canvas.height),stack.pop()),
    ];
    targets.forEach(target => target.sketch());
    moveTargets();
}

function randomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max)-circleR; // adjusting for the size of the target
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restart(){
  if(!test){
    document.getElementById("indicator").innerHTML = 'Real Test';
    indicator.innerHTML = 'Real Test';
    targets = [];
    finished = false;
    currTarget = 50;
    first = true;
    test = true;
    setup();
  }
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

function withinCircleR(targ, targ1){
  let d = 25 - Math.pow((targ.x-targ1.x),2) + Math.pow((targ.y-targ1.y),2);
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
    clearBackground();
    targets.forEach(target => target.sketch());
  }

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
    if(currTarget <= 5){
      targets.shift();
      clearBackground();
      targets.forEach(target => target.sketch());
    }else{
      targets.shift();
      targets.push(new Target(randomInt(circleR,canvas.width),randomInt(circleR,canvas.height),stack.pop()));
      clearBackground();
      targets.forEach(target => target.sketch());
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
  if(!subjectID || subjectID.length === 0){
    subjectID = prompt("Please enter your subject ID"); //Ensuring existance of subject ID
  }
  increaseTime();
  moveTargets();
  if(currTarget === 0){
    if(test){
      noLoop();
      ctx.font = "30px Avenir";
      ctx.fillStyle = "white";
      ctx.fillText(`Finished`, ((canvas.width/2)-35), canvas.height / 2);//35 is to shift the text over
      let URLquery = '?subjectID=' + subjectID + '&elapsedTime=' + (millis()/1000-timef);
      window.location = 'http://adrian.lmu.build/APM_TEST/APM_Link.php' + URLquery;
    }else{
    ctx.font = "30px Avenir";
    ctx.fillStyle = "white";
    ctx.fillText(`Finished Trial`, ((canvas.width/2)-55), canvas.height / 2);//35 is to shift the text over
    }
  finished = true;
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
}

class Target{
  constructor(x,y,index){
    Object.assign(this, {x,y,index});
  }
  sketch(){
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
}
