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
    const temperatureInput = addPlanetModal.querySelector('#planetTemperature');
    const massInput = addPlanetModal.querySelector('#planetMass');
    const atmosphereInput = addPlanetModal.querySelector('#planetAtmosphere');
    const satellitesInput = addPlanetModal.querySelector('#planetSatellites');
    const missionsInput = addPlanetModal.querySelector('#planetMissions');

    const newPlanet = {
        name: nameInput.value.trim(),
        image: imageInput.value.trim(),
        description: descriptionInput.value.trim(),
        details: {
            temperature: temperatureInput.value.trim(),
            mass: massInput.value.trim(),
            atmosphere: atmosphereInput.value.trim(),
            satellites: satellitesInput.value.split(',').map(s => s.trim()),
            missions: missionsInput.value.split(',').map(m => m.trim())
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
    temperatureInput.value = '';
    massInput.value = '';
    atmosphereInput.value = '';
    satellitesInput.value = '';
    missionsInput.value = '';

    const homePage = document.querySelector('page-home');
    if (homePage) {
        homePage.connectedCallback();
    }
});

