<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">

    <title>Page Not found</title>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      background: rgb(14, 30, 37);
      color: white;
      overflow: hidden;
    }

    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 24px;
    }

    .main {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 75%;
      max-width: 364px;
      padding: 24px;
      background: white;
      color: rgb(14, 30, 37);
      border-radius: 8px;
      box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .16);
    }

    a {
      margin: 0;
      text-decoration: none;
      font-weight: 600;
      line-height: 24px;
      color: #00ad9f;
    }

    a svg {
      position: relative;
      top: 2px;
    }

    a:hover,
    a:focus {
      text-decoration: underline;
      color: #007A70;
    }

    a:hover svg path{
      fill: #007A70;
    }

    p:last-of-type {
      margin: 0;
    }

    </style>
  </head>
  <body>
    <div class="main">
      <div class="card">
        <div class="header">
          <h1>Page Not found</h1>
        </div>
        <div class="body">
          <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
          <p>
            <a id="back-link" href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#00ad9f" d="M11.9998836,4.09370803 L8.55809517,7.43294953 C8.23531459,7.74611298 8.23531459,8.25388736 8.55809517,8.56693769 L12,11.9062921 L9.84187871,14 L4.24208544,8.56693751 C3.91930485,8.25388719 3.91930485,7.74611281 4.24208544,7.43294936 L9.84199531,2 L11.9998836,4.09370803 Z"/>
              </svg>
              Back to our site
             </a>
          </p>
        </div>
      </div>
    </div>
    <script>
      (function() {
        if (document.referrer && document.location.host && document.referrer.match(new RegExp("^https?://" + document.location.host))) {
          document.getElementById("back-link").setAttribute("href", document.referrer);
        }
      })();
    </script>
  </body>
</html>