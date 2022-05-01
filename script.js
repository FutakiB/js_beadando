const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const formplayernum = document.querySelector("#playerNum");
const formKincsszam = document.querySelector("#kicsszam");
const startbtn = document.querySelector("#start");
const tbody = document.querySelector("tbody");
const leirasbtn = document.querySelector("#leiras");
const leiras = document.querySelector(".leiras");
const savebtn = document.querySelector("#save");
const loadbtn = document.querySelector("#load");

let blockSize = canvas.width / 9;

formplayernum.value = 2;
formKincsszam.value = 2;

let canvasX = canvas.offsetLeft;
let canvasY = canvas.offsetTop;

let table = [[]];
for (let i = 0; i < 7; i++) {
  table.push([]);
  for (let j = 0; j < 7; j++) {
    let mezo = {
      x: 0,
      y: 0,
      draw: drawStraightUp,
      to: { up: false, right: false, down: false, left: false },
    };
    table[i].push(mezo);
  }
}

let plusOne;
let players = [];
let kincsSzam = formKincsszam.value;
let aktPNum = 0;
let aktPlayer;
let isGameOver = false;
let tolni = false;

let treasures = [];

let mezok = {
  drawStraightUp: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawStraightUp,
    to: { up: true, right: false, down: true, left: false },
  },

  drawStraightSide: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawStraightSide,

    to: { up: false, right: true, down: false, left: true },
  },

  drawCornerUpToRight: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawCornerUpToRight,
    to: { up: true, right: true, down: false, left: false },
  },

  drawCornerUpToLeft: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawCornerUpToLeft,
    to: { up: true, right: false, down: false, left: true },
  },

  drawCornerdownToRight: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawCornerdownToRight,
    to: { up: false, right: true, down: true, left: false },
  },

  drawCornerdownToLeft: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawCornerdownToLeft,
    to: { up: false, right: false, down: true, left: true },
  },

  drawThreeWayRight: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawThreeWayRight,
    to: { up: true, right: true, down: true, left: false },
  },

  drawThreeWayDown: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawThreeWayDown,
    to: { up: false, right: true, down: true, left: true },
  },

  drawThreeWayLeft: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawThreeWayLeft,
    to: { up: true, right: false, down: true, left: true },
  },

  drawThreeWayUp: {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    bejar: false,
    kincs: null,
    draw: drawThreeWayUp,
    to: { up: true, right: true, down: false, left: true },
  },
};

let betolas = {
  x: blockSize * 2,
  y: 0,
  plus: false,
  row: 0,
  col: 0,
};

leiras.style.visibility = "hidden";

if (!isLoadable()) {
  loadbtn.disabled = true;
}

loadbtn.addEventListener("click", (e) => {
  load();
  e.preventDefault();
  canvas.addEventListener("mousemove", hoverEventHandler);
  canvas.addEventListener("contextmenu", contextmenuEventHandler);
  canvas.addEventListener("click", clickEventHandler);
  canvas.addEventListener("click", lepes);
});

function load() {
  if (isLoadable) {
    const savedData = JSONfn.parse(localStorage.getItem("LabyrinthGameSave"));
    //console.log(savedData);
    table = savedData.table;
    players = savedData.players;

    plusOne = savedData.plusOne;
    kincsSzam = savedData.kincsSzam;
    aktPNum = savedData.aktPNum;
    aktPlayer = savedData.aktPlayer;
    isGameOver = savedData.isGameOver;
    tolni = savedData.tolni;

    betolas = savedData.betolas;
  }
}

function isLoadable() {
  if (localStorage.getItem("LabyrinthGameSave")) {
    return true;
  }
  return false;
}

savebtn.disabled = true;
savebtn.addEventListener("click", (e) => {
  e.preventDefault();
  save();
  loadbtn.disabled = false;
});

function save() {
  const SaveObject = {
    table: table,
    players: players,

    plusOne: plusOne,
    kincsSzam: kincsSzam,
    aktPNum: aktPNum,
    aktPlayer: aktPlayer,
    isGameOver: isGameOver,
    tolni: tolni,

    betolas: betolas,
  };
  localStorage.setItem("LabyrinthGameSave", JSONfn.stringify(SaveObject));
}

