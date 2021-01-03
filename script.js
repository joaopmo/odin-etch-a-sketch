jscolor.presets.default = {
    format:'rgba',
    closeButton:true
};

let dynamicValues = {
    gridScale: 24,
    drawing: false,
    color: '#000000',
    opacity: 1,
    picker: false,
    eraser: false,
    getGrid: function() {
        return this.gridScale;
    },
    setGrid: function(value) {
        this.gridScale = value;
    },
    getDrawing: function() {
        return this.drawing;
    },
    setDrawing: function(value) {
        this.drawing = value;
    },
    getColor: function() {
        return this.color;
    },
    setColor: function(value) {
        this.color = value;
    },
    getOpacity: function() {
        return this.opacity;
    },
    setOpacity: function(value) {
        this.opacity = value;
    },
    getEraser: function() {
        return this.eraser;
    },
    setEraser: function(value) {
        this.eraser = value;
    },
    getPicker: function() {
        return this.picker;
    },
    setPicker: function(value) {
        this.picker = value;
    }
};

function makeGrid(grid) {
    const container = document.getElementById('grid-container');
    const clear = document.getElementById('clear');

    for (let i = 0; i < grid; i++) {
        const div = document.createElement('div');
        div.classList.add('line');
        container.appendChild(div);

        for (let j = 0; j < grid; j++) {
            const span = document.createElement('span');
            span.classList.add('cell');
            span.style.backgroundColor = '#ffffff';
            div.appendChild(span);
        }
    }
}

function opacityCalc(rgb, hex) {
    rgb = rgb.slice(4, rgb.length - 1);
    let [r1, g1, b1] = rgb.split(',').map(n => parseInt(n, 10));

    hex = hex.match(/[A-Za-z0-9]{2}/g);
    let [r2, g2, b2] = hex.map(n => parseInt(n, 16));

    let r3 = (1 - dynamicValues.getOpacity()) * r1 + dynamicValues.getOpacity() * r2;
    let g3 = (1 - dynamicValues.getOpacity()) * g1 + dynamicValues.getOpacity() * g2;
    let b3 = (1 - dynamicValues.getOpacity()) * b1 + dynamicValues.getOpacity() * b2;

    r3 = r3.toString(16);
    g3 = g3.toString(16)
    b3 = b3.toString(16);

    r3 = r3.length == 1 ? "0" + r3 : r3.slice(0, 2);
    g3 = g3.length == 1 ? "0" + g3 : g3.slice(0, 2);
    b3 = b3.length == 1 ? "0" + b3 : b3.slice(0, 2);

    let newHex = "#" + r3 + g3 + b3;
    return newHex;
}

function blockScroll() {
    document.body.addEventListener("touchstart", function (e) {
    if (e.target.id === 'grid-container' || e.target.className === 'cell') {
        e.preventDefault();
    }
    }, false);
    document.body.addEventListener("touchend", function (e) {
    if (e.target.id === 'grid-container' || e.target.className === 'cell') {
        e.preventDefault();
    }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
    if (e.target.id === 'grid-container' || e.target.className === 'cell') {
        e.preventDefault();
    }
    }, false);
} 


function drawAction(target) {
    const colorPicker = document.getElementById('color');

    if (dynamicValues.getDrawing()) {
        let currentColor = target.style.getPropertyValue('background-color');
        if (dynamicValues.getEraser()) {
            currentColor = '#ffffff';
        } else {
            currentColor = opacityCalc(currentColor, dynamicValues.getColor());
        }
    
        setTimeout(() => {
            target.style.backgroundColor = currentColor;
        }, 100);

    } else if(dynamicValues.getPicker()) {
        const currentColor = target.style.getPropertyValue('background-color');
        colorPicker.jscolor.fromString(currentColor);
        colorPicker.jscolor.channel('A', 1.0);
    }
}

function drawEvents() {
    const container = document.getElementById('grid-container');
    const colorPicker = document.getElementById('color');
    const pickerButton = document.getElementById('picker');

    container.addEventListener('pointerdown', function(e) {
        if (!dynamicValues.getPicker()) {
            dynamicValues.setDrawing(true);
        }
        colorPicker.jscolor.hide();
    });

    container.addEventListener('pointerup', function(e){
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
            if (dynamicValues.getPicker()){
                dynamicValues.setColor(colorPicker.jscolor.toHEXString());
                dynamicValues.setOpacity(1);
                dynamicValues.setPicker(false);
            }
            pickerButton.classList.remove('button-focus');
        }
        dynamicValues.setDrawing(false);
    });

    container.addEventListener('pointermove', function(e) {
        let target = '';

        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
            let x = e.clientX;
            let y = e.clientY;
            target = document.elementFromPoint(x, y);
        } else {
            return;
        }

        drawAction(target);
    });
    
    container.addEventListener('pointerover', function(e) {
        let target = '';

        if (e.pointerType === 'mouse') {
            target = e.target
        } else {
            return;
        }

        drawAction(target);
    });

    
    container.addEventListener('click', 
    function(e) {
        if (dynamicValues.getPicker()){
            dynamicValues.setColor(colorPicker.jscolor.toHEXString());
            dynamicValues.setOpacity(1);
            dynamicValues.setPicker(false);
        }

        pickerButton.classList.remove('button-focus');
    });
}

function colorPicker(color) {
    dynamicValues.setColor(color.toHEXString());
    dynamicValues.setOpacity(color.channel('A').toFixed(2));
}

function gridScale() {
    const slider = document.getElementById('grid-scale');
    slider.addEventListener('change', 
    function() {
        const container = document.getElementById('grid-container');
        container.textContent = ''
        dynamicValues.setGrid(this.value);
        makeGrid(dynamicValues.getGrid());
    });
}

function pickerButton() {
    const picker = document.getElementById('picker');
    const eraser = document.getElementById('eraser');
    picker.addEventListener('click',
    function(e) {
        dynamicValues.setPicker(!dynamicValues.getPicker());
        dynamicValues.setEraser(false);
        e.target.classList.toggle('button-focus');
        eraser.classList.remove('button-focus');
    });
}

function eraserButton() {
    const eraser = document.getElementById('eraser');
    const picker = document.getElementById('picker');
    eraser.addEventListener('click',
    function(e) {
        dynamicValues.setEraser(!dynamicValues.getEraser());
        dynamicValues.setPicker(false);
        e.target.classList.toggle('button-focus');
        picker.classList.remove('button-focus');
    });
}

function clearButton() {
    const clear = document.getElementById('clear');
    const eraser = document.getElementById('eraser');
    const picker = document.getElementById('picker');
    const container = document.getElementById('grid-container');

    clear.addEventListener('click',
    function(e) {
        e.target.classList.toggle('button-focus');
        eraser.classList.remove('button-focus');
        picker.classList.remove('button-focus');
        dynamicValues.setEraser(false);
        dynamicValues.setPicker(false);

        setTimeout(function(){
            container.textContent = ''
            makeGrid(dynamicValues.getGrid());
            e.target.classList.toggle('button-focus');
        }, 500);
    });
}

function customProperties() {
    const grid = document.getElementById('grid-container');
    const main = document.getElementById('main-container');

    window.addEventListener('resize', 
    function() {
        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
        grid.style.setProperty('--vh', `${vh}px`);
        grid.style.setProperty('--vw', `${vw}px`);
        main.style.setProperty('--vh', `${vh}px`);
    });
}

document.addEventListener('DOMContentLoaded', 
function(){
    makeGrid(dynamicValues.getGrid());
    blockScroll();
    drawEvents(); 
    gridScale();
    pickerButton();
    eraserButton();
    clearButton();
    customProperties();
}, false);