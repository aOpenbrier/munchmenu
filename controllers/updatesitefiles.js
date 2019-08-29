const fs = require('fs')
let sitemap = []

module.exports = function (menu) {

    menu.forEach(tab => {
        // party tray menu are duplicate items from other tabs with less info
        if (tab.id != "menuparty") {
            tab.sections.forEach((section, sectionIndex) => {
                if (section["section items"]) {
                    section["section items"].forEach((item, itemIndex) => {
                        if (item.image) {
                            const filename = `${item.image.split('.')[0]}.html`
                            const data = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Munch Thai Food - ${item.name}</title>
    <meta name="description" content="${item.description}">
    <meta property="og:title" content="Munch Thai Food ${item.name}">
    <meta property="og:description" content="${item.description}">
    <meta property="og:image" content="https://www.munchthai.com/assets/images/${item.image}">
    <meta property="og:url" content="https://www.munchthai.com/menu/${filename}">
    <meta name="theme-color" content="#c4001b">
    <link rel="shortcut icon" href="../assets/images/favicon.png">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:700" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/reset.css">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<header>
<a class="sr-only sr-only-focusable" href="#top">skip navigation</a>
        <nav>
            <ul id='nav-collapse' role="menu">
                <li role="presentation" class='order'>
                    <a role="menuitem" href="https://www.toasttab.com/munch-thai/v2/online-order#!/" target="_blank">Order<span class='hidemobile'> Online</span></a>
                </li>
                <li role="presentation"><a role="menuitem" href="https://www.munchthai.com">Home</a></li>
                <li role="presentation"><a role="menuitem" href="https://www.munchthai.com#ourmenu">Our Menu</a></li>
                <li role="presentation"><a role="menuitem" href="#location">Contact Us</a></li>
                <li role="presentation" class="hamburger">
                    <i role="presentation" id='navtrigger' class="material-icons" onclick="openMenu()">
                        menu
                    </i>
                </li>
            </ul>
        </nav>
        </header>
    <main>
    <div class="menucontainer">
                <div>
                <a class="backbutton" href="../index.html#ourmenu"><i class="material-icons" role="presentation">arrow_back_ios</i>Back to Menu</a>
                </div>
                <div id="top" class="menu itempage">
                <div tabindex="0" aria-labelledby="itemname">
            <img class="itempagelogo" src="../assets/images/logo.png" alt="Munch Logo">
            <h5 id="itemname" class="itemname">${item.name}</h5>
            <p class="itemdesc">${item.description}</p>
            ${item["gf option"] ? `<p class="itemdietary">*Gluten-free optional</p>` : ''}
            ${item.vegan ? `<p class="itemdietary">*Vegan</p>` : ''}
            ${item.vegetarian ? `<p class="itemdietary">*Vegetarian</p>` : ''}
            ${item.extras ? `<p class="itemextras">${item.extras}</p>` : ''}
            ${item.options ? `<p class="itemoptions">${item.options}</p>` : ''}
            <div class="itemimagewrapper">
                <div class="itemimage" style="background-image:url(../assets/images/${item.image})">
                        <iframe title="share ${item.name} to facebook" src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fwww.munchthai.com%2Fmenu%2F${filename}&layout=button&size=small&width=59&height=20&appId" width="59" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
                <div>
            <div>
        </div>
    </div>
</div>
</main>
<footer>
    <div class="sociallinks">
        <a aria-label="Find on Instagram" href="https://www.facebook.com/munchthaifood/" rel="noopener" target="_blank"><img class="invert" src="../assets/images/instagram.png" alt="instagram logo"></a>
        <a aria-label="Like on Facebook" href="https://www.instagram.com/munchthaifood/" rel="noopener" target="_blank"> <img src="../assets/images/facebook.png" alt="facebook logo"></a>
    </div>
    <div id="location" class="location">
        <div tabindex="0" aria-labelledby="locheader">
            <p id="locheader">Location</p>
            <p>Munch - Thai Food & Sweet Tea</p>
            <p>880 W Lincoln Ave</p>
            <p>Anaheim, CA 92805</p>
            <p>(714) 956-2830</p>
        </div>
    </div>
</footer>
<script src="../assets/js/nav.js"></script>
</body>
</html>
`
                            // add page to sitemap
                            sitemap.push({name: item.name, url: `https://www.munchthai.com/menu/${filename}`})
                            fs.writeFileSync(`./publish/menu/${filename}`, data, (e) => e && console.error(e))

                        }
                    })
                }
            })
        }
    })
    
    let text = sitemap.map(page => page.url).join(`\n`)
    text = 'https://www.munchthai.com\nhttps://www.munchthai.com/sitemap.html\n'+ text
    fs.writeFileSync(`./publish/sitemap.txt`, text, (e) => e && console.error(e))
    
    const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Munch Thai Food - Sitemap</title>
    <meta name="description" content="Sitemap for Munch Thai.">
    <meta property="og:title" content="Munch Thai Food Sitemap">
    <meta property="og:description" content="Sitemap for Munch Thai">
    <meta property="og:image" content="https://www.munchthai.com/assets/images/header.jpg">
    <meta property="og:url" content="https://www.munchthai.com/sitemap.html">
    <meta name="theme-color" content="#c4001b">
    <link rel="shortcut icon" href="./assets/images/favicon.png">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:700" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/reset.css">
    <link rel="stylesheet" href="./assets/css/style.css">
</head>

<body>
<header>
    <a class="sr-only sr-only-focusable" href="#top">skip navigation</a>
    <nav>
        <ul id="nav-collapse" role="menu">
            <li role="presentation" class='order'>
                <a role="menuitem" href="https://www.toasttab.com/munch-thai/v2/online-order#!/" target="_blank">Order<span class='hidemobile'> Online</span></a>
            </li>
                <li role="presentation"><a role="menuitem" href="https://www.munchthai.com">Home</a></li>
                <li role="presentation"><a role="menuitem" href="https://www.munchthai.com#ourmenu">Our Menu</a></li>
                <li role="presentation"><a role="menuitem" href="#location">Contact Us</a></li>
            <li role="presentation" class="hamburger">
                <i role="presentation" id='navtrigger' class="material-icons" onclick="openMenu()">
                    menu
                </i>
            </li>
        </ul>
    </nav>
</header>
    <main>
        <div class="menucontainer">
            <div>
                <a class="backbutton" href="./index.html#ourmenu"><i class="material-icons" role="presentation">arrow_back_ios</i>Back to Menu</a>
            </div>
            <div id="top" class="menu itempage" tabindex="0" aria-labelledby="header1">
                <h1 id="header1">Sitemap</h1>
                <br>
                <ul>
                    <li><a href="https://www.munchthai.com">Munchthai.com Home</a></li>
                    <li><a href="https://www.munchthai.com/sitemap.html">Sitemap</a></li>
                </ul>
                <h2>Menu</h2>
                <ul>
                    ${sitemap.map(page => `<li><a href="${page.url}">${page.name}</a></li>`).join('\n')}
                </ul>
            </div>
    </main>
    <footer>
        <div class="sociallinks">
            <a aria-label="Find on Instagram" href="https://www.facebook.com/munchthaifood/" rel="noopener" target="_blank"><img class="invert" src="./assets/images/instagram.png" alt="instagram logo"></a>
            <a aria-label="Like on Facebook" href="https://www.instagram.com/munchthaifood/" rel="noopener" target="_blank"> <img src="./assets/images/facebook.png" alt="facebook logo"></a>
        </div>
        <div id="location" class="location">
            <div tabindex="0" aria-labelledby="locheader"
                <p id="locheader">Location</p>
                <p>Munch - Thai Food & Sweet Tea</p>
                <p>880 W Lincoln Ave</p>
                <p>Anaheim, CA 92805</p>
                <p>(714) 956-2830</p>
            </div>
        </div>
    </footer>
    <script src="./assets/js/nav.js"></script>
</body>

</html>
`
    fs.writeFileSync(`./publish/sitemap.html`, html, (e) => e && console.error(e))

}