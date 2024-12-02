const addPlanetModal = document.querySelector('ion-modal[trigger="add-planet-modal"]');
const closeModalButton = addPlanetModal.querySelector('#close-add-planet-modal');
const confirmAddPlanetButton = addPlanetModal.querySelector('#confirm-add-planet');

closeModalButton.addEventListener('click', async () => {
    await addPlanetModal.dismiss();
});

confirmAddPlanetButton.addEventListener('click', () => {
    const nameInput = addPlanetModal.querySelector('#planetName');
    const imageInput = addPlanetModal.querySelector('#planetImage');
    const descriptionInput = addPlanetModal.querySelector('#planetDescription');
    const massInput = addPlanetModal.querySelector('#planetMass');
    
    const newPlanet = {
        id: Math.floor((Math.random() * 100) + 9),
        name: nameInput.value.trim(),
        image: imageInput.value.trim(),
        description: descriptionInput.value.trim(),
        details: {
            mass: massInput.value.trim(),
        }
    };

    if (!newPlanet.name || !newPlanet.image || !newPlanet.description) {
        alert('Будь ласка, заповніть всі обов\'язкові поля.');
        return;
    }

    const savedPlanets = JSON.parse(localStorage.getItem('planets')) || [];
    savedPlanets.push(newPlanet);
    localStorage.setItem('planets', JSON.stringify(savedPlanets));

    addPlanetModal.dismiss();

    nameInput.value = '';
    imageInput.value = '';
    descriptionInput.value = '';
    massInput.value = '';
    
    const homePage = document.querySelector('page-home');
    if (homePage) {
        homePage.connectedCallback();
    }
});

