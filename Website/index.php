<html>
    <script src="uikit/js/uikit.min.js"></script>
    <script src="uikit/js/uikit-icons.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="uikit/css/uikit.min.css" />
    <link rel="stylesheet" href="scrollbar.css" />
    <link rel="stylesheet" href="styles.css">


    <?php include 'head.php';?>
    <body>
        
        <div id="home" class="uk-section uk-section-secondary uk-light">
        
            <div class="uk-container">
                <h1 class=" uk-text-center uk-text-bold uk-text-italic " uk-parallax="y: -300;">SecuroServ</h1>
                <h2 class="uk-text-center uk-text-italic" uk-parallax="x: 500;"> No Signup, No Bullshit </h2>
                <div class="image-stack">

                    <div uk-parallax="x: 350;blur: 30;" class="image-stack__item--middle">
                        
                        <img src="assets/ssweb.png" width="" height="" alt="" class="img">
                        
                    </div>
                    <div uk-parallax="x: -700;blur: 30;" class="image-stack__item--bottom">
                        <img src="assets/sselectron.png" width="" height="" alt="" class="img">
                        
                    </div>
                    <div uk-parallax="x: -700;blur: 30;" class="image-stack__item--top">
                        <img src="assets/ssweb2.png" width="" height="" alt="" class="img">
                    </div>

                </div>

                <div style="height:20%"></div>
            </div>

            
        </div>

        <div  class="uk-section uk-section-primary uk-dark">
            <div id="about" class="uk-container">

                <div class="uk-child-width-1-3@m uk-dark" uk-grid uk-scrollspy="cls: uk-animation-slide-bottom; target: .uk-card; delay: 300; repeat: true" uk-height-match="target: > div > .uk-card">
                    <div>
                        <div class="uk-card uk-card-secondary uk-card-body">
                            <h3 class="uk-card-title">2048 bit RSA</h3>
                            <p>Encryption keys are created using 2048 bit RSA encryption</p>
                        </div>
                    </div>
                    <div>
                        <div class="uk-card uk-card-secondary uk-card-body" uk-scrollspy-class="uk-animation-slide-top">
                            <h3 class="uk-card-title">Open Source</h3>
                            <p>Server and Client code available on Github</p>
                        </div>
                    </div>
                    <div>
                        <div class="uk-card uk-card-secondary uk-card-body">
                            <h3 class="uk-card-title">Blind Server</h3>
                            <p>The server will never know your keys, making your messages virtually impossible to decrypt.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div id = "download" class="uk-section uk-section-default uk-dark">
            <div class="uk-container">

                

            </div>
        </div>

    <body>
    <div>
    <?php include 'foot.php';?>
    </div>




</html>
