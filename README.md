## Summary

If you are curious about the height or weight of someone who should wear a Calvin Klein or Patagonia size 'M' according to the brand, then this visualization is for you.

The visualization uses anthropometric (body measurement) data from a US Army survey to show the viewer real life measurement distributions for individual clothing sizes from popular brands.

When the user selects a brand, they are not just shown the distributions of individuals' chest sizes and other common sizing metrics, but they are also given height and weight distributions.

 Having not seen any similar visualizations, I wanted to create this one both for my own curiousity and because I feel other people may find it interesting.

 ## Design

 The visualization attempts to provide an overview of clothing sizes in a more effective way than the typical size "charts" provided by major clothing brand. Their charts are no more than look up tables.

I considered using animation to illustrate that the intervals for each clothing size are often unrealistic, that brands frequently claim an unrealistic variety of people are supposed to wear the same article of clothing. As I envisions it, that graphic would have had little room for user interaction, and it would be unlikely a viewer would be interested in the clothing brand I chose to examine given the number of brands out there.  

Instead I opted for a design choice that would engage engage a bigger range of users. The graphic would include a menu for the user to select brands they are actually interested in from a variety of popular choices.

That first design choice made the initial aim problematic since some brands do provide reasonable size specifications, so instead I decided to include an overview of who wears each size and let users reach their own conclusions. That choice led to the next design elements falling naturally in place. The graphic would show the distribution of people within each size for important measurements such as chest, waist, weight, etc. Although that goal suggested varients of histograms, or boxplots, I went with histograms. I feel histograms give a better intuitive representation of the distribution than box plots or even violin plots do. As a categorical variable, size is natural to encode using the color with an encompanying legend.

The graphic would need histograms for each of the important measurements. That requirement called for a panel of 6-8 histogram plots or a way to select and display them one at a time. Forcing the user to select each measurement in order to see a histogram would be too much work for them, so the graphic needs show them all at once. To show the different sizes on each axis without too much clutter, the user can click on a size in the legend to highlight it. The graphics for that size can be highlighted by increasing the opacity while simultaneously lowering the opacity of the non-highlighted sizes.

The histograms alone would show enough information to accomplish the goal of giving an overview of the sizes, but they would leave the viewer questioning how they were calculated. In order to 'show' rather than just 'tell', the visualization includes a scatter plot of the individual measurements for each person. A single scatter plot is sufficient as seeing how two of the dimensions were categorized and aggregated into the histograms gives the viewer a good picture of how it worked for all of them. However, a menu was added to allow the viewer explore different dimensions.

Early versions of the graphic had the scatter plot centered, with three histograms on either side. That was reorded because it broke up the similar elements. If a person wanted to scan the histograms to get an overview of the size they just clicked on, then they had to scan further, with the scatter plot breaking their flow. Instead it seemed better to have the scatter plot on one side and then the histograms in a contiguous block.

A propblem with the initial design was that the histograms plots were hard to interpret when all sizes were shown on the same axis. That issue was solved by changing the histograms to only show interpolated outlines of the distribution by interpolating the midpoints of the histogram bars until the viewer selects a specific size. Once they selecte the size, the actual underlying histogram for that size is made visiable.
