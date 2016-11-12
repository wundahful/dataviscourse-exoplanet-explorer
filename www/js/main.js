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
    ID_PLANET_CHART_X = 'planet-chart-x',
    ID_PLANET_CHART_Y = 'planet-chart-y',
    ID_ORBITAL = 'orbital',
    ID_COMPARISON = 'planet-comparison',
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
    ORBIT_RAD_MAX = 'pl_orbsmax',
    ORBIT_ECCENTRICITY = 'pl_orbeccen',
    ROWID = 'rowid',
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
    st_teff = 'st_teff',
    EARTH_RADIUS =  6353,
    SUN_RADIUS = 695700;


/*
 * Style Variables
 */
var POINT_RAD = 5;

var X_SCALES = {},
    Y_SCALES = {};
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

    transitionOrbit(planet);

    return orbit;
}

function transitionOrbit(planet) {
    var T_YEAR = 7000;
    planet.transition()
        .duration(T_YEAR)
        .ease(d3.easeLinear)
        .attrTween('transform', orbitTransform())
        //.each('end', transitionOrbit(planet));
}

function orbitTransform() {
    return function(d, i, a) {
        return function (t) {
            return 'translate(' + (250 + 50 * Math.cos(t))+ ', ' + (250 + 50 * Math.sin(t)) + ')';
        }
    }
}
function initOrbital(planetData) {
    /**
     * Get the canvas
     */
    var planetOrbits = d3.select(ID(ID_ORBITAL));

    var width = planetOrbits.attr('width'),
        height = planetOrbits.attr('height');

    planetOrbits.selectAll("*").remove();
    planetOrbits.datum(planetData);

    var hud = {
        'sun' : planetOrbits.append('circle'),
        'exo': planetOrbits.append('circle'),
        'earth': planetOrbits.append('circle'),
        'star': planetOrbits.append('circle')
    };

    var SUN_RAD = 3;
    var AU = SUN_RAD / 0.00465047;
    var EARTH_RAD = 2;
    var VERT_CENT = 450;
    var ECC_EARTH = 0.0167;


    hud['sun']
        .attr('transform', 'translate(300, '+ VERT_CENT + ')')
        .attr('r', SUN_RAD)
        .attr('fill', 'yellow');

    hud['star']
        .attr('transform', 'translate(900, '+ VERT_CENT + ')')
        .attr('r', function (d) { return SUN_RAD * d[STAR_RADIUS]})
        .attr('fill', 'red');

    hud['earth']
        .attr('transform', 'translate(300, '+ (VERT_CENT + AU) + ')')
        .attr('r', EARTH_RAD)
        .attr('fill', 'steelblue');

    hud['exo']
        .attr('transform', function (d) {
            return 'translate(900, '+ (VERT_CENT + (AU * d[ORBIT_RAD_MAX])) + ')'
        })
        .attr('r', function (d) { return EARTH_RAD * d[PLANET_RADIUS_EARTH]})
        .attr('fill', 'darkgray');

    //Orbit
    // EARTH ORBIT
    planetOrbits.append('ellipse')
        .attr('transform', 'translate(300, 450)')
        .attr('ry', AU)
        .attr('rx', AU * Math.sqrt(1-ECC_EARTH))
        .attr('stroke', 'lightgray')
        .attr('fill', 'none')
        .attr('stroke-width', 2);

    // EXO ORBIT
    planetOrbits.append('ellipse')
        .attr('transform', 'translate(900, 450)')
        .attr('ry', function (d) { return AU * d[ORBIT_RAD_MAX]; })
        .attr('rx', function (d) { return AU * d[ORBIT_RAD_MAX] * Math.sqrt(1-d['pl_orbeccen']); })
        .attr('stroke', 'lightgray')
        .attr('fill', 'none')
        .attr('stroke-width', 2);

    //drawOrbit(hud['exo']);

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
    var e = d3.extent(planetData, function (d) {return d[PLANET_RADIUS_EARTH]; });
    var earthRadiusScale = d3.scaleLinear()
        //.domain(d3.extent(planetData, function (d) {return d[PLANET_RADIUS_EARTH];}))
        .domain([e[0], 1, e[1]])
        .range([POINT_RAD, width/2, width - POINT_RAD]);


    e = d3.extent(planetData, function (d) {return d[PLANET_RADIUS_JUPITER]; });
    var jupiterRadiusScale = d3.scaleLinear()
        //.domain(d3.extent(planetData, function (d) {return d[PLANET_RADIUS_JUPITER];}))
        .domain([e[0], 1, e[1]])
        .range([POINT_RAD, width - POINT_RAD]);

    e = d3.extent(planetData, function (d) {return d[STAR_RADIUS]; } );
    var starRadiusScale = d3.scaleLinear()
        //.domain(d3.extent(planetData, function (d) {return d[STAR_RADIUS];}))
        .domain([e[0], 1, e[1]])
        .range([POINT_RAD, width - POINT_RAD]);

    var planetCountScale = d3.scaleLinear()
        .domain([0, planetData.length])
        .range([POINT_RAD, height - POINT_RAD]);

    var orbitRadiusScale = d3.scaleLinear()
        .domain(d3.extent(planetData, function (d) { return d[ORBIT_RAD_MAX] ; }))
        .range([height - POINT_RAD, POINT_RAD]);

    e = d3.extent(planetData, function (d) {return d[ORBIT_ECCENTRICITY]; } );
    var eccScaleX = d3.scaleLinear()
        .domain([e[0], 0.0167, e[1]])
        .range([width - POINT_RAD, width/2, POINT_RAD]);


    var eccScaleY = d3.scaleLinear()
        .domain([e[0], 0.0167, e[1]])
        .range([height - POINT_RAD, height/2, POINT_RAD]);


    X_SCALES[PLANET_RADIUS_EARTH] = earthRadiusScale;
    X_SCALES[PLANET_RADIUS_JUPITER] = jupiterRadiusScale;
    X_SCALES[STAR_RADIUS] = starRadiusScale;
    X_SCALES[ORBIT_ECCENTRICITY] = eccScaleX;
    Y_SCALES[ORBIT_ECCENTRICITY] = eccScaleY;
    Y_SCALES['count'] = planetCountScale;
    Y_SCALES[ORBIT_RAD_MAX] = orbitRadiusScale;
    /**
     * Create the background
     */
    var gradient = createGradient(planetChart);

    var background = planetChart.append('rect')
        .attr('id', ID_BG)
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(' + ID(ID_BG_GRADIENT) + ')');


    /** Selection boxes */
    var selectX = d3.select(ID(ID_PLANET_CHART_X)),
        selectY = d3.select(ID(ID_PLANET_CHART_Y));

    selectX.on('change', changeX);
    selectY.on('change', changeY);
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
        .attr('stroke-width', function (d) { return 1 + d[PLANET_RADIUS_EARTH]/10; })
        .attr('r', function (d) { return POINT_RAD + d[PLANET_RADIUS_EARTH]/7; })
        //.attr('r', function (d) { return POINT_RAD + d[PLANET_RADIUS_EARTH] ; })
        .attr('cy', function (d, i) { return planetCountScale(i); } )
        //.attr('cy', function (d) { return orbitRadiusScale(d[ORBIT_RAD_MAX]); } )
        .attr('cx', function (d) { return earthRadiusScale(d[PLANET_RADIUS_EARTH]);} );

    points.on('click', function (d) { debugClick(d); updateComparison(d); initOrbital(d); });

}

