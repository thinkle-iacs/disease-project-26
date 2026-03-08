/* Demo 2: Moving Agents with Proximity-Based Infection */
/* Game: Proximity Disease Simulation */
/* Authors: Demo Example */
/* Description: People move around the space randomly. When an infected person */
/* comes near a healthy person, they may spread the infection based on proximity. */
/* Citations: simple-canvas-library */

import "./style.css";
import { GameInterface } from 'simple-canvas-library';

let gi = new GameInterface();


/* ============================================================
 * STATE
 * ============================================================ */

let connections = [];
let population = [];
let infectionRate = 0.5;
let roundCount = 0;
let infectedPerRound = [1];
let numCols = 10;
let lastCheck = 0;
let simulationDone = false;


/* ============================================================
 * COORDINATE HELPER
 *
 * See main.js for full documentation of percentToPixels.
 * ============================================================ */
function percentToPixels(x, y, bounds) {
  return {
    x: bounds.left + (x / 100) * (bounds.right - bounds.left),
    y: bounds.top + (y / 100) * (bounds.bottom - bounds.top),
  };
}


/* ============================================================
 * INITIALIZATION
 * ============================================================ */

/**
 * Generate a population with random positions and velocities.
 * @param {number} p - population size
 */
function generatePopulation(p) {
  population = [];
  roundCount = 0;
  infectedPerRound = [1];
  simulationDone = false;
  lastCheck = 0;

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


/* ============================================================
 * SIMULATION LOGIC
 *
 * updatePopulation: Check for proximity-based infections.
 * Uses spatial partitioning (region map) for efficiency.
 * This is a CREATE task function with parameters, sequencing,
 * selection, and iteration.
 * ============================================================ */
function updatePopulation(population, infectionRate) {
  let toInfect = [];
  connections = [];

  // Infection range scales DOWN as population grows
  let range = 100 / Math.sqrt(population.length);

  // Spatial partitioning: group people by region
  let regionMap = {}
  for (let person of population) {
    let xZone = Math.round(person.x / (range * 3));
    let yZone = Math.round(person.y / (range * 3));
    const key = `${xZone}-${yZone}`;
    if (!regionMap[key]) {
      regionMap[key] = []
    }
    regionMap[key].push(person);
  }

  // Check each region for infections
  for (let key in regionMap) {
    let infected = [];
    let uninfected = [];

    // Separate infected and uninfected
    for (let person of regionMap[key]) {
      if (person.infected) {
        infected.push(person);
      } else {
        uninfected.push(person);
      }
    }

    // Check if infected people are close enough to spread disease
    if (infected.length && uninfected.length) {
      for (let infectedPerson of infected) {
        for (let uninfectedPerson of uninfected) {
          let distance = Math.hypot(
            infectedPerson.x - uninfectedPerson.x,
            infectedPerson.y - uninfectedPerson.y
          );

          if (distance < range) {
            if (Math.random() < infectionRate) {
              toInfect.push(uninfectedPerson);
              connections.push({
                person: infectedPerson,
                other: uninfectedPerson,
                color: 'red',
                weight: 3
              });
            } else {
              connections.push({
                person: infectedPerson,
                other: uninfectedPerson,
                color: 'yellow',
                weight: 1
              });
            }
          }
        }
      }
    }
  }

  // Infect people at the end of the round
  for (let person of toInfect) {
    person.infected = true;
  }

  return population;
}


/**
 * Move all people according to their velocity.
 * Bounce off walls.
 * @param {number} stepTime - milliseconds since last frame
 */
function movePopulation(stepTime) {
  for (let person of population) {
    person.x += person.vx * stepTime * 0.001;
    person.y += person.vy * stepTime * 0.001;

    // Bounce off walls
    if (person.x > 100) {
      person.x = 100;
      person.vx *= -1;
    }
    if (person.y > 100) {
      person.y = 100;
      person.vy *= -1;
    }
    if (person.x < 0) {
      person.x = 0;
      person.vx *= -1;
    }
    if (person.y < 0) {
      person.y = 0;
      person.vy *= -1;
    }
  }
}


/* ============================================================
 * DRAWING: CONNECTIONS
 *
 * Draw lines showing who is near whom and transmitting.
 * ============================================================ */
function drawConnections(ctx, bounds) {
  for (let { person, other, color, weight } of connections) {
    let personCoords = percentToPixels(person.x, person.y, bounds);
    let otherCoords = percentToPixels(other.x, other.y, bounds);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineWidth = weight;
    ctx.moveTo(personCoords.x, personCoords.y);
    ctx.lineTo(otherCoords.x, otherCoords.y);
    ctx.stroke();
  }
}


/* ============================================================
 * DRAWING: SIMULATION
 *
 * Draw the moving population as colored circles.
 * Also handles movement and automatic round progression.
 * ============================================================ */
function drawSimulation(ctx, bounds, elapsed, stepTime) {
  let boundsWidth = bounds.right - bounds.left;
  let boundsHeight = bounds.bottom - bounds.top;

  // Auto-update simulation each second
  if (!simulationDone && (elapsed - lastCheck) > 1000) {
    updatePopulation(population, infectionRate);
    roundCount++;
    let infected = 0;
    for (let person of population) {
      if (person.infected) {
        infected++;
      }
    }
    infectedPerRound.push(infected);
    if (infected === population.length) {
      simulationDone = true;
    }
    lastCheck = elapsed;
  }

  // Move people
  if (!simulationDone) {
    movePopulation(stepTime);
  }

  // Draw people
  let radius = Math.max(3, (Math.min(boundsWidth, boundsHeight) / numCols) * 0.3);
  for (let person of population) {
    if (person.infected) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'green';
    }
    let coordinates = percentToPixels(person.x, person.y, bounds);
    ctx.beginPath();
    ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}


/* ============================================================
 * DRAWING: GRAPH
 *
 * Draw a bar chart showing infections over time.
 * ============================================================ */
function drawGraph(data, dataMax, ctx, bounds) {
  let graphWidth = bounds.right - bounds.left;
  let graphHeight = bounds.bottom - bounds.top;

  // Draw axes
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bounds.left, bounds.top);
  ctx.lineTo(bounds.left, bounds.bottom);
  ctx.lineTo(bounds.right, bounds.bottom);
  ctx.stroke();

  // Bar width: default to 20 rounds, shrink if we have more
  let maxRounds = Math.max(20, data.length);
  let barWidth = graphWidth / maxRounds;

  // Draw total infected bars (orange)
  for (let i = 0; i < data.length; i++) {
    let barHeight = (data[i] / dataMax) * graphHeight;
    let barX = bounds.left + i * barWidth;
    let barY = bounds.bottom - barHeight;
    ctx.fillStyle = 'orange';
    ctx.fillRect(barX, barY, barWidth - 2, barHeight);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${data[i]}`,
      barX + barWidth / 2,
      barY - 10
    );
  }

  // Draw new infections (red bars on top)
  for (let i = 0; i < data.length; i++) {
    let newInfections = data[i] - (data[i - 1] || 0);
    let barHeight = (newInfections / dataMax) * graphHeight;
    let barX = bounds.left + i * barWidth;
    let barY = bounds.bottom - barHeight;
    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, barWidth - 2, barHeight);
  }
}


/* ============================================================
 * DRAWING: HUD
 *
 * Draw text overlays showing game state.
 * ============================================================ */
function drawHUD(ctx) {
  ctx.fillStyle = 'yellow';
  ctx.textAlign = "left";
  ctx.fillText(
    `Round: ${roundCount}
Population: ${population.length}
Infection Rate: ${infectionRate}`,
    20, 20
  );
}


/* ============================================================
 * REGISTERED DRAWING CALLBACKS
 * ============================================================ */

gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  let simBounds = {
    top: 10,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawConnections(ctx, simBounds);
  drawSimulation(ctx, simBounds, elapsed, stepTime);
});

gi.addDrawing(function ({ ctx, width, height }) {
  let graphBounds = {
    top: height / 2 + 10,
    bottom: height * 0.9,
    left: width * 0.1,
    right: width * 0.9,
  };
  drawGraph(infectedPerRound, population.length, ctx, graphBounds);
});

gi.addDrawing(function ({ ctx }) {
  drawHUD(ctx);
});


/* ============================================================
 * CONTROLS
 * ============================================================ */

let topBar = gi.addTopBar();

topBar.addSlider({
  label: 'Infection Rate',
  min: 0,
  max: 1,
  step: 0.01,
  value: 0.5,
  oninput: function (value) {
    infectionRate = value;
  }
});

let numberInput = topBar.addNumberInput({
  label: 'Population Size',
  min: 12,
  max: 10000,
  value: population.length,
  oninput: function (value) {
    generatePopulation(value);
  }
});

topBar.addButton({
  text: 'Reset',
  onclick: function () {
    for (let p of population) {
      p.infected = false;
    }
    let patientZero = population[Math.floor(Math.random() * population.length)];
    patientZero.infected = true;
    roundCount = 0;
    connections = [];
    simulationDone = false;
    lastCheck = 0;
    numberInput.enable();
    infectedPerRound = [1];
  }
});


gi.run();


