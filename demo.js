/*
* Copy this into main.js for a quick demo
*/

import "./style.css";

import { GameInterface, GameCanvas } from 'simple-canvas-library';

let gi = new GameInterface();

// An example using "elapsed" to calculate position
// based on absolute amount of time that's gone by
gi.addDrawing(
  function ({ ctx, width, height, elapsed }) {
    ctx.fillStyle = "red";
    // Pick whatever is smaller -- 1/3 width or 1/3 height
    let radius = Math.min(width / 3, height / 3);
    // Center of the canvas
    let centerx = width / 2;
    let centery = height / 2;
    // Angle in radians -- move one circle (2pi) every 5 seconds
    // (5000ms)
    let theta = (elapsed / 5000) * Math.PI * 2
    // Calculate x,y using trig -- the unit circle
    // is your friend :)
    let x = centerx + Math.cos(theta) * radius;
    let y = centery + Math.sin(theta) * radius;
    // Draw a rectangle at x,y
    ctx.fillRect(x, y, 30, 30);
  }
)

// And an example using stepTime to track how long we've been
// going...
let circleX = 0;
let circleY = 100;

gi.addDrawing(
  function ({ ctx, width, height, stepTime }) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255,255,0)';
    let radius = height / 8;
    ctx.arc(
      circleX, circleY, radius, 0, Math.PI * 2
    );
    ctx.stroke();
    if (circleX > width + radius) {
      circleX = -radius;
    } else {
      // move 150 pixels per second
      circleX += 150 * (stepTime / 1000)
    }
  }
)

// When the user "clicks" -- we 
// MOVE x and y
gi.addClickHandler(
  function ({ x, y }) {
    circleX = x;
    circleY = y
  }
)
gi.run();


