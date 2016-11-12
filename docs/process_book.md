##### Matthew Territo  
u1076954  
territo@cs.utah.edu  
https://github.com/wundahful/dataviscourse-exoplanet-explorer

# OpenSpace Exoplanet Explorer: Process Book

## Prototyping Notes
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

### Similar Work Survey
<screenshots to come>

After the feedback session I was introduced to some other similar concepts
- http://www.visualcinnamon.com/portfolio/exoplanets
- http://www.nationalgeographic.com/astrobiology/goldilocks-worlds/

And from bl.ocks.org's reference pages, followed through to Jonathan Corum’s 2013 interactive graphic on Kepler exoplanets:
- http://www.nytimes.com/interactive/science/space/keplers-tally-of-planets.html

While it's disappointing to find that other project contain some major aspects of what I'm trying to achieve, there's still definitely room for improvement and more compelling interactivity. I'll need to focus more on the integration aspect with OpenSpace, and I'd like to make some adaptations so that this doesn't become a simple re-implementation project. The light transit curve visualization could be a worthwhile addition.