leirasbtn.addEventListener("click", (e) => {
  e.preventDefault();
  leiras.style.visibility = "visible";
});

startbtn.addEventListener("click", (e) => {
  e.preventDefault();
  savebtn.disabled = false;
  init(formplayernum.value);
  canvas.classList.add("canvas");
});
//init(formplayernum.value);
//canvas.classList.add("canvas");

formplayernum.addEventListener(
  "input",
  (x) => (formKincsszam.max = 24 / formplayernum.value)
);

function init(a) {
  plusOne;
  players = [];
  kincsSzam = formKincsszam.value;
  aktPNum = 0;
  aktPlayer;
  isGameOver = false;
  tolni = false;

  betolas = {
    x: blockSize * 2,
    y: 0,
    plus: false,
    row: 0,
    col: 0,
  };

  canvas.addEventListener("mousemove", hoverEventHandler);
  canvas.addEventListener("contextmenu", contextmenuEventHandler);
  canvas.addEventListener("click", clickEventHandler);
  canvas.removeEventListener("click", lepes);

  generateStatic();

  randomTabla();

  playerInit(a);

  treasuresInit();

  generateTable();

  next();
}

function generateTable() {
  let inner = "";
  for (let i = 0; i < players.length; i++) {
    inner += "<tr>";
    inner += aktPNum == i ? "<th>" : "<td>";
    inner += i + 1;
    inner += aktPNum == i ? "</th>" : "</td>";
    inner += "<td>";
    //console.log(players[i].treasures);
    inner += players[i].treasures[players[i].treasures.length - 1]
      ? players[i].treasures[players[i].treasures.length - 1]
      : "start";
    inner += "</td>";
    inner += "<td class=" + players[i].color + ">";
    inner += players[i].color;
    inner += "</td>";
    inner += "</tr>";
  }
  tbody.innerHTML = inner;
}

function playerInit(a) {
  let player1 = {
    locId: {
      x: 0,
      y: 0,
    },
    location: table[0][0],
    treasures: [],
    color: "red",
    start: table[0][0],
  };
  players.push(player1);

  let player2 = {
    locId: {
      x: 1,
      y: 1,
    },
    location: table[6][6],
    treasures: [],
    color: "green",
    start: table[6][6],
  };
  players.push(player2);

  let player3 = {
    locId: {
      x: 0,
      y: 1,
    },
    location: table[0][6],
    treasures: [],
    color: "blue",
    start: table[0][6],
  };
  players.push(player3);

  let player4 = {
    locId: {
      x: 1,
      y: 0,
    },
    location: table[6][0],
    treasures: [],
    color: "yellow",
    start: table[6][0],
  };
  players.push(player4);

  for (let i = 0; i < 4 - a; i++) {
    players.pop();
  }
  aktPNum = 0;
  aktPlayer = players[0];
}

function treasuresInit() {
  for (let i = 1; i < players.length * kincsSzam + 1; i++) {
    treasures.push(i);
  }
  treasures.sort(() => (Math.random() > 0.5 ? 1 : -1));
  //console.log(treasures);

  rendomTreasures();

  players.forEach((x) => {
    x.treasures = treasures.splice(0, kincsSzam);
  });
}

