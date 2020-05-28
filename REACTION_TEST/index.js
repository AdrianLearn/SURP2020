const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
document.body.addEventListener("mousemove", updateMouse);
let boxes = 10;
document.getElementById("numSquares").innerHTML = boxes;
let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
let createdTime;
let currBox;
let times = [];
let averageTime;
let start = false;

function random(range){
  let rand = Math.floor(Math.random()*range);
  if(rand < 40){
    rand+=40;
  }
  return rand;
}

function startButton(){
  start = true;
  make();
}

function average(times){
  let total = 0;
  for(let i = 0; i < times.length; i++){
    total += times[i];
  }
  total = total/times.length;
  return total;
}

function make(){
  if(boxes == 0){
    clearBoard();
    ctx.font = "30px Avenir";
    ctx.fillStyle = "black";
    ctx.fillText(`Finished`, ((canvas.width/2)-50), canvas.height / 2);//50 is to shift the text over
  }else{
    currBox = null;
    let time = Math.random()*3000;
    clearBoard();
    if(start){
      setTimeout(function() {
        createdTime=Date.now();
        currBox = new Box (random(canvas.width), random(canvas.height), random(200), random(200), getRandomColor());
        currBox.draw();
      }, time);
    }
  }
}

function clearBoard(){
  ctx.fillStyle='white';
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
canvas.addEventListener("click", () => {
  if(currBox.withinBounds() && boxes != 0){
    boxes--;
    let clickedTime=Date.now();
    let reactionTime=(clickedTime-createdTime)/1000;
    times.push(reactionTime);
    averageTime = average(times);
    document.getElementById("reactionTime").innerHTML=reactionTime;
    document.getElementById("averageTime").innerHTML=averageTime.toFixed(3);
    document.getElementById("numSquares").innerHTML = boxes;
    make();
  }
});

function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function getRandomColor() {
	let letters = "0123456789ABCDEF".split('');
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
  if(color == "#FFFFFF"){//in the case the square is white
    color = getRandomColor();
    console.log("white shifted");
  }
	return color;
}
make();

class Box{
  constructor(x,y,width, height,color){
    Object.assign(this, {x,y,width,height,color});
  }
  draw(){
    ctx.fillStyle = getRandomColor();
    ctx.fill();
    ctx.beginPath();
    this.checkBounds();
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
  checkBounds(){ // function to ensure the boxes don't float off the edge of the canvas and are visible
    if(this.x > canvas.width-50){
      this.x = canvas.width-50;
    }if(this.y > canvas.height-50){
      this.y = canvas.height-50;
    }
  }
  withinBounds(){
    return mouse.x > this.x && mouse.x < this.x + this.width && mouse.y > this.y && mouse.y < this.y +  this.height;
  }
}
