/*
 * API Variables
 */
var API_URL = 'http://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?',
    API_DELIM_OPEN  = '&',
    API_DELIM_CLOSE = '=',
    API_KEY_FORMAT  = 'format',
    API_KEY_TABLE   = 'table',
    API_KEY_SELECT  = 'select',
    API_VAL_JSON    = 'csv',
    API_VAL_EXOPLANETS = 'exoplanets';

/*
 * Selection variables
 */
var ID_TOKEN = '#',
    CLASS_TOKEN = '.',
    ID_PLANET_CHART = 'planet-chart',
    ID_PLANET_CHART_X = 'planet-chart-x',
    ID_PLANET_CHART_Y = 'planet-chart-y',
    ID_MAP = 'galactic-map',
    ID_ORBITAL = 'orbital',
    ID_COMPARISON = 'planet-comparison',
    ID_BG_GRADIENT = 'gradient-bg',
    ID_BG = 'bg',
    ID_SYMBOL_Q = 'symbol-q',
    ID_SYMBOL_EARTH = 'symbol-earth',
    ID_SYMBOL_SUN = 'symbol-sun',
    ID_SYMBOL_PLANET = 'symbol-planet',
    ID_SYMBOL_STAR = 'symbol-star',
    ID_STAR_GRAD_START = 'star-grad-start',
    CLASS_MAP_GRID = 'map-grid',
    CLASS_CHART_HOVER = 'chart-hover',
    CLASS_CHART_UNHOVERED = 'chart-unhovered',
    CLASS_PLANET_HABITABLE = 'planet-habitable',
    CLASS_PLANET_POINT = 'planet-point',
    CLASS_COMPARISON_TEXT = 'comp-text',
    CLASS_COMPARISON_IMAGES = 'comp-img';

/*
 * Data Variables
 */
var PLANET_RADIUS_JUPITER = 'pl_radj',
    PLANET_RADIUS_EARTH = 'pl_rade',
    PLANET_MASS_JUPITER = 'pl_massj',
    PLANET_MASS_EARTH = 'pl_masse',
    PLANET_NAME = 'pl_name',
    PLANET_LETTER = 'pl_letter',
    PLANET_YEAR_LENGTH = 'pl_orbper',
    STAR_NAME = 'pl_hostname',
    STAR_RADIUS = 'st_rad',
    STAR_CLASS = 'st_spstr',
    STAR_COLOR_COUNT = 'st_colorn',
    STAR_TEMP = 'st_teff',
    STAR_MASS = 'st_mass',
    STAR_LONG = 'st_glon',
    STAR_LAT = 'st_glat',
    STAR_LUMINOSITY = 'st_lum',
    ORBIT_RAD_MAX = 'pl_orbsmax',
    ORBIT_ECCENTRICITY = 'pl_orbeccen',
    ROWID = 'rowid',
    HABITABLE = 'habitable',
    HABITABLE_ZONE_INNER = 'hzi',
    HABITABLE_ZONE_OUTER = 'hzo';

var PROPERTIES_NUM = [
    PLANET_RADIUS_JUPITER,
    PLANET_RADIUS_EARTH,
    PLANET_MASS_JUPITER,
    PLANET_MASS_EARTH,
    PLANET_YEAR_LENGTH,
    STAR_RADIUS,
    STAR_TEMP,
    STAR_MASS,
    STAR_LONG,
    STAR_LAT,
    ORBIT_RAD_MAX,
    STAR_LUMINOSITY,
    ORBIT_ECCENTRICITY
];

var PROPERTIES_STR = [
    PLANET_NAME,
    STAR_CLASS,
];

