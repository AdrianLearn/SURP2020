const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let clickedTime;
let createdTime;
var reactionTime;
function random(range){
  return Math.floor(Math.random()*range));
}

function getRandomColor() {
	let letters = "0123456789ABCDEF".split('');
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

class Box{
  constructor(x,y,width, height,color){
    Object.assign(this, {x,y,width,height,color});
  }
  draw(){
    noStroke();
    ctx.fill(this.color);
    ctx.beginPath();
    ctx.rect(x,y,width,height);
  }
}
