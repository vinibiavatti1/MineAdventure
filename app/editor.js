$(initGame);

let isMouseDown = false;
$(document).on("mousedown", function () {
    isMouseDown = true;
}).on("mouseup", function () {
    isMouseDown = false;
});

function initGame() {
    document.oncontextmenu = function() {return false;};
    $(".size-input").on("change keyup", sizeInputChange);
    $("#load-btn").on("click", loadLevel);
    createMap();
    renderLevelSelect();
    generateScript();
}

function createMap() {
    $("#map").empty();
    const width = $("#width").val();
    const height = $("#height").val();
    for (let y = 0; y < height; y++) {
        const row = $("<tr>");
        for (let x = 0; x < width; x++) {
            const el = createTile(x, y);
            row.append(el);
        }
        $("#map").append(row);
    }
}

function createTile(x, y) {
    const spot = $("<td>");
    spot.addClass("tile-spot");
    const el = $("<div>"); 
    el.attr("data-x", x);
    el.attr("data-y", y);
    el.addClass("tile tile-unknown");
    el.on("mousedown", function (e) {
        e.preventDefault(); 
        onTileClick.call(this);
    });
    el.on("mouseenter", function () {
        if (isMouseDown) {
            onTileClick.call(this);
        }
    });
    spot.html(el);
    return spot;
}

function sizeInputChange() {
    createMap();
    generateScript();
}

function onTileClick() {
    const el = $(this);
    if (el.hasClass("tile-bomb")) {
        el.removeClass("tile-bomb");
        el.html("");
    } else {
        el.addClass("tile-bomb");
        el.html("Ø");
    }
    generateScript();
}

function generateScript() {
    let script = "{\n";
    script += `    width: ${$("#width").val()},\n`;
    script += `    height: ${$("#height").val()},\n`;
    script += `    mines: [\n`;
    $(".tile-bomb").each(function() {
        const x = $(this).data("x");
        const y = $(this).data("y");
        script += `        {x: ${x}, y: ${y}},\n`;
    });
    script += `    ],\n`;
    script += `},\n`;
    $("#script-output").val(script);
}

function renderLevelSelect() {
    LEVELS.forEach((_, index) => {
        const option = $("<option>").val(index).text(`Level ${index + 1}`);
        $("#level-select").append(option);
    });
}

function loadLevel() {
    const selectedIndex = $("#level-select").val();
    const selectedLevel = LEVELS[selectedIndex];
    $("#width").val(selectedLevel.width);
    $("#height").val(selectedLevel.height);
    createMap();
    selectedLevel.mines.forEach(mine => {
        const tile = $(`.tile[data-x="${mine.x}"][data-y="${mine.y}"]`);
        tile.addClass("tile-bomb");
        tile.html("Ø");
    });
    generateScript();
}