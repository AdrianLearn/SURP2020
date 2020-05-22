const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let time = document.getElementById("time");
const ellipseSize = 2;
let timer = time.innerHTML;
let frames = 0;
let currIndex = 0;
let currTarget = 50;
/*
* required by p5.js, called at the beginning of the webpage load
*/
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
    //requestAnimationFrame(drawScene);
}

function random(range){
  return Math.floor(Math.random() * range-20) + 20;
}

function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

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
}
class Target{
  constructor(x,y,index){
    Object.assign(this, {x,y,index});
  }
  show(){
    noStroke();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x,this.y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = "10px Arial";
    ctx.strokeText(this.index,this.x-5,this.y+4);
    ctx.stroke();
  }
  hide(){
    noStroke();
    ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.arc(this.x,this.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }
}
targets = [
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
  new Target(random(780),random(580)),
];
function mouseBounds(){
  return mouse.x <= targets[currIndex].x + 20 && mouse.x >= targets[currIndex].x - 20 && mouse.y <= targets[currIndex].y +20 && mouse.y >= targets[currIndex].y-20;
}
canvas.addEventListener("click", () => {
  console.log('click');
  if(targets[currIndex].index == currTarget && mouseBounds()){
    console.log(targets[currIndex].index);
    console.log(currTarget);
    let temp = new Target(random(780), random(580),stack.pop());
    targets.push(temp);
    temp.show();
    targets[currIndex].hide();
    currTarget--;
    currIndex++;
  }
});

let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
document.body.addEventListener("mousemove", updateMouse);

function increaseTime(){
  frames++;
  //if(frames%60===0){
    timer++;
  //}
  time.innerHTML = timer;
  time = document.getElementById("time");
}

function draw(){
  increaseTime();
}