function contextmenuEventHandler(e) {
  e.preventDefault();
  x = e.pageX - canvasX;
  y = e.pageY - canvasY;

  //#region top
  if (
    (x > blockSize * 2 && x < blockSize * 3 && y > 0 && y < blockSize) ||
    (x > blockSize * 4 && x < blockSize * 5 && y > 0 && y < blockSize) ||
    (x > blockSize * 6 && x < blockSize * 7 && y > 0 && y < blockSize) ||
    (x > 0 && x < blockSize && y > blockSize * 2 && y < blockSize * 3) ||
    (x > 0 && x < blockSize && y > blockSize * 4 && y < blockSize * 5) ||
    (x > 0 && x < blockSize && y > blockSize * 6 && y < blockSize * 7) ||
    (x > blockSize * 2 &&
      x < blockSize * 3 &&
      y > blockSize * 8 &&
      y < blockSize * 9) ||
    (x > blockSize * 4 &&
      x < blockSize * 5 &&
      y > blockSize * 8 &&
      y < blockSize * 9) ||
    (x > blockSize * 6 &&
      x < blockSize * 7 &&
      y > blockSize * 8 &&
      y < blockSize * 9) ||
    (x > blockSize * 8 &&
      x < blockSize * 9 &&
      y > blockSize * 2 &&
      y < blockSize * 3) ||
    (x > blockSize * 8 &&
      x < blockSize * 9 &&
      y > blockSize * 4 &&
      y < blockSize * 5) ||
    (x > blockSize * 8 &&
      x < blockSize * 9 &&
      y > blockSize * 6 &&
      y < blockSize * 7)
  ) {
    //console.log(e);
    let buf = plusOne.kincs;
    switch (plusOne.draw) {
      case drawStraightUp:
        plusOne = Object.assign({}, mezok.drawStraightSide);
        break;
      case drawStraightSide:
        plusOne = Object.assign({}, mezok.drawStraightUp);
        break;
      case drawCornerUpToRight:
        plusOne = Object.assign({}, mezok.drawCornerdownToRight);
        break;
      case drawCornerdownToRight:
        plusOne = Object.assign({}, mezok.drawCornerdownToLeft);
        break;
      case drawCornerdownToLeft:
        plusOne = Object.assign({}, mezok.drawCornerUpToLeft);
        break;
      case drawCornerUpToLeft:
        plusOne = Object.assign({}, mezok.drawCornerUpToRight);
        break;
      case drawThreeWayUp:
        plusOne = Object.assign({}, mezok.drawThreeWayRight);
        break;
      case drawThreeWayRight:
        plusOne = Object.assign({}, mezok.drawThreeWayDown);
        break;
      case drawThreeWayDown:
        plusOne = Object.assign({}, mezok.drawThreeWayLeft);
        break;
      case drawThreeWayLeft:
        plusOne = Object.assign({}, mezok.drawThreeWayUp);
        break;
    }
    plusOne.kincs = buf;
  }
}

function animatomTolas(col, row) {
  if (tolni) {
    if (row == 0) {
      plusOne.y += blockSize / 100;

      for (let i = 0; i < 7; i++) {
        table[col][i].y += blockSize / 100;
      }
    } else if (row == 6) {
      plusOne.y -= blockSize / 100;

      for (let i = 0; i < 7; i++) {
        table[col][i].y -= blockSize / 100;
      }
    } else if (col == 0) {
      plusOne.x += blockSize / 100;

      for (let i = 0; i < 7; i++) {
        table[i][row].x += blockSize / 100;
      }
    } else if (col == 6) {
      plusOne.x -= blockSize / 100;
      for (let i = 0; i < 7; i++) {
        table[i][row].x -= blockSize / 100;
      }
    }
  }
}

function clickEventHandler() {
  if (!tolni) {
    tolni = true;
  }
}

