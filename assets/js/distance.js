document.addEventListener('DOMContentLoaded', function () {
    const arrivalDate = new Date('2025-06-13');
    const departureDate = new Date(arrivalDate);
    departureDate.setMonth(departureDate.getMonth() - 10);
    const totalDistance = 225000000;
    const speed = 774000;

    function calculateDistance() {
        const now = new Date();
        const elapsedTime = (now - departureDate) / (1000 * 60 * 60 * 24);
        const remainingDistance = totalDistance - (elapsedTime * speed);
        return remainingDistance > 0 ? remainingDistance : 0;
    }

    function updateDistance() {
        const distanceElement = document.getElementById('distance-ship-mars');
        const distance = calculateDistance();
        distanceElement.innerText = `${distance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} km`;
    }

    updateDistance();
    setInterval(updateDistance, 500);
});