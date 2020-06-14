<html>
    <script src="uikit/js/uikit.min.js"></script>
    <script src="uikit/js/uikit-icons.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="uikit/css/uikit.min.css" />
    <link rel="stylesheet" href="scrollbar.css" />
    <link rel="stylesheet" href="styles.css">


    <head>
        <title>
            SecuroServ
        </title>
</head>
<header>  


<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar" class="">
    <nav class="uk-navbar-container " uk-navbar>
        <div>
            <a class="uk-navbar-item uk-logo"><i uk-icon="icon: code" class="uk-padding"></i>SecuroServ</a>
        </div>
        <div class="uk-navbar-right">

            <ul class="uk-navbar-nav uk-padding-small">
                <li class=""><a class="uk-button-text" href="#body" uk-scroll>Home</a></li>
                <li class=""><a class=" uk-button-text" href="#about" uk-scroll>About</a></li>
                <li class=""><a class="uk-button-text" href="#download" uk-scroll>Download</a></li>
                
            </ul>

        </div>
    </nav>
</div>



</header>    <body>
        
        <div id="home" class="uk-section uk-section-secondary uk-light">
        
            <div class="uk-container">
                <h1 class=" uk-text-center uk-text-bold uk-text-italic " uk-parallax="y: -300;">SecuroServ</h1>
                <h2 class="uk-text-center uk-text-italic" uk-parallax="x: 500;"> No Bullshit </h2>
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

        <div id="download" class="uk-section uk-section-default uk-preserve-color">
            <div class="uk-container">

                <div class="uk-panel uk-dark uk-margin-medium">
                    <h2>Download</h2>
                </div>

                <div class="uk-grid-match uk-child-width-expand@m" uk-grid>
                    <div>
                        <div class="uk-card uk-card-default uk-card-body">
                            <h4>Download Client</h4>
                            <div class="uk-position-relative uk-visible-toggle uk-light">

                                <ul class="uk-subnav" uk-height-match="target: > li">
                                    <li > 
                                        <p>
                                            <a href="versions/SecuroServ-win32-x64.zip">
                                            <img src="assets/windows.png" alt="" width="64" height="64">
					    </a>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <a href="versions/SecuroServ-linux-x64.zip">
                                            <img src="assets/linux.png" alt=""  width="64" height="64">
					    </a>
                                        </p>
                                    </li>
                                    <li >
                                        <p>
                                            <a href="versions/SecuroServ-darwin-x64.zip">
                                            <img src="assets/apple.png" alt=""  width="64" height="64">
					    </a>
                                        </p>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="uk-card uk-card-default uk-card-body">
                            <h4>See Web Client</h4>
                            <div class="uk-background-primary container">
                                <button class="uk-button uk-button-primary uk-button-large button_shake" onclick="window.open('http://70.142.145.111','_blank')">
                                    <svg width="100%" height="100%" viewBox="0 0 180 60" class="border">
                                        <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
                                        <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
                                    </svg>
                                    <span>Web Client</span>
                                </button>
                            </div>
                        </div>
                    </div>
            </div>

    </div>
</div>

    <body>
    <div>
    <div>

<div class="uk-section uk-section-secondary uk-light">
    <div class="uk-container">

        <h3>SecuroServ</h3>

        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
            <div>
				<a>Privacy Policy.</a>
				<a>Source Code</a>
            </div>
        </div>

    </div>
</div>

</div>
    </div>




</html>

