/* Demo 1: Grid-Based Random Pairing */
/* Game: Random Pairing Disease Simulation */
/* Authors: Demo Example */
/* Description: People are arranged in a grid. Each round, people are randomly */
/* paired up, and infections spread based on the infection rate. */
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
 * Generate a population arranged in a grid with random wiggle.
 * @param {number} p - population size
 */
function generatePopulation(p) {
  population = [];
  roundCount = 0;
  infectedPerRound = [1];

  // Calculate grid dimensions
  numCols = Math.ceil(Math.sqrt(p)) * 2;
  let numRows = Math.ceil(p / numCols);

  for (let i = 0; i < p; i++) {
    let col = i % numCols;
    let row = Math.floor(i / numCols);

    // Calculate the cell size for this grid
    let cellWidth = 100 / numCols;
    let cellHeight = 100 / numRows;

    // Base position (centered in cell)
    let baseX = (col + 1) * cellWidth;
    let baseY = (row + 1) * cellHeight;

    // Add random wiggle within half the cell size
    let wiggleX = (Math.random() - 0.3) * cellWidth;
    let wiggleY = (Math.random() - 0.3) * cellHeight;

    population.push({
      x: baseX + wiggleX,
      y: baseY + wiggleY,
      infected: false
    });
  }

  // Infect patient zero
  let patientZero = population[Math.floor(Math.random() * population.length)];
  patientZero.infected = true;
}

generatePopulation(400);


/* ============================================================
 * DRAWING: CONNECTIONS
 *
 * Draw lines showing who is paired with whom each round.
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
 * Draw the population as colored circles.
 * ============================================================ */
function drawSimulation(ctx, bounds) {
  let boundsWidth = bounds.right - bounds.left;
  let boundsHeight = bounds.bottom - bounds.top;
  let radius = Math.max(3, (Math.min(boundsWidth, boundsHeight) / numCols) * 0.6);

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

gi.addDrawing(function ({ ctx, width, height }) {
  let simBounds = {
    top: 10,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawConnections(ctx, simBounds);
  drawSimulation(ctx, simBounds);
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
 * SIMULATION LOGIC
 *
 * updatePopulation: Randomly pair up people and spread infection.
 * This is a CREATE task function with parameters, sequencing,
 * selection, and iteration.
 * ============================================================ */
function updatePopulation(population, infectionRate) {
  connections = [];
  let toInfect = [];
  let unconnected = population.slice();

  // Pair up people randomly
  while (unconnected.length > 1) {
    let person = unconnected[Math.floor(Math.random() * unconnected.length)];
    let other = unconnected[Math.floor(Math.random() * unconnected.length)];

    // Make sure we don't pair someone with themselves
    while (other == person) {
      other = unconnected[Math.floor(Math.random() * unconnected.length)];
    }

    let connection = { person, other, color: '#222', weight: 1 };

    // Check if infection spreads
    if (person.infected && !other.infected) {
      if (Math.random() < infectionRate) {
        toInfect.push(other);
        connection.color = 'red';
        connection.weight = 3;
      } else {
        connection.color = 'yellow';
      }
    } else if (!person.infected && other.infected) {
      if (Math.random() < infectionRate) {
        toInfect.push(person);
        connection.color = 'red';
        connection.weight = 3;
      } else {
        connection.color = 'yellow';
      }
    }

    if (person.infected && other.infected) {
      connection.color = '#400';
    }

    // Remove both people from the unconnected list
    unconnected = unconnected.filter(
      function (p) {
        return p !== other && p !== person;
      }
    );

    connections.push(connection);
  }

  // Infect people at the end of the round
  for (let person of toInfect) {
    person.infected = true;
  }

  return population;
}


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

topBar.addButton({
  text: 'Next Round',
  onclick: function () {
    roundCount++;
    numberInput.disable();
    population = updatePopulation(population, infectionRate);

    // Count infected for graph
    let infectedCount = 0;
    for (let person of population) {
      if (person.infected) {
        infectedCount++;
      }
    }
    infectedPerRound.push(infectedCount);
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
    numberInput.enable();
    infectedPerRound = [1];
  }
});


gi.run();


