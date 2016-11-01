/*
 * API Variables
 */
var API_URL = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?',
    API_DELIM_OPEN = '&',
    API_DELIM_CLOSE = '=',
    API_KEY_FORMAT = API_DELIM_OPEN + 'format' + API_DELIM_CLOSE,
    API_KEY_TABLE = API_DELIM_OPEN + 'table' + API_DELIM_CLOSE,
    API_VAL_JSON = 'json',
    API_VAL_EXOPLANETS = 'exoplanets';

/*
 * Selection variables
 */
var ID_TOKEN = '#',
    CLASS_TOKEN = '.',
    ID_PLANET_CHART = 'planet-chart',
    ID_BG_GRADIENT = 'gradient-bg',
    ID_BG = 'bg';

/*
 * Data Variables
 */
var RADIUS_JUPITER = 'pl_radj';

/*
 * Style Variables
 */
var POINT_RAD = 10;

/**
 * Log out d to the console
 * @param d
 */
function debugClick(d) {
    console.log(d);
}

/**
 * Generates background gradient
 * @param svg
 * @returns D3 gradient object
 */
function createGradient( svg ) {

    var gradient = svg.append('defs')
        .append('radialGradient')
        .attr('id', ID_BG_GRADIENT)
        .attr('cx', '50%')
        .attr('fx', '50%')
        .attr('r', '180%')
        .attr('cy', '80%')
        .attr('fy', '100%')

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', "#4C4857")
        .attr('stop-opacity', 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", '#020202')
        .attr("stop-opacity", 1);

    return gradient;
}

function initAll(planetData) {
    /**
     * Get the canvas
     */
    var planetChart = d3.select(ID_TOKEN + ID_PLANET_CHART);

    var width = planetChart.attr('width'),
        height = planetChart.attr('height');

    /**
     * Create scales
     */
    var jupiterRadiusScale = d3.scaleLinear()
        .domain(d3.extent(planetData, function (d) {return d[RADIUS_JUPITER];}))
        .range([POINT_RAD, planetChart.attr('width') - POINT_RAD]);

    var planetCountScale = d3.scaleLinear()
        .domain([0, planetData.length])
        .range([POINT_RAD, planetChart.attr('height') - POINT_RAD]);

    /**
     * Create the background
     */
    var gradient = createGradient(planetChart);

    var background = planetChart.append('rect')
        .attr('id', ID_BG)
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(' + ID_TOKEN + ID_BG_GRADIENT + ')');

    /**
     * Generate points
     */
    var points = planetChart.selectAll('circle')
        .data(planetData);

    points = points.enter()
      .append('circle')
        .attr('fill', 'steelblue')
        .attr('stroke', 'white')
      .merge(points)
        .attr('stroke-width', function (d) { return 2 * d[RADIUS_JUPITER]; })
        .attr('r', function (d) { return POINT_RAD * d[RADIUS_JUPITER] ; })
        .attr('cy', function (d, i) { return planetCountScale(i); } )
        .attr('cx', function (d) { return jupiterRadiusScale(d[RADIUS_JUPITER]);} );

    points.on('click', function (d) { debugClick(d); });
}

/*
 * Anonymous function that automatically runs once this file is loaded
 */
(function(){
    d3.json(API_URL +
        API_KEY_FORMAT + API_VAL_JSON +
        API_KEY_TABLE + API_VAL_EXOPLANETS +
        '&where=pl_kepflag=1', function (error, planetData) {

        initAll(planetData)
    });
})();