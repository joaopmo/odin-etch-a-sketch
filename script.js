jscolor.presets.default = {
    format: "rgba",
    closeButton: true,
};

let dynamicValues = {
    gridScale: 24,
    drawing: false,
    color: "#000000",
    opacity: 1,
    picker: false,
    eraser: false,
};

function makeGrid(grid) {
    const container = document.getElementById("grid-container");

    for (let i = 0; i < grid; i++) {
        const line = document.createElement("span");
        line.classList.add("line");
        container.appendChild(line);

        for (let j = 0; j < grid; j++) {
            const cell = document.createElement("span");
            cell.classList.add("cell");
            cell.style.backgroundColor = "#ffffff";
            line.appendChild(cell);
        }
    }
}

function blockScroll() {
    document.body.addEventListener(
        "touchstart",
        function (e) {
            if (e.target.id === "grid-container" || e.target.className === "cell") {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        },
        { passive: false }
    );
    document.body.addEventListener(
        "touchend",
        function (e) {
            if (e.target.id === "grid-container" || e.target.className === "cell") {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        },
        { passive: false }
    );
    document.body.addEventListener(
        "touchmove",
        function (e) {
            if (e.target.id === "grid-container" || e.target.className === "cell") {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        },
        { passive: false }
    );
}

function opacityCalc(rgb, hex) {
    rgb = rgb.slice(4, rgb.length - 1);
    let [r1, g1, b1] = rgb.split(",").map((n) => parseInt(n, 10));

    hex = hex.match(/[A-Za-z0-9]{2}/g);
    let [r2, g2, b2] = hex.map((n) => parseInt(n, 16));

    let r3 = (1 - dynamicValues.opacity) * r1 + dynamicValues.opacity * r2;
    let g3 = (1 - dynamicValues.opacity) * g1 + dynamicValues.opacity * g2;
    let b3 = (1 - dynamicValues.opacity) * b1 + dynamicValues.opacity * b2;

    r3 = r3.toString(16);
    g3 = g3.toString(16);
    b3 = b3.toString(16);

    r3 = r3.length == 1 ? "0" + r3 : r3.slice(0, 2);
    g3 = g3.length == 1 ? "0" + g3 : g3.slice(0, 2);
    b3 = b3.length == 1 ? "0" + b3 : b3.slice(0, 2);

    let newHex = "#" + r3 + g3 + b3;
    return newHex;
}

function drawAction(target) {
    const colorPicker = document.getElementById("color");

    if (dynamicValues.drawing) {
        let currentColor = target.style.getPropertyValue("background-color");
        if (dynamicValues.eraser) {
            currentColor = "#ffffff";
        } else {
            currentColor = opacityCalc(currentColor, dynamicValues.color);
        }

        target.style.boxShadow = "inset 0 0 100px aqua";
        setTimeout(() => {
            target.style.boxShadow = "none";
            target.style.backgroundColor = currentColor;
        }, 1000 / dynamicValues.gridScale ** 0.5);
    } else if (dynamicValues.picker) {
        const currentColor = target.style.getPropertyValue("background-color");
        colorPicker.jscolor.fromString(currentColor);
        colorPicker.jscolor.channel("A", 1.0);
    }
}

function drawEvents() {
    const container = document.getElementById("grid-container");
    const colorPicker = document.getElementById("color");
    const pickerButton = document.getElementById("picker");

    container.addEventListener("pointerdown", function (e) {
        if (!dynamicValues.picker) {
            dynamicValues.drawing = true;
        }
        colorPicker.jscolor.hide();
    });

    container.addEventListener("pointerup", function (e) {
        if (e.pointerType === "touch" || e.pointerType === "pen") {
            if (dynamicValues.picker) {
                dynamicValues.color = colorPicker.jscolor.toHEXString();
                dynamicValues.opacity = 1;
                dynamicValues.picker = false;
            }
            pickerButton.classList.remove("button-focus");
        }
        dynamicValues.drawing = false;
    });

    container.addEventListener("pointermove", function (e) {
        let target = "";

        if (e.pointerType === "touch" || e.pointerType === "pen") {
            let x = e.clientX;
            let y = e.clientY;
            target = document.elementFromPoint(x, y);
        } else {
            target = e.target;
        }

        if (!target || target.className !== "cell") {
            return;
        }

        drawAction(target);
    });

    container.addEventListener("click", function (e) {
        if (dynamicValues.picker) {
            dynamicValues.color = colorPicker.jscolor.toHEXString();
            dynamicValues.opacity = 1;
            dynamicValues.picker = false;
        }

        pickerButton.classList.remove("button-focus");
    });
}

function colorPicker(color) {
    dynamicValues.color = color.toHEXString();
    dynamicValues.opacity = color.channel("A").toFixed(2);
}

function gridScale() {
    const slider = document.getElementById("grid-scale");
    slider.addEventListener("change", function () {
        const container = document.getElementById("grid-container");
        container.textContent = "";
        dynamicValues.gridScale = this.value;
        makeGrid(dynamicValues.gridScale);
    });
}

function pickerButton() {
    const picker = document.getElementById("picker");
    const eraser = document.getElementById("eraser");
    picker.addEventListener("click", function (e) {
        dynamicValues.picker = !dynamicValues.picker;
        dynamicValues.eraser = false;
        e.target.classList.toggle("button-focus");
        eraser.classList.remove("button-focus");
    });
}

function eraserButton() {
    const eraser = document.getElementById("eraser");
    const picker = document.getElementById("picker");
    eraser.addEventListener("click", function (e) {
        dynamicValues.eraser = !dynamicValues.eraser;
        dynamicValues.picker = false;
        e.target.classList.toggle("button-focus");
        picker.classList.remove("button-focus");
    });
}

function clearButton() {
    const clear = document.getElementById("clear");
    const eraser = document.getElementById("eraser");
    const picker = document.getElementById("picker");
    const container = document.getElementById("grid-container");

    clear.addEventListener("click", function (e) {
        e.target.classList.toggle("button-focus");
        eraser.classList.remove("button-focus");
        picker.classList.remove("button-focus");
        dynamicValues.eraser = false;
        dynamicValues.picker = false;

        setTimeout(function () {
            container.textContent = "";
            makeGrid(dynamicValues.gridScale);
            e.target.classList.toggle("button-focus");
        }, 500);
    });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        makeGrid(dynamicValues.gridScale);
        blockScroll();
        drawEvents();
        gridScale();
        pickerButton();
        eraserButton();
        clearButton();
    },
    false
);
