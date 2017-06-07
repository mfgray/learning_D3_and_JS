## Summary

If you are curious about the height or weight of someone who should wear a Calvin Klein or Patagonia size 'M' according to the brand, then this visualization is for you.

The visualization uses anthropometric (body measurement) data from a US Army survey to show the viewer real life measurement distributions for individual clothing sizes from popular brands.

The graphic starts off with an animation that uses measurements from real people to help illustrate how clothing sizes vary from brand to brand. Then it opens up to let the user select different brands and explore for themselves.
When the user selects a brand, they are not just shown the distributions of individuals' chest sizes and other common sizing metrics, but they are also given height and weight distributions.

 Having not seen any similar visualizations, I wanted to create this one both for my own curiosity and because I feel other people may find it interesting. Additionally, it provided more room for learning compared to recreating a graph more similar to the in class examples.

 ## Design

 The visualization attempts to provide an overview of clothing sizes in a more effective way than the typical size "charts" provided by major clothing brand. Chart is in quotes since those charts are no more than look up tables.

The graphic evolved in two stages. In the first stage I made the interactive graph that I was interesting in seeing. I wanted to see how size charts for different clothing brands faired when applied to real people. After submitting that version for feedback, the consensus was that it wasn't sufficiently explanatory. In the second stage I addressed that feedback by adding an animated intro story showing how letter sizing (i.e. S, M, L) varies significantly between brands.

Due to that progression, many of the design choices were made in order create the interactive first version of the graph, and afterwards the code was adapted to make the more explanatory animation. Those two parts together made the product follow the wine glass structure analogy from the course videos. First the animation leads the viewer along a  narrative, and then it opens up to let the viewer explore.

The interactive portion was designed to engage a wide range of viewers. As a first design choice to meet that goal, the graphic would include a menu to select brands the viewers are legitimately interested in from a variety of popular choices. That choice led to the next design elements falling naturally in place. The graphic would show the distribution of people within each size for important measurements such as chest, waist, weight, height, etc. Although that goal suggested variants of histograms, or boxplots, I went with histograms. I feel histograms give a better intuitive representation of the distribution than box plots or even violin plots do. As a categorical variable, size is natural to encode using the color with an accompanying size legend.

The graphic would need histograms for each of the important measurements. That requirement called for a panel of 6-8 histogram plots or a way to select and display them one at a time. Forcing the user to select each measurement in order to see a histogram would be too much work for them, so the graphic needs show them all at once. The user can click on a size in the size legend to highlight an individual size.  The graphics for that size can be highlighted by increasing the opacity while simultaneously lowering the opacity of the non-highlighted sizes.

The histograms alone would show enough information to accomplish the goal of giving an overview of the sizes, but they would leave the viewer questioning how they were calculated. In order to 'show' rather than just 'tell', the visualization includes a scatter plot of the individual measurements for each person. A single scatter plot is sufficient as seeing how two of the dimensions were categorized and aggregated into the histograms gives the viewer a good picture of how it worked for all of them. However, a menu was added to allow the viewer explore different dimensions.

A problem with the initial design was that the histograms plots were hard to interpret when all sizes were shown on the same axis. That issue was solved by changing the histograms to only show interpolated outlines of the distribution by interpolating the midpoints of the histogram bars until the viewer selects a specific size. Once they selected the size, the actual underlying histogram for that size is made visible.


## Feedback

