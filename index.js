class Canvas {
    static WIDTH = 1200;
    static HEIGHT = 900;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.width = Canvas.WIDTH;
        this.canvas.height = Canvas.HEIGHT;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawLine(vectorFrom, vectorTo, r = 0, g = 0, b = 0, a = 1) {
        const { x: x1, y: y1 } = vectorFrom;
        const { x: x2, y: y2 } = vectorTo;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    drawPoint(vector, r = 4) {
        const { x, y } = vector;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    drawCircle(vector, r) {
        const { x, y } = vector;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
    drawText(x, y, text) {
        this.ctx.font = "24px serif";
        this.ctx.fillText(text, x + 20, y + 20);
    }
    drawRect(x, y, width, height, r = 0, g = 0, b = 0) {
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.fillRect(x, y, width, height);
    }
}

const options = {
    angle: 30,
    depth: 10,
    lineReductionSpeedKoef: 0.9,
    leftLineReductionAcceleration: 0.91,
    rightLineReductionAcceleration: 1,
};

const canvasEl = document.getElementById("canvas");

const canvas = new Canvas(canvasEl);

const fractRoot = {
    start: new Vector(Canvas.WIDTH / 2, Canvas.HEIGHT - 180),
    end: new Vector(Canvas.WIDTH / 2, Canvas.HEIGHT - 300),
};

const drawFractal = (
    fractRoot,
    shiftAngle,
    maxDepth,
    vReductionLine = 0.9,
    aLeftReductionLine = 1,
    aRightReductionLine = 1
) => {
    const fract = (line, angle, depth, vReductionLine) => {
        if (depth === 0) return;

        const { start, end } = line;

        const v = end.sub(start).scaleBy(vReductionLine);

        const newPositon = end.add(v.rotate(Vector.toRadians(angle)));

        canvas.drawLine(end, newPositon);

        depth -= 1;

        fract(
            {
                start: end,
                end: newPositon,
            },
            -angle,
            depth,
            vReductionLine * aLeftReductionLine
        );

        fract(
            {
                start: end,
                end: newPositon,
            },
            angle,
            depth,
            vReductionLine * aRightReductionLine
        );
    };

    fract(fractRoot, shiftAngle, maxDepth, vReductionLine);
};

const frame = () => {
    canvas.clear();

    drawFractal(
        fractRoot,
        options.angle,
        options.depth,
        options.lineReductionSpeedKoef,
        options.leftLineReductionAcceleration,
        options.rightLineReductionAcceleration
    );

    requestAnimationFrame(frame);
};

frame();

// ** view **

window.onload = () => {
    smothIncreaseDepth(options.depth);
};

function setRandomOptions() {
    options.angle = Math.random() * 90;
    options.depth = 8 + Math.floor(Math.random() * 8);
    options.lineReductionSpeedKoef = 0.8 + 0.2 * Math.random();
    options.leftLineReductionAcceleration = 0.8 + 0.2 * Math.random();
    options.rightLineReductionAcceleration = 0.8 + 0.2 * Math.random();
}

function smothIncreaseDepth(toDepth, ms = 80) {
    options.depth = 0;

    const int = setInterval(() => {
        options.depth += 1;
        document.getElementById("depthValue").innerText = options.depth;
        document.getElementById("depth").value = options.depth;

        if (options.depth > toDepth) {
            clearInterval(int);
        }
    }, ms);
}

function updateOptionsDisplay() {
    document.getElementById("angleValue").innerText =
        options.angle.toPrecision(2);
    document.getElementById("angle").value = options.angle.toPrecision(2);
    document.getElementById("lineReductionSpeedKoefValue").innerText =
        options.lineReductionSpeedKoef.toPrecision(2);
    document.getElementById("lineReductionSpeedKoef").value =
        options.lineReductionSpeedKoef.toPrecision(2);
    document.getElementById(
        "left:lineReductionAccelerationKoefValue"
    ).innerText = options.leftLineReductionAcceleration.toPrecision(2);
    document.getElementById("left:lineReductionAccelerationKoef").value =
        options.leftLineReductionAcceleration.toPrecision(2);
    document.getElementById(
        "right:lineReductionAccelerationKoefValue"
    ).innerText = options.rightLineReductionAcceleration.toPrecision(2);
    document.getElementById("right:lineReductionAccelerationKoef").value =
        options.rightLineReductionAcceleration.toPrecision(2);
}

document.getElementById("angle").addEventListener("input", (e) => {
    options.angle = +e.target.value;
    document.getElementById("angleValue").innerText = e.target.value;
});

document.getElementById("depth").addEventListener("input", (e) => {
    options.depth = +e.target.value;
    document.getElementById("depthValue").innerText = e.target.value;
});

document
    .getElementById("lineReductionSpeedKoef")
    .addEventListener("input", (e) => {
        options.lineReductionSpeedKoef = +e.target.value;
        document.getElementById("lineReductionSpeedKoefValue").innerText =
            e.target.value;
    });

document
    .getElementById("left:lineReductionAccelerationKoef")
    .addEventListener("input", (e) => {
        options.leftLineReductionAcceleration = +e.target.value;
        document.getElementById(
            "left:lineReductionAccelerationKoefValue"
        ).innerText = e.target.value;
    });

document
    .getElementById("right:lineReductionAccelerationKoef")
    .addEventListener("input", (e) => {
        options.rightLineReductionAcceleration = +e.target.value;
        document.getElementById(
            "right:lineReductionAccelerationKoefValue"
        ).innerText = e.target.value;
    });

document.getElementById("random").addEventListener("click", () => {
    setRandomOptions();
    smothIncreaseDepth(options.depth);
    updateOptionsDisplay();
});
