const html = document.createElement('div');
const insertPoint = document.getElementById('app');
html.style.position = 'absolute';
html.style.top = '0';
html.style.left = '0';
html.style.width = '100%';
html.style.height = '100%';
html.style.backgroundColor = 'rgb(15, 15, 15)';
html.style.color = 'white';
html.style.textDecoration = 'underline';
html.style.display = 'flex';
html.style.justifyContent = 'center';
html.style.alignItems = 'center';
html.style.zIndex = '999';
html.innerHTML = '<h1 onmousemove="resetTimer();" onclick="resetTimer();">Ben je er nog?</h1>';

let timer = 0;

function resetTimer() {
    if (timer > 29 && insertPoint.contains(html)) {
        insertPoint.removeChild(html);
    }
    timer = 0;
}

function incrementTimer() {
    timer++;
    checkTimer();
}

function checkTimer() {
    if (timer > 29 && !insertPoint.contains(html)) {
        insertPoint.appendChild(html);
    }
}

document.addEventListener('mousemove', resetTimer);
document.addEventListener('click', resetTimer);
setInterval(incrementTimer, 5000);