function hoverEventHandler(e) {
  x = e.pageX - canvasX;
  y = e.pageY - canvasY;

  //#region top
  if (x > blockSize * 2 && x < blockSize * 3 && y > 0 && y < blockSize) {
    betolas.x = blockSize * 2;
    betolas.y = 0;
    betolas.plus = true;
    betolas.col = 1;
    betolas.row = 0;
  } else if (x > blockSize * 4 && x < blockSize * 5 && y > 0 && y < blockSize) {
    betolas.x = blockSize * 4;
    betolas.y = 0;
    betolas.plus = true;
    betolas.col = 3;
    betolas.row = 0;
  } else if (x > blockSize * 6 && x < blockSize * 7 && y > 0 && y < blockSize) {
    betolas.x = blockSize * 6;
    betolas.y = 0;
    betolas.plus = true;
    betolas.col = 5;
    betolas.row = 0;
  }
  //#endregion
  //#region left
  else if (x > 0 && x < blockSize && y > blockSize * 2 && y < blockSize * 3) {
    betolas.x = 0;
    betolas.y = blockSize * 2;
    betolas.plus = true;
    betolas.col = 0;
    betolas.row = 1;
  } else if (x > 0 && x < blockSize && y > blockSize * 4 && y < blockSize * 5) {
    betolas.x = 0;
    betolas.y = blockSize * 4;
    betolas.plus = true;
    betolas.col = 0;
    betolas.row = 3;
  } else if (x > 0 && x < blockSize && y > blockSize * 6 && y < blockSize * 7) {
    betolas.x = 0;
    betolas.y = blockSize * 6;
    betolas.plus = true;
    betolas.col = 0;
    betolas.row = 5;
  }
  //#endregion
  //#region bottom
  else if (
    x > blockSize * 2 &&
    x < blockSize * 3 &&
    y > blockSize * 8 &&
    y < blockSize * 9
  ) {
    betolas.x = blockSize * 2;
    betolas.y = blockSize * 8;
    betolas.plus = true;
    betolas.col = 1;
    betolas.row = 6;
  } else if (
    x > blockSize * 4 &&
    x < blockSize * 5 &&
    y > blockSize * 8 &&
    y < blockSize * 9
  ) {
    betolas.x = blockSize * 4;
    betolas.y = blockSize * 8;
    betolas.plus = true;
    betolas.col = 3;
    betolas.row = 6;
  } else if (
    x > blockSize * 6 &&
    x < blockSize * 7 &&
    y > blockSize * 8 &&
    y < blockSize * 9
  ) {
    betolas.x = blockSize * 6;
    betolas.y = blockSize * 8;
    betolas.plus = true;
    betolas.col = 5;
    betolas.row = 6;
  }
  //#endregion

  //#region right
  else if (
    x > blockSize * 8 &&
    x < blockSize * 9 &&
    y > blockSize * 2 &&
    y < blockSize * 3
  ) {
    betolas.x = blockSize * 8;
    betolas.y = blockSize * 2;
    betolas.plus = true;
    betolas.col = 6;
    betolas.row = 1;
  } else if (
    x > blockSize * 8 &&
    x < blockSize * 9 &&
    y > blockSize * 4 &&
    y < blockSize * 5
  ) {
    betolas.x = blockSize * 8;
    betolas.y = blockSize * 4;
    betolas.plus = true;
    betolas.col = 6;
    betolas.row = 3;
  } else if (
    x > blockSize * 8 &&
    x < blockSize * 9 &&
    y > blockSize * 6 &&
    y < blockSize * 7
  ) {
    betolas.x = blockSize * 8;
    betolas.y = blockSize * 6;
    betolas.plus = true;
    betolas.col = 6;
    betolas.row = 5;
  }
  //#endregion
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomTabla() {
  let straight = 13;
  let corner = 15;
  let threeWay = 6;

  let valaszthatok = [];

  let val;
  for (let i = 0; i < straight; i++) {
    if (getRandomInt(2) == 0) {
      val = Object.assign({}, mezok.drawStraightUp);
    } else {
      val = Object.assign({}, mezok.drawStraightSide);
    }
    valaszthatok.push(val);
  }
  for (let i = 0; i < corner; i++) {
    switch (getRandomInt(4)) {
      case 0:
        val = Object.assign({}, mezok.drawCornerUpToLeft);
        break;
      case 1:
        val = Object.assign({}, mezok.drawCornerUpToRight);
        break;
      case 2:
        val = Object.assign({}, mezok.drawCornerdownToLeft);
        break;
      case 3:
        val = Object.assign({}, mezok.drawCornerdownToRight);
        break;
    }
    valaszthatok.push(val);
  }

  for (let i = 0; i < threeWay; i++) {
    switch (getRandomInt(4)) {
      case 0:
        val = Object.assign({}, mezok.drawThreeWayUp);
        break;
      case 1:
        val = Object.assign({}, mezok.drawThreeWayRight);
        break;
      case 2:
        val = Object.assign({}, mezok.drawThreeWayLeft);
        break;
      case 3:
        val = Object.assign({}, mezok.drawThreeWayDown);
        break;
    }
    valaszthatok.push(val);
  }
  //console.log(valaszthatok);
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (!(j % 2 == 0 && i % 2 == 0)) {
        let rand = getRandomInt(valaszthatok.length);
        table[i][j] = valaszthatok[rand];
        table[i][j].lx = i;
        table[i][j].ly = j;
        valaszthatok.splice(rand, 1);
      }
    }
  }
  plusOne = valaszthatok[0];
  plusOne.x = 0;
  plusOne.y = 0;
}

