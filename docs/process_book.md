##### Matthew Territo  
u1076954  
territo@cs.utah.edu  
https://github.com/wundahful/dataviscourse-exoplanet-explorer

# OpenSpace Exoplanet Explorer: Process Book
***
**http://www.sci.utah.edu/~territo/cs6630/exoplanets/index.html**

**https://github.com/wundahful/dataviscourse-exoplanet-explorer**

***
+++
# Background and Motivation
My research group is The OpenSpace project (openspaceproject.com). We're building an open source planetary & cosmological visualization platform. The primary application is for use in planetarium shows, public outreach, and in the classroom. NASA and space research institutions are also involved to guide its development toward becoming a useful research tool as well, especially for studying solar weather.
  
While others are beginning work on information visualization for solar dynamics research, my goal is to focus more on the outreach side. I'm primarily interested in improving communication of complex science (especially visually), and I think exoplanet discovery is one of the more tangible and inspiring research themes that can be shared.

+++

# Project Objectives
This project will involve a browser-based exoplanet explorer. Eventually, it will integrate with the OpenSpace package to interactively update along with navigation inside OpenSpace. It will present the exoplanets that have been confirmed by the Kepler mission data at https://kepler.nasa.gov/index.cfm (there are actually a few missions involved, but Kepler is the most recognizable). By presenting information in a relatable scale, I’d like to inspire discovery of the universe and space exploration.

My proposal is to showcase these planets in relation to our solar system and Earth: how far away they are, how their orbits, mass, & day lengths compare to Earth’s, and if they’re possibly habitable. Furthermore, I’d compare similar metrics for their star vs. the Sun. A final goal might be to do some more traditional information visualization over the entire dataset to analyze exoplanet statistics. However, it’s more important to me to create an exploration portal that shows relationships to Earth rather than to provide a technical measurement and analysis tool.

My original intent is a heads-up-display style console. As you navigate inside of OpenSpace, it feeds the camera frustum to the Exoplanet Explorer. The Explorer then loads information about planets within the current viewport. Since OpenSpace has many hardware and software requirements, I envision this display as a standalone viewer to reduce the amount of investment an average surfer needs to get involved with the project. Users can select planets at simplest with a list, but possibly by region or a map. It is my hope that the easy access to this web tool will also drive engagement by inspiring users to take the time to install and learn the full OpenSpace package.

# Data
Data will come from the NASA Exoplanet Archive hosted by CalTech. I plan to mostly use the confirmed planet database, but may need to integrate additional sources.
http://exoplanetarchive.ipac.caltech.edu/  
http://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets

# Data Processing
The data seems relatively clean for the confirmed planets, and most data are presented in units relative to the Earth and Sun, so it shouldn't require much processing. There's also an API available, which should make accessing active data very simple. The biggest processing to be done will likely be calculating habitable zones based on star types. There might also be some not-insignificant work to process the light curve/transit data.

+++

# Visualization Design
### Design 1: Heads-Up Display
The Heads-Up Display presents mainly blown-up views. We use animated location to encode the orbit's distance and velocity. In a separate panel, we also use area to encode size, and feature direct data to show information about selection. There's an overall galactic map to display distance and give context.

It is able to encode quite a bit of information about each individual planet effectively, but provides less analysis of the overall picture. It also relies somewhat on displaying direct data instead of an encoding.

### Design 2: Analytics Console
The Analytics Console would be magic-window style implementation. It begins with an overview bar chart of the number of habitable planets within distance bins. As you select areas of the galactic map via a window (connected to OpenSpace), the encoding can change to show a detail view. The example presented is a scatter plot of Distance to the Sun vs. "Most Earthlike," an ordinal metric that would need to be curated. Other views would be possible to break out. Tooltips can present even finer detail on an individual datum.

This view presents information in a very explorable manner, with access to many levels of information. Despite this, the clinical nature of the presentation has the potential to stymie engagement if the styling isn't well considered.

### Design 3: Vitruvian Planet
The Vitruvian Planet design is meant to show how the values cluster around an ideal planet i.e. the Earth. It would be a scatterplot presentation with Earth at the center of interactive axes. The data could be changed to compare gravity against distance to the sun, or temperature vs. size, easily showing how they directly compare to Earth. The color and size channels of the marks could also be used to encode different information from chart to chart, but more likely would show size and temperature across all other values.

This presentation has a more compelling encoding & interactivity than the Analytics Console, and a more analytical approach than the Heads-Up Display. However, it may try to encode too much information in too small of a space, and the scaling may become a factor, especially since we're dealing with Very Large Numbers™.

