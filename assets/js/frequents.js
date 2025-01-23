const buttonPositions = [];
const maxAttempts = 10;
const pageNames = {
    'ship-info': 'Schipinformatie',
    'travel-info': 'Reisinformatie',
    'restaurant': 'Eten en Drinken',
    'movies-series': 'Films en Series',
    'games': 'Games',
    'music': 'Muziek',
    'vr-holodeck': 'VR-Holodeck',
    'wellness-fitness': 'Wellness en Fitness',
    'cameras': 'Camera feeds',
    'library': 'Library'
};

function pager(page) {
    let frequents = localStorage.getItem('frequents');
    if (frequents === null) {
        console.warn('no frequents created yet, creating them!');
        frequents = {};
    } else {
        frequents = JSON.parse(frequents);
    }

    if (frequents[page]) {
        frequents[page]++;
    } else {
        frequents[page] = 1;
    }

    localStorage.setItem('frequents', JSON.stringify(frequents));

    switch (page) {
        case 'ship-info':
            window.location.href = './ship-info/';
            break;
        case 'travel-info':
            window.location.href = './travel-info/';
            break;
        case 'restaurant':
            window.location.href = './restaurant/';
            break;
        case 'movies-series':
            window.location.href = './movies-series/';
            break;
        case 'games':
            window.location.href = './games/';
            break;
        case 'music':
            window.location.href = './music/';
            break;
        case 'vr-holodeck':
            window.location.href = './vr-holodeck/';
            break;
        case 'wellness-fitness':
            window.location.href = './wellness-fitness/';
            break;
        case 'cameras':
            window.location.href = './cameras/'
            break;
        case 'library':
            window.location.href = './library/'
            break;
        default:
            console.warn('Page not found');
            break;
    }
}

function doRectanglesOverlap(rect1, rect2) {
    return !(rect1.left > rect2.right || rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.bottom < rect2.top);
}

window.onload = () => {
    let frequents = localStorage.getItem('frequents');
    if (frequents === null) {
        console.warn('No frequents created yet, creating them!');
        frequents = {};
    } else {
        frequents = JSON.parse(frequents);
    }

    let frequentsList = document.getElementById('frequents');
    frequentsList.style.position = 'relative';
    let sortedPages = Object.keys(frequents).sort((a, b) => frequents[b] - frequents[a]).slice(0, 4);

    for (let page of sortedPages) {
        let button = document.createElement('button');
        button.innerHTML = pageNames[page] || page;
        button.setAttribute('class', 'frequent');
        button.addEventListener('click', function () { pager(page); });

        const frequentsWidth = frequentsList.offsetWidth;
        const frequentsHeight = frequentsList.offsetHeight;
        let buttonWidth = 250;
        let buttonHeight = 70;
        let position;
        let attempts = 0;

        do {
            let x = Math.random() * (frequentsWidth - buttonWidth);
            let y = Math.random() * (frequentsHeight - buttonHeight);

            position = {
                left: x,
                right: x + buttonWidth,
                top: y,
                bottom: y + buttonHeight
            };

            let hasOverlap = buttonPositions.some(pos => doRectanglesOverlap(position, pos));

            if (!hasOverlap || attempts >= maxAttempts) {
                button.style.position = 'absolute';
                button.style.left = `${x}px`;
                button.style.top = `${y}px`;
                buttonPositions.push(position);
                break;
            }

            attempts++;
        } while (true);

        frequentsList.appendChild(button);
    }
}