function generateStatic() {
  //TODO: megg kell nézni a truekat, fügvényt írni rá
  table[0][0] = Object.assign({}, mezok.drawCornerdownToRight);
  table[0][0].lx = 0;
  table[0][0].ly = 0;

  table[2][0] = Object.assign({}, mezok.drawThreeWayDown);
  table[2][0].lx = 2;
  table[2][0].ly = 0;

  table[4][0] = Object.assign({}, mezok.drawThreeWayDown);
  table[4][0].lx = 4;
  table[4][0].ly = 0;

  table[6][0] = Object.assign({}, mezok.drawCornerdownToLeft);
  table[6][0].lx = 6;
  table[6][0].ly = 0;

  table[0][2] = Object.assign({}, mezok.drawThreeWayRight);
  table[0][2].lx = 0;
  table[0][2].ly = 2;

  table[0][4] = Object.assign({}, mezok.drawThreeWayRight);
  table[0][4].lx = 0;
  table[0][4].ly = 4;

  table[0][6] = Object.assign({}, mezok.drawCornerUpToRight);
  table[0][6].lx = 0;
  table[0][6].ly = 6;

  table[2][6] = Object.assign({}, mezok.drawThreeWayUp);
  table[2][6].lx = 2;
  table[2][6].ly = 6;

  table[4][6] = Object.assign({}, mezok.drawThreeWayUp);
  table[4][6].lx = 4;
  table[4][6].ly = 6;

  table[6][6] = Object.assign({}, mezok.drawCornerUpToLeft);
  table[6][6].lx = 6;
  table[6][6].ly = 6;

  table[6][4] = Object.assign({}, mezok.drawThreeWayLeft);
  table[6][4].lx = 6;
  table[6][4].ly = 4;

  table[6][2] = Object.assign({}, mezok.drawThreeWayLeft);
  table[6][2].lx = 6;
  table[6][2].ly = 2;

  table[2][2] = Object.assign({}, mezok.drawThreeWayRight);
  table[2][2].lx = 2;
  table[2][2].ly = 2;

  table[4][2] = Object.assign({}, mezok.drawThreeWayDown);
  table[4][2].lx = 4;
  table[4][2].ly = 2;

  table[2][4] = Object.assign({}, mezok.drawThreeWayUp);
  table[2][4].lx = 2;
  table[2][4].ly = 4;

  table[4][4] = Object.assign({}, mezok.drawThreeWayLeft);
  table[4][4].lx = 4;
  table[4][4].ly = 4;
}

