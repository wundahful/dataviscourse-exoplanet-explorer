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
    ID_MAP_GRID = 'galactic-grid',
    ID_MAP_PLANETS = 'galactic-planets',
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
    CLASS_PLANET_POINT = 'planet-point',
    CLASS_COMPARISON_TEXT = 'comp-text',
    CLASS_COMPARISON_IMAGES = 'comp-img',
    CLASS_ROW_PREFIX = 'row-',
    CLASS_SELECTED = 'selected';

/*
 * Data Variables
 */
var PLANET_RADIUS_JUPITER = 'pl_radj',
    PLANET_RADIUS_EARTH = 'pl_rade',
    PLANET_MASS_JUPITER = 'pl_massj',
    PLANET_MASS_EARTH = 'pl_masse',
    PLANET_TEMP = 'pl_eqt',
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
    ROWID = 'rowid';

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
    ORBIT_ECCENTRICITY,
    PLANET_TEMP
];

var PROPERTIES_STR = [
    PLANET_NAME,
    STAR_CLASS,
];

var COLOR_OUTER = '#522222',
    COLOR_INNER = '#D9B227',
    COLOR_CENTER = '#06914C',
    COLOR_UNKNOWN = COLOR_OUTER;

var COLOR_SCALE_2D, COLOR_SCALE_X, COLOR_SCALE_Y;
var SELECTED_DATA;

/** Astronomical Constants */
    var SUN_RADIUS = 695700,
    SUN_TEMP = 5800,
    EARTH_TEMP = 252,
    SUN_LUMINOSITY = 1,
    AU = SUN_RADIUS / 0.00465047,
    KM_AU = 149597871,
    EARTH_RADIUS =  6353,
    EARTH_ECC = 0.0167;

    var COLOR_SCALE = d3.scaleLinear()
        .domain([0,         2400,       4000,       5500,       6000,       7500,           10500,      30000])
        .range(['Black',    'Coral',    'Gold',     '#DDBA4B',  '#F2D16D',  'LightBlue',    'SkyBlue',  'DeepSkyBlue' ])
        .interpolate(d3.interpolateLab);

/*
 * Style Variables
 */
var POINT_RAD = 6;

var X_SCALES = {},
    Y_SCALES = {};

var GALACTIC_PROJECTION = d3.geoAzimuthalEquidistant()
    .translate([
        d3.select(ID(ID_MAP)).attr('width')/2,
        d3.select(ID(ID_MAP)).attr('height')/2])
    .scale(100)


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

    /** Star Mass */
    e = d3.extent(planetData, function (d) {return d[STAR_MASS]; } );
    var starMassX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var starMassY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Star Radius */
    e = d3.extent(planetData, function (d) {return d[STAR_RADIUS]; } );
    var starRadiusX = d3.scaleLinear().domain([e[0], 1, e[1]]).range(width3Range);
    var starRadiusY = d3.scaleLinear().domain([e[0], 1, e[1]]).range(height3Range);

    /** Planet Temperature */
    e = d3.extent(planetData, function (d) {return d[PLANET_TEMP]; } );
    var planetTempX = d3.scaleLinear().domain([e[0], EARTH_TEMP, e[1]]).range(width3Range);
    var planetTempY = d3.scaleLinear().domain([e[0], EARTH_TEMP, e[1]]).range(height3Range);

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

    X_SCALES[PLANET_RADIUS_EARTH] = earthRadiusX;
    Y_SCALES[PLANET_RADIUS_EARTH] = earthRadiusY;

    X_SCALES[STAR_RADIUS] = starRadiusX;
    Y_SCALES[STAR_RADIUS] = starRadiusY;

    X_SCALES[PLANET_MASS_EARTH] = earthMassX;
    Y_SCALES[PLANET_MASS_EARTH] = earthMassY;

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

    X_SCALES[PLANET_TEMP] = planetTempX;
    Y_SCALES[PLANET_TEMP] = planetTempY;

    genColorScales();
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

    var mapPath = d3.geoPath()
        .projection(GALACTIC_PROJECTION);

    var gridGroup = galacticMap.append('g')
        .attr('id', ID_MAP_GRID);

    var grat = d3.geoGraticule();

    gridGroup.append('path')
        .datum(grat)
        .classed(CLASS_MAP_GRID, true   )
        .attr('d', mapPath);

    gridGroup.append('path')
        .datum(grat.outline)
        .classed(CLASS_MAP_GRID, true   )
        .attr('d', mapPath);

    /** Create axis */
    gridGroup.append('path')
        .attr('stroke', 'lightgray')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('opacity', .5)
        .attr('d',
            'M 0 ' + height/2 +
            'H ' + width +
            'M  ' + width/2 + ' 0' +
            'V ' + height +
            'Z'
        );

    galacticMap.append('circle')
        .attr('r', POINT_RAD)
        .attr('cx', function () { return GALACTIC_PROJECTION([0, 0])[0]; })
        .attr('cy', function () { return GALACTIC_PROJECTION([0, 0])[1]; })
        .attr('opacity', 0.7)
        .attr('fill', 'black');

    var planetGroup = galacticMap.append('g')
        .attr('id', ID_MAP_PLANETS);

    updateMap(planetData);
}

