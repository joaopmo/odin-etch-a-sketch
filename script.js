jscolor.presets.default = {
    format:'rgba'
};

let dynamicValues = {
    gridScale: 28,
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

function drawEvents() {
    const container = document.getElementById('grid-container');
    const colorPicker = document.getElementById('color');
    const pickerButton = document.getElementById('picker');

    container.addEventListener('mousedown', function(e){
        if (!dynamicValues.getPicker()) {
            dynamicValues.setDrawing(true);
        }
    });
    

    container.addEventListener('mouseover', function(e){
        if (dynamicValues.getDrawing()) {
            let currentColor = e.target.style.getPropertyValue('background-color');
            if (dynamicValues.getEraser()) {
                currentColor = '#ffffff';
            } else {
                currentColor = opacityCalc(currentColor, dynamicValues.getColor());
            }
            setTimeout(function(){
                e.target.style.backgroundColor = currentColor;
            }, 80);
        } else if(dynamicValues.getPicker()) {
            const currentColor = e.target.style.getPropertyValue('background-color');
            colorPicker.jscolor.fromString(currentColor);
        }
    });

    container.addEventListener('mouseup', function(){
            dynamicValues.setDrawing(false);
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

document.addEventListener('DOMContentLoaded', 
function(){
    makeGrid(dynamicValues.getGrid());
    drawEvents(); 
    gridScale();
    pickerButton();
    eraserButton();
    clearButton();
}, false);