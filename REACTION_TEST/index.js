const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
document.body.addEventListener("mousemove", updateMouse);
let mouse = { x: 0, y: 0 }; // mouse object containing coordinates of the mouse location on the canvas
let clickedTime;
let createdTime;
let reactionTime;
let currBox;

function random(range){
  return Math.floor(Math.random()*range);
}

function make(){
  let time = Math.random()*3000;
  ctx.fillStyle='white';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  setTimeout(function() {
    createdTime=Date.now();
    currBox = new Box (random(canvas.width), random(canvas.height), random(200), random(200), getRandomColor());
    currBox.show();
    currBox.draw();

  }, time);
}

canvas.addEventListener("click", () => {
  if(currBox.withinBounds()){
    clickedTime=Date.now();
    reactionTime=(clickedTime-createdTime)/1000;
    document.getElementById("reactionTime").innerHTML=reactionTime;
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
    ctx.fillRect(this.x,this.y,this.width,this.height);
    console.log('drawn');
  }
  withinBounds(){
    return mouse.x > this.x && mouse.x < this.x + canvas.width && mouse.y > this.y && mouse.y < this.y + canvas.height;
  }
  show(){
    console.log('box at ' + this.x, this.y, this.width, this.height + 'with color ' + this.color);
  }
}