### Design 4: Composite
The composite design takes the Vitruvian Planet and integrates it into the Heads Up Display. Design 1 is lacking in overall view and Design 3 is perhaps too direct. I feel that combining them elevates both concepts. The combination provides the more playful multimedia experience I'm trying to obtain while also introducing a deeper, meaningful level of analytics.

# Must-Have Features
- Planet size relative to Earth or Jupiter (depending on order of magnitude)
- Type & size of star it's orbiting
- Distance from our solar system
- Length of day
- Animated orbits compared against Earth's orbit
- Display of Habitable Zone in a planet's system vs. Earth & Sun's
- Map/viz of all exoplanet distances to our solar system
- "Vitruvian" scatterplot against Earth

# Optional Features
- Simplified and understandable representation of the light curve measurement for each planet
- Display/animate and entire star system with multiple planets when applicable
- Comparison/selection of multiple planets across systems
- Plot locations using galactic coordinates
- Filtering connected to OpenSpace software's camera frustum

+++
# Project Schedule
### Week 1: October 24 - October 30
- Proposal
- Peer Review
- Design
- API exploration
### Week 2: October 31 - November 6
- Studying astrophysical models and calculation methods
- Data munging & processing
- Initial layout & prototyping
- OpenSpace code exploration (find camera output)
### Week 3: November 7 - November 13
- Working size comparisons for Earth/planet, Sun/star
- Working orbit display
- Simple chart of distances vs habitable-ness
- **November 11**: Milestone Due
### Week 4: November 14 - November 20
- Interactivity
- Styling, art
- Optional: *Begin OpenSpace Integration*
### Week 5: November 21 - November 27
- Animation
- Styling, art
- Optional: *Multiple Selections & Displays, Continue OpenSpace Integration*
### Week 6: November 22 - December 2
- Finalize Code
- Finalize Process Book
- Cleanup
- **December 2**: Project Due

+++
# Prototyping Notes
- Implementation is moving along. The "Vitruvian" chart (with comparisons made to Earth) has a few interesting measurements to load. It'll be nice to get galactic location in there as well.
- Discussing with OpenSpace team: there's some simple text output from another feature (Globe Browsing) which includes information about the camera frustum. Might be a simple way to integrate interactivity.
- I'm going to have to decide how to work with astronomical scale. The examples I surveyed almost universally trade off accurate scale portrayal for large legibility. Perhaps there's a way to balance the two using the multiple views.
- After getting feedback and seeing the column layout in practice, I'm considering layering the orbit views — having selectable layers and toggles for turning on and off display of orbit lines, animation, habitable zones, etc.
- The data is a little lighter than it appears. After implementing some of the comparisons, it turns out that the records for a large number of the confirmed exoplanets are incomplete. For the data I'm focusing on, only ~200 of the ~3100 items are complete. I'll need to decide if there's a way to synthesize values or how to handle them. Omission of 90% of the available items would be a disappointment.

## References
### Reference Methods/Algorithms
- https://bl.ocks.org/mbostock/5415941
After scanning through bl.ocks.org to see if Mike Bostock had provided any conventions for a cartesian-style axis, I stumbled upon one of his implementations that shows off Kepler exoplanet orbits, similar to part of my project.
- http://www.nytimes.com/interactive/science/space/keplers-tally-of-planets.html
- http://bl.ocks.org/syntagmatic/5bbf30e8a658bcd5152b  
While trying to find some reference for 2D color interpolation, I found an old colleague's example. Thanks, Kai!

### Similar Work Survey
After the feedback session I was introduced to some other similar concepts
- http://www.visualcinnamon.com/portfolio/exoplanets
- http://www.nationalgeographic.com/astrobiology/goldilocks-worlds/

And from bl.ocks.org's reference pages, followed through to Jonathan Corum’s 2013 interactive graphic on Kepler exoplanets:
- http://www.nytimes.com/interactive/science/space/keplers-tally-of-planets.html

While it's disappointing to find that other project contain some major aspects of what I'm trying to achieve, there's still definitely room for improvement and more compelling interactivity. I'll need to focus more on the integration aspect with OpenSpace, and I'd like to make some adaptations so that this doesn't become a simple re-implementation project. The light transit curve visualization could be a worthwhile addition.

+++

# Summary

## Implemtation Details

## Design Choices & Challenges

## Continuing Improvements
The I noticed late in the game that the API calls don't actually pull the entire data set, but merely the Kepler survey data. Since this discovery came late in the process and I hadn't been able to rectify it, I'm continuing to use my cached version of the full dataset in the deployment.
