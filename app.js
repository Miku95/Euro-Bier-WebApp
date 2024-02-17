const userId = getUserIdFromUrl();
console.log("User ID:", userId);

document.getElementById('purchaseBeer').addEventListener('click', function() {
    purchaseItem('purchaseBeer', userId);
});

document.getElementById('purchaseSpezi').addEventListener('click', function() {
    purchaseItem('purchaseSpezi', userId);
});

document.getElementById('purchaseKiste').addEventListener('click', function() {
    purchaseItem('purchaseKiste', userId);
});

function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

function purchaseItem(action, userId) {
    const data = {
        action: action,
        userId: userId, // Include the UserID in the request data
    };
    fetch('https://script.google.com/macros/s/AKfycbyid3TwlUSBEG7uRTiup_AvALBKSoiaMvqaHhJQ8MOaMmjnFBTF_Q5t9spHHx-Zu6J1/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // or 'application/json' if you've handled CORS
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // This line correctly parses the JSON response body
    })
    .then(data => {
        console.log(data); // Make sure data is what you expect
        if (data.status === "success") {
            document.getElementById('responseMessage').innerText = data.message + ". New credit: " + data.newCredit + "€";
        } else {
            document.getElementById('responseMessage').innerText = "Error: " + data.message;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.getElementById('responseMessage').innerText = 'Error making request. See console for more details.';
    });
}