//#region arrows
function drawArrow(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(-10, -20);
  ctx.lineTo(0, 20);
  ctx.lineTo(10, -20);
  ctx.lineTo(0, -10);
  ctx.lineTo(-10, -20);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

function drawAllArrow() {
  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ctx.translate(-(blockSize * 2 + blockSize / 2), blockSize / 2);
  drawArrow(0, 0);
  ctx.translate(-(blockSize * 2), 0);
  drawArrow(0, 0);
  ctx.translate(-(blockSize * 2), 0);
  drawArrow(0, 0);
  for (let i = 0; i < 3; i++) {
    ctx.translate(-(blockSize * 2), blockSize * 2);
    ctx.rotate(-Math.PI / 2);
    drawArrow(0, 0);
    ctx.translate(-(blockSize * 2), 0);
    drawArrow(0, 0);
    ctx.translate(-(blockSize * 2), 0);
    drawArrow(0, 0);
  }
  ctx.restore();
}
//#endregion

function playerCycle(player, mezo) {
  if (player.location == mezo) {
    console.log(player);
    return true;
  }
  return false;
}

function wasTolas(col, row) {
  let buff;
  if (row == 0) {
    buff = plusOne;
    players.forEach((player) => {
      if (playerCycle(player, table[col][6])) {
        player.location = plusOne;
      }
    });
    plusOne = table[col][6];
    for (let i = 6; i > 0; i--) {
      table[col][i] = table[col][i - 1];
    }
    table[col][0] = buff;
  } else if (row == 6) {
    buff = plusOne;
    players.forEach((player) => {
      if (playerCycle(player, table[col][0])) {
        player.location = plusOne;
      }
    });
    plusOne = table[col][0];

    for (let i = 0; i < 7; i++) {
      table[col][i] = table[col][i + 1];
    }
    table[col][6] = buff;
  } else if (col == 0) {
    buff = plusOne;
    players.forEach((player) => {
      if (playerCycle(player, table[6][row])) {
        player.location = plusOne;
      }
    });
    plusOne = table[6][row];
    for (let i = 6; i > 0; i--) {
      table[i][row] = table[i - 1][row];
    }
    table[0][row] = buff;
  } else if (col == 6) {
    buff = plusOne;
    players.forEach((player) => {
      if (playerCycle(player, table[0][row])) {
        player.location = plusOne;
      }
    });
    plusOne = table[0][row];

    for (let i = 0; i < 7; i++) {
      table[i][row] = table[i + 1][row];
    }
    table[6][row] = buff;
  }
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      table[i][j].x = 0;
      table[i][j].lx = i;
      table[i][j].y = 0;
      table[i][j].ly = j;
    }
  }
  plusOne.x = 0;
  plusOne.y = 0;
  lep();
  //console.log("lep");
}
function drawPlayer(player) {
  ctx.save();
  //ctx.fillStyle(player.color)
  ctx.fillStyle = player.color;
  ctx.translate(
    player.location.lx * blockSize +
      (player.locId.x * blockSize) / 2 +
      blockSize / 4 +
      player.location.x,
    player.location.ly * blockSize +
      (player.locId.y * blockSize) / 2 +
      blockSize / 4 +
      player.location.y
  );
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

function bejaras(mez) {
  try {
    if (!mez.bejar) {
      mez.bejar = true;
      if (
        mez.to.up &&
        table[mez.lx][mez.ly - 1] &&
        table[mez.lx][mez.ly - 1].to.down
      ) {
        bejaras(table[mez.lx][mez.ly - 1]);
      }
      if (
        mez.to.down &&
        table[mez.lx][mez.ly + 1] &&
        table[mez.lx][mez.ly + 1].to.up
      ) {
        bejaras(table[mez.lx][mez.ly + 1]);
      }
      if (
        mez.to.right &&
        table[mez.lx + 1][mez.ly] &&
        table[mez.lx + 1][mez.ly].to.left
      ) {
        bejaras(table[mez.lx + 1][mez.ly]);
      }
      if (
        mez.to.left &&
        table[mez.lx - 1][mez.ly] &&
        table[mez.lx - 1][mez.ly].to.right
      ) {
        bejaras(table[mez.lx - 1][mez.ly]);
      }
    }
  } catch (error) {}
}

function rendomTreasures() {
  for (let i = 0; i < treasures.length; i++) {
    let row = getRandomInt(7);
    let col = getRandomInt(7);
    ran = 7 * col + row + 1;
    //console.log (row + " "+ col+ " "+ ran)
    while (
      ran == 7 ||
      ran == 44 ||
      ran == 49 ||
      ran == 1 ||
      table[col][row].kincs !== null
    ) {
      row = getRandomInt(6);
      col = getRandomInt(6);
      ran = 7 * col + row + 1;
      //console.log (row + " "+ col+ " "+ ran)
    }
    table[col][row].kincs = treasures[i];
    //console.log(table[col][row].kincs)
  }
}

function lepes(e) {
  canvas.removeEventListener("mousemove", hoverEventHandler);
  canvas.removeEventListener("contextmenu", contextmenuEventHandler);
  canvas.removeEventListener("click", clickEventHandler);
  x = e.pageX - canvasX;
  y = e.pageY - canvasY;
  col = Math.floor(x / blockSize - 1);
  row = Math.floor(y / blockSize - 1);
  if (col >= 0 && row >= 0 && col < 7 && row < 7) {
    //bejaras(player1.location);
    if (table[col][row].bejar) {
      aktPlayer.location = table[col][row];
      if (
        table[col][row].kincs ==
        aktPlayer.treasures[aktPlayer.treasures.length - 1]
      ) {
        aktPlayer.treasures.pop();
        table[col][row].kincs = null;
      }
      aktPNum++;
      tol();
      //console.log("tol");
    }
  }
}

function lep() {
  //players.forEach((x) => console.log(x.treasures));
  bejaras(aktPlayer.location);
  canvas.removeEventListener("mousemove", hoverEventHandler);
  canvas.removeEventListener("contextmenu", contextmenuEventHandler);
  canvas.removeEventListener("click", clickEventHandler);
  canvas.addEventListener("click", lepes);
}

function tol() {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      table[i][j].bejar = false;
    }
  }
  canvas.addEventListener("mousemove", hoverEventHandler);
  canvas.addEventListener("contextmenu", contextmenuEventHandler);
  canvas.addEventListener("click", clickEventHandler);
  canvas.removeEventListener("click", lepes);
}

