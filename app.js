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
    let col;
    switch (action) {
        case 'purchaseBeer':
            col = 1;
            break;
        case 'purchaseSpezi':
            col = 2;
            break;
        case 'purchaseKiste':
            col = 3;
            break;
        default:
            console.error('Invalid action');
            return;
    }

    const data = {
        action: action,
        row: 2, // Example row, adjust based on your needs
        col: col
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
        // Correctly access the properties of the data object
        if (data.status === "success") {
            document.getElementById('responseMessage').innerText = data.message + ". New credit: " + data.newCredit;
        } else {
            // Handle any other status
            document.getElementById('responseMessage').innerText = "Error: " + data.message;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.getElementById('responseMessage').innerText = 'Error making request. See console for more details.';
    });
}
