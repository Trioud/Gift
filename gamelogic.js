// gamelogic.js
import {
  format,
  addHours,
  isEqual,
  isAfter,
} from "https://cdn.skypack.dev/date-fns@2.30.0";
import { toggleConvoyer } from "./conveyor.js";
import { finishGame } from "./finalcondition.js";

export const numberFormatter = new Intl.NumberFormat("fr-FR");

const endTime = new Date(2025, 11, 25, 0, 0, 0);

export let game = {
  argent: 0,
  cadeaux: 500000,
  enfants: 0,
  lutins: 0,
  workStartHour: 6,
  workEndHour: 18,
  fullTime: false,
  cdf: 0,
  lastNightClubMonthGranted: null,
  sabotages: 0,
  giftsPerChild: 5,
  eurosPerChild: 2,
  elfCost: 100,
  elfEfficiency: 1,
  conveyorActive: false,
  gameTime: new Date(2025, 0, 1, 9, 0, 0),
  gameStarted: false,
  marketingTier: 0,
  gameEnded: false,
  sabotageCoins: 100,
  achievement: [
    {
      label: "100 lettres d'enfants",
      threshold: 100,
      message:
        "Romeo, Ruben et Martin ont enfin reçu leurs cadeaux ! Mais ils en veulent plus... les petits gourmands ! 🎁",
      active: 0,
    },
    {
      label: "1000 lettres d'enfants",
      threshold: 1000,
      message:
        "Romeo, Ruben et Martin sont maintenant des influenceurs ! Ils ont convaincu tous leurs copains d'écrire au Père Noël... euh, à vous ! 📮",
      active: 0,
    },
    {
      label: "10000 lettres d'enfants",
      threshold: 10000,
      message:
        "Romeo, Ruben et Martin dirigent maintenant une armée d'enfants ! Le Père Noël va avoir besoin d'un avocat... 😈",
      active: 0,
    },
    {
      label: "100000 lettres d'enfants",
      threshold: 100000,
      message: "Romeo, Ruben et Martin ont envahi le Monde !",
      active: 0,
    },
    {
      label: "1000000 lettres d'enfants",
      threshold: 1000000,
      message: "Romeo, Ruben et Martin ont envahi la Galaxy !",
      active: 0,
    },
    {
      label: "Mascotte achetée",
      watch: "upgrades.marketing.mascotte.current",
      operator: "==",
      value: "upgrades.marketing.mascotte.limit",
      message: "Elle est trop belle !",
      active: 0,
    },
    {
      label: "Influenceur en herbe",
      watch: "upgrades.marketing.instagroom.current",
      operator: "==",
      value: 1,
      message: "Toujours plus de post !!",
      active: 0,
    },
    {
      label: "24/24 7j/7",
      watch: "upgrades.rh.elfSchedule.current",
      operator: "==",
      value: "upgrades.rh.elfSchedule.limit",
      message: "NE REFLECHISSEZ PLUS, EMBALLEZ",
      active: 0,
    },
  ],
  upgrades: {
    marketing: {
      mascotte: {
        label: `Faire designer une mascotte ${numberFormatter.format(
          10000
        )}€<br>Diminue le nombre de cadeaux nécessaire de 0,5 pour avoir une lettre d'enfant`,
        price: 10000,
        current: 0,
        limit: 1,
        reduction: 0.5,
        requiredTier: 0,
      },
      instagroom: {
        label: `Post Instagroom ${numberFormatter.format(
          45000
        )}€<br>Diminue le nombre de cadeaux nécessaire de 0,1 pour avoir une lettre d'enfant`,
        price: 45000,
        current: 0,
        limit: 5,
        reduction: 0.1,
        requiredTier: 0,
      },
      AIadd: {
        label: `Créer une publicité avec de l'IA ${numberFormatter.format(
          80000
        )}€<br>Diminue le nombre de cadeaux nécessaire de 0,5 pour avoir une lettre d'enfant`,
        price: 80000,
        current: 0,
        limit: 1,
        reduction: 0.5,
        requiredTier: 1,
      },
      skeletonsCloset: {
        label: `Trouver des éléments compromettants du Père Noël ${numberFormatter.format(
          150000
        )}€<br>Diminue le nombre de cadeaux nécessaire de 0,2 pour avoir une lettre d'enfant`,
        price: 150000,
        current: 0,
        limit: 5,
        reduction: 0.2,
        requiredTier: 2,
      },
      bribe: {
        label: `Pot-de-vin à l'Éducation National ${numberFormatter.format(
          1000000000
        )}€<br>Diminue le nombre de cadeaux nécessaire de 0,5 pour avoir une lettre d'enfant`,
        price: 1000000000,
        current: 0,
        limit: 1,
        reduction: 0.5,
        requiredTier: 3,
      },
    },
    rh: {
      elfEfficiency: {
        label: "Motiver les elfes 🗣️",
        price: 1,
        current: 0,
        limit: 1,
        reduction: 0.5,
      },
      marketingEfficiency: {
        label: "Partenariat avec Notendo",
        price: 1,
        current: 0,
        limit: 1,
        reduction: 0.5,
      },
      marketingUpgrade: {
        label: "Motiver le service Marketing 🗣️",
        price: 1,
        current: 0,
        limit: 3,
        reduction: 0.5,
      },
      elfSchedule: {
        label: "Améliorer & Augmenter la vie de travail des elfes",
        price: 1,
        current: 0,
        limit: 6,
        reduction: 0.5,
      },
      nightClub: {
        label: "Faire un nightclub pour les RH",
        price: 1,
        current: 0,
        limit: 1,
        reduction: 0.5,
      },
    },
    sabotage: {
      sabotageCoin: {
        label: "Gagne un Sabotage Coin",
        price: -1,
        current: 0,
        limit: 4,
        reduction: 0.5,
      },
      charbon: {
        label:
          "Remplacer avec du charbon les cadeaux du Père Noël (Multiplicateur de 10)",
        price: 1,
        current: 0,
        limit: 1,
        reduction: 1.25,
      },
      corruption: {
        label: "Corrompre les lutins du père Noël",
        price: 1,
        current: 0,
        limit: 1,
        reduction: 1.25,
      },
      casserole: {
        label: "Trouver les casseroles sur Madame Noël",
        price: 1,
        current: 0,
        limit: 1,
        reduction: 1.25,
      },
    },
  },
};

