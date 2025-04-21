$(initGame);

const FIRST_LEVEL = 0;
const TILES = {
    BOMB: -3,
    MINE: -2,
    UNKNOWN: -1,
    CLEAR: 0,
}
const MARKERS = {
    FLAG: 1,
    UNKNOWN: 2,
}
const BUTTON_TYPES = {
    LEFT: 0,
    RIGHT: 2,
}

let currentLevelIndex = FIRST_LEVEL;
let currentLevel = LEVELS[currentLevelIndex];
let levelOver = false;
let levelDone = false;
let height = 0;
let width = 0;
let deaths = 0;
let levelMap = {};
let markers = {};
let playerName = "";
let running = false;
let time = {h: 0, m: 0, s: 0};

function initGame() {
    loadPlayerName();
    document.oncontextmenu = function() {return false;};
    $("#reset-btn").on("click", onResetClick);
    $("#start-btn").on("click", onStartClick);
    $("#next-btn").on("click", onNextClick);
    resetGame();
}

function resetGame() {
    currentLevelIndex = FIRST_LEVEL;
    currentLevel = LEVELS[currentLevelIndex];
    deaths = 0;
    running = false;
    time = {h: 0, m: 0, s: 0};
    $("#start-btn").attr("disabled", false);
    resetLevel()
}

function resetLevel() {
    levelOver = false;
    levelDone = false;
    markers = {};
    createLevelMap();
    render();
    markHintTile();
}

function createLevelMap() {
    levelMap = {};
    for (let y = 0; y < currentLevel.height; y++) {
        for (let x = 0; x < currentLevel.width; x++) {
            const key = posKey(x, y);
            if (currentLevel.mines.some(mine => mine.x === x && mine.y === y)) {
                levelMap[key] = TILES.MINE;
            } else {
                levelMap[key] = TILES.UNKNOWN;
            }
        }
    }
}

function render() {
    renderMap();
    renderData();
    renderMarkers();
}

function renderMap() {
    $("#map").empty();
    for (let y = 0; y < currentLevel.height; y++) {
        const row = $("<tr>");
        for (let x = 0; x < currentLevel.width; x++) {
            const tile = getTile(x, y);
            const el = createTile(x, y, tile);
            row.append(el);
        }
        $("#map").append(row);
    }
}

function renderData() {
    $("#level").html(currentLevelIndex + 1);
    $("#level-count").html(LEVELS.length);
    $("#deaths").html(deaths);
    $("#bombs").html(currentLevel.mines.length);
    $("#flags").html(Object.values(markers).filter(marker => marker === MARKERS.FLAG).length);
}

function renderMarkers() {
    for (const [key, value] of Object.entries(markers)) {
        const [x, y] = key.split(",").map(Number);
        const tile = getTile(x, y);
        if (tile != TILES.UNKNOWN && tile != TILES.MINE) {
            deleteMarker(x, y);
            continue;
        }
        const el = $(`.tile[data-x="${x}"][data-y="${y}"]`);
        if (value == MARKERS.FLAG) {
            el.text("F");
        } else if (value == MARKERS.UNKNOWN) {
            el.text("?");
        }
    }
}

function createTile(x, y, tile) {
    const spot = $("<td>");
    spot.addClass("tile-spot");
    const el = $("<div>"); 
    el.attr("data-x", x);
    el.attr("data-y", y);
    el.addClass("tile");
    switch (tile) {
        case TILES.UNKNOWN:
            el.addClass("tile-unknown");
            $(el).on("mousedown", onTileClick);
            break;
        case TILES.MINE:
            el.addClass("tile-mine");
            $(el).on("mousedown", onTileClick);
            break;
        case TILES.BOMB:
            el.addClass("tile-bomb");
            el.text("Ø");
            break;
        case TILES.CLEAR:
            el.addClass("tile-0");
            el.text("0");
            break;
        default:
            el.addClass("tile-" + tile); 
            el.text(tile);
            break;
    }
    spot.html(el);
    return spot;
}

function onTileClick(evt) {
    if (levelOver || levelDone || !running) {
        return;
    }
    let x = parseInt($(this).attr("data-x"));
    let y = parseInt($(this).attr("data-y"));
    if (evt.button == BUTTON_TYPES.LEFT) {
        processTile(x, y);
    } else if (evt.button == BUTTON_TYPES.RIGHT) {
        processMarker(x, y);
    }
    render();
    checkVictory();
}

