// Global variables
const html = document.documentElement;
const app = document.getElementById('app');
const mainContainer = document.getElementById('main-container');

// App object to initialize and run the application
const App = {
    init: function() {
        this.UI.renderMenu();
        this.UI.renderThemeToggle();
        this.UI.setView('Calculator');
        this.addEventListeners();
    },

    addEventListeners: function() {
        window.addEventListener('message', this.handleMessage.bind(this));
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
        new ResizeObserver(this.sendHeightToParent).observe(document.body);
    },

    handleMessage: function(event) {
        if (event.data === 'requestHeight') {
            App.sendHeightToParent();
        }
        if (event.data.action === 'setTheme') {
            App.UI.setTheme(event.data.theme);
        }
        if (event.data.action === 'privateApi' && typeof acceptPrivateApiResponse !== 'undefined') {
            acceptPrivateApiResponse(event.data);
        }
    },

    handleDOMContentLoaded: function() {
        App.UI.setView('Calculator'); // Set the default view to Calculator
        App.UI.renderMenu();
        App.UI.renderThemeToggle();
        App.sendHeightToParent();  // Send initial height on DOM load
    },

    sendHeightToParent: function() {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'myApp', action: 'setHeight', height }, '*');
    }
};

// UI object to handle DOM manipulations and rendering
App.UI = {
    header: document.querySelector('h1'),
    ddMenu: document.querySelector('#ddMenu'),

    toggleTheme: function() {
        html.classList.toggle('dark');
        this.renderThemeToggle(); // Update the theme toggle buttons
    },

    setView: function(view) {
        this.header.innerText = view;
        this.toggleMenu(true);

        if (view === 'Calculator') {
            App.Calculator.render();
        } else if (view === 'About') {
            this.renderAbout();
        } else if (view === 'Contact') {
            this.renderContact();
        }
        App.sendHeightToParent();  // Update height after changing view
    },

    toggleMenu: function(hide) {
        if (!hide) {
            this.ddMenu.classList.toggle('hidden');
            document.querySelectorAll('svg').forEach((el) => {
                el.classList.toggle('hidden');
            });
        } else {
            this.ddMenu.classList.add('hidden');
            document.querySelectorAll('svg')[0].classList.remove('hidden');
            document.querySelectorAll('svg')[1].classList.add('hidden');
        }
    },

    renderAbout: function() {
        app.innerHTML = `
            <div class="p-4">
                <h2 class="text-2xl font-bold mb-4">About This Application</h2>
                <p class="mb-4">This application demonstrates basic JavaScript functionalities including a calculator, an about section, and a contact section.</p>
            </div>
        `;
    },

    renderContact: function() {
        app.innerHTML = `
            <div class="p-4">
                <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
                <p class="mb-4">If you have any questions or feedback, please reach out to us at:</p>
                <ul class="list-disc list-inside mb-4">
                    <li>Email: <a href="mailto:mohammad.abu.ahmad@e.braude.co.il" class="text-blue-600 underline">mohammad.abu.ahmad@e.braude.co.il</a></li>
                    <li>Phone: <a href="tel:+972-5400000000" class="text-blue-600 underline">+1 (234) 567-890</a></li>
                </ul>
            </div>
        `;
    },

    renderMenu: function() {
        const menuItems = [
            { name: 'Calculator', action: () => this.setView('Calculator') },
            { name: 'About', action: () => this.setView('About') },
            { name: 'Contact', action: () => this.setView('Contact') }
        ];

        this.ddMenu.innerHTML = '';
        menuItems.forEach(item => {
            const button = document.createElement('button');
            button.className = 'block py-1 px-2';
            button.innerText = item.name;
            button.onclick = item.action;
            this.ddMenu.appendChild(button);
        });

        const navBar = document.querySelector('.sm\\:flex');
        navBar.innerHTML = '';
        menuItems.forEach(item => {
            const button = document.createElement('button');
            button.innerText = item.name;
            button.onclick = item.action;
            navBar.appendChild(button);
        });

        document.querySelectorAll('.block.sm\\:hidden').forEach(button => {
            button.addEventListener('click', () => this.toggleMenu());
        });
    },

    renderThemeToggle: function() {
        const isDarkMode = html.classList.contains('dark');

        const toggleButtons = [
            { className: `py-1 px-2 rounded ${isDarkMode ? 'hidden' : 'block'} bg-blue-500 hover:bg-blue-600 text-white`, text: 'Dark', action: this.toggleTheme.bind(this) },
            { className: `py-1 px-2 rounded ${isDarkMode ? 'block' : 'hidden'} bg-yellow-400 hover:bg-yellow-500 text-black`, text: 'Light', action: this.toggleTheme.bind(this) }
        ];

        const container = document.getElementById('themeToggleContainer');
        container.innerHTML = '';

        toggleButtons.forEach(buttonInfo => {
            const button = document.createElement('button');
            button.className = buttonInfo.className;
            button.innerText = buttonInfo.text;
            button.onclick = buttonInfo.action;
            container.appendChild(button);
        });
    }
};

// Calculator object to handle calculator-specific logic
App.Calculator = {
    addRow: function(container, content) {
        const row = `<div class='grid grid-cols-5 gap-2'>${content}</div>`;
        container.insertAdjacentHTML('beforeend', row);
    },

    addMonitor: function(container, text) {
        const t = text ?? '';
        const monitor = `
        <div id='monitor' class="bg-white dark:bg-gray-800 border-4 border-blue-400 dark:border-gray-700 h-20 flex items-center col-span-5 text-blue-800 dark:text-white p-2 rounded-lg mb-2 font-bold text-4xl">
            ${t}
        </div>`;
        container.insertAdjacentHTML('beforeend', monitor);
    },

    button: function(text) {
        const c = text === 'calculate' ? 'col-span-4' : '';
        return `<div class='bg-blue-400 dark:bg-gray-600 hover:bg-blue-600 dark:hover:bg-gray-700 text-white ${c} py-1 rounded-md text-center text-lg font-bold cursor-pointer d-btn'>${text}</div>`;
    },

    addButtons: function(container, nums) {
        const btnHTML = nums.map((n) => this.button(n)).join('');
        this.addRow(container, btnHTML);
    },

    click: function(event) {
        const monitor = document.getElementById('monitor');
        const bac = monitor.innerText.trim();
        const a = event.target.innerText;
        console.log(a);
        if (a === 'clear') {
            monitor.innerText = '';
        } else if (a === 'calculate') {
            monitor.innerText = bac + '=' + eval(bac);
        } else {
            monitor.innerText += a;
        }
    },

    render: function() {
        const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '+', '-', '*', '/', '**', 'calculate', 'clear'];
        app.innerHTML = '';
        this.addMonitor(app);
        this.addButtons(app, labels);
        const buttons = document.querySelectorAll('.d-btn');
        buttons.forEach((el) => el.addEventListener('click', this.click));
    }
};

// Initialize the app
App.init();