import { availability } from "./availability.js";
import { checkAchievements, updateAchievementsUI } from "./achievements.js";
import { updateLettresPhysics } from "./lettre.js";
import { updateGoodies } from "./goodies.js";

function isWorkHour() {
  if (game.fullTime) return true;

  const hour = game.gameTime.getHours();
  return hour >= game.workStartHour && hour < game.workEndHour;
}

let currentCanvas = "";

function changeCanvasBackground(newUrl) {
  const bgDiv = document.getElementById("bgTransition");

  // Prevent reapplying the same background
  if (newUrl === currentCanvas) return;

  // Start fade-in with new background
  bgDiv.style.backgroundImage = `url('${newUrl}')`;
  bgDiv.style.opacity = 0;

  setTimeout(() => {
    // Fade out the transition overlay
    if (newUrl == "./assets/background-people.png") {
      bgDiv.style.opacity = 1;
    } else {
      bgDiv.style.opacity = 0.4;
    }
    currentCanvas = newUrl;
  }, 200); // Match the CSS transition duration
}

window.startGame = () => {
  game.gameStarted = true;
  document.getElementById("missionScreen").style.display = "none";
  document.getElementById("station").style.display = "block";
  document.getElementById("child").style.display = "block";
  document.getElementById("achievements").style.display = "block";

  changeCanvasBackground("./assets/test-background.png");
  function handleNightClubMonthlyCDF() {
    // Nightclub must be bought
    if (game.upgrades.rh.nightClub.current < 1) return;

    const currentMonthKey =
      game.gameTime.getFullYear() + "-" + game.gameTime.getMonth();

    // Give CDF only once per month
    if (game.lastNightClubMonthGranted !== currentMonthKey) {
      game.cdf += 1;
      game.lastNightClubMonthGranted = currentMonthKey;
    }
  }
  let tick = setInterval(() => {
    const activeBg =
      isWorkHour() && game.lutins > 0
        ? "./assets/background-people.png"
        : "./assets/test-background.png";
    changeCanvasBackground(activeBg);
    if (game.gameStarted && isWorkHour()) {
      game.cadeaux += game.lutins;
    }

    game.gameTime = addHours(game.gameTime, 1);
    handleNightClubMonthlyCDF();
    game.enfants = Math.floor(game.cadeaux / game.giftsPerChild);
    game.argent += game.enfants * game.eurosPerChild;

    if (
      !game.gameEnded &&
      (isEqual(game.gameTime, endTime) || isAfter(game.gameTime, endTime))
    ) {
      //alert("HELLO");
      //game.gameEnded = true;
      finishGame(tick);
    }
    updateUI();
  }, 1000);
};