/** Astronomical Constants */
    var SUN_RADIUS = 695700,
    SUN_TEMP = 5800,
    SUN_LUMINOSITY = 1,
    AU = SUN_RADIUS / 0.00465047,
    KM_AU = 149597871,
    EARTH_RADIUS =  6353,
    EARTH_ECC = 0.0167;

    var COLOR_SCALE = d3.scaleLinear()
        .domain([2400, 3700, 5200, 6000, 7500, 10000, 30000])
        .range(['SandyBrown', 'NavajoWhite',  'Gold', 'LemonChiffon', 'Azure', 'LightSteelBlue' ]);


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

    /**
     * Create the background
     */
    var gradient = createGradient(planetOrbits);

    var background = planetOrbits.append('rect')
        .attr('id', ID_BG)
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(' + ID(ID_BG_GRADIENT) + ')');

    var hud = {
        'sun' : planetOrbits.append('circle'),
        'exo': planetOrbits.append('circle'),
        'earth': planetOrbits.append('circle'),
        'star': planetOrbits.append('circle')
    };

    var VERT_CENT = 450;
    var Scale = .0000026;

    hud['sun']
        .attr('transform', 'translate(300, '+ VERT_CENT + ')')
        .attr('r', Scale * SUN_RADIUS)
        .attr('fill', 'gold');

    hud['star']
        .attr('transform', 'translate(900, '+ VERT_CENT + ')')
        .attr('r', function (d) { return Scale * SUN_RADIUS * d[STAR_RADIUS]})
        .attr('fill', function (d) { return COLOR_SCALE(d[STAR_TEMP]); });

    hud['earth']
        .attr('transform', 'translate(300, '+ (Scale * AU + VERT_CENT) + ')')
        .attr('r', Scale * EARTH_RADIUS)
        .attr('fill', 'steelblue');

    hud['exo']
        .attr('transform', function (d) {
            return 'translate(900, '+ (VERT_CENT + (Scale * AU * d[ORBIT_RAD_MAX])) + ')'
        })
        .attr('r', function (d) { return Scale * EARTH_RADIUS * d[PLANET_RADIUS_EARTH]})
        .attr('fill', 'darkgray');

    //Orbit
    // EARTH ORBIT
    planetOrbits.append('ellipse')
        .attr('transform', 'translate(300, 450)')
        .attr('ry', Scale * AU)
        .attr('rx', Scale * AU * Math.sqrt(1-EARTH_ECC))
        .attr('stroke', 'lightgray')
        .attr('fill', 'none')
        .attr('stroke-width', 2);

    // EXO ORBIT
    planetOrbits.append('ellipse')
        .attr('transform', 'translate(900, 450)')
        .attr('ry', function (d) { return Scale * AU * d[ORBIT_RAD_MAX]; })
        .attr('rx', function (d) { return Scale * AU * d[ORBIT_RAD_MAX] * Math.sqrt(1-d[ORBIT_ECCENTRICITY]); })
        .attr('stroke', 'lightgray')
        .attr('fill', 'none')
        .attr('stroke-width', 2);

    //drawOrbit(hud['exo']);

}

