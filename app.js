// Define the URL as a global variable
const baseURL = 'https://script.google.com/macros/s/AKfycbw5Mye3nD3hFb1fK-oMiy2AfK4cqeqIFC6WqnxS7B6jfjw4I4pP0u4o23v4IkfeKzZw/exec';

document.addEventListener('DOMContentLoaded', function() {
    const userId = getUserIdFromURL();
    fetchCurrentCredit(userId);
    getHighScores('getTopHighscores');
    
    // Event listeners for the buttons
    document.getElementById('purchaseBeer').addEventListener('click', () => purchaseItem('purchaseBeer'));
    document.getElementById('purchaseSpezi').addEventListener('click', () => purchaseItem('purchaseSpezi'));
    document.getElementById('purchaseKiste').addEventListener('click', () => purchaseItem('purchaseKiste'));
    document.getElementById('loadCredit5').addEventListener('click', () => uploadCredit('loadCredit5'));
    document.getElementById('loadCredit10').addEventListener('click', () => uploadCredit('loadCredit10'));
});

function getUserIdFromURL() {
    return new URLSearchParams(window.location.search).get('userId');
}

function fetchFromBaseURL(action, userId, data) {
    return fetch(`${baseURL}?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data)
    });
}

function purchaseItem(action) {
    const userId = getUserIdFromURL();
    const data = { action, userId };
    
    fetchFromBaseURL(action, userId, data)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht in Ordnung');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.status === "success") {
                document.getElementById('responseMessage').innerText = data.message;
                fetchCurrentCredit(userId);
                getHighScores('getTopHighscores');
            } else {
                document.getElementById('responseMessage').innerText = `Fehler: ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage:', error);
            document.getElementById('responseMessage').innerText = 'Fehler bei der Anfrage. Weitere Details finden Sie in der Konsole.';
        });
}

function fetchCurrentCredit(userId) {
    const data = { action: 'getCredit', userId };
    
    fetchFromBaseURL('getCredit', userId, data)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht in Ordnung');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.status === "success") {
                document.getElementById('userName').innerText = `Hallo ${data.name}! - Was darf es sein?`;
                document.getElementById('currentCredit').innerText = `Aktueller Kontostand: €${data.credit}`;
            } else {
                console.error("Fehler beim Abrufen des aktuellen Guthabens:", data.message);
            }
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage:', error);
        });
}

function uploadCredit(action) {
    const userId = getUserIdFromURL();
    const data = { action, userId };
    
    fetchFromBaseURL(action, userId, data)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht in Ordnung');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.status === "success") {
                const message = `Guthaben erfolgreich hochgeladen!`;
                document.getElementById('responseMessage').innerText = message;
                fetchCurrentCredit(userId);
            } else {
                document.getElementById('responseMessage').innerText = `Fehler: ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage:', error);
            document.getElementById('responseMessage').innerText = 'Fehler bei der Anfrage. Weitere Details finden Sie in der Konsole.';
        });
}

function getHighScores(action) {
    const userId = getUserIdFromURL();
    const data = { action, userId };

    fetchFromBaseURL(action, userId, data)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht in Ordnung');
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            // Check if topSpezi exists
            if (responseData.topSpeziHighscores) {
                document.getElementById('topSpezi').innerHTML = "<h3>Top 3 Spezi Highscores</h3>";
                // Display top 3 highscores for spezi
                responseData.topSpeziHighscores.forEach((score, index) => {
                    document.getElementById('topSpezi').innerHTML += `<p>${index + 1}. ${score.userId}: ${score.count}</p>`;
                });
            } else {
                console.error('Top-Spezi-Highscores nicht gefunden');
            }

            // Check if topBeer exists
            if (responseData.topBeerHighscores) {
                document.getElementById('topBeer').innerHTML = "<h3>Top 3 Bier Highscores</h3>";
                // Display top 3 highscores for beer
                responseData.topBeerHighscores.forEach((score, index) => {
                    document.getElementById('topBeer').innerHTML += `<p>${index + 1}. ${score.userId}: ${score.count}</p>`;
                });
            } else {
                console.error('Top-Bier-Highscores nicht gefunden');
            }
        })
        .catch(error => {
            console.error('Fehler bei der Abfrage:', error);
        });
}
