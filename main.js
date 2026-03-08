/* Main game file: main.js */
/* Game: [Your Game Name Here] */
/* Authors: [Your Name(s) Here] */
/* Description: [Short description of your game here] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] */
/* Note: If you use significant AI help you should cite that here as well, */
/* including summaries of prompts and/or interactions you had with the AI. */
/* AI-generated sections in the code should also be marked like this:      */
/*   // AI-generated: [brief description]                                  */
/*   // end AI-generated                                                   */

import "./style.css";
import { GameInterface } from 'simple-canvas-library';

let gi = new GameInterface();


/* ============================================================
 * STATE
 * Add your simulation variables here.
 * ============================================================ */

let infectionRate = 0.5;
// let population = [];
// let roundCount = 0;
// let infectedPerRound = [1];
// ... add more as you need them


/* ============================================================
 * COORDINATE HELPER
 *
 * All positions in your simulation use "percent coordinates":
 * x and y are numbers from 0 to 100, where (0,0) is the
 * top-left and (100,100) is the bottom-right of any region.
 *
 * This means you can write all your logic in 0-100 terms and
 * let the canvas be whatever size it wants -- the drawing will
 * scale automatically.
 *
 * percentToPixels() converts a percent coordinate (x, y) into
 * actual pixel coordinates for a given rectangular region
 * (described by a bounds object).
 *
 * A bounds object looks like:
 *   { top: 10, bottom: 400, left: 10, right: 800 }
 *
 * Examples (with bounds = { top:0, bottom:400, left:0, right:800 }):
 *   percentToPixels(0,   0,   bounds) --> { x: 0,   y: 0   }  top-left
 *   percentToPixels(100, 100, bounds) --> { x: 800, y: 400 }  bottom-right
 *   percentToPixels(50,  50,  bounds) --> { x: 400, y: 200 }  center
 *
 * Usage:
 *   let { x, y } = percentToPixels(person.x, person.y, simBounds);
 *
 * @param {number} x        - horizontal position, 0-100
 * @param {number} y        - vertical position, 0-100
 * @param {{top: number, bottom: number, left: number, right: number}} bounds
 * @returns {{x: number, y: number}}
 */
function percentToPixels(x, y, bounds) {
  return {
    x: bounds.left + (x / 100) * (bounds.right - bounds.left),
    y: bounds.top + (y / 100) * (bounds.bottom - bounds.top),
  };
}


/* ============================================================
 * DRAWING: SIMULATION
 *
 * Draw your agents (people) inside the simulation area.
 * The bounds object tells you exactly where that area is
 * on the canvas -- use it with percentToPixels().
 *
 * Example -- drawing a circle at a person's position:
 *
 *   let { x, y } = percentToPixels(person.x, person.y, bounds);
 *   ctx.fillStyle = person.infected ? 'red' : 'green';
 *   ctx.beginPath();
 *   ctx.arc(x, y, radius, 0, 2 * Math.PI);
 *   ctx.fill();
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top: number, bottom: number, left: number, right: number}} bounds
 * @param {number} elapsed - total ms since simulation started
 */
function drawSimulation(ctx, bounds, elapsed) {

  // YOUR CODE HERE

}


/* ============================================================
 * DRAWING: GRAPH
 *
 * Draw a bar chart in the graph area showing how your data
 * has changed over time.
 *
 * The y-axis is a little tricky: a bar that reaches "100%
 * infected" should go all the way to the TOP of the graph
 * area, but top < bottom in canvas coordinates (y=0 is the
 * top of the screen). So a taller bar means a SMALLER y value.
 * percentToPixels handles this correctly as long as you think
 * of y=0 as "no infections" and y=100 as "all infected":
 *
 *   let barBottom = percentToPixels(barX, 0,   bounds);  // baseline
 *   let barTop    = percentToPixels(barX, pct, bounds);  // scaled height
 *   ctx.fillRect(barBottom.x, barTop.y, barWidth, barBottom.y - barTop.y);
 *
 * Wait -- does that work? Try it with some numbers and see.
 * (Hint: it doesn't quite -- why not? What needs to change?)
 *
 * This function is a strong CREATE task candidate: it takes
 * data as a parameter and you can test it with fake data to
 * see exactly how the output changes.
 *
 * @param {number[]} data   - list of values to graph (e.g. infectedPerRound)
 * @param {number} dataMax  - the maximum possible value (e.g. population.length)
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top: number, bottom: number, left: number, right: number}} bounds
 */
function drawGraph(data, dataMax, ctx, bounds) {

  // Draw axes
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bounds.left, bounds.top);
  ctx.lineTo(bounds.left, bounds.bottom);
  ctx.lineTo(bounds.right, bounds.bottom);
  ctx.stroke();

  // YOUR CODE HERE: draw one bar per entry in data[]
  // Hint: what percentage of dataMax is data[i]?
  //   let pct = (data[i] / dataMax) * 100;
  // Then use percentToPixels to find where that bar top should be.

}


/* ============================================================
 * DRAWING: HUD (optional)
 *
 * Draw text overlays -- round count, infection rate, etc.
 * Delete this function and its call below if you don't want it.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function drawHUD(ctx, width, height) {

  // YOUR CODE HERE (or delete this function)

}


/* ============================================================
 * REGISTERED DRAWING CALLBACKS
 *
 * These set up the bounds objects and call your draw functions.
 * You shouldn't need to change these -- just fill in the
 * draw functions above.
 * ============================================================ */

gi.addDrawing(function ({ ctx, width, height, elapsed }) {
  let simBounds = {
    top: 10,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawSimulation(ctx, simBounds, elapsed);
});

gi.addDrawing(function ({ ctx, width, height }) {
  let graphBounds = {
    top: height / 2 + 10,
    bottom: height - 50,
    left: 50,
    right: width - 50,
  };
  drawGraph([], 1, ctx, graphBounds);  // <- replace [] and 1 with your real data
});

gi.addDrawing(function ({ ctx, width, height }) {
  drawHUD(ctx, width, height);
});


/* ============================================================
 * SIMULATION LOGIC
 *
 * Write a function (or functions) that update your population
 * each round. This is the other strong candidate for your
 * CREATE task function.
 *
 * Your CREATE task function must have:
 *   [ ] A parameter that genuinely affects what it does
 *   [ ] Sequencing  -- steps in a deliberate order
 *   [ ] Selection   -- at least one if/else
 *   [ ] Iteration   -- at least one loop
 *   [ ] An explicit call with arguments somewhere in your code
 * ============================================================ */

// YOUR CODE HERE


/* ============================================================
 * CONTROLS
 * ============================================================ */

let topBar = gi.addTopBar();

topBar.addButton({
  text: 'Next Round',
  onclick: function () {
    // call your update function here
    window.alert('Replace me: call your simulation update function');
  }
});

topBar.addSlider({
  label: 'Infection Rate',
  min: 0,
  max: 1,
  step: 0.01,
  value: infectionRate,
  oninput: function (value) {
    infectionRate = value;
  }
});

topBar.addSlider({
  label: 'Initial Population',
  min: 16,
  max: 2048,
  oninput: function (value) {
    // call your generatePopulation function here, using value as the population size
    window.alert('Replace me: call your generatePopulation function with population size ' + value);
  }
});

topBar.addButton({
  text: 'Reset',
  onclick: function () {
    // call your generatePopulation function here
    window.alert('Replace me: call your generatePopulation function');
  }
});

// TODO: add sliders or inputs for your own parameters here


gi.run();