function loadScales(planetData, width, height) {

    var width3Range = [POINT_RAD, width/2, width - POINT_RAD],
        height3Range = [height - POINT_RAD, height/2, POINT_RAD],
        width2Range = [POINT_RAD, width - POINT_RAD],
        height2Range = [height - POINT_RAD, POINT_RAD];

    /** Earth Radius */
    var e = d3.extent(planetData, function (d) {return d[PLANET_RADIUS_EARTH]; });
    var earthRadiusX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var earthRadiusY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Earth Mass */
    e = d3.extent(planetData, function (d) {return d[PLANET_MASS_EARTH]; } );
    var earthMassX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var earthMassY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Jupiter Radius */
    e = d3.extent(planetData, function (d) {return d[PLANET_RADIUS_JUPITER]; });
    var jupiterRadiusX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var jupiterRadiusY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Jupiter Mass */
    e = d3.extent(planetData, function (d) {return d[PLANET_MASS_JUPITER]; } );
    var jupiterMassX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var jupiterMassY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Star Mass */
    e = d3.extent(planetData, function (d) {return d[STAR_MASS]; } );
    var starMassX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var starMassY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Star Radius */
    e = d3.extent(planetData, function (d) {return d[STAR_RADIUS]; } );
    var starRadiusX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var starRadiusY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Star Temperature */
    e = d3.extent(planetData, function (d) {return d[STAR_TEMP]; } );
    var starTempX = d3.scaleLinear().domain([e[0], SUN_TEMP, e[1]]).range(width3Range);
    var starTempY = d3.scaleLinear().domain([e[0], SUN_TEMP, e[1]]).range(height3Range);

    /** Star Luminosity */
    e = d3.extent(planetData, function (d) {return d[STAR_LUMINOSITY]; } );
    var starLumX = d3.scaleLinear().domain([e[0], SUN_LUMINOSITY, e[1]]).range(width3Range);
    var starLumY = d3.scaleLinear().domain([e[0], SUN_LUMINOSITY, e[1]]).range(height3Range);

    /** Orbit Radius */
    e = d3.extent(planetData, function (d) { return d[ORBIT_RAD_MAX] ; } );
    var orbitRadiusX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var orbitRadiusY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Orbit Eccentricity */
    e = d3.extent(planetData, function (d) {return d[ORBIT_ECCENTRICITY]; } );
    var eccScaleX = d3.scaleLinear().domain([e[0], EARTH_ECC, e[1]]).range(width3Range);
    var eccScaleY = d3.scaleLinear().domain([e[0], EARTH_ECC, e[1]]).range(height3Range);


    var planetCountScale = d3.scaleLinear()
        .domain([0, planetData.length])
        .range(height2Range);


    X_SCALES[PLANET_RADIUS_EARTH] = earthRadiusX;
    Y_SCALES[PLANET_RADIUS_EARTH] = earthRadiusY;

    X_SCALES[PLANET_RADIUS_JUPITER] = jupiterRadiusX;
    Y_SCALES[PLANET_RADIUS_JUPITER] = jupiterRadiusY;

    X_SCALES[STAR_RADIUS] = starRadiusX;
    Y_SCALES[STAR_RADIUS] = starRadiusY;

    X_SCALES[PLANET_MASS_EARTH] = earthMassX;
    Y_SCALES[PLANET_MASS_EARTH] = earthMassY;

    X_SCALES[PLANET_MASS_JUPITER] = jupiterMassX;
    Y_SCALES[PLANET_MASS_JUPITER] = jupiterMassY;

    X_SCALES[STAR_MASS] = starMassX;
    Y_SCALES[STAR_MASS] = starMassY;

    X_SCALES[STAR_TEMP] = starTempX;
    Y_SCALES[STAR_TEMP] = starTempY;

    X_SCALES[STAR_LUMINOSITY] = starLumX;
    Y_SCALES[STAR_LUMINOSITY] = starLumY;

    X_SCALES[ORBIT_ECCENTRICITY] = eccScaleX;
    Y_SCALES[ORBIT_ECCENTRICITY] = eccScaleY;

    X_SCALES[ORBIT_RAD_MAX] = orbitRadiusX;
    Y_SCALES[ORBIT_RAD_MAX] = orbitRadiusY;

    Y_SCALES['count'] = planetCountScale;
}

function initMap(planetData) {
    var galacticMap = d3.select(ID(ID_MAP));

    var width = galacticMap.attr('width'),
        height = galacticMap.attr('height');

    var gradient = createGradient(galacticMap);

    var background = galacticMap.append('rect')
        .attr('id', ID_BG)
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(' + ID(ID_BG_GRADIENT) + ')');


    var proj = d3.geoAzimuthalEquidistant()
        .translate([width/2, height/2])
        .scale(100)

    var mapPath = d3.geoPath()
        .projection(proj);

    var gridGroup = galacticMap.append('g');

    var grat = d3.geoGraticule()

    gridGroup.append('path')
        .datum(grat)
        .classed(CLASS_MAP_GRID, true   )
        .attr('d', mapPath);

    gridGroup.append('path')
        .datum(grat.outline)
        .classed(CLASS_MAP_GRID, true   )
        .attr('d', mapPath);

    var planetGroup = galacticMap.append('g');

    var points = planetGroup.selectAll('circle')
        .data(planetData)
      .enter()
      .append('circle')
        .attr('cx', function (d) { return proj([d[STAR_LAT], d[STAR_LONG]])[0]; })
        .attr('cy', function (d) { return proj([d[STAR_LAT], d[STAR_LONG]])[1]; })
        .attr('fill', 'darkred')
        .attr('opacity', .4)
        .attr('r', POINT_RAD/2)
        .classed(CLASS_PLANET_POINT, true)
        //.classed(CLASS_PLANET_HABITABLE, function (d) { return d[HABITABLE]});


    galacticMap.append('circle')
        .attr('cy', function (d) { return proj([0, 0])[0]; })
        .attr('cx', function (d) { return proj([0, 0])[1]; })
        .attr('fill', 'wheat')
        .attr('r', POINT_RAD);

    /** Set Hover */
    points.on('mouseover', function (d) {
        this.parentNode.appendChild(this);
        d3.select(this).classed(CLASS_CHART_HOVER, true);
        pointHover(d, ID_PLANET_CHART);
    })
        .on('mouseleave', function () {
            d3.select(this).classed(CLASS_CHART_HOVER, false);
            pointClearHover(ID_PLANET_CHART);
        })
        .on('click', function (d) { debugClick(d); updateComparison(d); initOrbital(d); });

}

