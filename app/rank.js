$(initRank);

let initialRank = [
    {name: "Guruleni", time: {h: 0, m: 49, s: 59}, deaths: 85, date: "4/21/2025, 11:47:40 AM"}
];

let rank = []

function initRank() {
    loadRank();
    randerRank();
}

function addRank() {
    rank.push({
        name: playerName,
        time: time,
        deaths: deaths,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("rank", JSON.stringify(rank));
    randerRank();
}

function randerRank() {
    $("#rank").empty();
    rank.sort((a, b) => {
        if (a.time.h !== b.time.h) {
            return a.time.h - b.time.h;
        } else if (a.time.m !== b.time.m) {
            return a.time.m - b.time.m;
        } else if (a.time.s !== b.time.s) {
            return a.time.s - b.time.s;
        } else {
            return a.lives - b.lives;
        }
    });
    rank.forEach((item, index) => {
        const formattedTime = [item.time.h, item.time.m, item.time.s]
                .map(unit => unit.toString().padStart(2, "0"))
                .join(":");
        const el = $("<tr>");
        el.append($("<td>").text(index + 1));
        el.append($("<td>").text(item.name));
        el.append($("<td>").text(formattedTime));
        el.append($("<td>").text(item.deaths));
        el.append($("<td>").text(item.date));
        $("#rank").append(el);
    });
}

function loadRank() {
    const rankData = localStorage.getItem("rank");
    if (rankData) {
        rank = JSON.parse(rankData);
    } else {
        rank = initialRank;
        localStorage.setItem("rank", JSON.stringify(rank));
    }
}