function fillMapPoints() {
    d3.selectAll(ID(ID_MAP) + ' ' + CLS(CLASS_PLANET_POINT))
        .attr('fill', function(d) {
            var pt = d3.select(ID(ID_PLANET_CHART) + ' ' + CLS(d[ROWID]));

            if (pt.empty())
                return COLOR_UNKNOWN;

            return pt.attr('fill');
        })
}


function pointHover(data) {
    var sel = d3.selectAll('svg circle' + CLS(CLASS_PLANET_POINT) + CLS(data[ROWID]))
        .classed(CLASS_CHART_HOVER, true);

    effervesceSelected(sel)
}


function pointClearHover() {
    d3.selectAll('svg circle' + CLS(CLASS_PLANET_POINT))
        .classed(CLASS_CHART_HOVER, false);

    effervesceSelected(d3.selectAll(CLS(CLASS_SELECTED)));

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
        .attr('opacity', .5)
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
        updateChart(selectionFilter(planetData));
        updateMap(planetData)
    });

    selectY.on('change', function () {
        updateChart(selectionFilter(planetData));
        updateMap(planetData)
    });

    updateChart(selectionFilter(planetData));
}


function updateMap(planetData) {

    var group = d3.selectAll(ID(ID_MAP_PLANETS));
    var points = group.selectAll('circle')
        .data(planetData);

    points.exit().remove();

    points = points.enter()
        .append('circle')
        .attr('r', POINT_RAD * 0.65)
        .merge(points)
        .attr('cx', function (d) {
            return GALACTIC_PROJECTION([d[STAR_LAT], d[STAR_LONG]])[0];
        })
        .attr('cy', function (d) {
            return GALACTIC_PROJECTION([d[STAR_LAT], d[STAR_LONG]])[1];
        })
        .attr('class', function (d) {
            return CLASS_PLANET_POINT + ' ' + d[ROWID];
        }, true)
        .classed(CLASS_SELECTED, function (d) {
            return d[ROWID] == SELECTED_DATA[ROWID]
        });


    fillMapPoints();
    effervesceSelected(d3.selectAll(CLS(CLASS_SELECTED)));

    /** Set Hover */
    points.on('click', clickPlanet)
        .on('mouseover', function (d) {
            pointHover(d);
            updateComparison(d);
        })
        .on('mouseout', function () {
            pointClearHover();
            updateComparison(SELECTED_DATA)
        });
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
        TYPE_S = 'S',
        UNKNOWN = 'Unknown';

    var valTest = function (val) {
        return val ? val : UNKNOWN;
    }

    var hudData = [
        {   'name' : 'Earth',
            'radius' : EARTH_RADIUS,
            'orbit_rad' : KM_AU,
            'mass' : 1,
            'temp' : EARTH_TEMP,
            'type' : TYPE_P,
            'r': planetData[PLANET_RADIUS_EARTH] < 1 ? maxR : maxR/planetData[PLANET_RADIUS_EARTH],
            'img': ID_SYMBOL_EARTH
        },
        {   'name' : planetData[PLANET_NAME],
            'radius' : valTest(Math.round(EARTH_RADIUS * planetData[PLANET_RADIUS_EARTH])),
            'orbit_rad' : valTest(Math.round(KM_AU * planetData[ORBIT_RAD_MAX])),
            'mass' : valTest(planetData[PLANET_MASS_EARTH]),
            'temp' : valTest(planetData[PLANET_TEMP]),
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
            'mass' : valTest(planetData[STAR_MASS]),
            'temp' : valTest(planetData[STAR_TEMP]),
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
    compIMG.selectAll('use').remove();

    var planets = compIMG.selectAll('use')
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
            return 'stop-color:' + COLOR_SCALE(planetData[STAR_TEMP])
        })


}
function initAll(planetData) {
    SELECTED_DATA = planetData[846];
    initChart(planetData);
    initMap(planetData);
    initComparison(SELECTED_DATA);
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

    d3.select('#sun-grad-start')
        .attr('style', 'stop-color:' + COLOR_SCALE(SUN_TEMP));

    updateComparison(data);
}