let c = 0;
function draw() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(23, 9, 71)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (tolni) {
    animatomTolas(betolas.col, betolas.row);
    canvas.removeEventListener("mousemove", hoverEventHandler);
    canvas.removeEventListener("contextmenu", contextmenuEventHandler);
    canvas.removeEventListener("click", clickEventHandler);
    c++;
    if (c > 100) {
      tolni = false;
      c = 0;
      wasTolas(betolas.col, betolas.row);
      /*canvas.addEventListener("mousemove", hoverEventHandler);
      canvas.addEventListener("contextmenu", contextmenuEventHandler);
      canvas.addEventListener("click", clickEventHandler);*/
    }
  }
  drawAllArrow();
  plusOne.draw(
    betolas.x + plusOne.x,
    betolas.y + plusOne.y,
    false,
    plusOne.kincs
  );
  ctx.translate(blockSize, blockSize);

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      table[i][j].draw(
        i * blockSize + table[i][j].x,
        j * blockSize + table[i][j].y,
        table[i][j].bejar,
        table[i][j].kincs
      );
    }
  }
  for (let i = 0; i < players.length; i++) {
    drawPlayer(players[i]);
  }
  ctx.restore();
}

function next() {
  update();
  draw();
  generateTable();
  //console.log("a");
  if (!isGameOver) {
    requestAnimationFrame(next);
  }
}

function gameOver() {
  isGameOver = true;
  alert(`${aktPNum} járékos nyert!!!`);
  console.log("Game OVER");
  init(formplayernum);
}

function update() {
  players.forEach((x) => {
    if (x.treasures.length == 0 && x.location == x.start) {
      gameOver();
    }
  });
  if (aktPNum >= players.length) {
    aktPNum = 0;
  }
  aktPlayer = players[aktPNum];
}

//#region draw