function pointHover(data, svgID) {
    d3.select(ID(svgID))
      .selectAll('circle' + CLS(CLASS_PLANET_POINT))
      .filter(function (d) { return d[ROWID] == data[ROWID]; })
        .each(function () {
            this.parentNode.appendChild(this);
        })
        .classed(CLASS_CHART_HOVER, true);

}

function pointClearHover(svgID) {
    d3.select(ID(svgID))
      .selectAll('circle')
        .classed(CLASS_CHART_HOVER, false)
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
    loadScales(planetData, width, height);
    /**
     * Create the background
     */
    var gradient = createGradient(planetChart);

    var background = planetChart.append('rect')
        .attr('id', ID_BG)
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(' + ID(ID_BG_GRADIENT) + ')');

    /** Create axis */
    planetChart.append('path')
        .attr('stroke', 'lightgray')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d',
            'M 0 ' + height/2 +
            'H ' + width +
            'M  ' + width/2 + ' 0' +
            'V ' + height +
            'Z'
        );


    /** Selection boxes */
    var selectX = d3.select(ID(ID_PLANET_CHART_X)),
        selectY = d3.select(ID(ID_PLANET_CHART_Y));

    selectX.on('change', function() {
        updateChart(selectionFilter(planetData))
    });

    selectY.on('change', function () {
        updateChart(selectionFilter(planetData));
    });

    updateChart(selectionFilter(planetData));

}

function selectionFilter(data) {
    var props = getChartSelections();
    return data.filter(function (d) {
        return d[props[0]] !== 0 && d[props[1]] !== 0;
    });
}

function getChartSelections() {
    var selX = d3.select(ID(ID_PLANET_CHART_X)).property('value');
    var selY = d3.select(ID(ID_PLANET_CHART_Y)).property('value');
    return [selX, selY]
}