function convertDataFormats(data) {
    for (var i =0; i < data.length; i++) {
        for (var j=0; j < PROPERTIES_NUM.length; j++) {
            data[i][PROPERTIES_NUM[j]] = +data[i][PROPERTIES_NUM[j]];
        }

        data[i][ROWID] = CLASS_ROW_PREFIX + i;
    }
    return data
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
        .attr('r', POINT_RAD)
      .merge(points)
        .attr('fill', function (d) {
            return getColor(
                X_SCALES[props[0]](d[props[0]]),
                Y_SCALES[props[1]](d[props[1]]));
        })
        .attr('cx', function (d) { return X_SCALES[props[0]](d[props[0]]); })
        .attr('cy', function (d) { return Y_SCALES[props[1]](d[props[1]]); })
        .attr('class', function (d) { return CLASS_PLANET_POINT + ' ' + d[ROWID]; })
        .classed(CLASS_SELECTED, function (d) { return d[ROWID] == SELECTED_DATA[ROWID] });


    points.on('click', clickPlanet)
        .on('mouseover', function (d) {
            pointHover(d);
            updateComparison(d)
        })

        .on('mouseout', function () {
            pointClearHover();
            updateComparison(SELECTED_DATA);
        });

    effervesceSelected(d3.selectAll(CLS(CLASS_PLANET_POINT) + CLS(CLASS_SELECTED)));
}

function effervesceSelected(selection) {
    selection.each(function () { this.parentNode.appendChild(this); });
}

function clickPlanet(planetData) {
    debugClick(planetData);
    SELECTED_DATA = planetData;
    d3.selectAll(CLS(CLASS_PLANET_POINT) + CLS(CLASS_SELECTED))
        .classed(CLASS_SELECTED, false);

    var sel = d3.selectAll(CLS(planetData[ROWID]))
        .classed(CLASS_SELECTED, true);

    effervesceSelected(sel)


    updateComparison(SELECTED_DATA);
}

/** Adapted from old colleague's work, Kai Chang
 * http://bl.ocks.org/syntagmatic/5bbf30e8a658bcd5152b
 */
function getColor(x, y) {
    var size = d3.select(ID(ID_PLANET_CHART)).attr('width');

    var color = COLOR_SCALE_2D
        .range([COLOR_SCALE_X(x), COLOR_SCALE_Y(y)])
        .interpolate(d3.interpolateLab);

        var strength = (y - x) / (size-1);

    return color(strength)
}

function genColorScales() {
    var size = d3.select(ID(ID_PLANET_CHART)).attr('width');

    var targetSize = size/6,
        half = size/2;
    var dom = [0, half-targetSize, half, half+targetSize, size],
        ran = [COLOR_OUTER, COLOR_INNER, COLOR_CENTER, COLOR_INNER, COLOR_OUTER];

    COLOR_SCALE_X = d3.scaleLinear()
        .domain(dom)
        .range(ran);

    COLOR_SCALE_Y = d3.scaleLinear()
        .domain(dom)
        .range(ran);

    COLOR_SCALE_2D = d3.scaleLinear()
        .domain([-1, 1])
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