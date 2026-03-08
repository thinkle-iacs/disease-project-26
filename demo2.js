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
let connections = [];
let population = [];
let infectionRate = 0.5;
let roundCount = 0;
let infectedPerRound = [1];
let numCols = 10;

function generatePopulation(p) {
  population = [];
  roundCount = 0;
  infectedPerRound = [1];
  for (let i = 0; i < p; i++) {
    let person = {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      vx: Math.floor(Math.random() * 20) - 10,
      vy: Math.floor(Math.random() * 20) - 10,
      infected: i === 0, // literal patient zero
    }
    population.push(person);
  }

}


generatePopulation(400);





function getCoordinates(person, width, height) {
  let x = ((5 + person.x) / 100) * (width * 0.9);   // e.g. x=10 -> 10% of width (adjusted to 90% to leave padding)
  let y = 10 + (person.y / 100) * (height / 2 * 0.9);  // e.g. y=10 -> 10% of height (adjusted to 90% to leave padding)
  return { x, y }
}


// Draw connections
gi.addDrawing(function drawConnections({ ctx, width, height }) {
  for (let { person, other, color, weight } of connections) {
    let personCoords = getCoordinates(person, width, height);
    let otherCoords = getCoordinates(other, width, height);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineWidth = weight;
    ctx.moveTo(personCoords.x, personCoords.y);
    ctx.lineTo(otherCoords.x, otherCoords.y);
    ctx.stroke();
  }

});

let lastCheck = 0;
let simulationDone = false;
// Draw people
gi.addDrawing(function drawPeople({ ctx, width, height, stepTime, elapsed }) {

  if (!simulationDone && (elapsed - lastCheck) > 1000) {
    updatePopulation(population, infectionRate);
    roundCount++;
    let infected = population.filter(p => p.infected).length;
    infectedPerRound.push(infected);
    if (infected === population.length) {
      // All people are infected
      simulationDone = true;
    }
    lastCheck = elapsed;

  }
  if (!simulationDone) {
    // move the people...
    for (let person of population) {
      person.x += person.vx * stepTime * 0.001;
      person.y += person.vy * stepTime * 0.001;
      if (person.x > 100) {
        person.x = 100;
        person.vx *= -1
      }
      if (person.y > 100) {
        person.y = 100;
        person.vy *= -1
      }
      if (person.x < 0) {
        person.x = 0;
        person.vx *= -1
      }
      if (person.y < 0) {
        person.y = 0;
        person.vy *= -1
      }
    }
  }
  let radius = Math.max(3, (Math.min(width, height / 2) / numCols) * 0.3);
  // Draw population...
  for (let person of population) {
    if (person.infected) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'green';
    }
    let coordinates = getCoordinates(person, width, height);
    ctx.beginPath();
    ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

});


// Draw graph
gi.addDrawing(function drawGraph({ ctx, width, height }) {
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
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.fillText(
      `${infectedPerRound[i]}`,
      barX + barWidth / 2, barY - 10, // position text above the bar
    );
  }
  // Now let's add red bars for the new infections each round.
  for (let i = 0; i < infectedPerRound.length; i++) {
    let newInfections = infectedPerRound[i] - (infectedPerRound[i - 1] || 0);
    let barHeight = (newInfections / population.length) * graphHeight;
    let barX = leftOfGraph + i * barWidth;
    let barY = bottomOfGraph - barHeight;
    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, barWidth - 2, barHeight);
  }
  // end AI-generated
})


gi.addDrawing(function drawText({ ctx }) {
  // Draw text...
  ctx.fillStyle = 'yellow';
  ctx.textAlign = "left";
  ctx.fillText(
    `
Round: ${roundCount}
Population: ${population.length}
Infection Rate: ${infectionRate}
    `, 20, 20
  )
});

// UI for adjusting things
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
  connections = [];
  // Infection range scales DOWN as population grows
  // Uses square root so it doesn't shrink too fast
  // For 100 people: 100/10 = 10
  // For 400 people: 100/20 = 5
  // For 1600 people: 100/40 = 2.5
  let range = 100 / Math.sqrt(population.length);
  let regionMap = {}
  for (let person of population) {
    let xZone = Math.round(person.x / (range * 3));
    let yZone = Math.round(person.y / (range * 3));
    const key = `${xZone}-${yZone}`;
    if (!regionMap[key]) { regionMap[key] = [] }
    regionMap[key].push(person);
  }
  // Now go through each "region" and check for overlap...
  for (let key in regionMap) {
    let infected = [];
    let uninfected = [];
    // collect infected people
    for (let person of regionMap[key]) {
      if (person.infected) {
        infected.push(person);
      } else {
        uninfected.push(person);
      }
    }
    // if there are any infected people, then check
    // their distance from uninfected people
    if (infected.length && uninfected.length) {
      for (let infectedPerson of infected) {
        for (let uninfectedPerson of uninfected) {
          if (Math.hypot(infectedPerson.x - uninfectedPerson.x, infectedPerson.y - uninfectedPerson.y) < range) {
            // they are close enough to potentially infect... 
            if (Math.random() < infectionRate) {
              toInfect.push(uninfectedPerson);
              connections.push({ person: infectedPerson, other: uninfectedPerson, color: 'red', weight: 3 });
            } else {
              connections.push({ person: infectedPerson, other: uninfectedPerson, color: 'yellow', weight: 1 });
            }
          }
        }
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


let numberInput = topBar.addNumberInput(
  {
    label: 'Population Size',
    min: 12,
    max: 10000,
    value: population.length,
    oninput: function (value) {
      generatePopulation(value);
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
    connections = [];
    numberInput.enable();
    infectedPerRound = [1];
  }
})


/* Run the game */
gi.run();


