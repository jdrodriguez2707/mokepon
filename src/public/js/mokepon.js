// MOKEPON GAME

// GET SECTIONS

// Get choose pet section
const choosePetSection = document.getElementById("choose-pet-section");
const subtitle = document.getElementById("subtitle");
const mokeponCardsSection = document.getElementById("mokepon-cards");
const choosePetButton = document.getElementById("btn-select-pet");

// Get map section
const mapSection = document.getElementById("map-section");
const map = document.getElementById("map");
let canvas = map.getContext("2d");
let interval;
// map responsive
const maxMapWidth = 800;
const maxMapHeight = 600;
let mapWidth = window.innerWidth - 40;
let mapHeight = (mapWidth * maxMapHeight) / maxMapWidth;

if (mapWidth > maxMapWidth) {
  mapWidth = maxMapWidth - 40;
}

if (mapHeight > maxMapHeight) {
  mapHeight = maxMapHeight - 40;
}

map.width = mapWidth;
map.height = mapHeight;

// Get choose attack section
const chooseAttackSection = document.getElementById("choose-attack-section");
const attackButtonsSection = document.getElementById("attack-buttons-section");
let attackButtons = []; // save attack buttons
const showMessagesSection = document.getElementById("messages-section");
const result = document.getElementById("result");
const restartButton = document.getElementById("btn-restart");
const showPlayerWins = document.getElementById("player-wins");
const showPlayerSelectedPet = document.getElementById("player-pet");
const showPlayerAttackSection = document.getElementById(
  "player-attack-section"
);
const showEnemyWins = document.getElementById("enemy-wins");
const showSelectedPetEnemy = document.getElementById("enemy-pet");
const showEnemyAttackSection = document.getElementById("enemy-attack-section");

// PLAYER AND ENEMY INFORMATION

// Save player information
let playerId = null,
  playerPetName,
  playerPetObject,
  playerAttacks = [],
  showPlayerAttack,
  playerWins = 0;
// check if the player selected a pet
let isPetSelected = false;

// Save enemy information
let enemyId = null,
  enemyAttacks = [],
  showEnemyAttack,
  enemyWins = 0;

// MOKEPONS

// Save mokepons information
let mokepons = [];
let enemyMokepons = [];
let mokeponOption; // save choose mokepon card - HTML structure
let attackOption; // save choose attack button - HTML structure
let mokeponInputs = [];
let mokeponNames = []; // save names of mokepones to display them on screen

// Mokepon size (responsive)
const maxMokeponWidth = 80;
// const maxMokeponHeight = 80;
let mokeponWidth = (maxMokeponWidth * map.width) / maxMapWidth;
let mokeponHeight = mokeponWidth;

// Create a Mokepon mold (template)
class Mokepon {
  constructor(name, image, mokeponImage, id = null) {
    this.id = id;
    this.name = name;
    this.image = image; // image for the mokepon card
    this.attacks = [];
    this.mokeponImage = new Image(); // image for the canvas
    this.mokeponImage.src = mokeponImage;
    this.width = mokeponWidth;
    this.height = mokeponHeight;
    // organize mokepons on the map
    this.x =
      random(1, Math.floor(map.width / this.width)) * this.width - this.width;
    this.y =
      random(1, Math.floor(map.height / this.height)) * this.height - this.height;

    this.speedX = 0;
    this.speedY = 0;
  }

