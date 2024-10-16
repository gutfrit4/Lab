const radioGroupEl = document.querySelector('ion-radio-group');
const sortPlanetModal = document.querySelector('ion-modal[trigger="sort-planet-modal"]');
const closeModalButton = sortPlanetModal.querySelector('#close-sort-planet-modal');
const confirmSortPlanetButton = sortPlanetModal.querySelector('#confirm-sort-planet');

closeModalButton.addEventListener('click', async () => {
    await sortPlanetModal.dismiss();
});

confirmSortPlanetButton.addEventListener('click', async () => {
    await sortPlanetModal.dismiss();

    const homePage = document.querySelector('page-home');
    if (homePage) {
        homePage.connectedCallback();
    }
});

radioGroupEl.addEventListener('ionChange', () => {
    localStorage.setItem('sort-direction', radioGroupEl.value);
});