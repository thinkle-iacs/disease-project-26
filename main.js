/* Main game file: main.js */
/* Game: [Your Game Name Here] */
/* Authors: [Your Name(s) Here] */
/* Description: [Short description of your game here] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] 
/* Note: If you use significant AI help you should cite that here as well */
/* including summaries of prompts and/or interactions you had with the AI */
/* In addition, of course, any AI-generated code should be clearly maked */
/* in comments throughout the code, though of course when using e.g. CoPilot */
/* auto-complete it maye be impractical to mark every line, which is why you */
/* should also include a summary here */


import "./style.css";

import { GameInterface } from 'simple-canvas-library';

let gi = new GameInterface();

/* Variables: Top-Level variables defined here are used to hold game state */

let population = [];
let infectionRate = 0.5;
let roundCount = 0;
let infectedPerRound = [1];
let numCols = 10;

function generatePopulation (p) {
  population = [];
  roundCount = 0;
  infectedPerRound = [1];
  numCols = Math.ceil(Math.sqrt(p));
  for (let i = 0; i < p; i++) {
    let col = i % numCols;
    let row = Math.floor(i / numCols);
    population.push({
      x: (col + 1) * 10,  // e.g. 10, 20, 30... (% of canvas width)
      y: (row + 1) * 10,  // e.g. 10, 20, 30... (% of canvas height)
      infected: false
    });
  }
}

generatePopulation(400);
// end AI-generated

// infect a random one...

let patientZero = population[Math.floor(Math.random() * population.length)];
patientZero.infected = true;

gi.addDrawing(function ({ ctx }) {
  // Draw text...
  ctx.fillStyle = 'yellow';
  ctx.fillText(
    `
Round: ${roundCount}
Population: ${population.length}
Infection Rate: ${infectionRate}
    `, 20, 20
  )
});

gi.addDrawing(function ({ ctx, width, height }) {
  // AI-generated: convert % position to canvas pixels
  let radius = (Math.min(width, height / 2) / numCols) * 0.4;
  // Draw population...
  for (let person of population) {
    if (person.infected) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'green';
    }
    let px = (person.x / population.length) * (width * 0.9);   // e.g. x=10 -> 10% of width (adjusted to 90% to leave padding)
    let py = 20 + (person.y / population.length) * (height / 2 * 0.9);  // e.g. y=10 -> 10% of height (adjusted to 90% to leave padding)
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  // end AI-generated
});

gi.addDrawing(function ({ ctx, width, height }) {
  let topOfGraph = height / 2;
  let bottomOfGraph = height * 0.9;
  let leftOfGraph = width * 0.1;
  let rightOfGraph = width * 0.9;
  let graphWidth = rightOfGraph - leftOfGraph;
  let graphHeight = bottomOfGraph - topOfGraph;

  // AI-generated: draw axes
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(leftOfGraph, topOfGraph);
  ctx.lineTo(leftOfGraph, bottomOfGraph);
  ctx.lineTo(rightOfGraph, bottomOfGraph);
  ctx.stroke();

  // Bar width: default to 20 rounds, shrink if we have more
  let maxRounds = Math.max(20, infectedPerRound.length);
  let barWidth = graphWidth / maxRounds;

  // Draw one bar per round
  for (let i = 0; i < infectedPerRound.length; i++) {
    let barHeight = (infectedPerRound[i] / population.length) * graphHeight;
    let barX = leftOfGraph + i * barWidth;
    let barY = bottomOfGraph - barHeight;
    ctx.fillStyle = 'orange';
    ctx.fillRect(barX, barY, barWidth - 2, barHeight);
  }
  // end AI-generated
})


const topBar = gi.addTopBar();
topBar.addSlider(
  {
    label: 'Infection Rate',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.5,
    oninput: function (value) {
      infectionRate = value;
    }
  }
);

function updatePopulation(population, infectionRate) {
  let toInfect = [];
  for (let person of population) {
    // Each person picks another person to shake hands with...
    let other = population[Math.floor(Math.random() * population.length)];
    if (person.infected && !other.infected) {
      // Infected person can infect the other person based on infectionRate
      if (Math.random() < infectionRate) {
        toInfect.push(person);
      }
    } else if (!person.infected && other.infected) {
      // Other person can infect this person based on infectionRate
      if (Math.random() < infectionRate) {
        toInfect.push(person);
      }
    }
  }
  // wait to actually infect them until
  // the end of the round, so the disease doesn't
  // propagate within a single round.
  for (let person of toInfect) {
    person.infected = true;
  }
  return population;
}

topBar.addButton(
  {
    text: 'Next Round',
    onclick: function () {
      roundCount++;
      population = updatePopulation(population, infectionRate);
      // Count how many are infected and record it for the graph
      let infectedCount = 0;
      for (let person of population) {
        if (person.infected) {
          infectedCount++;
        }
      }
      infectedPerRound.push(infectedCount);
    }
  }
);

topBar.addButton({
  text: 'Reset',
  onclick: function () {
    for (let p of population) {
      p.infected = false;
    };
    let patientZero = population[Math.floor(Math.random() * population.length)];
    patientZero.infected = true;
    roundCount = 0;
    infectedPerRound = [1];
  }
})


/* Run the game */
gi.run();


