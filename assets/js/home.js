const hours = new Date().getHours();
const greetings = [
    { start: 0, end: 6, message: "Goedenacht, " },
    { start: 6, end: 12, message: "Goedemorgen, " },
    { start: 12, end: 18, message: "Goedemiddag, " },
    { start: 18, end: 24, message: "Goedenavond, " }
];

const groet = greetings.find(g => hours >= g.start && hours < g.end)?.message || "Hallo, ";
document.getElementById("greet").innerHTML = groet;

const names = ["Menno", "Peta", "Mark", "Jesse", "Jeroen", "Jordy", "Jelle", "Jasper", "Joris", "Soufiane", "Danique", "Lars", "Ivory"];
const name = names[Math.floor(Math.random() * names.length)];
document.getElementById("greet").innerHTML += name;

const date = new Date().toLocaleDateString();
document.getElementById("date").innerHTML = date;

function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    document.getElementById("time").innerHTML = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

updateTime();
setInterval(updateTime, 10000);

const landDate = localStorage.getItem('landDate');
const [day, month] = landDate.split('.').map(Number);
const remainingDays = month * 30 + day;
document.getElementById("days").innerHTML = remainingDays;

const degrees = Math.floor(Math.random() * 40) + 160;
document.getElementById('degrees').innerText = `${degrees}°C`;

const messages = [
    "Gisteren heb je veel digitale dingen gedaan en niet gesport of gelezen. Misschien is het een goed idee om vandaag wat meer te bewegen of een boek te lezen. Dit is een advies van de AI aan boord van het ruimteschip.",
    "Vandaag is een perfecte dag om wat tijd door te brengen in de fitnessruimte. Vergeet niet om ook voldoende water te drinken.",
    "Je hebt de afgelopen dagen veel tijd besteed aan het kijken van films. Probeer vandaag eens een nieuwe hobby op te pakken of een wandeling te maken.",
    "Het lijkt erop dat je de afgelopen week weinig hebt geslapen. Probeer vanavond wat eerder naar bed te gaan voor een goede nachtrust.",
    "Je hebt gisteren veel tijd doorgebracht in de VR-holodeck. Vergeet niet om ook wat tijd buiten door te brengen en te genieten van de echte wereld.",
    "Vandaag is een goede dag om wat tijd door te brengen met je medepassagiers. Sociale interactie is belangrijk voor je welzijn.",
    "Je hebt de afgelopen dagen veel tijd besteed aan het spelen van games. Probeer vandaag eens een boek te lezen of een nieuwe vaardigheid te leren.",
    "Het lijkt erop dat je de afgelopen week weinig hebt bewogen. Probeer vandaag wat tijd door te brengen in de fitnessruimte of een wandeling te maken.",
    "Je hebt gisteren veel tijd doorgebracht met het luisteren naar muziek. Vergeet niet om ook wat tijd te besteden aan andere activiteiten.",
    "Vandaag is een perfecte dag om wat tijd door te brengen in de bibliotheek. Lees een boek en ontspan."
];
document.querySelector('.what-todo').innerText = messages[Math.floor(Math.random() * messages.length)];