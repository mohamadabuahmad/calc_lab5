// Global variable declarations
const header = document.querySelector('h1'); // Header element
const app = document.getElementById('app'); // Main application container
const ddMenu = document.querySelector('#ddMenu'); // Dropdown menu element
const html = document.documentElement; // HTML document root element

// Function to send the height of the content to the parent page
const sendHeightToParent = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'myApp', action: 'setHeight', height }, '*');
};

// Function to toggle between light and dark themes
const toggleTheme = () => {
    html.classList.toggle('dark');
    renderThemeToggle(); // Update the theme toggle buttons
};

// Function to set the current view (Calculator, About, Contact)
const setView = (v) => {
    header.innerText = v;
    toggleMenu(true);

    if (v === 'Calculator') {
        renderCalculator();
    } else if (v === 'About') {
        renderAbout();
    } else if (v === 'Contact') {
        renderContact();
    }
    sendHeightToParent();  // Update height after changing view
};

// Function to toggle the dropdown menu visibility
const toggleMenu = (hide) => {
    if (!hide) {
        ddMenu.classList.toggle('hidden');
        document.querySelectorAll('svg').forEach((el) => {
            el.classList.toggle('hidden');
        });
    } else {
        ddMenu.classList.add('hidden');
        document.querySelectorAll('svg')[0].classList.remove('hidden');
        document.querySelectorAll('svg')[1].classList.add('hidden');
    }
};

// Function to add a row of content to the container
const addRow = (container, content) => {
    const row = `<div class='grid grid-cols-5 gap-2'>${content}</div>`;
    container.insertAdjacentHTML('beforeend', row);
};

// Function to add a monitor display to the container
const addMonitor = (container, text) => {
    const t = text ?? '';
    const monitor = `
    <div id='monitor' class="bg-white dark:bg-gray-800 border-4 border-blue-400 dark:border-gray-700 h-20 flex items-center col-span-5 text-blue-800 dark:text-white p-2 rounded-lg mb-2 font-bold text-4xl">
        ${t}
    </div>`;
    container.insertAdjacentHTML('beforeend', monitor);
};

// Function to create a button element with the provided text
const button = (text) => {
    const c = text === 'calculate' ? 'col-span-4' : '';
    return `<div class='bg-blue-400 dark:bg-gray-600 hover:bg-blue-600 dark:hover:bg-gray-700 text-white ${c} py-1 rounded-md text-center text-lg font-bold cursor-pointer d-btn'>${text}</div>`;
};

// Function to add buttons to the container
const addButtons = (container, nums) => {
    const btnHTML = nums.map((n) => button(n)).join('');
    addRow(container, btnHTML);
};

// Function to handle button click events
const click = (event) => {
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
};

// Function to render the Calculator view
const renderCalculator = () => {
    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '+', '-', '*', '/', '**', 'calculate', 'clear'];
    app.innerHTML = '';
    addMonitor(app);
    addButtons(app, labels);
    const buttons = document.querySelectorAll('.d-btn');
    buttons.forEach((el) => el.addEventListener('click', click));
};

// Function to render the About view
const renderAbout = () => {
    app.innerHTML = '<div class="p-4 h-[200px] flex items-center justify-center">Temp for About</div>';
};

// Function to render the Contact view
const renderContact = () => {
    app.innerHTML = '<div class="p-4 h-[200px] flex items-center justify-center">Temp for Contact</div>';
};

// Function to render the menu items dynamically
const renderMenu = () => {
    const menuItems = [
        { name: 'Calculator', action: () => setView('Calculator') },
        { name: 'About', action: () => setView('About') },
        { name: 'Contact', action: () => setView('Contact') }
    ];

    ddMenu.innerHTML = '';

    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'block py-1 px-2';
        button.innerText = item.name;
        button.onclick = item.action;
        ddMenu.appendChild(button);
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
        button.addEventListener('click', () => toggleMenu());
    });
};

// Function to render the theme toggle buttons dynamically
const renderThemeToggle = () => {
    const isDarkMode = html.classList.contains('dark');
    
    const toggleButtons = [
        { className: `py-1 px-2 rounded ${isDarkMode ? 'hidden' : 'block'} bg-blue-500 hover:bg-blue-600 text-white`, text: 'Dark', action: toggleTheme },
        { className: `py-1 px-2 rounded ${isDarkMode ? 'block' : 'hidden'} bg-yellow-400 hover:bg-yellow-500 text-black`, text: 'Light', action: toggleTheme }
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
};

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    setView('Calculator'); // Set the default view to Calculator
    renderMenu();
    renderThemeToggle();
    sendHeightToParent();  // Send initial height on DOM load
});

// Listen for messages from the parent page
window.addEventListener('message', (event) => {
    if (event.data === 'requestHeight') {
        sendHeightToParent();
    }
    if (event.data.action === 'setTheme') {
        setTheme(event.data.theme);
    }
    if (event.data.action === 'privateApi' && typeof acceptPrivateApiResponse !== 'undefined') {
        acceptPrivateApiResponse(event.data);
    }
});

// Observe changes to the content's height
const resizeObserver = new ResizeObserver(() => {
    sendHeightToParent();
});
resizeObserver.observe(document.body);
