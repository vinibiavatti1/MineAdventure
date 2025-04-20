$(() => {
    document.oncontextmenu = function() {return false;};
    $("#reset-btn").on("click", resetButtonClick);
    $("#next-btn").on("click", nextButtonClick);
    initGame();
});

const FIRST_LEVEL = 1;
const MAX_LIVES = 50;
const LEVELS = [
    LEVEL_1,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4,
    LEVEL_5,
    LEVEL_6,
    LEVEL_7,
    LEVEL_8,
    LEVEL_9,
    LEVEL_10,
    LEVEL_11,
    LEVEL_12,
    LEVEL_13,
    LEVEL_14,
    LEVEL_15,
    LEVEL_16,
    LEVEL_17,
    LEVEL_18,
    LEVEL_19,
    LEVEL_20,
    LEVEL_21,
    LEVEL_22,
    LEVEL_23,
    LEVEL_24,
    LEVEL_25,
    LEVEL_26,
    LEVEL_27,
    LEVEL_28,
    LEVEL_29,
    LEVEL_30,
]
const TILE_TYPES = {
    UNEXPLORED: "-",
    NONE: "0",
    MINE: "B",
    BOMB: "X",
}
const MARKER_TYPES = {
    FLAG: "F",
    UNKNOWN: "?",
}
const BUTTON_TYPES = {
    LEFT: 0,
    RIGHT: 2,
}

let currentLevel = FIRST_LEVEL;
let currentMap = [];
let levelOver = false;
let gameOver = false;
let done = false;
let height = 0;
let width = 0;
let lives = MAX_LIVES;
let markers = {};

function initGame() {
    currentLevel = FIRST_LEVEL;
    lives = MAX_LIVES;
    levelOver = false;
    gameOver = false;
    initLevel();
}

function initLevel() {
    levelOver = false;
    const levelMap = LEVELS[currentLevel - 1];
    currentMap = levelMap.map(row => row.slice());
    height = currentMap.length;
    width = currentMap[0].length;
    markers = {};
    done = false;
    $("#bombs-n").text(countBombs());
    renderLevel();
}

function renderLevel() {
    $("#level").empty();
    for (let y = 0; y < height; y++) {
        const row = $("<tr>");
        for (let x = 0; x < width; x++) {
            const tile = getTile(x, y);
            const tileEl = $("<td>");
            tileEl.addClass("tile border border-2");
            switch (tile) {
                case TILE_TYPES.UNEXPLORED:
                case TILE_TYPES.MINE:
                    tileEl.addClass("tile-empty");
                    $(tileEl).on("mousedown", click);
                    break;
                case TILE_TYPES.NONE:
                    tileEl.addClass("tile-0");
                    break;
                case TILE_TYPES.BOMB:
                    tileEl.addClass("tile-bomb");
                    tileEl.text("B");
                    break;
                default:
                    tileEl.addClass("tile-" + tile);
                    tileEl.text(tile);
                    break;
            }
            tileEl.attr("data-x", x);
            tileEl.attr("data-y", y);
            row.append(tileEl);
        }
        $("#level").append(row);
    }
    $("#level-n").text(currentLevel);
    $("#lives-n").text(lives);
    renderMarkers();
}

function renderMarkers() {
    for (const [key, value] of Object.entries(markers)) {
        const x = parseInt(key.split(",")[0]);
        const y = parseInt(key.split(",")[1]);
        const tileEl = $(`td[data-x="${x}"][data-y="${y}"]`);
        const tile = getTile(x, y);
        if (tile != TILE_TYPES.UNEXPLORED && tile != TILE_TYPES.MINE) {
            continue;
        }
        switch (value) {
            case MARKER_TYPES.FLAG:
                tileEl.addClass("tile-flag");
                tileEl.text("B");
                break;
            case MARKER_TYPES.UNKNOWN:
                tileEl.addClass("tile-unknown");
                tileEl.text("?");
                break;
            default:
                return;
        }
    }
}

function click(evt) {
    if (gameOver || levelOver || done) {
        return;
    }
    let x = $(this).attr("data-x");
    let y = $(this).attr("data-y");
    x = parseInt(x);
    y = parseInt(y);
    if (evt.button == BUTTON_TYPES.RIGHT) {
        processRightClick(x, y);
    } else {
        processTile(x, y);
        if(isLevelDone()) {
            processLevelDone();
        }
    }
    renderLevel();
}

function processRightClick(x, y) {
    if (!isValidPosition(x, y)) {
        return;
    }
    const tile = getTile(x, y);
    if (tile != TILE_TYPES.UNEXPLORED && tile != TILE_TYPES.MINE) {
        return;
    }
    const marker = getMarker(x, y);
    if (!marker) {
        setMarker(x, y, MARKER_TYPES.FLAG);
        return;
    }
    switch (marker) {
        case MARKER_TYPES.FLAG: setMarker(x, y, MARKER_TYPES.UNKNOWN); break;
        case MARKER_TYPES.UNKNOWN: setMarker(x, y, null); break;
        default: return;
    }
}