Once the graphic had the panel of distribution plots, the scatter plot, and the working legend and menu, I submitted it for [feedback on the forum.](https://discussions.udacity.com/t/feed-back-request-for-d3-js-project-visualizing-clothing-sizes/250406/3) The main comments from the three reviews were:

* Not sufficiently explanatory
* Colors not distinct enough
* Dropdown menu not obvious
* Mouse turns to text selector over some of the buttons

The appearance related issues were easily addressed.
* I changed the color scheme.
* I highlighted the dropdown buttons by making them underline the text when hovered over, and also made the brand select dropdown blink to guide the user to the first one they should change.
* I used CSS to make SVG text non-selectable and the pointer remain the default

The issue of it not being sufficiently explanatory required more changes. I added a skippable intro animation that focused on chest and weight and then demonstrated that letter sizing between brands is basically arbitrary. That was accomplished by showing the weight distribution for size small for Levis and comparing it to small for Calvin Klein, revealing that Calving Klein small was a Levis large. The moral was that one has to look at the size chart rather than go off the letter size. At the end of the animation, the visualization opens up to let the user explore the brand of their choice using the data.

## Data Description

Anthropometric measurements are taken form the 1988 Army survey, described in the source: "Gordon, C. C. et al. 1988 ANTHROPOMETRIC SURVEY OF U.S. ARMY PERSONNEL: METHODS AND SUMMARY STATISTICS. (1989)

Size charts were primarily obtained from the respective brand websites, except for a few from REI's website for brands that weren't REI.

## Resources
Resources and References

As my choice of visualization was intended to provide a lot of learning opportunities, I had to consult a number of forums and sites. There may be some left off that arrived from links on these ones, or showed very similar info to the ones here.

#### Data

Anthropometric measurements are taken form the 1988 Army survey, described in the source: "Gordon, C. C. et al. 1988 ANTHROPOMETRIC SURVEY OF U.S. ARMY PERSONNEL: METHODS AND SUMMARY STATISTICS. (1989) via http://mreed.umtri.umich.edu/mreed/downloads.html#ansur

Size charts were scraped from the REI website and respective brand websites.

Starter code for scraping and parsing size charts was from the following source: http://srome.github.io/Parsing-HTML-Tables-in-Python-with-BeautifulSoup-and-pandas/

Saving data in json format
https://stackoverflow.com/questions/7100125/storing-python-dictionaries
https://stackoverflow.com/questions/17043860/python-dump-dict-to-json-file

#### CSS, D3 and JS
Extensive use of D3 manual:
https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md

Histograms
https://bl.ocks.org/mbostock/3048450
https://bost.ocks.org/mike/bar/
https://bost.ocks.org/mike/bar/2/
https://bl.ocks.org/mbostock/1933560
https://github.com/d3/d3-3.x-api-reference/blob/master/Histogram-Layout.md
http://bl.ocks.org/nnattawat/8916402

D3 lines
https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md
https://bl.ocks.org/mbostock/3883245
http://bl.ocks.org/d3noob/8dc93bce7e7200ab487d

D3 text formatting
https://bl.ocks.org/emmasaunders/0016ee0a2cab25a643ee9bd4855d3464

d3 remove elements https://stackoverflow.com/questions/16260285/d3-removing-elements

svg tags
https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute

Hex color codes
http://colorbrewer2.org/#type=qualitative&scheme=Set1&n=5

JS this
https://stackoverflow.com/questions/8719635/jquery-this-versus-this-and-maybe-even-this
https://stackoverflow.com/questions/3373723/pass-this-to-function

Javascript styling
https://google.github.io/styleguide/javascriptguide.xml#Naming

Vanilla Javascript functions https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
https://www.w3schools.com/js/js_if_else.asp
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

Require js
http://requirejs.org
http://hiphoff.com/using-require-js-to-efficiently-load-javascript-files-and-their-dependencies/

Extensive use of references on CSS and JS from:
https://www.w3schools.com

General selectors
https://www.w3schools.com/cssref/css_selectors.asp

Visibility
https://www.w3schools.com/css/css_display_visibility.asp

Timed events
https://www.w3schools.com/jsref/met_win_cleartimeout.asp

Hover
https://www.w3schools.com/cssref/sel_hover.asp

Dropdown button
https://www.w3schools.com/howto/howto_css_dropdown.asp

User selectables
https://css-tricks.com/almanac/properties/u/user-select/

toggling things https://jaketrent.com/post/d3-class-operations/
  http://bl.ocks.org/d3noob/7030f35b72de721622b8
  https://bl.ocks.org/pbogden/c57e358281b69132c2f07ec955ab4db0

More dropdowns
 http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
 http://bl.ocks.org/tomkelly000/6110163

JS equality
https://stackoverflow.com/questions/5491605/empty-arrays-seem-to-equal-true-and-false-at-the-same-time

JS tips https://appendto.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/?nabe=4834138299564032:0,5488687288942592:1,5685334715400192:1,6035677076783104:1,6118337346273280:2

JS timed events
https://javascript.info/settimeout-setinterval
