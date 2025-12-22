// lettre.js - Système de physique pour les lettres dans la boîte aux lettres
import { game } from "./gamelogic.js";

// Constantes et variables
const lettresEmojis = ["✉️", "💌", "📨", "📧"];
let activeLetters = [];
let lastEnfantsCount = 0;
let animationFrameId = null;
let lastCheckedHour = -1; // Pour détecter quand on passe à minuit
let shouldFallAtMidnight = false; // Flag pour faire tomber les lettres à minuit
const MAX_LETTERS = 50; // Maximum de lettres
let lastDiscreteRemoval = 0; // Pour la suppression discrète
let lastMailboxX = null; // Position précédente de la boîte aux lettres
let lastMailboxY = null;

class Letter {
  constructor(container) {
    this.container = container;
    this.emoji =
      lettresEmojis[Math.floor(Math.random() * lettresEmojis.length)];
    this.size = 20 + Math.random() * 10; // Taille entre 20 et 30px
    this.x = Math.random() * (container.offsetWidth - this.size);
    this.y = -this.size;
    this.vx = (Math.random() - 0.5) * 1.5; // Vitesse horizontale réduite
    this.vy = 0;
    this.gravity = 0.3;
    this.bounce = 0.4; // Coefficient de rebond réduit pour plus de stabilité
    this.friction = 0.98; // Friction augmentée pour ralentir plus vite
    this.rotation = (Math.random() - 0.5) * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;

    // Créer l'élément DOM
    this.element = document.createElement("div");
    this.element.className = "lettre-physique";
    this.element.textContent = this.emoji;
    this.element.style.position = "absolute";
    this.element.style.fontSize = `${this.size}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `rotate(${this.rotation}deg)`;
    this.element.style.pointerEvents = "none";
    this.element.style.userSelect = "none";
    this.isDestroying = false;
    this.shouldFall = false; // Pour faire tomber à minuit
    container.appendChild(this.element);
  }

  update() {
    // Ne pas animer si la lettre est en train d'être détruite
    if (this.isDestroying) return;
    const containerHeight = this.container.offsetHeight;
    const containerWidth = this.container.offsetWidth;

    // Appliquer la gravité
    this.vy += this.gravity;

    // Mettre à jour la position
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Si la lettre doit tomber (minuit), augmenter la gravité
    if (this.shouldFall) {
      this.gravity = 0.8; // Gravité plus forte pour tomber rapidement
      // Si elle sort du conteneur, la supprimer
      if (this.y > containerHeight + 50) {
        this.isDestroying = true;
        this.remove();
        return;
      }
    }

    // Empiler les lettres au sol au lieu de les brûler (sauf si elles doivent tomber)
    if (this.y + this.size >= containerHeight && !this.shouldFall) {
      this.vy = 0;
      this.vx *= this.friction;
      this.rotationSpeed *= 0.5;

      // Arrêter les petites oscillations
      if (Math.abs(this.vx) < 0.1) {
        this.vx = 0;
      }
      if (Math.abs(this.rotationSpeed) < 0.5) {
        this.rotationSpeed = 0;
      }

      // Simplement se positionner au fond - les lettres peuvent se superposer
      this.y = containerHeight - this.size;
    }

    // Collision avec les murs latéraux
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -this.bounce;
    } else if (this.x + this.size >= containerWidth) {
      this.x = containerWidth - this.size;
      this.vx *= -this.bounce;
    }

    // Collision entre lettres - version très légère (elles peuvent se superposer)
    // On garde juste une légère séparation pour éviter les explosions de vitesse
    activeLetters.forEach((other) => {
      if (
        other !== this &&
        !other.isDestroying &&
        !this.shouldFall &&
        !other.shouldFall
      ) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (this.size + other.size) / 2;

        // Seulement si elles sont très proches et en mouvement rapide
        if (
          distance < minDistance * 0.6 &&
          distance > 0.1 &&
          (Math.abs(this.vx) > 1 ||
            Math.abs(this.vy) > 1 ||
            Math.abs(other.vx) > 1 ||
            Math.abs(other.vy) > 1)
        ) {
          // Normaliser la direction
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;

          // Séparation très légère
          const separation = overlap * 0.15;
          this.x -= nx * separation;
          this.y -= ny * separation;
          other.x += nx * separation;
          other.y += ny * separation;

          // Réduire légèrement les vitesses pour éviter les explosions
          const damping = 0.9;
          this.vx *= damping;
          this.vy *= damping;
          other.vx *= damping;
          other.vy *= damping;
        }
      }
    });

    // Mettre à jour l'élément DOM
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

function createLetter() {
  const container = document.getElementById("lettres-container");
  if (!container) return;

  // Si on dépasse le maximum, supprimer discrètement la plus ancienne
  if (activeLetters.length >= MAX_LETTERS) {
    const now = Date.now();
    // Supprimer une lettre toutes les 500ms maximum
    if (now - lastDiscreteRemoval > 500) {
      const oldestLetter = activeLetters.find(
        (letter) => !letter.shouldFall && !letter.isDestroying
      );
      if (oldestLetter) {
        oldestLetter.isDestroying = true;
        oldestLetter.remove();
        activeLetters = activeLetters.filter((l) => l !== oldestLetter);
        lastDiscreteRemoval = now;
      }
    } else {
      // Ne pas créer de nouvelle lettre si on vient de supprimer une
      return;
    }
  }

  const letter = new Letter(container);
  activeLetters.push(letter);

  // Démarrer la boucle d'animation si elle n'est pas déjà active
  if (!animationFrameId) {
    animateLettres();
  }
}

function animateLettres() {
  activeLetters.forEach((letter) => letter.update());

  // Nettoyer les lettres détruites du tableau
  activeLetters = activeLetters.filter((letter) => !letter.isDestroying);

  // Détecter le mouvement de la boîte aux lettres et secouer les lettres
  const windowElement = document.getElementById("child");
  if (windowElement) {
    const currentX = parseInt(windowElement.dataset.worldX || "0", 10);
    const currentY = parseInt(windowElement.dataset.worldY || "0", 10);

    if (lastMailboxX !== null && lastMailboxY !== null) {
      const deltaX = currentX - lastMailboxX;
      const deltaY = currentY - lastMailboxY;
      shakeLettersFromMovement(deltaX, deltaY);
    }

    lastMailboxX = currentX;
    lastMailboxY = currentY;
  }

  // Vérifier si on est passé à minuit (00h00) - faire tomber toutes les lettres
  const currentHour = game.gameTime.getHours();
  if (currentHour === 0 && lastCheckedHour !== 0) {
    // C'est minuit, faire tomber toutes les lettres
    shouldFallAtMidnight = true;
    activeLetters.forEach((letter) => {
      letter.shouldFall = true;
      letter.gravity = 0.8; // Gravité plus forte
    });
  }
  // Réinitialiser le flag quand on sort de minuit
  if (currentHour !== 0 && lastCheckedHour === 0) {
    shouldFallAtMidnight = false;
  }
  lastCheckedHour = currentHour;

  // Continuer l'animation s'il y a des lettres actives
  animationFrameId = requestAnimationFrame(animateLettres);
}

// Fonction pour secouer les lettres quand la boîte aux lettres bouge
function shakeLettersFromMovement(deltaX, deltaY) {
  if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return; // Ignorer les très petits mouvements

  // Appliquer des forces aux lettres proportionnelles au mouvement
  const forceMultiplier = 0.3;
  activeLetters.forEach((letter) => {
    if (!letter.isDestroying && !letter.shouldFall) {
      // Force basée sur le mouvement de la fenêtre
      letter.vx += deltaX * forceMultiplier;
      letter.vy += deltaY * forceMultiplier;
      letter.rotationSpeed += (deltaX + deltaY) * 0.1;

      // Limiter les vitesses pour éviter les explosions
      letter.vx = Math.max(-10, Math.min(10, letter.vx));
      letter.vy = Math.max(-10, Math.min(10, letter.vy));
      letter.rotationSpeed = Math.max(-20, Math.min(20, letter.rotationSpeed));
    }
  });
}

// Fonction pour éjecter toutes les lettres immédiatement
export function ejectLetters() {
  activeLetters.forEach((letter) => {
    if (!letter.isDestroying) {
      letter.shouldFall = true;
      letter.gravity = 0.8; // Gravité plus forte pour tomber rapidement
      // Ajouter une petite force vers le bas pour accélérer la chute
      letter.vy += 2;
    }
  });
}

// Fonction principale pour mettre à jour la physique des lettres
export function updateLettresPhysics() {
  const container = document.getElementById("lettres-container");
  if (!container) return;

  // Initialiser les positions de la boîte aux lettres si ce n'est pas déjà fait
  const windowElement = document.getElementById("child");
  if (windowElement && lastMailboxX === null) {
    lastMailboxX = parseInt(windowElement.dataset.worldX || "0", 10);
    lastMailboxY = parseInt(windowElement.dataset.worldY || "0", 10);
  }

  // Vérifier si le nombre d'enfants a augmenté
  const currentCount = game.enfants;
  if (currentCount > lastEnfantsCount) {
    const newLetters = currentCount - lastEnfantsCount;

    // Créer toutes les nouvelles lettres avec un petit délai entre chacune
    for (let i = 0; i < newLetters; i++) {
      setTimeout(() => {
        createLetter();
      }, i * 100);
    }

    lastEnfantsCount = currentCount;
  }

  // Démarrer la boucle d'animation si elle n'est pas déjà active
  if (!animationFrameId) {
    animateLettres();
  }
}

// Exposer la fonction globalement pour le bouton HTML
window.ejectLetters = ejectLetters;