function updateComparison(planetData) {
    var comparison = d3.select(ID(ID_COMPARISON));
    var compText = comparison.select('g' + CLS(CLASS_COMPARISON_TEXT));
    var compIMG = comparison.select('g' + CLS(CLASS_COMPARISON_TEXT));

    var colWidth = comparison.attr('width')/4,
        colHeight = comparison.attr('height');

    var rad = 'radius';
    var r = 10;
    var pad = 40;
    var maxR = colWidth - pad;
    var r2 = 10/EARTH_RADIUS;
    var TYPE_P = 'P',
        TYPE_S = 'S';

    var hudData = [
        {   'name' : 'Earth',
            'radius' : EARTH_RADIUS,
            'orbit_rad' : KM_AU,
            'mass' : 1,
            'temp' : 0,
            'type' : TYPE_P,
            'r': planetData[PLANET_RADIUS_EARTH] < 1 ? maxR : maxR/planetData[PLANET_RADIUS_EARTH],
            'img': ID_SYMBOL_EARTH
        },
        {   'name' : planetData[PLANET_NAME],
            'radius' : Math.round(EARTH_RADIUS * planetData[PLANET_RADIUS_EARTH]),
            'orbit_rad' : Math.round(KM_AU * planetData[ORBIT_RAD_MAX]),
            'mass' : planetData[PLANET_MASS_EARTH],
            'temp' : 0,
            'type' : TYPE_P,
            'r': planetData[PLANET_RADIUS_EARTH] > 1 ? maxR : maxR * planetData[PLANET_RADIUS_EARTH],
            'img': ID_SYMBOL_PLANET
        },
        {   'name' : 'Sun',
            'radius' : SUN_RADIUS,
            'orbit_rad' : KM_AU,
            'mass' : 1,
            'temp' : SUN_TEMP,
            'type' : TYPE_S,
            'r': planetData[STAR_RADIUS] < 1 ? maxR : maxR/planetData[STAR_RADIUS],
            'img': ID_SYMBOL_SUN
        },
        {   'name' : planetData[STAR_NAME],
            'radius' : Math.round(SUN_RADIUS * planetData[STAR_RADIUS]),
            'orbit_rad' : KM_AU,
            'mass' : planetData[STAR_MASS],
            'temp' : planetData[STAR_TEMP],
            'type' : TYPE_S,
            'r': planetData[STAR_RADIUS] > 1 ? maxR : maxR * planetData[STAR_RADIUS],
            'img': ID_SYMBOL_STAR
        }
    ];

    compText.selectAll('tspan').remove();

    var stats = compText.selectAll('text')
        .data(hudData);

    stats = stats.enter()
      .append('text')
        .attr('fill', 'whitesmoke')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
      .merge(stats);

    stats
      .append('tspan')
        .attr('x', function (d, i) { return colWidth * i; })
        .attr('dy', '1.2em')
        .text(function (d) { return 'Name: ' + d['name']; } )
      .append('tspan')
        .attr('x', function (d, i) { return colWidth * i; })
        .attr('dy', '1.2em')
        .text(function (d) { return 'Radius: ' + d[rad] + ' km'; } )
      .append('tspan')
        .attr('x', function (d, i) { return colWidth * i; })
        .attr('dy', '1.2em')
        .text(function (d) { return 'Orbital Radius: ' + d['orbit_rad'] + ' km'; })
      .append('tspan')
        .attr('x', function (d, i) { return colWidth * i; })
        .attr('dy', '1.2em')
        .text(function (d) { return 'Mass: ' + d['mass'] ; })
      .append('tspan')
        .attr('x', function (d, i) { return colWidth * i; })
        .attr('dy', '1.2em')
        .text(function (d) { return 'Temperature: ' + d['temp'] + 'K'; });

    /** The planet/stars */
    compIMG.selectAll('circle').remove();
    compIMG.selectAll('image').remove();
    compIMG.selectAll('use').remove();

    var planets = compIMG.selectAll('circle')
        .data(hudData);


    planets = planets.enter()
      .append('svg:use')
        .attr('x', function (d, i) {
            return d['r'] !== 0 ? colWidth/2 + i * colWidth - d['r']/2 : colWidth/2 + i * colWidth - maxR/2;
        })
        .attr('y', function (d) {
            return d['r'] !== 0 ? colHeight/2 - d['r']/2 : colHeight/2 - maxR/2;
        })
        .attr('width', function (d) { return d['r'] !== 0 ? d['r'] : maxR; })
        .attr('height', function (d) { return d['r'] !== 0 ? d['r'] : maxR; })
        .attr('xlink:href', function (d) { return d['r'] != 0 ? ID(d['img']) : ID(ID_SYMBOL_Q); })
      .merge(planets);

    d3.select(ID(ID_STAR_GRAD_START))
        .attr('style', function (d) {
            console.log(this, COLOR_SCALE(planetData[STAR_TEMP]), COLOR_SCALE(planetData[STAR_TEMP]).toString());
            return 'stop-color:' + COLOR_SCALE(planetData[STAR_TEMP])
        })


}
function initAll(planetData) {
    initMap(planetData);
    initChart(planetData);
    initOrbital(planetData[0]);
    initComparison(planetData[0]);
}