function drawStraightUp(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize - 4);
  ctx.fillRect(
    (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize - 4
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawStraightSide(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize / 3 - 3);
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize - 4,
    blockSize / 3 - 3
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawCornerUpToRight(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize - 4);
  ctx.fillRect(
    0 + (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize - 4,
    blockSize / 3 - 3
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawCornerUpToLeft(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize / 3 - 3);
  ctx.fillRect(
    0 + (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize - 4
  );
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize - 4,
    blockSize / 3 - 3
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawCornerdownToRight(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize / 3 - 3);
  ctx.fillRect(
    (blockSize / 3) * 2 + 3 - 4,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize - 4);
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawCornerdownToLeft(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize / 3 - 3);
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(
    (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize - 4
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawThreeWayUp(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize / 3 - 3);
  ctx.fillRect(
    0 + (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize - 4,
    blockSize / 3 - 3
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawThreeWayRight(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(
    0 + (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(
    (blockSize / 3) * 2 + 3 - 4,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize - 4);
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawThreeWayDown(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize / 3 - 3);
  ctx.fillRect(
    (blockSize / 3) * 2 + 3 - 4,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}

function drawThreeWayLeft(x, y, bejar, kincs) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgb(70, 1, 71)";
  ctx.fillRect(0, 0, blockSize, blockSize);
  ctx.translate(2, 2);
  ctx.fillStyle = bejar ? "rgb(55, 120, 54)" : "rgb(31, 31, 31)";
  ctx.fillRect(0, 0, blockSize - 4, blockSize - 4);
  ctx.fillStyle = "rgb(179, 115, 37)";
  ctx.fillRect(0, 0, blockSize / 3 - 3, blockSize / 3 - 3);
  ctx.fillRect(
    (blockSize / 3) * 2 + 3 - 4,
    0,
    blockSize / 3 - 3,
    blockSize - 4
  );
  ctx.fillRect(
    0,
    0 + (blockSize / 3) * 2 + 3 - 4,
    blockSize / 3 - 3,
    blockSize / 3 - 3
  );
  ctx.fillStyle = "white";
  ctx.font = "20px cursive";
  if (kincs) {
    ctx.fillText(kincs, blockSize / 2 - 7, blockSize / 2 + 8);
  }
  ctx.restore();
}
//#endregion
//#region custom JSON a fügvények miatt
/**
 * JSONfn - javascript (both node.js and browser) plugin to stringify,
 *          parse and clone objects with Functions, Regexp and Date.
 *
 * Version - 1.1.0
 * Copyright (c) Vadim Kiryukhin
 * vkiryukhin @ gmail.com
 * http://www.eslinstructor.net/jsonfn/
 *
 * Licensed under the MIT license ( http://www.opensource.org/licenses/mit-license.php )
 *
 *   USAGE:
 *     browser:
 *         JSONfn.stringify(obj);
 *         JSONfn.parse(str[, date2obj]);
 *         JSONfn.clone(obj[, date2obj]);
 *
 *     nodejs:
 *       var JSONfn = require('path/to/json-fn');
 *       JSONfn.stringify(obj);
 *       JSONfn.parse(str[, date2obj]);
 *       JSONfn.clone(obj[, date2obj]);
 *
 *
 *     @obj      -  Object;
 *     @str      -  String, which is returned by JSONfn.stringify() function;
 *     @date2obj - Boolean (optional); if true, date string in ISO8061 format
 *                 is converted into a Date object; otherwise, it is left as a String.
 */

(function (exports) {
  "use strict";

  exports.stringify = function (obj) {
    return JSON.stringify(obj, function (key, value) {
      var fnBody;
      if (value instanceof Function || typeof value == "function") {
        fnBody = value.toString();

        if (fnBody.length < 8 || fnBody.substring(0, 8) !== "function") {
          //this is ES6 Arrow Function
          return "_NuFrRa_" + fnBody;
        }
        return fnBody;
      }
      if (value instanceof RegExp) {
        return "_PxEgEr_" + value;
      }
      return value;
    });
  };

  exports.parse = function (str, date2obj) {
    var iso8061 = date2obj
      ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/
      : false;

    return JSON.parse(str, function (key, value) {
      var prefix;

      if (typeof value != "string") {
        return value;
      }
      if (value.length < 8) {
        return value;
      }

      prefix = value.substring(0, 8);

      if (iso8061 && value.match(iso8061)) {
        return new Date(value);
      }
      if (prefix === "function") {
        return eval("(" + value + ")");
      }
      if (prefix === "_PxEgEr_") {
        return eval(value.slice(8));
      }
      if (prefix === "_NuFrRa_") {
        return eval(value.slice(8));
      }

      return value;
    });
  };

  exports.clone = function (obj, date2obj) {
    return exports.parse(exports.stringify(obj), date2obj);
  };
})(typeof exports === "undefined" ? (window.JSONfn = {}) : exports);
//#endregion
