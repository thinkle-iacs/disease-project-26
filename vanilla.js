// boilerplate: get canvas and 2D drawing context
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
// set canvas width and height
canvas.width = 400;
canvas.height = 400;

// Now let's start drawing...
// Pen settings...
ctx.strokeStyle = "rgb(255,128,0)";
ctx.lineWidth = 16;

// Now start drawing
ctx.moveTo(10, 10); // Go to 10,10
ctx.lineTo(100, 100); // line to 100,100
ctx.lineTo(45, 200); // then to 45,200
ctx.stroke(); // now draw it!
ctx.beginPath(); // pick up the pen
// Now draw a circle at 200,200
// with radius 100
ctx.arc(
  200,
  200, // center (x,y)
  100, // radius
  0, // start angle (radians)
  Math.PI * 2 // end angle (radians)
);
ctx.fillStyle = "rgb(0,128,128)"; // fill color
ctx.fill(); // fill it in!
ctx.stroke();
