<!DOCTYPE html>
<html lang="de">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1€ Getränke App</title>
    <style>
        body {
            background-color: green;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            padding: 10px;
        }
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        #currentCredit {
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 20px;
            color: #333;
            text-align: center;
        }

        #userName {
            font-size: 24px;
            font-weight: bold;
            color: black;
            margin-bottom: 10px;
            text-align: center;
        }

        #buttonsContainer {
            text-align: center;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        button {
            padding: 10px 20px;
            font-size: 18px;
        }

        #logoContainer {
            margin-top: 20px;
            text-align: center;
        }

        #clubLogo {
            width: 200px;
            height: auto;
        }

        .paypal-button {
            margin-top: 20px;
        }
        .modal {
        display: none;
        position: fixed;
        z-index: 2;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0,0.4);
        }

        .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        }

        .close {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        }

        .close:hover,
        .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
        }

    </style>
</head>
<body>
    <!-- Loading overlay -->
    <div id="loadingOverlay" class="loading-overlay">
        <div class="loader"></div>
    </div>

    <h1>1€ Getränke App</h1>
    <div id="userName"></div>
   
    <div id="buttonsContainer">
        <button id="purchaseBeer">Bier</button>
        <button id="purchaseSpezi">Spezi</button>
        <button id="purchaseKiste">Kiste</button>
        <button id="LadeButton" onclick="window.open('https://www.paypal.me/GermaniaKa/')">Konto aufladen</button> 
    </div>
    <div id="currentCredit">Aktueller Kontostand: ?€</div>

    <div id="logoContainer">
        <img id="clubLogo" src="logo.png" alt="Club Logo">
    </div>
    <div id="topSpezi"></div>
    <div id="topBeer"></div>
    <div id="successModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Transaktion erfolgreich!</h2>
          <p>Lass es dir schmecken!</p>
        </div>
      </div>
    <script src="app.js"></script>
</body>
</html>
