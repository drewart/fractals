window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas0');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = 'green'

    ctx.lineWidth = 10;
    ctx.lineCap = 'round'
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;

    // effect settings
    const levelMax = 6;
    const branchMax = 4;
    let size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
    let maxLvl = 4;
    let branches = 2;

    let sides = 7;
    let scale = 0.5;
    let spread = 0.5;
    let colorNum = Math.random() * 360;
    let color = 'hsl('+ colorNum +', 100%, 50%)';  // 120 green 0 red
    let lineWidth = Math.floor(Math.random() * 20 + 10);

    // override settings via parameters
    parseParams()


    // controls

    const randBtn = this.document.getElementById('randomize');

    const sliderSpread = document.getElementById('spread');
    const labelSpread = document.querySelector('[for="spread"]')

    const sliderMaxLevel = document.getElementById('maxLevel');
    const labelMaxLevel = document.querySelector('[for="maxLevel"]');

    const sliderBranches = document.getElementById('branches');
    const labelBranches = document.querySelector('[for="branches"]');

    const sliderSides = document.getElementById('sides');
    const labelSides = document.querySelector('[for="sides"]');

    sliderSpread.addEventListener('change', function(e) {
        spread = e.target.value;
        updateSliders();
        drawFractal();
    });

    sliderMaxLevel.addEventListener('change', function(e) {
        maxLvl = e.target.value
        updateSliders();
        drawFractal()
    });

    sliderBranches.addEventListener('change', function(e) {
        branches = e.target.value
        updateSliders();
        drawFractal()
    });

    sliderSides.addEventListener('change', function(e) {
        sides = e.target.value
        updateSliders();
        drawFractal()
    });


    function drawBranch(lvl) {
        if (lvl > maxLvl) return;
        ctx.beginPath()
        ctx.moveTo(0 ,0 );
        ctx.lineTo(size , 0);
        ctx.stroke();
        for (let i = 0; i < branches; i++) {
            ctx.save();

            ctx.translate(size - (size/branches) * i, 0);
            ctx.rotate(spread);
            ctx.scale(scale, scale);

            drawBranch(lvl + 1)
            ctx.restore();

            ctx.save();

            ctx.translate(size - (size/branches) * i, 0);
            ctx.rotate(-spread);
            ctx.scale(scale, scale);

            drawBranch(lvl + 1)
            ctx.restore();
        }
    }

    function drawFractal() { 
        // TODO if clear
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.translate(canvas.width/2, canvas.height/2);

        for (let i = 0; i < sides; i++) {
            ctx.rotate((Math.PI * 2) / sides);
            drawBranch(0);
        }

        ctx.restore();
    }
    drawFractal()

    // parseParams takes the querySearch input
    function parseParams() {

        const queryString = window.location.search;
        // console.log(queryString);
        const urlParams = new URLSearchParams(queryString);

        if ( urlParams.has("maxLevel")) {
            maxLvl = urlParams.get("maxLevel")
        }

        if (maxLvl > levelMax) {
            maxLvl = levelMax
        }

        // url override
        if ( urlParams.has("branches")) {
            branches = urlParams.get("branches")
        }

        if (branches > branchMax) {
            branches = branchMax;
        }

        if ( urlParams.has("sides")) {
            sides = urlParams.get("sides")
        }
        if ( urlParams.has("scale")) {
            scale = urlParams.get("scale")
        }
        if ( urlParams.has("spread")) {
            spread = urlParams.get("spread")
        }
        if ( urlParams.has("colorNum")) {
            colorNum = urlParams.get("colorNum")
            color = 'hsl('+ colorNum +', 100%, 50%)';
        }
        if ( urlParams.has("lineWidth")) {
            lineWidth = urlParams.get("lineWidth")
        }
    }


    function randomizeFractal() {

        maxLvl = Math.floor(Math.random() * 5 + 1);
        branches = Math.floor(Math.random() * 4 + 1);
        sides = Math.floor(Math.random() * 7 + 2);
        scale = Math.random() * 0.2 + 0.4;
        spread = Math.random() * 2.9 + 0.1;
        colorNum = Math.random() * 360;
        color = 'hsl('+ colorNum +', 100%, 50%)';  // 120 green 0 red
        lineWidth = Math.floor(Math.random() * 20 + 10)
    }

    randBtn.addEventListener('click', function() {
        
        randomizeFractal();
        updateSliders();
        drawFractal();

    });


    function updateSliders() {
        sliderSpread.value = spread;
        labelSpread.innerText = 'Spread: ' + Number(spread).toFixed(2);

        sliderMaxLevel.value = maxLvl;
        labelMaxLevel.innerHTML = 'Level: '+ maxLvl;

        sliderBranches.value = branches;
        labelBranches.innerHTML = 'Branches: '+ branches;

        sliderSides.value = sides;
        labelSides.innerHTML = 'Sides: ' + sides;

        updateURL()
    }

    function updateURL() {
        let url = window.location.href;
        for (let i = 0; i < url.length; i++) {
            if (url.charAt(i) == '?') {
                url = url.substring(0,i); 
                break
            }
        }
        newURL = url + "?maxLevel=" +maxLvl+ "&branches=" +branches+ "&sides=" + sides + "&spread=" + spread + "&scale="+ scale + "&colorNum="+ colorNum + "&lineWidth="+lineWidth
        // console.log(newURL);
        const nextState = { additionalInformation : 'history push'};
        window.history.pushState(nextState, "drewart", newURL);

    }

    updateSliders();


})