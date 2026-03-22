/**
 * SPRITESHEET VIEWER
 * Developed by Franklan Taylor
 * Created March 20th, 2026
 * 
 * This is the webpage functionality for our spritesheet and animation viewer. Things like uploading a spritesheet, pausing,
 * and examining current frames are all implemented here.
 */


//// GET ELEMENTS ////
const CANVAS = document.getElementById("sprite-canvas");
const CONTEXT = CANVAS.getContext("2d");

const OUTPUT = document.getElementById("output");

// Option elements
const FORM = document.options;
const CONTROLS = document.controls;

//// GLOBAL VARIABLES ////
let SPRITE_FRAME_RATE = 12;                                            
const CANVAS_WIDTH = CANVAS.getAttribute("width");
const CANVAS_HEIGHT = CANVAS.getAttribute("height");

let FRAME_COUNT = 0;
let SPRITE_COL_COUNT = 0;
let SPRITE_ROW_COUNT = 0;
let SHEET_WIDTH = 0;
let SHEET_HEIGHT = 0;

let SPRITE_WIDTH = (SHEET_WIDTH / SPRITE_COL_COUNT);
let SPRITE_HEIGHT = (SHEET_HEIGHT / SPRITE_ROW_COUNT);

let SCALE = 1;

let cSpriteCol = 0;
let cSpriteRow = 0;
let cFrame = 0;

let isPaused = false;

let backgroundColor = "white";

let SPRITESHEET = new Image(2000, 2000);
SPRITESHEET.src = "./assets/Boss_Spritesheet.png";


function runSprites() { 
    // CLEAR RECT FIRST
    CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // BACKGROUND
    CONTEXT.fillStyle = backgroundColor;
    CONTEXT.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // DRAW THE SPRITE  
    CONTEXT.drawImage(
        SPRITESHEET,                                    // IMAGE
        cSpriteCol * SPRITE_WIDTH,                      // SX
        cSpriteRow * SPRITE_HEIGHT,                     // SY
        SPRITE_WIDTH,                                   // SWIDTH
        SPRITE_HEIGHT,                                  // SHEIGHT
        0,                                              // DX
        0,                                              // DY
        SPRITE_WIDTH * SCALE,                           // DWIDTH
        SPRITE_HEIGHT * SCALE                           // DHEIGHT
    );

    // advance frames only if not paused
    if (isPaused === false) {
        cFrame++;
        cSpriteCol++;
    }

    //console.log("Current Column: " + cSpriteCol + " | Current Row: " + cSpriteRow + " | Current Frame: " + cFrame);

    // current sprite col is greater than the number of columsn within the spritesheet so move to the next row of the sheet
    if (cSpriteCol >= SPRITE_COL_COUNT && isPaused === false) {
        cSpriteRow++;
        cSpriteCol = 0;
    }

    // reset loop
    if (cFrame >= FRAME_COUNT && isPaused === false) {
        cFrame = 0;
        cSpriteCol = 0;
        cSpriteRow = 0;
    }
}

// RESIZE THE CANVAS WHEN THE PAGE LOADS
window.onload = function() {
    // CANVAS.setAttribute("width", "" + (SPRITE_WIDTH * SCALE) * 2);
    // CANVAS.setAttribute("height", "" + (SPRITE_HEIGHT * SCALE) * 2);
    CANVAS.setAttribute("width", "" + SPRITE_WIDTH * SCALE);
    CANVAS.setAttribute("height", "" + SPRITE_HEIGHT * SCALE);
}

// CONTROLS
CONTROLS.prevFrame.onclick = function() {
    cFrame--;
    cSpriteCol--;

    // if we are on the first col, go to the last column of the previous row
    if (cSpriteCol < 0) {
        cSpriteCol = SPRITE_COL_COUNT - 1;
        
        // if we cant go back anymore rows, keep it at row 0, col 0
        if (cSpriteRow <= 0) {
            cSpriteRow = SPRITE_ROW_COUNT - 1;
            //cSpriteCol = 0;
        } else {
            cSpriteRow--;
        }
    }

    if (cFrame < 0) {
        cFrame = 0;
    }

    console.log(cFrame);
    console.log(cSpriteCol);
}

CONTROLS.pausePlay.onclick = function() {
    if (isPaused === false) {
        isPaused = true;
        CONTROLS.pausePlay.value = "Play";
    } else {
        isPaused = false;
        CONTROLS.pausePlay.value = "Pause";
    }

    console.log(isPaused);
}