window.conveyorbelt = () => {
  if (game.enfants >= 100 && game.argent >= 5000 && !game.conveyorActive) {
    game.argent -= 5000;
    const conveyorBtn = document.querySelector(
      'button[onclick="conveyorbelt()"]'
    );
    game.conveyorActive = true;
    game.elfEfficiency += 0.2;
    conveyorBtn.textContent = "Tapis Roulant opérationnel 🏗️";
    updateUI();
  }
  updateUI();
};

window.acheterLutin = () => {
  const prix = game.elfCost;
  if (game.argent >= prix) {
    game.argent -= prix;
    game.lutins += 1;
    game.elfCost = Math.floor(game.elfCost * 1.5);
    updateUI();
  }
};

window.emballerManuellement = () => {
  game.cadeaux += 1;
  game.enfants = Math.floor(game.cadeaux / game.giftsPerChild);
  updateUI();
};

window.feteRH = () => {
  if (game.argent > 0) {
    game.cdf += 1;
    game.argent = 0;
    updateUI();
  }
};

window.utiliserSabotage = () => {
  if (game.cdf >= 5) {
    game.sabotages += 1;
    game.cdf -= 5;
    updateUI();
  }
};

function toggleModules() {
  const child = game.enfants;
  document
    .querySelector('[data-threshold="100"]')
    ?.style.setProperty("display", child >= 100 ? "block" : "none");

  // Ne pas toucher au display des fenêtres si elles sont minimisées manuellement
  document.querySelectorAll('[data-threshold="1000"]').forEach((el) => {
    if (el.dataset.manuallyMinimized !== "true") {
      el.style.display = child >= 1000 ? "block" : "none";
    }
  });
  document.querySelectorAll('[data-threshold="10000"]').forEach((el) => {
    if (el.dataset.manuallyMinimized !== "true") {
      el.style.display = child >= 10000 ? "block" : "none";
    }
  });
  document.querySelectorAll('[data-threshold="100000"]').forEach((el) => {
    if (el.dataset.manuallyMinimized !== "true") {
      el.style.display = child >= 100000 ? "block" : "none";
    }
  });
  document.querySelectorAll('[data-threshold="1000000"]').forEach((el) => {
    if (el.dataset.manuallyMinimized !== "true") {
      el.style.display = child >= 1000000 ? "block" : "none";
    }
  });
}

function toggleSubModules() {
  // Emballage
  toggleConvoyer();
}

function updateStat(id, value, prefix = "", unit = "") {
  const el = document.getElementById(id);
  const wrapper = el?.parentElement;
  if (!el || !wrapper) return;

  const thresholdAttr = wrapper.getAttribute("data-threshold");
  const threshold = thresholdAttr !== null ? parseInt(thresholdAttr) : null;
  const shouldDisplay = threshold === null || value >= threshold;

  if (shouldDisplay) {
    wrapper.style.display = "block";

    const formatted =
      typeof value === "number" ? numberFormatter.format(value) : value;

    el.textContent = `${prefix}${formatted}${unit}`;
  } else {
    wrapper.style.display = "none";
  }
}

