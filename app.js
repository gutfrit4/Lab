class HomePage extends HTMLElement {    
    constructor() {
        super();
        this.planets = [];
    }

    async getTranslation(term) {
        const url = new URL('https://free-google-translator.p.rapidapi.com/external-api/free-google-translator');
        const params = {
            from: 'en',
            to: 'uk',
            query: term,
        };
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '3675523b90msh38742820affd674p161d3ajsn9f4b000792ed',
                'x-rapidapi-host': 'free-google-translator.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data.translation;
        } catch (error) {
            console.log(error);
            console.error('Помилка при перекладі:', error);
        }
    }

    async fetchPlanetsData() {
        const url = 'https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planets/';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3675523b90msh38742820affd674p161d3ajsn9f4b000792ed',
                'x-rapidapi-host': 'planets-info-by-newbapi.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.planets = data.map((planet) => {
                return {
                    id: planet.id,
                    name: planet.name,
                    image: planet.imgSrc.img,
                    description: planet.description,
                    details: {
                        mass: planet.basicDetails.mass,
                    }
                }
            });
        } catch (error) {
            console.error('Помилка при отриманні даних про планети:', error);
        }
    }

    async getTranslatedPlanet() {
        const loader = document.querySelector('ion-loading');
        loader.present();
        const savedPlanets = JSON.parse(localStorage.getItem('planets')) || [];
        const allPlanets = this.planets.concat(savedPlanets);
        const tempPlanets = Promise.all(
            allPlanets.map(async(planet) => {
                return {
                    id: planet.id,
                    name: await this.getTranslation(planet.name),
                    image: planet.image,
                    description: await this.getTranslation(planet.description),
                    details: {
                        mass: planet.details.mass,
                    }
                }
            })
        );
        this.planets = await tempPlanets;
        this.render();
        loader.dismiss();
    }

    render() {
        const sortDir = localStorage.getItem('sort-direction') || 'asc';
        let allPlanets = [];

        if (sortDir === 'asc') {
            allPlanets = this.planets.sort((a, b) => (a.name > b.name ? 1 : -1));
        }
        
        if (sortDir === 'desc') {
            allPlanets = this.planets.sort((a, b) => (a.name > b.name ? -1 : 1));
        }

        if (sortDir === 'mass') {
            allPlanets = this.planets.sort((a, b) => (a.mass > b.mass ? 1 : -1));
        }


        this.innerHTML = `
            <ion-header>
                <ion-toolbar>
                    <ion-title>Планети Сонячної системи</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-grid>
                    <ion-row>
                    ${allPlanets.map(planet => `
                        <ion-col size="12" size-sm="6" size-md="4">
                            <ion-card class="planet-card" button href="/planet/${planet.id}">
                                <ion-img src="${planet.image}"></ion-img>
                                <ion-card-header>
                                    <ion-card-title>${planet.name}</ion-card-title>
                                </ion-card-header>
                                <ion-card-content>
                                    <p>${planet.description}</p>
                                </ion-card-content>
                            </ion-card>
                        </ion-col>
                    `).join('')}
                </ion-row>
                </ion-grid>
            </ion-content>
        `;
    }

    async connectedCallback() {
        await this.fetchPlanetsData();
        await this.getTranslatedPlanet();
    }
}

class PlanetPage extends HTMLElement {
    constructor() {
        super();
        this.planet = {};
    }

    async fetchPlanetData() {
        const currentPlanetHash = window.location.hash;
        const planetId = decodeURI(currentPlanetHash.split('/').pop());
        const url = `https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planets/${planetId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3675523b90msh38742820affd674p161d3ajsn9f4b000792ed',
                'x-rapidapi-host': 'planets-info-by-newbapi.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (data.detail === 'Not Found') {
                const localPlanets = JSON.parse(localStorage.getItem('planets')) || [];
                this.planet = localPlanets.find(p => p.id.toString() === planetId);
            } else {
                this.planet = {
                    id: data.id,
                    name: data.name,
                    image: data.imgSrc.img,
                    description: data.description,
                    details: {
                        mass: data.basicDetails.mass,
                    }
                };
            }
        } catch (error) {
            console.error('Помилка при отриманні даних про планети:', error);
        } 
    }

    async getTranslation(term) {
        const url = new URL('https://free-google-translator.p.rapidapi.com/external-api/free-google-translator');
        const params = {
            from: 'en',
            to: 'uk',
            query: term,
        };
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '3675523b90msh38742820affd674p161d3ajsn9f4b000792ed',
                'x-rapidapi-host': 'free-google-translator.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data.translation;
        } catch (error) {
            console.log(error);
            console.error('Помилка при перекладі:', error);
        }
    }

    async getTranslatedPlanet() {
        const loader = document.querySelector('ion-loading');
        loader.present();
        const tempPlanet = {
            id: this.planet.id,
            name: await this.getTranslation(this.planet.name),
            image: this.planet.image,
            description: await this.getTranslation(this.planet.description),
            details: {
                mass: this.planet.details.mass,
            }
        }
        this.planet = tempPlanet;
        this.render();
        loader.dismiss();
    }

    render() { 
        if (!this.planet) {
            this.innerHTML = `
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Планета не знайдена</ion-title>
                        <ion-buttons slot="start">
                            <ion-back-button defaultHref="/"></ion-back-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <p>На жаль, інформація про цю планету відсутня.</p>
                </ion-content>
            `;
            return;
        }

        this.innerHTML = `
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button></ion-back-button>
                    </ion-buttons>
                    <ion-title>${this.planet.name}</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-breadcrumbs>
                    <ion-breadcrumb href="/">Головна</ion-breadcrumb>
                    <ion-breadcrumb>${this.planet.name}</ion-breadcrumb>
                </ion-breadcrumbs>
                <ion-img src="${this.planet.image}"></ion-img>
                <ion-card>
                    <ion-card-content>
                        <p>${this.planet.description}</p>
                    </ion-card-content>
                </ion-card>
                <ion-chip color="primary">
                    <ion-label>Маса: ${this.planet.details.mass}</ion-label>
                </ion-chip>
            </ion-content>
    `;
    }

    async connectedCallback() {
        await this.fetchPlanetData();
        await this.getTranslatedPlanet();
    }

    static get observedAttributes() {
        return ['name'];
    }

    attributeChangedCallback() {
        this.connectedCallback();
    }
}

customElements.define('page-home', HomePage);
customElements.define('page-planet', PlanetPage);