function processTile(x, y) {
    if (!isValidPosition(x, y)) {
        return;
    }
    const tile = getTile(x, y);
    switch (tile) {
        case TILE_TYPES.UNEXPLORED: processUnexploredTile(x, y); return;
        case TILE_TYPES.MINE: processBombTile(x, y); return;
    }
}

function processUnexploredTile(x, y) {
    const bombs = countNeighbourBombs(x, y);
    if (bombs != 0) {
        setTile(x, y, bombs.toString());
        return;
    }
    setTile(x, y, TILE_TYPES.NONE);
    processTile(x-1, y-1);
    processTile(x-0, y-1);
    processTile(x+1, y-1);
    processTile(x-1, y-0);
    processTile(x+1, y-0);
    processTile(x-1, y+1);
    processTile(x-0, y+1);
    processTile(x+1, y+1);
}

function processBombTile(x, y) {
    setTile(x, y, TILE_TYPES.BOMB);
    levelOver = true;
    $("#reset-btn").attr("disabled", false);
    alert("BOOM! You hit a bomb!");
    lives--;
    if (lives <= 0) {
        alert("Game Over :(");
        gameOver = true;
    }
}

function countNeighbourBombs(x, y) {
    let count = 0;
    const targets = [
        isMine(x-1, y-1),
        isMine(x-0, y-1),
        isMine(x+1, y-1),
        isMine(x-1, y-0),
        isMine(x+1, y-0),
        isMine(x-1, y+1),
        isMine(x-0, y+1),
        isMine(x+1, y+1),
    ]
    targets.forEach((bomb) => {
        if (bomb) {
            count++;
        }
    });
    return count;
}

function isMine(x, y) {
    if (!isValidPosition(x, y)) {
        return false;
    }
    return getTile(x, y) == TILE_TYPES.MINE;
}

function isValidPosition(x, y) {
    return y >= 0 && y < height && x >= 0 && x < width;
}

function resetButtonClick() {
    $("#reset-btn").attr("disabled", true);
    if (gameOver) {
        initGame();
        return;
    }
    initLevel();
}

function setTile(x, y, type) {
    if (!isValidPosition(x, y)) {
        return;
    }
    currentMap[y][x] = type;
}

function getTile(x, y) {
    if (!isValidPosition(x, y)) {
        return null;
    }
    return currentMap[y][x];
}

function setMarker(x, y, type) {
    if (!isValidPosition(x, y)) {
        return;
    }
    if (!type) {
        delete markers[`${x},${y}`];
        return;
    }
    markers[`${x},${y}`] = type;
}

function getMarker(x, y) {
    if (!isValidPosition(x, y)) {
        return null;
    }
    return markers[`${x},${y}`];
}

function isLevelDone() {
    if (gameOver || levelOver) {
        return false;
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = getTile(x, y);
            if (tile == TILE_TYPES.UNEXPLORED) {
                return false;
            }
        }
    }
    return true;
}

function processLevelDone() {
    done = true;
    alert("Level completed!");
    $("#next-btn").attr("disabled", false);
}

function nextButtonClick() {
    if (currentLevel == 24) {
        let link = atob('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/c2NhX2Vzdj1kM2U0N2Y1YzQxZGFkMjhlJnJsej0xQzFHQ0NBX2VuJnN4c3JmPUFIVG44enE2UWZGQ09ZT2dhb2wtUjhGYWFiRGppMlVLM3c6MTc0NTE1ODQ2NDk4NyZxPWhvbWVucytkZStzdW5nYSZ1ZG09MiZmYnM9QUJ6T1RfQ1dkaFFMUDFGY21VNUIwZm4zeHVXcEEtZGs0d3BCV09Hc29SN0RHNXpKQnRtdUVkaGZ5d3l6aGVuZGtMRG5oY3JHdjBidnNGMDJQRTl3QWdhblEtZjFkSmpPclVHT0h5b2Nadm1YajZMaE90TlUxV3NzMmNBZEZ2V29yZFN0WDJVbXl3MF80bFowdGtwVGF6Z1JKRmpXcGloelpyRGFYNzVMWkNfMWpqVGRwMW9CaXJUZmJSNmhVY3Q3QlR0NmFPYS1lU0czJnNhPVgmdmVkPTJhaFVLRXdqUm9JZno1ZWFNQXhWM2J2RURIYU5vQnBFUXRLZ0xlZ1FJRUJBQiZiaXc9MTkyMCZiaWg9OTQ1JmRwcj0x');
        window.open(link, '_blank');
    }
    $("#next-btn").attr("disabled", true);
    currentLevel++;
    if (currentLevel > LEVELS.length) {
        alert("You completed all levels! Congratulations!!!");
        initGame();
        return;
    }
    initLevel();
}

function countBombs() {
    let count = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (getTile(x, y) == TILE_TYPES.MINE) {
                count++;
            }
        }
    }
    return count;
}