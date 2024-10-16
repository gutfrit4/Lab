const planets = [
    {
        name: 'Меркурій',
        image:
            'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
        description: 'Найменша планета Сонячної системи та найближча до Сонця.',

        details: {
            temperature: 'Вдень до 430°C, вночі до -180°C',
            mass: '3.3011×10^23 кг',
            distance: '57.9 млн км від Сонця',
            discovery: 'Відома з давнини',
            atmosphere: 'Відсутня',
            satellites: 'Немає',
            missions: ['Mariner 10', 'MESSENGER', 'BepiColombo']
        }
    },
    {
        name: 'Венера',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
        description: 'Друга планета від Сонця, відома своєю густою атмосферою.',
        details: {
            temperature: 'Середня близько 464°C',
            mass: '4.8675×10^24 кг',
            distance: '108.2 млн км від Сонця',
            discovery: 'Відома з давнини',
            atmosphere: 'Вуглекислий газ, азот',
            satellites: 'Немає',
            missions: ['Venera', 'Magellan', 'Venus Express', 'Akatsuki']
        }
    },
    {
        name: 'Земля',
        image:
            'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg'
        ,
        description: 'Наша рідна планета, єдина відома з життям.',
        details: {
            temperature: 'Середня близько 15°C',
            mass: '5.97237×10^24 кг',
            distance: '149.6 млн км від Сонця',
            discovery: 'Не застосовується',
            atmosphere: 'Азот, кисень',
            satellites: 'Місяць',
            missions: ['Apollo', 'Міжнародна космічна станція']
        }
    }
];

class HomePage extends HTMLElement {    
    connectedCallback() {
        const sortDir = localStorage.getItem('sort-direction') || 'asc';
        const savedPlanets = JSON.parse(localStorage.getItem('planets')) || [];
        let allPlanets = [];

        if (sortDir === 'asc') {
            allPlanets = planets.concat(savedPlanets).sort((a, b) => (a.name > b.name ? 1 : -1));
        }
        
        if (sortDir === 'desc') {
            allPlanets = planets.concat(savedPlanets).sort((a, b) => (a.name > b.name ? -1 : 1));
        }

        if (sortDir === 'mass') {
            allPlanets = planets.concat(savedPlanets).sort((a, b) => (a.mass > b.mass ? 1 : -1));
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
                            <ion-card class="planet-card" button href="/planet/${planet.name}">
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
}

class PlanetPage extends HTMLElement {
    connectedCallback() {
        const savedPlanets = JSON.parse(localStorage.getItem('planets')) || [];
        const allPlanets = planets.concat(savedPlanets);
        const currentPlanetHash = window.location.hash;
        const planetName = decodeURI(currentPlanetHash.split('/').pop());
        const planet = allPlanets.find(p => p.name === planetName);

        if (!planet) {
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
                    <ion-title>${planet.name}</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-breadcrumbs>
                    <ion-breadcrumb href="/">Головна</ion-breadcrumb>
                    <ion-breadcrumb>${planet.name}</ion-breadcrumb>
                </ion-breadcrumbs>
                <ion-img src="${planet.image}"></ion-img>
                <ion-card>
                    <ion-card-content>
                        <p>${planet.description}</p>
                    </ion-card-content>
                </ion-card>
                <ion-chip color="primary">
                    <ion-label>Температура: ${planet.details.temperature}</ion-label>
                </ion-chip>
                <ion-chip color="secondary">
                    <ion-label>Маса: ${planet.details.mass}</ion-label>
                </ion-chip>
                <ion-chip color="tertiary">
                    <ion-label>Відстань від Сонця: ${planet.details.distance}</ion-label>   
                </ion-chip>
                <ion-chip color="success">
                    <ion-label>Рік відкриття: ${planet.details.discovery}</ion-label>
                </ion-chip>
                <ion-accordion-group>
                    <ion-accordion value="atmosphere">
                        <ion-item slot="header">
                            <ion-label>Хімічний склад атмосфери</ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <p>${planet.details.atmosphere}</p>
                        </div>
                    </ion-accordion>
                    <ion-accordion value="satellites">
                        <ion-item slot="header">
                            <ion-label>Супутники</ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <p>${planet.details.satellites}</p>
                        </div>
                    </ion-accordion>
                    <ion-accordion value="missions">
                        <ion-item slot="header">
                            <ion-label>Дослідження</ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <ion-list>
                                ${planet.details.missions.map(mission => `
                                    <ion-item>${mission}</ion-item>
                                `).join('')}
                            </ion-list>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
            </ion-content>
    `;
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