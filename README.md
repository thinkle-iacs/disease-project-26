# Simple Canvas Game

## About this Project

In this project, your goal is to create a simple game. That means you'll need:

(1) User interaction
(2) A "goal" (something the user is trying to do)
(3) Feedback (something that tells the user how they're doing)

Your goal should be to come up with a _new_ game: please don't simply reimplement Pong or a well known existing game. I recommend taking inspiration from drawings or animations you've done in our intro to canvas drawing as you build your games. You can also come up with your own twist on an existing game.

Sample game ideas might include:

(1) Creative ideas using trig functions and circular motion, such as... - e.g. define spiral motion and try to "hit" a target by "rolling" an object in a spiral path
(2) Creative ideas using simple bouncing motions such as...

- Trying to bounce a ball into a moving target
- Trying to keep a ball "in the air" by bouncing it off a moving platform
  (3) Creative ideas using user interaction such as...
- Trying to "catch" falling objects by moving a basket left/right
- Trying to "dodge" falling objects by moving a character left/right
- Trying to "collect" falling objects by moving a character left/right

## Planning and Requirements

You should have done pen-and-paper planning _before_ you start this project. The key concepts you need to think through ahead of time are:

### 1. Variables

What variables will you need to track the game state? For example, you might need variables for:

- Player position
- Score
- Number of lives
- Positions of falling objects
- Velocity of moving objects

You should try to design your game to be simple enough that the "state" of the game can be tracked with a small number (<10) of variables.

### 2. Drawing Functions

You can add as many drawing functions as you need to your game. It's usually simplest to think of each object as a drawing. Think about what variables you need to draw each object. For example, to draw a player character, you might need:

- x position
- y position
- size

### 3. User Interaction (event handlers)

What user interactions will you need to handle? For example, you might need:

- Key presses (e.g. left/right arrows to move a character)
- Mouse clicks (e.g. to start the game or interact with objects)
- Mouse movement (e.g. to move a character with the mouse)

You can add as many event handlers as you need. The typical pattern is that you will _update a variable_ in the event handler, and then use that variable in your drawing functions to change what is drawn.

### 4. Utility Functions / Extra Logic

Do you need any extra functions to help with game logic? For example, you might want a function to:

- Check for collisions between objects
- Update the score
- Reset the game state

### About Functions

A good rule of thumb is a function should "fit" on a screen. If you find yourself scrolling a lot to read a function, it's probably too big and should be broken up into smaller functions that each do one specific thing. For example, you might have a single function in charge of drawing a bouncing ball that grows too long. You could break that function up into smaller parts like:

1. A function to update the ball's position based on velocity.
2. A function to check for collisions with walls and reverse velocity.
3. A function to draw the ball at its current position.

This makes your code easier to read, easier to debug, and easier to reuse.

## Assessment Criteria

Your project will be assessed based on the following criteria:

1. Do you use functions effectively to organize your code?

- Proficient (3): Functions are used to break code into logical sections, each with a clear purpose.
- Mastery (4): Function names are descriptive and always use a verb. Sub-functions are used to break complex
  tasks into simpler steps. Student uses functions with parameters and/or return values.

2. Do you use variables effectively to track game state?
   - Proficient (3): Variables are used to track key game state (e.g. player position, score).
   - Mastery (4): Variables have descriptive names that clearly indicate their purpose. Constants are used to avoid
     "magic numbers" in code (e.g. using `const GRAVITY = 0.5` instead of just `0.5`). Variable names help make
     the code "self documenting" (i.e. it's easy to see what's happening just by reading the code).
3. Do you implement user interaction effectively?
   - Proficient (3): User interaction is implemented using appropriate event handlers (e.g. keydown, click).
   - Mastery (4): Student has thought through details of interaction such as edge cases (e.g. what happens if multiple keys are
     pressed at once). Student also includes a clear way to start/restart the game (e.g. a start screen or restart button after
     the game ends).
4. Is your game fun and engaging to play?
   - Proficient (3): The game has a clear goal and provides feedback to the player (e.g. score, lives).
   - Mastery (4): The game includes additional features that enhance engagement (e.g. levels, increasing difficulty, easter eggs).
5. Is your code well organized and easy to read?
   - Proficient (3): Code is organized into functions and uses consistent indentation and spacing.
   - Mastery (4): Code includes extensive comments that show understanding of code and suggest student followed a "comment first" approach to writing (i.e. you first wrote comments laying out your plan, then wrote the code).

## A Note on AI

Note: I have provided Copilot with instructions for helping you on this project. Because Copilot here knows all about the project and library we are using, I recommend using Copilot _within your editor_ and _NOT_ using outside tools like ChatGPT to help you with this project. Using ChatGPT or similar tools may lead to confusion because they don't have the context of our specific library and project setup.

Whenever you use AI, you need to cite your sources. If you use Copilot to help you write code, please add a comment in your code like this:

```javascript
// Code generated with the help of GitHub Copilot
// in response to prompt: "...summary of prompt..."
// Begin generated code

// End generated code
```

When you use Copilot auto-complete, it is less obvious that you are using AI assistance, so please make sure to
add a general note at the top of your `main.js` file where you acknowledge how you used Copilot in the project.

I _recommend_ that you follow a "comment first" approach to writing your code. If before each line of code you
write a comment describing what you want to do, then you can use Copilot to help you fill in the code for each comment. This way, you are in control of the logic and structure of the code, and Copilot can help you with fussy
details like how you draw a circle on the canvas or other API details.

## Running project

To run project, use

```sh
npm run dev
```

### Your Code

Your code should live in `main.js`

### Demos

See demo.js for some sample code.

Simple Canvas Library home page here: https://thinkle.github.io/simple-canvas-library/
Source code of simple canvas library here: https://github.com/thinkle/simple-canvas-library/
