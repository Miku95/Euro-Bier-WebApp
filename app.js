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
            col = 1; // Assuming column 1 is for beer purchases
            break;
        case 'purchaseSpezi':
            col = 2; // Adjust the column index for Spezi purchases
            break;
        case 'purchaseKiste':
            col = 3; // Adjust the column index for Kiste purchases
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
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').innerText = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').innerText = 'Error making request';
    });
}