function updateComparison(planetData) {
    var comparison = d3.select(ID(ID_COMPARISON));

    var rad = 'radius';

    var hudData = [
        { 'radius' : EARTH_RADIUS },
        { 'radius' : Math.round(EARTH_RADIUS * planetData[PLANET_RADIUS_EARTH]) },
        { 'radius' : SUN_RADIUS },
        { 'radius' : Math.round(SUN_RADIUS * planetData[STAR_RADIUS]) }
    ];
    console.log(hudData)

    var stats = comparison.selectAll('text')
        .data(hudData);

    stats = stats.enter()
      .append('text')
        .attr('fill', 'black')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
      .merge(stats)
        .attr('x', function (d, i) { return 10 + 200 * i; } )
        .attr('y', 20 )
        .text(function (d) { return d[rad] + ' km'; });
}

function initAll(planetData) {
    initOrbital(planetData[2347]);
    initComparison(planetData[2347]);
    initChart(planetData);
}

function changeX(d) {
    var sel = d3.select(this);
    var prop = sel.property('value');
    d3.selectAll(ID(ID_PLANET_CHART) + ' circle')
        .attr('cx', function (d) { return X_SCALES[prop](d[prop]); })
        .attr('stroke-width', function (d) { return 1 + d[prop]/10; })
        .attr('r', function (d) { return POINT_RAD + d[prop]/7; })
}

function changeY(d) {
    var sel = d3.select(this);
    var prop = sel.property('value');
    d3.selectAll(ID(ID_PLANET_CHART) + ' circle')
        .attr('cy', function (d, i) { return prop == 'count' ? Y_SCALES[prop](i) : Y_SCALES[prop](d[prop]); })
}

function main(error, data) {
    data = data.filter(function (d) {
        return d !== null &&
            d[PLANET_RADIUS_EARTH] !== '';} );
    data = convertDataFormats(data);
    initAll(data);
}

function initComparison( data ) {
    var planetChart = d3.select(ID(ID_COMPARISON));

    var width = planetChart.attr('width'),
        height = planetChart.attr('height');

}

function convertDataFormats (data) {
    for (var i =0; i < data.length; i++) {
        data[i][PLANET_RADIUS_EARTH] = +data[i][PLANET_RADIUS_EARTH];
        data[i][PLANET_MASS_EARTH] = +data[i][PLANET_MASS_EARTH];
        data[i][PLANET_RADIUS_JUPITER] = +data[i][PLANET_RADIUS_JUPITER];
        data[i][PLANET_MASS_JUPITER] = +data[i][PLANET_MASS_JUPITER];
        data[i][PLANET_YEAR_LENGTH] = +data[i][PLANET_YEAR_LENGTH];
        data[i][STAR_RADIUS] = +data[i][STAR_RADIUS];
        data[i][ORBIT_RAD_MAX] = +data[i][ORBIT_RAD_MAX];
        data[i][ORBIT_ECCENTRICITY] = +data[i][ORBIT_ECCENTRICITY];
        data[i][ROWID] = data[i][ROWID]-1;
    }
    return data
}

function updateChart (data) {

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
        ORBIT_RAD_MAX,
        ORBIT_ECCENTRICITY,
        ROWID,
        st_umbj,
        st_bmvj,
        st_vjmic,
        st_vjmrc,
        st_jmh2,
        st_hmk2,
        st_jmk2,
        st_bmy,
        st_m1,
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