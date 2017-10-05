let colors = ["red", "brown", "blue", "purple", "yellow", "orange", "gray", "green", "crimson", "lavender", "indigo",
    "moccasin", "orchid", "plum", "silver", "tan", "red", "brown", "blue", "purple", "yellow", "orange",
    "gray", "green", "crimson", "lavender", "indigo", "moccasin", "orchid", "plum", "silver", "tan"];

let svgContainer,
    svgWidth = 1100,
    svgHeight = 700,
    svgMargin = {
        top: 20,
        right: 50,
        bottom: 20,
        left: 50
    },
    startPoint = {
        x: svgMargin.left,
        y: Math.round((svgMargin.top + svgHeight)/2)
    },
    xAxisLength = 1050,
    yAxisLength = 650,
    scale = 300;

let N = 256;
//let K = 3 * N / 4;
let K = 0;
let delta = 16;
let phase = Math.PI / 24;
let M = [];

let signalVector = [];
let signalWithPhaseVector = [];
let sVector = [], sPhaseVector = [];    // Array of signal medium square value for different M parameter
let aVector = [], aPhaseVector = [];    // Array of signal amplitudes for different M parameter
let sErrVector = [], sPhaseErrVector = []; // Array of errors of calculating medium square value of signal
let aErrVector = [], aPhaseErrVector = []; // Array of errors of calculating amplitude of signal


function init() {
    for(let i = K; i <= 5 * N; i += delta) {
        M.push(i);
    }
    drawSvgContainer(svgWidth, svgHeight, svgMargin);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    task1();
}

function task1() {
    signalVector = [];
    signalWithPhaseVector = [];
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    M.forEach((m, i) => {
        let signal = getHarmonicSignalVector(0, 1, m, 1, 0);
        let phaseSignal = getHarmonicSignalVector(phase, 1, m, 1, 0);
        signalVector.push(signal);
        signalWithPhaseVector.push(phaseSignal);
        drawFunctionGraph(signal, colors[i], 1);
        drawFunctionGraph(phaseSignal, colors[i], 1);
    });
}

function task2() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    sVector = getSkzVector(signalVector);
    sPhaseVector = getSkzVector(signalWithPhaseVector);
    drawFunctionGraph(sVector, colors[10], 1);
    drawFunctionGraph(sPhaseVector, colors[3], 1);
}

function task3() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    aVector = getAmplitudesVector(signalVector);
    aPhaseVector = getAmplitudesVector(signalWithPhaseVector);
    drawFunctionGraph(aVector, colors[10], 1);
    drawFunctionGraph(aPhaseVector, colors[3], 1);
}

function task4() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    if(!aVector.length) {
        aVector = getAmplitudesVector(signalVector);
    }
    if(!aPhaseVector.length) {
        aPhaseVector = getAmplitudesVector(signalWithPhaseVector);
    }
    aErrVector = getAmplitudesErrorVector(aVector);
    aPhaseErrVector = getAmplitudesErrorVector(aPhaseVector)
    drawFunctionGraph(aErrVector, colors[8], 1);
    drawFunctionGraph(aPhaseErrVector, colors[3], 1);
}

function task5() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    if(!sVector.length) {
        sVector = getSkzVector(signalVector);
    }
    if(!sPhaseVector) {
        sPhaseVector = getAmplitudesVector(signalWithPhaseVector);
    }
    sErrVector = getSkzErrorVector(sVector);
    sPhaseErrVector = getSkzErrorVector(sPhaseVector);
    drawFunctionGraph(sErrVector, colors[6], 1);
    drawFunctionGraph(sPhaseErrVector, colors[3], 1);
}

function getHarmonicSignalVector(initPhase, amplitude, count, oscillation) {
    let result = [];
    for(let n = 0; n < count-1; n++) {
        let y = harmonicSignal(initPhase, amplitude, N, oscillation, n);
        result.push({y: y, x: n});
    }
    return result;
}

function harmonicSignal(initPhase, amplitude, period, oscillation, n) {
    return amplitude * Math.sin((2 * Math.PI * oscillation * n) / period + initPhase);
}

function getSkzVector(signalVector) {
    let result = [];
    signalVector.forEach((s, i) => {
        let y = skz(M[i], s);
        let x = M[i];
        result.push({y, x});
    });
    return result;
}

function skz(M, signal) {
    let sum = 0;
    signal.forEach(s => sum += Math.pow(s.y, 2));
    return Math.sqrt((1/(1 + M)) * sum)
}

function getAmplitudesVector(signalVector) {
    let result = [];
    M.forEach((m, index) => {
        let aSin = 0;
        let aCos = 0;
        let a;
        signalVector[index].forEach((s, i) => {
            aSin += s.y * Math.sin(2 * Math.PI * i / m);
            aCos += s.y * Math.cos(2 * Math.PI * i / m);
        });
        aSin = aSin * (2 / m);
        aCos = aCos * (2 / m);
        a = Math.sqrt(Math.pow(aSin, 2) + Math.pow(aCos, 2));
        result.push({x: m, y: a});
    });
    return result;
}

function getAmplitudesErrorVector(amplitudeVector) {
    let result = [];
    amplitudeVector.forEach(amplitude => {
        result.push({y: 1 - amplitude.y, x: amplitude.x})
    });
    return result;
}

function getSkzErrorVector(skzVector) {
    let result = [];
    skzVector.forEach(skz => {
        result.push({y: 0.707 - skz.y, x: skz.x})
    });
    return result;
}

function drawSvgContainer(width, height, margin) {
    svgContainer = d3.select("body").append("svg")
        .attr("width", margin.left + width + margin.right)
        .attr("height", margin.top + height + margin.bottom);
}

function clearSvgContainer(svg) {
    svg.selectAll("*").remove();
}

function drawAxes(xLength, yLength, startPoint, scale) {
    let xScale = d3.scaleLinear().domain([0, xLength]).range([0, xLength]);
    let yScale = d3.scaleLinear().domain([-1 * yAxisLength / scale / 2, yAxisLength / scale / 2]).range([yLength, 0]);
    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);

    svgContainer
        .append("g")
        .attr('class', 'axis')
        .attr('transform', 'translate(' + startPoint.x + ',' + Math.round(svgMargin.top * 1.75) + ')')
        .call(yAxis);

    svgContainer
        .append("g")
        .attr('class', 'axis')
        .attr('transform', 'translate(' + startPoint.x + ',' + startPoint.y + ')')
        .call(xAxis);
}

//TODO: implement and use function to draw continuous function graph
function drawFunctionGraph(points, color, width) {
    for(let i = 0; i < points.length - 1; i++) {
        drawLine(points[i], points[i+1], color, width);
    }
}

function drawPoints(functionResults, color, size) {
    functionResults.forEach( point => {
        drawPoint(point, color, size);
    });
}

function drawLine(p1, p2, color, width) {
    svgContainer.append("line")
        .attr("x1", p1.x + startPoint.x)
        .attr("y1", startPoint.y - (p1.y * scale))
        .attr("x2", p2.x + startPoint.x)
        .attr("y2", startPoint.y - (p2.y * scale))
        .attr("stroke-width", width || 1)
        .attr("stroke", color || 'black');
}

function drawPoint(point, color, size) {
    svgContainer.append("circle")
        .attr("cx", point.x + startPoint.x)
        .attr("cy", startPoint.y - (point.y * scale))
        .attr("r", size || 1)
        .style("fill", color);
}