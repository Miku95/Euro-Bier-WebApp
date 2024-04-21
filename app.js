// Define the URL as a global variable
const baseURL = 'https://script.google.com/macros/s/AKfycbzNJ0tdUZmLDRwdhAldu_z-s8Iig7m6G2ok5EysKfSKkH7ZppJFTu181xWZK7MaspYZ/exec';

document.addEventListener('DOMContentLoaded', function() {
        const userId = getUserIdFromURL();

        Promise.all([
            fetchCurrentCredit(userId),
            fetchUserEmail(userId),
            getHighScores('getTopHighscores')
        ]).then(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }).catch((error) => {
            console.error("Error loading data:", error);
            document.getElementById('loadingOverlay').style.display = 'none';
        });
    document.getElementById('purchaseBeer').addEventListener('click', () => purchaseItem('purchaseBeer'));
    document.getElementById('purchaseSpezi').addEventListener('click', () => purchaseItem('purchaseSpezi'));
    document.getElementById('purchaseKiste').addEventListener('click', () => purchaseItem('purchaseKiste'));
    } 
);

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
    document.getElementById('loadingOverlay').style.display = 'flex';

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
                // Show the success modal instead of updating responseMessage
                showSuccessModal();
                return Promise.all([
                    fetchCurrentCredit(userId),
                    getHighScores('getTopHighscores')
                ]);
            } else {
                document.getElementById('responseMessage').innerText = `Fehler: ${data.message}`;
            }
        })
        .then(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage:', error);
            document.getElementById('responseMessage').innerText = 'Fehler bei der Anfrage. Weitere Details finden Sie in der Konsole.';
        })
        .finally(() => {
            // Always hide the loading overlay, regardless of the result
            document.getElementById('loadingOverlay').style.display = 'none';
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
                if(data.credit == "AUFLADEN!") {data.credit = 0;}
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
                    
                    // Wait for a brief period before triggering other actions
                    setTimeout(() => {
                        // Trigger actions that depend on the email being saved
                        fetchCurrentCredit(userId);
                        getHighScores('getTopHighscores');
                    }, 5000); // Wait for 2 seconds (adjust as needed)
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

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';

    // Close the modal when the user clicks anywhere outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function setupCloseModalListener() {
    const closeButton = document.querySelector('.close'); // Get the close button
    const modal = document.getElementById('successModal'); // Get the modal

    // Set up the click event listener for the close button
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupCloseModalListener();
});