function changeX() {
    var prop = getChartSelections()[0];
    d3.selectAll(ID(ID_PLANET_CHART) + ' circle')
        .attr('cx', function (d) { return X_SCALES[prop](d[prop]); })
}

function changeY() {
    var prop = getChartSelections()[1];
    d3.selectAll(ID(ID_PLANET_CHART) + ' circle')
        .attr('cy', function (d) { return Y_SCALES[prop](d[prop]); });
}

function main(error, data) {
    var planetData = convertDataFormats(data);
    initAll(planetData);
}

function initComparison(data) {
    var comparison = d3.select(ID(ID_COMPARISON));

    comparison.append('g')
        .classed(CLASS_COMPARISON_TEXT, true);
    comparison.append('g')
        .classed(CLASS_COMPARISON_IMAGES, true);

    updateComparison(data);
}

function convertDataFormats(data) {
    for (var i =0; i < data.length; i++) {
        for (var j=0; j < PROPERTIES_NUM.length; j++) {
            data[i][PROPERTIES_NUM[j]] = +data[i][PROPERTIES_NUM[j]];
        }

        data[i][ROWID] = i;

        /** Add habitable zone information */
        //var hab = calculateHabitableZone(data[i]);
        // data[i][HABITABLE] = hab[0];
        // data[i][HABITABLE_ZONE_INNER] = hab[1];
        // data[i][HABITABLE_ZONE_OUTER] = hab[2];
    }
    return data
}

function calculateHabitableZone(d) {
    if (d[STAR_LUMINOSITY] == 0 ||
        d[ORBIT_RAD_MAX] == 0) {
        return [false, 0, 0]
    }

    var lSun = 3.846e+26;
    var L = Math.pow(10, d[STAR_LUMINOSITY]);


    var orb = d[ORBIT_RAD_MAX]
    var ecc = orb * Math.sqrt(1-d[ORBIT_ECCENTRICITY]);
    var inner = Math.sqrt(L/1.1);
    var outer = Math.sqrt(L/0.53);
    var habitable = (inner <= orb && orb <= d[outer]) ? true : false;

    console.log(L, d[STAR_LUMINOSITY], habitable, inner, outer);
    return [habitable, inner, outer]
}

function updateChart ( data ) {
    /**
     * Generate points
     */
    var planetChart = d3.select(ID(ID_PLANET_CHART));

    var points = planetChart.selectAll('circle' + CLS(CLASS_PLANET_POINT))
        .data( data );

    var props = getChartSelections();

    points.exit().remove();

    points = points.enter()
      .append('circle')
        .classed(CLASS_PLANET_POINT, true)
        //.classed(CLASS_PLANET_HABITABLE, function (d) { return d[HABITABLE]})
        .attr('fill', 'steelblue')
        .attr('r', function (d) { return POINT_RAD })
      .merge(points)
        .attr('cx', function (d) { return X_SCALES[props[0]](d[props[0]]);} )
        .attr('cy', function (d) { return Y_SCALES[props[1]](d[props[1]]); } );


    points.on('click', function (d) {
            debugClick(d); updateComparison(d); initOrbital(d); })
        .on('mouseenter', function (d) {
            this.parentNode.appendChild(this);
            d3.select(this).classed(CLASS_CHART_HOVER, true);
            pointHover(d, ID_MAP); })
        .on('mouseleave', function () {
            d3.select(this).classed(CLASS_CHART_HOVER, false);
            pointClearHover(ID_MAP);
        });
}

/*
 * Anonymous function that automatically runs once this file is loaded
 */
(function(){
    /** API Query returns different resutls than full table data.
     *  Just caching data for now
     */
    var live = false;
    if (live) {
        d3.csv(API_URL +
            formatAPIQuery(API_KEY_FORMAT, API_VAL_JSON) +
            formatAPIQuery(API_KEY_TABLE, API_VAL_EXOPLANETS) +
            formatAPIKey(API_KEY_SELECT) + PROPERTIES_NUM.join() +
            '&where=pl_kepflag=1', main);
    } else {
        d3.csv('data/planets.csv', main)
    }
})();