const buttonPositions = [];
const maxAttempts = 10;
const pageNames = {
    'ship-info': 'Schipinformatie',
    'travel-info': 'Reisinformatie',
    'restaurant': 'Eten en drinken',
    'movies-series': 'Films en series',
    'games': 'Games',
    'music': 'Muziek',
    'vr-holodeck': 'VR-holodeck'
};

function page(page) {
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
        default:
            console.warn('Page not found');
            break;
    }
}

function doRectanglesOverlap(rect1, rect2) {
    return !(rect1.left > rect2.right || rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.bottom < rect2.top);
}

// ...existing code...

window.onload = function () {
    let frequents = localStorage.getItem('frequents');
    if (frequents === null) {
        console.warn('no frequents created yet, creating them!');
        frequents = {};
    } else {
        frequents = JSON.parse(frequents);
    }

    let frequentsList = document.getElementById('frequents');
    frequentsList.style.position = 'relative'; // Add this line to set the parent div's position to relative
    let sortedPages = Object.keys(frequents).sort((a, b) => frequents[b] - frequents[a]).slice(0, 4);

    for (let page of sortedPages) {
        let button = document.createElement('button');
        button.innerHTML = pageNames[page] || page;
        button.setAttribute('class', 'frequent');
        button.onclick = function () {
            page(page);
        };

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