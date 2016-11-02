/*
 * API Variables
 */
var API_URL = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?',
    API_DELIM_OPEN  = '&',
    API_DELIM_CLOSE = '=',
    API_KEY_FORMAT  = 'format',
    API_KEY_TABLE   = 'table',
    API_KEY_SELECT  = 'select',
    API_VAL_JSON    = 'json',
    API_VAL_EXOPLANETS = 'exoplanets';

/*
 * Selection variables
 */
var ID_TOKEN = '#',
    CLASS_TOKEN = '.',
    ID_PLANET_CHART = 'planet-chart',
    ID_ORBITAL = 'orbital',
    ID_BG_GRADIENT = 'gradient-bg',
    ID_BG = 'bg';

/*
 * Data Variables
 */
var PLANET_RADIUS_JUPITER = 'pl_radj',
    PLANET_RADIUS_EARTH = 'pl_rade',
    PLANET_MASS_JUPITER = 'pl_massj',
    PLANET_MASS_EARTH = 'pl_masse',
    PLANET_NAME = 'pl_name,',
    PLANET_YEAR_LENGTH = 'pl_orbper',
    STAR_RADIUS = 'st_rad',
    STAR_CLASS = 'st_spstr',
    STAR_COLOR_COUNT = 'st_colorn',
    st_umbj ='st_umbj',
    st_bmvj ='st_bmvj',
    st_vjmic='st_vjmic',
    st_vjmrc='st_vjmrc',
    st_jmh2 ='st_jmh2',
    st_hmk2 ='st_hmk2',
    st_jmk2 ='st_jmk2',
    st_bmy  ='st_bmy',
    st_m1   ='st_m1',
    st_c1   ='st_c1',
    st_teff = 'st_teff'
    ;

/*
 * Style Variables
 */
var POINT_RAD = 10;

/**
 * Formats key string
 * @param key
 * @returns {string}
 */
function formatAPIKey(key) {
    return API_DELIM_OPEN + key + API_DELIM_CLOSE;
}

/**
 * Formats key string
 * @param key
 * @returns {string}
 */
function ID(id) {
    return ID_TOKEN + id;
}

function CLS(cls) {
    return CLASS_TOKEN + cls;
}
/**
 * Helper to format API queries
 * @param key
 * @param val
 * @returns {string}
 */
function formatAPIQuery(key, val) {
    return formatAPIKey(key) + val;
}

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

function drawOrbit(planet) {
    var planetOrbits = d3.select(ID(ID_PLANET_CHART));

    var path = "M 0 0 " +
                "A 50 50 0 0 1 0 0 Z";

    var orbit = planetOrbits.append('path')
        .attr('d', path)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    return orbit;
}
function initOrbital(planetData) {
    /**
     * Get the canvas
     */
    var planetOrbits = d3.select(ID(ID_ORBITAL));
    console.log(planetData);
    var width = planetOrbits.attr('width'),
        height = planetOrbits.attr('height');

    var sun     = planetOrbits.append('circle'),
        earth   = planetOrbits.append('circle'),
        exo     = planetOrbits.append('circle'),
        star    = planetOrbits.append('circle');

    drawOrbit(exo);

}
function initChart(planetData) {
    /**
     * Get the canvas
     */
    var planetChart = d3.select(ID(ID_PLANET_CHART));

    var width = planetChart.attr('width'),
        height = planetChart.attr('height');

    /**
     * Create scales
     */
    var jupiterRadiusScale = d3.scaleLinear()
        .domain(d3.extent(planetData, function (d) {return d[PLANET_RADIUS_JUPITER];}))
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
        .style('fill', 'url(' + ID(ID_BG_GRADIENT) + ')');

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
        .attr('stroke-width', function (d) { return 2 * d[PLANET_RADIUS_JUPITER]; })
        .attr('r', function (d) { return POINT_RAD * d[PLANET_RADIUS_JUPITER] ; })
        .attr('cy', function (d, i) { return planetCountScale(i); } )
        .attr('cx', function (d) { return jupiterRadiusScale(d[PLANET_RADIUS_JUPITER]);} );

    points.on('click', function (d) { debugClick(d); });

}

function initAll(planetData) {
    initOrbital(planetData[0]);
    initChart(planetData);
}

function main(error, data) {
    initAll(data);
    console.log(data.filter(function (d) { return d[] !== null ;} ));
}

/*
 * Anonymous function that automatically runs once this file is loaded
 */
(function(){
    var cols = [
        PLANET_RADIUS_JUPITER,
        PLANET_RADIUS_EARTH,
        PLANET_MASS_JUPITER,
        PLANET_MASS_EARTH,
        PLANET_NAME,
        PLANET_YEAR_LENGTH,
        STAR_RADIUS,
        STAR_CLASS,
        STAR_COLOR_COUNT,
        st_umbj ,
        st_bmvj ,
        st_vjmic,
        st_vjmrc,
        st_jmh2 ,
        st_hmk2 ,
        st_jmk2 ,
        st_bmy  ,
        st_m1   ,
        st_c1,
        st_teff
    ];

    var live = false;
    if (live) {
        d3.json(API_URL +
            formatAPIQuery(API_KEY_FORMAT, API_VAL_JSON) +
            formatAPIQuery(API_KEY_TABLE, API_VAL_EXOPLANETS) +
            formatAPIKey(API_KEY_SELECT) + cols.join() +
            '&where=pl_kepflag=1', main);
    } else {
        d3.csv('data/planets.csv', main)
    }
})();