export function updateMarketingUI() {
  const tier = game.marketingTier;

  document.querySelectorAll("[data-required-tier]").forEach((el) => {
    const required = parseInt(el.getAttribute("data-required-tier"));
    el.style.display = required <= tier ? "inline" : "none";
  });

  updateStat(
    "mascotte_stats",
    `${game.upgrades.marketing.mascotte.current}/${game.upgrades.marketing.mascotte.limit}`
  );
  updateStat(
    "instagroom_stats",
    `${game.upgrades.marketing.instagroom.current}/${game.upgrades.marketing.instagroom.limit}`
  );
  updateStat(
    "AIadd_stats",
    `${game.upgrades.marketing.AIadd.current}/${game.upgrades.marketing.AIadd.limit}`
  );
  updateStat(
    "skeletonsCloset_stats",
    `${game.upgrades.marketing.skeletonsCloset.current}/${game.upgrades.marketing.skeletonsCloset.limit}`
  );
  updateStat(
    "bribe_stats",
    `${game.upgrades.marketing.bribe.current}/${game.upgrades.marketing.bribe.limit}`
  );
}

export function updateUI() {
  updateStat("argent", game.argent);
  updateStat("cadeaux", game.cadeaux);
  updateStat("enfants", game.enfants);
  updateStat("giftsPerChild", game.giftsPerChild);
  updateStat("lutins", game.lutins);
  updateStat("sabotage", game.sabotages);
  updateStat("cdf", game.cdf);
  updateStat("lutins_stats", (game.lutins * game.elfEfficiency) / 2);
  updateStat("argent_stats", (game.enfants * game.eurosPerChild) / 2);

  updateStat("lettres", game.enfants);

  updateMarketingUI();

  updateStat("FeteRH_stats", `${game.cdf}`);
  updateStat(
    "elfEfficiency_stats",
    `${game.upgrades.rh.elfEfficiency.current}/${game.upgrades.rh.elfEfficiency.limit}`
  );
  updateStat(
    "marketingEfficiency_stats",
    `${game.upgrades.rh.marketingEfficiency.current}/${game.upgrades.rh.marketingEfficiency.limit}`
  );
  updateStat(
    "marketingUpgrade_stats",
    `${game.upgrades.rh.marketingUpgrade.current}/${game.upgrades.rh.marketingUpgrade.limit}`
  );
  updateStat(
    "elfSchedule_stats",
    `${game.upgrades.rh.elfSchedule.current}/${game.upgrades.rh.elfSchedule.limit}`
  );
  updateStat(
    "nightClub_stats",
    `${game.upgrades.rh.nightClub.current} / ${game.upgrades.rh.nightClub.limit} max`
  );
  console.log(game.sabotageCoins);
  updateStat("sabotageCoins_stats", `${game.sabotageCoins}`);
  updateStat("charbon_stats", `${game.upgrades.sabotage.charbon.current}`);
  updateStat(
    "corruption_stats",
    `${game.upgrades.sabotage.corruption.current}`
  );
  updateStat("casserole_stats", `${game.upgrades.sabotage.casserole.current}`);

  const time = document.getElementById("horloge");
  const timeParent = time?.parentElement;
  if (time && timeParent) {
    time.textContent = format(game.gameTime, "MMMM dd, HH:mm");
    timeParent.style.display = "block";
  }

  const lutinButton = document.querySelector(
    'button[onclick="acheterLutin()"]'
  );
  if (lutinButton) {
    lutinButton.textContent = `Embaucher un TEK1 (${numberFormatter.format(
      game.elfCost
    )}€)`;
  }

  toggleModules();
  toggleSubModules();

  // Préserver l'état minimisé des fenêtres après les toggles
  if (window.preserveMinimizedState) {
    window.preserveMinimizedState();
  }

  const horaires = document.getElementById("horairesLutins");
  if (horaires) {
    if (game.fullTime) {
      horaires.textContent = "Les TEK1 travaillent 24h/24 (temps plein)";
    } else {
      horaires.textContent = `Les TEK1 travaillent de ${game.workStartHour}h00 à ${game.workEndHour}h00`;
    }
  }
  availability();

  updateGoodies();
  checkAchievements();
  updateAchievementsUI();
  updateLettresPhysics();

  if (window.updateMarketingButtonsVisibility) {
    window.updateMarketingButtonsVisibility();
  }
}

updateUI();
