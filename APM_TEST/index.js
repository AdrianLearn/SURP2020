const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let time = document.getElementById("time");
let currTarget = 50;
let finished = false;
let first = true;
let timef = null;
//Function called by p5.js in the beginning to set the canvas
function setup() {
    frameRate(100);
    noStroke();
    ctx.fillStyle = 'grey';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    targets.length = 5;
    time.innerHTML = 0;
    stack = new Stack;
    stack.populate();
    targets = [
      new Target(random(canvas.width-30),random(canvas.height-30),stack.pop()),
      new Target(random(canvas.width-30),random(canvas.height-30),stack.pop()),
      new Target(random(canvas.width-30),random(canvas.height-30),stack.pop()),
      new Target(random(canvas.width-30),random(canvas.height-30),stack.pop()),
      new Target(random(canvas.width-30),random(canvas.height-30),stack.pop()),
    ];
    moveTargets();
    targets.forEach(target => target.draw());

}

function random(range){
  return Math.floor(Math.random() * (range-30)) + 30;
}

function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function mouseBounds(){
  return mouse.x <= targets[0].x + 20 && mouse.x >= targets[0].x - 20 && mouse.y <= targets[0].y +20 && mouse.y >= targets[0].y-20;
}
canvas.addEventListener("click", () => {
  if(targets[0].index == currTarget && mouseBounds()){
    if(currTarget <= 5){
      targets.shift();
      clearBackground();
      targets.forEach(target => target.draw());
    }else{
      targets.shift();
      let temp = new Target(random(780), random(580),stack.pop());
      targets.push(temp);
      clearBackground();
      temp.draw();
      targets.forEach(target => target.draw());
      first = false;
    }
    currTarget--;
  }
});

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

function clearBackground() {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0,0,canvas.width, canvas.height);
}

let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
document.body.addEventListener("mousemove", updateMouse);

function increaseTime(){
  if(!finished){
  const t = millis()/1000-timef;
  const x = t.toFixed(2);
  time.innerHTML = x;
  time = document.getElementById("time");
}
}

function moveTargets(){
  for (let i = 0; i < targets.length; i++) {
  for (let j = i+1; j < targets.length; j++) {
    pushOff(targets[i], targets[j]);
  }
}
}
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
    ctx.fillText(`Finished`, (canvas.width/3), canvas.height / 2);
  }
}
// Subclasses for stack and target
class Stack{
  constructor(){
    this.data = [];
    this.top = 1;
  }
  populate(){
    for(let i = 1; i < 51; i++){
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
    ctx.arc(this.x,this.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = "12px Avenir";
    ctx.strokeText(this.index,this.x-5,this.y+4);
    ctx.stroke();
  }
}
//I dont know why I need this but it doesn't work without it
targets = [
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
];