  paintMokepon() {
    canvas.drawImage(
      this.mokeponImage,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min); // generate a random number
}

// Create Mokepons
// mokepons for the player
let hipodoge = new Mokepon(
  "Hipodoge",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  "./assets/hipodoge.png",
  "hipodoge"
);
let capipepo = new Mokepon(
  "Capipepo",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  "./assets/capipepo.png",
  "capipepo"
);
let ratigueya = new Mokepon(
  "Ratigueya",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  "./assets/ratigueya.png",
  "ratigueya"
);

// add attacks
const hipodogeAttacks = [
  { name: "💧", id: "btn-water" },
  { name: "💧", id: "btn-water" },
  { name: "💧", id: "btn-water" },
  { name: "🔥", id: "btn-fire" },
  { name: "🌱", id: "btn-land" },
];

hipodoge.attacks.push(...hipodogeAttacks);

const capipepoAttacks = [
  { name: "🌱", id: "btn-land" },
  { name: "🌱", id: "btn-land" },
  { name: "🌱", id: "btn-land" },
  { name: "💧", id: "btn-water" },
  { name: "🔥", id: "btn-fire" },
];

capipepo.attacks.push(...capipepoAttacks);

const ratigueyaAttacks = [
  { name: "🔥", id: "btn-fire" },
  { name: "🔥", id: "btn-fire" },
  { name: "🔥", id: "btn-fire" },
  { name: "💧", id: "btn-water" },
  { name: "🌱", id: "btn-land" },
];

ratigueya.attacks.push(...ratigueyaAttacks);

// add mokepons to global array
mokepons.push(hipodoge, capipepo, ratigueya);

// mokepons for the enemy (cpu)
// let hipodogeEnemy = new Mokepon('hipodoge', 'Hipodoge', './assets/mokepons_mokepon_hipodoge_attack.png', '💧', './assets/hipodoge.png');

// let capipepoEnemy = new Mokepon('capipepo', 'Capipepo', './assets/mokepons_mokepon_capipepo_attack.png', '🌱', './assets/capipepo.png');

// let ratigueyaEnemy = new Mokepon('ratigueya', 'Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.png', '🔥', './assets/ratigueya.png');

// add attacks
// hipodogeEnemy.attacks.push(...hipodogeAttacks);
// capipepoEnemy.attacks.push(...capipepoAttacks);
// ratigueyaEnemy.attacks.push(...ratigueyaAttacks);

// add enemy's mokepons to global array
// enemyMokepons.push(hipodogeEnemy, capipepoEnemy, ratigueyaEnemy);

// START GAME
mapSection.style.display = "none";
chooseAttackSection.style.display = "none";

// Loop through the mokepon array and generate the HTML structure
mokepons.forEach((mokepon) => {
  mokeponOption = `
  <input type="radio" name="pet" id=${mokepon.id}>
  <label class="mokepon-card" for=${mokepon.id}>
    <img src=${mokepon.image} alt=${mokepon.name}>
    <p id="${mokepon.name}">${mokepon.name}</p>
  </label>
  `;

  mokeponCardsSection.innerHTML += mokeponOption;
});

const inputHipodoge = document.getElementById(hipodoge.id);
const inputCapipepo = document.getElementById(capipepo.id);
const inputRatigueya = document.getElementById(ratigueya.id);
mokeponInputs.push(inputHipodoge, inputCapipepo, inputRatigueya);

const showNameHipodoge = document.getElementById(hipodoge.name);
const showNameCapipepo = document.getElementById(capipepo.name);
const showNameRatigueya = document.getElementById(ratigueya.name);
mokeponNames.push(showNameHipodoge, showNameCapipepo, showNameRatigueya);

choosePetButton.addEventListener("click", selectPetPlayer);
restartButton.addEventListener("click", restartGame);

// JOIN THE GAME

// Get player id from backend
fetch("http://localhost:3000/join").then(function (res) {
  if (res.ok) {
    res.text().then(function (response) {
      // console.log('ID:', response);
      playerId = response;
    });
  }
});

// PLAYER PET SELECTION

function selectPetPlayer() {
  // check which pet is selected
  for (let i = 0; i < mokeponInputs.length; i++) {
    if (mokeponInputs[i].checked) {
      // display the name of the player's pet on screen
      showPlayerSelectedPet.innerHTML = mokeponNames[i].textContent;

      isPetSelected = true;
      playerPetName = mokeponNames[i].textContent;
    }
  }

  if (isPetSelected) {
    selectMokepon(playerPetName);
    choosePetSection.style.display = "none";
    startMap();
  } else {
    alert("Por favor selecciona una mascota");
    return;
  }
}

function selectMokepon(playerPetName) {
  // send player pet name to backend
  fetch(`http://localhost:3000/mokepon/${playerId}`, {
    method: "POST",
    body: JSON.stringify({ mokepon: playerPetName }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// MAP

function startMap() {
  mapSection.style.display = "flex";
  playerPetObject = getPetObject(playerPetName); // get selected pet object
  // paint everything continuously to see the fluid movement of the mokepons
  interval = setInterval(paintMap, 50);

  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", stopMovement);

  // get all buttons that have the same class
  const movementButtons = document.querySelectorAll(".btn-move");

  movementButtons.forEach((movementButton) => {
    movementButton.addEventListener("mousedown", () =>
      moveCapipepo(movementButton.id)
    );
    movementButton.addEventListener("mouseup", stopMovement);

    movementButton.addEventListener("touchstart", () =>
      moveCapipepo(movementButton.id)
    );
    movementButton.addEventListener("touchend", stopMovement);
  });
}

function getPetObject(playerPetName) {
  for (let i = 0; i < mokepons.length; i++) {
    if (playerPetName === mokepons[i].name) {
      return mokepons[i];
    }
  }
}

// Create map background
let background = new Image();
background.src = "./assets/mokemap.png";

function paintMap() {
  canvas.clearRect(0, 0, map.width, map.height); // clear canvas (100%)

  canvas.drawImage(background, 0, 0, map.width, map.height);

  // update the position of the mokepon according to the speed that is modified by the keys that are pressed
  playerPetObject.x = playerPetObject.x + playerPetObject.speedX;
  playerPetObject.y = playerPetObject.y + playerPetObject.speedY;

  playerPetObject.paintMokepon();

  sendPosition(playerPetObject.x, playerPetObject.y); // send mokepon position to backend

  enemyMokepons.forEach(function (enemyMokepon) {
    if (enemyMokepon) {
      enemyMokepon.paintMokepon();

      checkMapBoundaries();
      checkCollision(enemyMokepon);
    }
  });
}

let keysPressed = {}; // save keys pressed

function keyPressed(event) {
  keysPressed[event.key] = true; // true -> key pressed
  startMovement();
}

function startMovement() {
  // movement of mokepon according to the key that is pressed
  if (keysPressed["ArrowUp"]) {
    playerPetObject.speedY = setSpeed(-8);
  }

  if (keysPressed["ArrowDown"]) {
    playerPetObject.speedY = setSpeed(8);
  }

  if (keysPressed["ArrowLeft"]) {
    playerPetObject.speedX = setSpeed(-8);
  }

  if (keysPressed["ArrowRight"]) {
    playerPetObject.speedX = setSpeed(8);
  }

  // gas and break conditions
  if (keysPressed["ArrowUp"] && keysPressed["ArrowDown"]) {
    playerPetObject.speedY = 0;
  }

  if (keysPressed["ArrowLeft"] && keysPressed["ArrowRight"]) {
    playerPetObject.speedX = 0;
  }

  // diagonal condition
  if (playerPetObject.speedX && playerPetObject.speedY) {
    playerPetObject.speedX *= 0.7;
    playerPetObject.speedY *= 0.7;
  }
}

function stopMovement(event) {
  if (event) {
    keysPressed[event.key] = false; // false -> key unpressed
  }

  playerPetObject.speedX = 0;
  playerPetObject.speedY = 0;
}

function moveCapipepo(direction) {
  switch (direction) {
    case "left":
      playerPetObject.speedX = setSpeed(-8);
      break;
    case "right":
      playerPetObject.speedX = setSpeed(8);
      break;
    case "down":
      playerPetObject.speedY = setSpeed(8);
      break;
    case "up":
      playerPetObject.speedY = setSpeed(-8);
      break;
  }
}

function setSpeed(maxSpeed) {
  // modify speed according to map size
  let newSpeed = (maxSpeed * map.width) / maxMapWidth;
  return newSpeed;
}

function sendPosition(x, y) {
  fetch(`http://localhost:3000/mokepon/${playerId}/position`, {
    method: "POST",
    body: JSON.stringify({ x, y }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function ({ enemies }) {
        spawnEnemyMokepons(enemies);
      });
    }
  });
}

function spawnEnemyMokepons(enemies) {
  enemyMokepons = enemies.map(function (enemy) {
    let enemyMokepon = null;

    if (enemy.mokepon) {
      const enemyMokeponName = enemy.mokepon.name || "";

      if (enemyMokeponName === "Hipodoge") {
        enemyMokepon = new Mokepon(
          "Hipodoge",
          "./assets/mokepons_mokepon_hipodoge_attack.png",
          "./assets/hipodoge.png",
          enemy.id
        );
      } else if (enemyMokeponName === "Capipepo") {
        enemyMokepon = new Mokepon(
          "Capipepo",
          "./assets/mokepons_mokepon_capipepo_attack.png",
          "./assets/capipepo.png",
          enemy.id
        );
      } else if (enemyMokeponName === "Ratigueya") {
        enemyMokepon = new Mokepon(
          "Ratigueya",
          "./assets/mokepons_mokepon_ratigueya_attack.png",
          "./assets/ratigueya.png",
          enemy.id
        );
      }

      enemyMokepon.x = enemy.x;
      enemyMokepon.y = enemy.y;

      return enemyMokepon;
    }
  });
}

function checkMapBoundaries() {
  // map limits
  const upMap = 0;
  const downMap = map.height - playerPetObject.height;
  const leftMap = 0;
  const rightMap = map.width - playerPetObject.width;

  // player edges
  const upPlayer = playerPetObject.y;
  const leftPlayer = playerPetObject.x;

  if (upPlayer < upMap) {
    playerPetObject.y = upMap;
  }

  if (upPlayer > downMap) {
    playerPetObject.y = downMap;
  }

  if (leftPlayer < leftMap) {
    playerPetObject.x = leftMap;
  }

  if (leftPlayer > rightMap) {
    playerPetObject.x = rightMap;
  }
}

function checkCollision(enemy) {
  if (enemy.x === undefined || enemy.y === undefined) {
    return;
  }

  // player edges
  const downPlayerPet = playerPetObject.y + playerPetObject.height - 7.5;
  const upPlayerPet = playerPetObject.y + 7.5;
  const rightPlayerPet = playerPetObject.x + playerPetObject.width - 7.5;
  const leftPlayerPet = playerPetObject.x + 7.5;

  // enemy edges
  const downEnemyPet = enemy.y + enemy.height;
  const upEnemyPet = enemy.y;
  const rightEnemyPet = enemy.x + enemy.width;
  const leftEnemyPet = enemy.x;

  if (
    // cases where there is no collision
    downPlayerPet < upEnemyPet ||
    upPlayerPet > downEnemyPet ||
    rightPlayerPet < leftEnemyPet ||
    leftPlayerPet > rightEnemyPet
  ) {
    return;
  }

  stopMovement();
  clearInterval(interval); // stop painting the map

  enemyId = enemy.id;

  mapSection.style.display = "none";
  chooseAttackSection.style.display = "flex";
  restartButton.style.display = "none";
  showSelectedPetEnemy.innerHTML = enemy.name;

  showAttacks();
}

// PLAYER ATTACKS

function showAttacks() {
  playerPetObject.attacks.forEach((attack) => {
    attackOption = `<button id=${attack.id} class="btn-attack">${attack.name}</button>`;
    attackButtonsSection.innerHTML += attackOption;
  });

  attackButtons = document.querySelectorAll(".btn-attack");

  attackSequence(); // save attack sequence
}

function attackSequence() {
  attackButtons.forEach((attackButton) => {
    // get click event info
    attackButton.addEventListener("click", (e) => {
      let attackName = e.target.textContent; // get attack name (attack button text content)
      playerAttacks.push(attackName);
      attackButton.style.background = "#1e3b64";
      attackButton.disabled = true;

      if (playerAttacks.length === 5) {
        sendAttacks();
      }
    });
  });
}

function sendAttacks() {
  // send attacks to backend
  fetch(`http://localhost:3000/mokepon/${playerId}/attacks`, {
    method: "POST",
    body: JSON.stringify({ attacks: playerAttacks }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  interval = setInterval(getEnemyAttacks, 50); // continually request the other player's attacks
}

// ENEMY ATTACKS (cpu)

// function randomEnemyAttacks() {
//   let enemyPetAttacks = collidedEnemyPet.attacks;

//   // add an extra attack if the enemy's pet is more powerful than the player's pet
//   if (enemyAttacks.length < 1) { // this condition is to prevent him from adding another extra attack
//     if ((playerPetType == '🔥' && enemyPetType == '💧') || (playerPetType == '🌱' && enemyPetType == '🔥') || (playerPetType == '💧' && enemyPetType == '🌱')) {
//       enemyPetAttacks.push(
//         { name: enemyPetType, id: enemyAttackButtonId }
//       );
//     }
//   }

//   let randomAttackNumber = random(0, enemyPetAttacks.length - 1);
//   enemyAttacks.push(enemyPetAttacks[randomAttackNumber].name);

//   // delete the selected attack to prevent it from being selected again
//   enemyPetAttacks.splice(randomAttackNumber, 1);

//   // Start combat
//   if (enemyAttacks.length === 5) {
//     combat();
//   }
// }

// ENEMY ATTACKS (player)

function getEnemyAttacks() {
  // get attacks from the other player
  fetch(`http://localhost:3000/mokepon/${enemyId}/attacks`).then(function (
    res
  ) {
    if (res.ok) {
      res.json().then(function ({ attacks }) {
        if (attacks.length === 5) {
          enemyAttacks = attacks;
          combat();
        }
      });
    }
  });
}

// COMBAT AND MESSAGES

function combat() {
  clearInterval(interval);

  for (
    let attackNumber = 0;
    attackNumber < playerAttacks.length;
    attackNumber++
  ) {
    if (playerAttacks[attackNumber] === enemyAttacks[attackNumber]) {
      saveCombatAttacks(attackNumber); // save the number of the attack chosen in an array
      createMessage(/* 'ES UN EMPATE🤝🏼' */);
    } else if (
      (playerAttacks[attackNumber] === "💧" &&
        enemyAttacks[attackNumber] === "🔥") ||
      (playerAttacks[attackNumber] === "🔥" &&
        enemyAttacks[attackNumber] === "🌱") ||
      (playerAttacks[attackNumber] === "🌱" &&
        enemyAttacks[attackNumber] === "💧")
    ) {
      saveCombatAttacks(attackNumber);
      createMessage(/* 'GANASTE🥳' */);
      playerWins++;
    } else {
      saveCombatAttacks(attackNumber);
      createMessage(/* 'PERDISTE☹️' */);
      enemyWins++;
    }
  }

  // show wins
  showPlayerWins.innerHTML = `🏆${playerWins}`;
  showEnemyWins.innerHTML = `🏆${enemyWins}`;

  checkWins(); // check who won
}

function saveCombatAttacks(attackNumber) {
  // save the chosen attack to display it on the screen
  showPlayerAttack = playerAttacks[attackNumber];
  showEnemyAttack = enemyAttacks[attackNumber];
}

function createMessage(/* message */) {
  // create messages (attack sequence)
  let newPlayerAttack = document.createElement("span");
  let newEnemyAttack = document.createElement("span");
  newPlayerAttack.innerHTML = showPlayerAttack;
  newEnemyAttack.innerHTML = showEnemyAttack;

  // add messages to HTML
  showPlayerAttackSection.appendChild(newPlayerAttack);
  showEnemyAttackSection.appendChild(newEnemyAttack);

  // show combat results
  // result.innerHTML = message;
}

function checkWins() {
  attackButtonsSection.style.display = "none";
  subtitle.style.display = "none";
  showMessagesSection.style.background = "#11468F";
  restartButton.style.display = "inline-block";

  // check who won
  if (playerWins === enemyWins) {
    result.innerHTML = "¡ES UN EMPATE!🤝🏼";
  } else if (playerWins > enemyWins) {
    result.innerHTML = "¡FELICIDADES, GANASTE!🏆";
  } else {
    result.innerHTML = "LO SIENTO, PERDISTE☹️";
  }
}

// RESTART GAME
function restartGame() {
  location.reload();
}
