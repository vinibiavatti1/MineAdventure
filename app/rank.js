$(initRank);

let initialRank = [
    {name: "Guruleni", time: {h: 0, m: 55, s: 59}, deaths: 102, date: "21/04/2025 11:47:40"},
    {name: "Ana", time: {h: 1, m: 20, s: 13}, deaths: 98, date: "21/04/2025 14:35:40"},
    {name: "Luli", time: {h: 2, m: 1, s: 20}, deaths: 186, date: "22/04/2025 16:20:00"},
    {name: "Felipasso", time: {h: 2, m: 18, s: 34}, deaths: 195, date: "22/04/2025 20:05:31"},
    {name: "Elder", time: {h: 4, m: 24, s: 24}, deaths: 1128, date: "22/04/2025 09:15:02"}
];

let rank = []

function initRank() {
    loadRank();
    randerRank();
}

function addRank(playerName, time, deaths) {
    rank.push({
        name: playerName,
        time: time,
        deaths: deaths,
        date: new Date().toLocaleString("pt-BR")
    });
    sortRank();
    localStorage.setItem("rank", JSON.stringify(rank));
    randerRank();
}

function sortRank() {
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
}

function randerRank() {
    $("#rank").empty();
    rank.forEach((item, index) => {
        const formattedTime = [item.time.h, item.time.m, item.time.s]
                .map(unit => unit.toString().padStart(2, "0"))
                .join(":");
        const el = $("<tr>");
        const pos = $("<td class='fw-bold'>").text(index + 1);
        const badge = $("<span class='badge text-bg-secondary ms-2'>");
        if (index === 0) {
            badge.addClass("text-bg-warning").text("Gold");
        } else if (index === 1) {
            badge.addClass("text-bg-info").text("Silver");
        } else if (index == 2) {
            badge.addClass("text-bg-light").text("Bronze");
        } else {
            badge.addClass("text-bg-secondary").text("Iron");   
        }
        el.append(pos.append(badge));
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
        sortRank();
        localStorage.setItem("rank", JSON.stringify(rank));
    }
}