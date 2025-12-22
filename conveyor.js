const conveyorButton = document.createElement('button');
conveyorButton.textContent = 'Activate Conveyor 🏗️ (€5000)';
document.getElementById('ui').appendChild(conveyorButton);


conveyorButton.onclick = () => {
  if (game.enfants > 100 && game.argent >= 5000 && !game.conveyorActive) {
    game.argent -= 5000;
    game.elfEfficiency += 0.2
    game.conveyorActive = true;
    conveyorButton.disabled = true;
    conveyorButton.textContent = 'Conveyor Activated 🏗️';
    console.log('Conveyor activated! Elf efficiency +0.2 🎉');
    updateUI();
  }
};

//  elfEfficiency: 1,
//   conveyorActive: false,