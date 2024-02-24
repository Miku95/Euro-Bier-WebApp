// Define the URL as a global variable
const baseURL = 'https://script.google.com/macros/s/AKfycbzNJ0tdUZmLDRwdhAldu_z-s8Iig7m6G2ok5EysKfSKkH7ZppJFTu181xWZK7MaspYZ/exec';

document.addEventListener('DOMContentLoaded', function() {
    const userId = getUserIdFromURL();
    fetchCurrentCredit(userId);
    fetchUserEmail(userId)
        .then(email => {
            if (!email) {
                const userEmail = prompt('Bitte geb deine E-Mail-Adresse ein,\nwelche mit deinem PayPal-Konto verknüpft ist:');
                if (userEmail) {
                    saveUserEmail(userId, userEmail);
                }
            }
        });
    getHighScores('getTopHighscores');
    
    document.getElementById('purchaseBeer').addEventListener('click', () => purchaseItem('purchaseBeer'));
    document.getElementById('purchaseSpezi').addEventListener('click', () => purchaseItem('purchaseSpezi'));
    document.getElementById('purchaseKiste').addEventListener('click', () => purchaseItem('purchaseKiste'));
});

window.addEventListener('focus', function() {
    window.location.reload();
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        window.location.reload();
    }
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

function fetchUserEmail(userId) {
    const data = { action: 'getUserEmail', userId };
    
    return fetchFromBaseURL('getUserEmail', userId, data)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht in Ordnung');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.status === "success") {
                return data.email; // Return user's email if found
            } else {
                console.error("Fehler beim Abrufen der E-Mail-Adresse des Benutzers:", data.message);
                return null; // Return null if user's email not found
            }
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage:', error);
            return null; // Return null in case of an error
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

function saveUserEmail(userId, email) {
    if (email) {
        const data = {
            action: 'savePayPalEmail',
            userId: userId,
            email: email
        };

        fetchFromBaseURL('savePayPalEmail', userId, data)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    console.log("PayPal email saved successfully.");
                    alert("PayPal E-Mail gespeichert.");
                } else {
                    console.error("Error saving PayPal email:", data.message);
                    alert("Fehler beim Speichern der PayPal E-Mail.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Fehler bei der Anfrage.");
            });
    } else {
        alert('Bitte geben Sie Ihre PayPal E-Mail-Adresse ein.');
    }
}
