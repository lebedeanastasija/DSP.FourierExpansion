let colors = ["red", "brown", "blue", "purple", "yellow", "orange", "gray", "green", "crimson", "lavender", "indigo",
    "moccasin", "orchid", "plum", "silver", "tan", "red", "brown", "blue", "purple", "yellow", "orange",
    "gray", "green", "crimson", "lavender", "indigo", "moccasin", "orchid", "plum", "silver", "tan"];

let svgContainer,
    svgWidth = 800,
    svgHeight = 500,
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
    xAxisLength = 750,
    yAxisLength = 450,
    scale = 150,

    N = 256,
    k = 5,
    K = 3 * N / 4,
    delta = 32,
    M = [];

let signalVector = [];
let sVector = [];
let aVector = [];


function init() {
    for(let i = K; i < 2 * N; i += delta) {
        M.push(i);
    }
    drawSvgContainer(svgWidth, svgHeight, svgMargin);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    task1();
}

function task1() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    M.forEach((m, i) => {
        let signal = harmonicSignalVector(0, 1, m, 1, i/50);
        signalVector.push(signal);
        drawPoints(signal, colors[i], 1)
    });
}

function task2() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    sVector = skzVector(signalVector);
    drawPoints(sVector, colors[10], 3);
}

function harmonicSignal(initPhase, amplitude, period, oscillation, n) {
    return amplitude * Math.sin((2 * Math.PI * oscillation * n) / period + initPhase);
}

function harmonicSignalVector(initPhase, amplitude, count, oscillation, dy) {
    let result = [];
    for(let n = 0; n < count; n++) {
        let y = harmonicSignal(initPhase, amplitude, N, oscillation, n) + dy;
        result.push({y: y, x: n});
    }
    return result;
}

function skzVector(signalVector) {
    debugger;
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
    signal.forEach(s => sum += s.y);
    return Math.sqrt(1/(1 + M) * sum)
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

function drawPoints(functionResults, color, size) {
    functionResults.forEach( point => {
        drawPoint(point, color, size);
    });
}

function drawPoint(point, color, size) {
    svgContainer.append("circle")
        .attr("cx", point.x + startPoint.x)
        .attr("cy", startPoint.y - (point.y * scale))
        .attr("r", size || 1)
        .style("fill", color);
}