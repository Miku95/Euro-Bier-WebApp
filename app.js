document.getElementById('purchaseBeer').addEventListener('click', function() {
    purchaseItem('purchaseBeer');
});

document.getElementById('purchaseSpezi').addEventListener('click', function() {
    purchaseItem('purchaseSpezi');
});

document.getElementById('purchaseKiste').addEventListener('click', function() {
    purchaseItem('purchaseKiste');
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
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.status === "success") {
            document.getElementById('responseMessage').innerText = data.message;
            fetchCurrentCredit(userId);
        } else {
            document.getElementById('responseMessage').innerText = "Error: " + data.message;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.getElementById('responseMessage').innerText = 'Error making request. See console for more details.';
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
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.status === "success") {
            document.getElementById('userName').innerText = "Hi " + data.name + "! - Lass es dir schmecken!";
            document.getElementById('currentCredit').innerText = "Aktueller Kontostand: €" + data.credit;
        } else {
            console.error("Error fetching current credit:", data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

