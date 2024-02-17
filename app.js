document.addEventListener('DOMContentLoaded', function() {
    const userId = new URLSearchParams(window.location.search).get('userId');
    fetchCurrentCredit(userId);
    getHighScores('getTopHighscores');
    
    // Event-Listener an die Schaltflächen anhängen
    document.getElementById('purchaseBeer').addEventListener('click', function() {
        purchaseItem('purchaseBeer');
    });

    document.getElementById('purchaseSpezi').addEventListener('click', function() {
        purchaseItem('purchaseSpezi');
    });

    document.getElementById('purchaseKiste').addEventListener('click', function() {
        purchaseItem('purchaseKiste');
    });

    document.getElementById('loadCredit5').addEventListener('click', function() {
        uploadCredit('loadCredit5'); // 5 Euro hochladen
    });

    document.getElementById('loadCredit10').addEventListener('click', function() {
        uploadCredit('loadCredit10'); // 10 Euro hochladen
    });
});


function purchaseItem(action) {
    const userId = new URLSearchParams(window.location.search).get('userId');
    const data = {
        action: action,
        userId: userId,
    };
    fetch('https://script.google.com/macros/s/AKfycbyid3TwlUSBEG7uRTiup_AvALBKSoiaMvqaHhJQ8MOaMmjnFBTF_Q5t9spHHx-Zu6J1/exec?userId=${userId}', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data)
    })
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
            document.getElementById('responseMessage').innerText = "Fehler: " + data.message;
        }
    })
    .catch(error => {
        console.error('Fehler bei der Abfrage:', error);
        document.getElementById('responseMessage').innerText = 'Fehler bei der Anfrage. Weitere Details finden Sie in der Konsole.';
    });
}

function fetchCurrentCredit(userId) {
    const data = {
        action: 'getCredit',
        userId: userId,
    };
    fetch('https://script.google.com/macros/s/AKfycbyid3TwlUSBEG7uRTiup_AvALBKSoiaMvqaHhJQ8MOaMmjnFBTF_Q5t9spHHx-Zu6J1/exec?userId=${userId}', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht in Ordnung');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.status === "success") {
            document.getElementById('userName').innerText = "Hallo " + data.name + "! - Was darf es sein?";
            document.getElementById('currentCredit').innerText = "Aktueller Kontostand: €" + data.credit;
        } else {
            console.error("Fehler beim Abrufen des aktuellen Guthabens:", data.message);
        }
    })
    .catch(error => {
        console.error('Fehler bei der Abfrage:', error);
    });
}

function uploadCredit(action, amount) {
    const userId = new URLSearchParams(window.location.search).get('userId');
    const data = {
        action: action,
        userId: userId,
    };
    fetch(`https://script.google.com/macros/s/AKfycbyid3TwlUSBEG7uRTiup_AvALBKSoiaMvqaHhJQ8MOaMmjnFBTF_Q5t9spHHx-Zu6J1/exec?userId=${userId}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain;charset=utf-8',
    },
        body: JSON.stringify(data)
    })  
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
            document.getElementById('responseMessage').innerText = "Fehler: " + data.message;
        }
    })
    .catch(error => {
        console.error('Fehler bei der Abfrage:', error);
        document.getElementById('responseMessage').innerText = 'Fehler bei der Anfrage. Weitere Details finden Sie in der Konsole.';
    });
}

function getHighScores(action) {
    const userId = new URLSearchParams(window.location.search).get('userId');
    const data = {
        action: action,
        userId: userId,
    };

    fetch(`https://script.google.com/macros/s/AKfycbyid3TwlUSBEG7uRTiup_AvALBKSoiaMvqaHhJQ8MOaMmjnFBTF_Q5t9spHHx-Zu6J1/exec?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(responseData => { // Now responseData holds the parsed JSON data
            console.log(responseData);
            // Check if topSpezi exists
            if (responseData.topSpeziHighscores) {
                document.getElementById('topSpezi').innerHTML = "<h3>Top 3 Spezi Highscores</h3>";
                // Display top 3 highscores for spezi
                responseData.topSpeziHighscores.forEach((score, index) => {
                    document.getElementById('topSpezi').innerHTML += `<p>${index + 1}. ${score.userId}: ${score.count}</p>`;
                });
            } else {
                console.error('Top Spezi scores not found in response data');
            }

            // Check if topBeer exists
            if (responseData.topBeerHighscores) {
                document.getElementById('topBeer').innerHTML = "<h3>Top 3 Beer Highscores</h3>";
                // Display top 3 highscores for beer
                responseData.topBeerHighscores.forEach((score, index) => {
                    document.getElementById('topBeer').innerHTML += `<p>${index + 1}. ${score.userId}: ${score.count}</p>`;
                });
            } else {
                console.error('Top Beer scores not found in response data');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