CONTROLS.nextFrame.onclick = function() {
    cFrame++;
    cSpriteCol++;

    if (cSpriteCol >= SPRITE_COL_COUNT) {
        cSpriteRow++;
        cSpriteCol = 0;
    }

    // reset loop
    if (cFrame >= FRAME_COUNT) {
        cFrame = 0;
        cSpriteCol = 0;
        cSpriteRow = 0;
    }
}

// WHEN THE REFRESH BUTTON IS PRESSED
FORM.refresh.onclick = function() {
    // clear old errors
    OUTPUT.innerHTML = "";

    let properFileRegex = /.+((\.png)|(\.jpg)|(\.jpeg))/;

    let filePath = FORM.spritesheetFile.value;
    let file = FORM.spritesheetFile.files[0];

    // A file has not been chosen.
    if (filePath === "") {
        alert("The file path is empty..");
        return;
    }
    
    // The chosen file does not have the proper file type.
    if (filePath.match(properFileRegex) === null) {
        alert("The file type is not supported..");
        FORM.spritesheetFile.value = "";
        return;
    }

    // validate width and height inputs
    let sheetWidth = Number(FORM.spritesheetWidth.value);
    let sheetHeight = Number(FORM.spritesheetHeight.value);

    if (isNaN(sheetWidth) || isNaN(sheetHeight)) {
        let error = document.createElement("p");
        error.innerHTML = "<p style='color: red; font-style: underline;'>Please enter a whole number for the width and/or height of the spritesheet.</p?"
        OUTPUT.insertBefore(error, null);
        return;
    }

    // validate column and row inputs
    let columnCount = Number(FORM.spritesheetColumns.value);
    let rowCount = Number(FORM.spritesheetRows.value);

    if (isNaN(columnCount) || isNaN(rowCount)) {
        let error = document.createElement("p");
        error.innerHTML = "<p style='color: red; font-style: underline;'>Please enter a whole number for the column and/or row count</p?"
        OUTPUT.insertBefore(error, null);
        return;
    }

    // validate scale
    let scale = Number(FORM.spriteScale.value);

    if (isNaN(scale)) {
        let error = document.createElement("p");
        error.innerHTML = "<p style='color: red; font-style: underline;'>Please enter a whole number for the scale</p?"
        OUTPUT.insertBefore(error, null);
        return;
    }

    // make sure the input fields are not 0
    if (
        sheetWidth  <= 0 ||
        sheetHeight <= 0 || 
        columnCount <= 0 ||
        rowCount    <= 0 ||
        scale       <= 0 
    ) {
        let error = document.createElement("p");
        error.innerHTML = "<p style='color: red; font-style: underline;'>Scale, width, height, column, or rows must be a number greater than 0.</p?"
        OUTPUT.insertBefore(error, null);
        return;
    }

    // SET THE NEW PROPERTIES OF THE SPRITE SHEET
    SHEET_WIDTH = sheetWidth;
    SHEET_HEIGHT = sheetHeight;
    SPRITE_COL_COUNT = columnCount;
    SPRITE_ROW_COUNT = rowCount;
    FRAME_COUNT = SPRITE_COL_COUNT * SPRITE_ROW_COUNT;
    SCALE = scale;

    // CHANGE THE CANVAS SIZE TO THE SIZE OF THE SPRITE
    let spriteWidth = SHEET_WIDTH / SPRITE_COL_COUNT;
    let spriteHeight = SHEET_HEIGHT / SPRITE_ROW_COUNT;

    SPRITE_WIDTH = spriteWidth;
    SPRITE_HEIGHT = spriteHeight;

    // CANVAS.setAttribute("width", "" + SPRITE_WIDTH * SCALE * 2);
    // CANVAS.setAttribute("height", "" + SPRITE_HEIGHT * SCALE * 2);
    CANVAS.setAttribute("width", "" + SPRITE_WIDTH * SCALE);
    CANVAS.setAttribute("height", "" + SPRITE_HEIGHT * SCALE);

    cSpriteCol = 0;
    cSpriteRow = 0;
    cFrame = 0;

    // SPRITESHEET = new Image(sheetWidth, sheetHeight);
    SPRITESHEET.src = URL.createObjectURL(file);
    
    // successful, clear errors;
    // OUTPUT.innerHTML = "";
}

FORM.changeColor.onclick = function() {
    if (FORM.backgroundColor.value != "") {
        backgroundColor = FORM.backgroundColor.value;
    }
}


setInterval(runSprites, 1000/SPRITE_FRAME_RATE);