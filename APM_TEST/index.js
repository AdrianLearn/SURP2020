const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let time = document.getElementById("time");
const ellipseSize = 2;
let timer = time.innerHTML;
let frames = 0;
let currTarget = 50;


//Function called by p5 in the beginning to set the canvas
function setup() {
    frameRate(1);
    noStroke();
    ctx.fillStyle = 'grey';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    targets.length = 5;
    time.innerHTML = 0;
    stack = new Stack;
    stack.populate();
    targets = [
      new Target(random(780),random(580),stack.pop()),
      new Target(random(780),random(580),stack.pop()),
      new Target(random(780),random(580),stack.pop()),
      new Target(random(780),random(580),stack.pop()),
      new Target(random(780),random(580),stack.pop()),
    ];
    targets.forEach(target => target.show());
}

function random(range){
  return Math.floor(Math.random() * range-30) + 30;
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
  console.log('click');
  if(targets[0].index == currTarget && mouseBounds()){
    if(currTarget <= 5){
      targets.shift();
      clearBackground();
      targets.forEach(target => target.show());
      currTarget--;
    }else{
    targets.shift();
    let temp = new Target(random(780), random(580),stack.pop());
    targets.push(temp);
    clearBackground();
    temp.show();
    targets.forEach(target => target.show());
    currTarget--;
  }
  }
});

function clearBackground() {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0,0,canvas.width, canvas.height);
}
let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
document.body.addEventListener("mousemove", updateMouse);

function increaseTime(){
  timer++;
  time.innerHTML = timer;
  time = document.getElementById("time");
}

function draw(){
  increaseTime();
  if(currTarget == 0){
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Done`, (canvas.width/4), canvas.height / 2);
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
  show(){
    noStroke();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x,this.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = "11px Avenir";
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