function processTile(x, y) {
    if (hasFlag(x, y)) {
        return;
    }
    const tile = getTile(x, y);
    if (tile == TILES.UNKNOWN) {
        const bombs = countSurroundingMines(x, y);
        setTile(x, y, bombs);
        if (bombs === 0) {
            processTile(x-1, y-1);
            processTile(x-0, y-1);
            processTile(x+1, y-1);
            processTile(x-1, y-0);
            processTile(x+1, y-0);
            processTile(x-1, y+1);
            processTile(x-0, y+1);
            processTile(x+1, y+1);
        }
    } else if (tile === TILES.MINE) {
        processMine(x, y);
    }
}

function processMine(x, y) {
    alert("BOOM!");
    $("#reset-btn").attr("disabled", false);
    setTile(x, y, TILES.BOMB);
    levelOver = true;
    deaths++;
}

function processMarker(x, y) {
    const marker = getMarker(x, y);
    if (!marker) {
        setMarker(x, y, MARKERS.FLAG);
    } else if (marker === MARKERS.FLAG) {
        setMarker(x, y, MARKERS.UNKNOWN);
    } else if (marker === MARKERS.UNKNOWN) {
        deleteMarker(x, y);
    }
}

function isValidPosition(x, y) {
    return x >= 0 && x < currentLevel.width && y >= 0 && y < currentLevel.height;
}

function posKey(x, y) {
    return `${x},${y}`;
}

function getTile(x, y) {
    if (isValidPosition(x, y)) {
        return levelMap[posKey(x, y)];
    }
    return null;
}

function setTile(x, y, value) {
    if (isValidPosition(x, y)) {
        levelMap[posKey(x, y)] = value;
    }
}

function getMarker(x, y) {
    if (isValidPosition(x, y)) {
        return markers[posKey(x, y)];
    }
    return null;
}

function hasFlag(x, y) {
    return getMarker(x, y) === MARKERS.FLAG;
}

function setMarker(x, y, type) {
    if (getMarker(x, y)) {
        deleteMarker(x, y);
    }
    if (isValidPosition(x, y)) {
        markers[posKey(x, y)] = type;
    }
}

function deleteMarker(x, y) {
    delete markers[posKey(x, y)];
}

function countSurroundingMines(x, y) {
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
    if (isValidPosition(x, y)) {
        return getTile(x, y) == TILES.MINE;
    }
    return false;
}

function onResetClick() {
    $("#reset-btn").attr("disabled", true);
    resetLevel();
}

function checkVictory() {
    const remainingTiles = Object.values(levelMap).filter(tile => tile === TILES.UNKNOWN).length;
    if (remainingTiles === 0) {
        if (currentLevelIndex + 1 < LEVELS.length) {
            currentLevelIndex++;
            currentLevel = LEVELS[currentLevelIndex];
            resetLevel();
        } else {
            alert("You have completed all levels!");
            addRank();
            currentLevelIndex = FIRST_LEVEL;
            currentLevel = LEVELS[currentLevelIndex];
            resetGame();
            $("#time").html("00:00:00");
            $("#rank-btn").click();
        }
    }
}

function loadPlayerName() {
    playerName = localStorage.getItem("playerName");
    if (!playerName) {
        playerName = prompt("Enter your name:");
        localStorage.setItem("playerName", playerName);
    }
}

function startTimer() {
    setInterval(() => {
        if (running) {
            incrementTime();
            const formattedTime = [time.h, time.m, time.s]
                .map(unit => unit.toString().padStart(2, "0"))
                .join(":");
            $("#time").text(formattedTime);
        }
    }, 1000);
}

function incrementTime() {
    time.s++;
    if (time.s >= 60) {
        time.s = 0;
        time.m++;
        if (time.m >= 60) {
            time.m = 0;
            time.h++;
        }
    }
}

function onStartClick() {
    alert("Go!");
    startTimer();
    running = true;
    $("#start-btn").attr("disabled", true);
}

function markHintTile() {
    let tiles = [];
    for (let y = 0; y < currentLevel.height; y++) {
        for (let x = 0; x < currentLevel.width; x++) {
            if (getTile(x, y) == TILES.MINE) {
                continue;
            }
            const mines = countSurroundingMines(x, y);
            if (mines == 0) {
                tiles.push($(`.tile[data-x="${x}"][data-y="${y}"]`));
            }
        }
    }
    if (tiles.length == 0) {
        return;
    }
    const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
    randomTile.addClass("tile-hint");
    randomTile.text("!");
}

function onNextClick() {
    if (currentLevelIndex + 1 < LEVELS.length) {
        currentLevelIndex++;
        currentLevel = LEVELS[currentLevelIndex];
        resetLevel();
    }
}