"use strict";
  function draw(error, data_men, data_women, sizeChart) {
   /*format data*/

  //format brand size charts
  editBaseVals(sizeChart);

  //format the measurement data
  var rawData = {'Men': formatData(data_men),
                 'Women' : formatData(data_women)};

  /* Set up graphic dimensions and variables*/
  var margins = {'top' : 125, 'right':60, 'left':60, 'bottom':50 };
  var svgWidth = 1000;
  var svgHeight = 535;

  var internalMargins = {'horizontal': 30, 'vertical': 50};

  var chart_widths = (svgWidth - margins.left - margins.right -
                      2 * internalMargins.horizontal)/3;

  var text_allow = internalMargins.horizontal/2

  //variables to set the grapic positions. Could be cleaned up
  var legendPos = {};
      legendPos.center = svgWidth/2;
      legendPos.top = 0;

  var histChartsLeft = {};
      histChartsLeft.spacing = 50;
      histChartsLeft.height = 70;
      histChartsLeft.totalVertical = (histChartsLeft.spacing +
                                      histChartsLeft.height);

  var mainChart = {};
      mainChart.width = (histChartsLeft.height +
                          2 * histChartsLeft.totalVertical);
      mainChart.height = mainChart.width;
      mainChart.left = margins.left;
      mainChart.right = mainChart.left + mainChart.width;
      mainChart.top =  margins.top;
      mainChart.bottom =  mainChart.top + mainChart.height;

    histChartsLeft.initial_top = margins.top;
    histChartsLeft.bottom = (histChartsLeft.initial_top +
                              histChartsLeft.height);
    histChartsLeft.width = chart_widths;
    histChartsLeft.left = mainChart.right +internalMargins.horizontal;
    histChartsLeft.right = histChartsLeft.left + histChartsLeft.width;


  var histChartsCenter = JSON.parse(JSON.stringify(histChartsLeft));
      histChartsCenter.left = (histChartsLeft.right +
                              internalMargins.horizontal);
      histChartsCenter.right = (histChartsCenter.left +
                                histChartsCenter.width);



  /*define additional global variables other than selectors/d3 */
  //set svg circle radius size for plot
  var radius = 3;

  //get brand list
  var brandList = Object.keys(sizeChart['Men']);

  //Set valid size list 'sizeList', which also specifies the order the sizes appear in the legend (except size 'None')
  var sizeList = ['XXS','XS','S','M','L','XL','XXL']

  //object for mapping size to color
  var colorMapping  = {'XXS': '#e67300', 'XS': '#aea200','S':'#b2182b',
                      'M':'#7fc97f',
                       'L':'#4393c3', 'XL':'#0530f1', 'XXL':'#40004b',
                       'XXXL':'#000000', 'None':'#444444'};

  //list for dropdown menu
  var genderOpts = d3.shuffle(['Men', 'Women']);

  // ensure the initial state when no chart is selected to returns an  empty dictionary for the chart
  sizeChart['Men']['None'] = {};
  sizeChart['Men']['None']['None'] = {};
  sizeChart['Women']['None'] = {};
  sizeChart['None']= {};
  sizeChart['None']['None'] = {};
  sizeChart['None']['None']['None'] = {};
  sizeChart['Women']['None']['None'] = {};


  //options for the sizing  method dropdown
  var methodList = [];
    methodList[0] = {'lab' : 'Chest', 'order':['Chest']};
    methodList[1] = {'lab' : 'Waist', 'order':['Waist']};
    methodList[2] = {'lab' : 'Chest and Waist', 'order':['Chest','Waist']};
    methodList[3] = {'lab' : 'Chest and Neck', 'order':['Chest','Neck']};
    methodList[4] = {'lab' : 'Chest and Hip', 'order':['Chest','Hip']};
    methodList[5] = {'lab' : 'Waist and Hip', 'order':['Waist','Hip']};
    methodList[6] = {'lab' : 'Chest, Waist, and Inseam',
                    'order':['Chest','Waist','Inseam']};
    methodList[7] = {'lab' : 'Waist, Hip, and Inseam',
                    'order':['Waist','Hip','Inseam']};

  //initial states for the sizing dropdown
  var  initMeasuredDims = [];

  var methodListFiltered = methodList.filter(function(items) {
      items.order.every(function(item){
          initMeasuredDims.includes(item); });
    });

  //Set the initial state for the menu options
  var initialState = {'Gender': {'data':  genderOpts[0],
                                'Sizes':  genderOpts[0]},
                        'Brand': 'None',
                        'Fit': "None",
                        'Method':['Chest'],
                        'Scatter': {'x': 'Chest', 'y':'Weight'},
                        'Units':'false',
                        'explanation':'false',
                        'table':'false'};


  //Initialize the variable to keep track of user selections
  var stateOptions = JSON.parse(JSON.stringify(initialState));


  /*add elements to the graphic*/

  //select div as container for everything
  var spMainBlock = d3.select('#spMainBlock')

  //title
  spMainBlock.append('h3')
    .attr('class','title')
    .text('Clothing Size Charts');

  //intro paragraph with a popup of data source
  var introBlurb = spMainBlock.append('p')
    .attr('class','intro').style('width','625px')
    .classed('startHidden', false);

  // introBlurb.append('p')
  //   .text(' Select a clothing brand and then select a size to see who it fits. ')
  //   .attr('class','intro_t')
  //   .style('display', 'inline');

  introBlurb.append('p')
    .text('A visual summary of how real people, 1774 men and 2208 women, ')
    .attr('class','intro_t')
    .style('display', 'inline');

  introBlurb.append('p')
    .text(' compare to clothing brand sizing charts.')
    .attr('class','intro_t')
    .style('display', 'inline');

  //append a dividing line
  spMainBlock.append('svg')
    .attr('height','3px')
    .attr('width', '1000px')
    .attr('class','intro')
      .append('line')
      .style('stroke','gray')
      .attr('x1','0px')
      .attr('x2','1000px')
      .attr('y1','1px')
      .attr('y2','1px');

/*         Add Menu and menu options      */

  //append div for the menu buttons
  var select = spMainBlock.append("div")
                  .attr('class', 'menu')
                  .classed('startHidden', true);;

  //Dropdown 1
  //create a dropdown menu for data gender
  var dataGenderSelector = makeDropdown(select, genderOpts, 'Gender',
                                        'Gender', genderOpts[0],60);
  //add on click function to the dropdown options
  dataGenderSelector.selectAll('.dropOptions')
    .on("click", function() {
      //set the current gender the anthropometic data and the size chart

      stateOptions['Gender']['Sizes'] = d3.select(this).attr('value');
      sizeGenderSelector.select('.dropbtnLabel')
        .text(d3.select(this).attr('value'));

      standardDropdownClick(this, dataGenderSelector, ['Gender','data'])
      // updates user gender selection and then redraws the grapics according to that choice
      });

  //Droptdown 2
  //create a dropdown menu for brands
  var brandSelector = makeDropdown(select, brandList, 'Brand',
                                   'Brand', 'SELECT', 115);
  //add on click function to the dropdown options
  brandSelector.selectAll('.dropOptions')
    .on("click", function() {
      standardDropdownClick(this, brandSelector, ['Brand'])});
    // updates user brand selection and then redraws the grapics according to that choice

  //format current selection text
  brandSelector.select('.dropbtnLabel').style('text-align','right');

  //Dropdown 2.b
  //add a gender dropdown to the brand selection.
  var sizeGenderSelector = makeDropdown(brandSelector, d3.shuffle(['Men', 'Women']), '','SC',' ',60, 'span');

  //add on click function to the dropdown options
  sizeGenderSelector.selectAll('.dropOptions')
    .on("click", function() {
      standardDropdownClick(this, sizeGenderSelector,
                            ['Gender','Sizes']) });
  //format current selection text
  sizeGenderSelector.select('.dropbtnLabel')
    .style('text-align','left').style('padding', '0').style('width','15px');

  //Dropdown 3
  //create a dropdown menu for different fits available
  var fit_selector = makeDropdown(select, stateOptions['Fit'], 'Fit', 'Fit', stateOptions['Fit'],90, 'div' ,80);
  //add on click function to the dropdown options
  fit_selector.selectAll('.dropOptions').on("click", function() {
  standardDropdownClick(this, fit_selector, ['Fit']) });
  // updates user fit selection and then redraws the grapics according to that choice

  //Dropdown 4
  //create a dropdown menu for the sizing methods available based on the user selected size charts
  var methodSelector = makeDropdown(select, methodListFiltered,
                                    'Sizing Method', 'Method', 'Chest',165);
  //add on click functionality
  methodSelector.selectAll('.dropOptions').on("click", function() {
    //set the current method
    stateOptions['Method'] = d3.select(this)[0][0]['__data__'].order;
    //update button label
    methodSelector.select('.dropbtnLabel')
      .text(d3.select(this)[0][0]['__data__'].lab);
    //update the graphics
    clearGraphics();
    updateGraphs();
  })

  //Dropdown 5
  //create a dropdown menu for selecting the columns plotted in the scatter plot: x-axis left side.
  var scatterSelector = makeDropdown(select,
                                    Object.keys(rawData['Men'][0]),
                                    'Plot Axis',
                                    'scatter_x',
                                    ('x:'+stateOptions['Scatter']['x']),
                                     115);

  scatterSelector.selectAll('.dropOptions')
    .on("click", function() {
      scatterDropdown(this, scatterSelector, 'x');
    });
  //format label text
  scatterSelector.select('.dropbtnLabel')
    .style('text-align','right');

  //Dropdown 5.b
  //dropdown menu for selecting the columns plotted in the scatter plot: y-axis Right side.
  var y_selector = makeDropdown(scatterSelector,
                                Object.keys(rawData['Men'][0]),
                                '',
                                'scatter_y',
                                ('y:'+stateOptions['Scatter']['y']),
                                60, 'span');

  y_selector.selectAll('.dropOptions')
    .on("click", function() {
      scatterDropdown(this, y_selector, 'y');
    });
    //format label text
    y_selector.select('.dropbtnLabel')
      .style('text-align','left').style('padding', '0').style('width','15px');

  /* append main svg and chart elements */

  //svg elements for graphics
  var svg = spMainBlock.append("svg")
      .attr('id','main_svg')
      .attr("width", svgWidth)
      .attr("height", svgHeight);

  //append element to contain histograms
  var histograms = d3.select('#main_svg').append('g')
    .attr('class','histograms');

  var svgButtons = svg.append('g')
    .attr('class','unit_buttons')
    .attr('transform',
        'translate('+  ( svgWidth/2) + ',' +
         (mainChart.bottom +1.5*internalMargins.vertical) +')')
    .classed('startHidden', true);
  var svgBtnShift = 1

  var startMenu = svg.append('g')
    .attr('class','unit_buttons')
    .attr('transform',
        'translate('+  ( svgWidth/2) + ',' +
         (svgHeight/5) +')');

  startScreen(startMenu);


  //dividing line
  svg.append('line')
    .classed('startHidden', true)
    .style('stroke','gray')
    .attr('x1', -500 +'px')
    .attr('x2', 500 + 'px')
    .attr('y1','1px')
    .attr('y2','1px')
    .attr('transform', "translate(" + (svgWidth/2) + "," + (0) + ")");


  // add a button to show and hide the units on the plots

  var unitToggle = svgButton(svgButtons, 'unitToggle',
                            'Show Units', [-7+ svgBtnShift,-1.5]);

  unitToggle.on('click', function(){
    //toggle global unit variable and update button label
     if (stateOptions['units']){
       stateOptions['units'] = false;
       d3.select('#'+'unitToggle').text('Show Units');

       } else {
         stateOptions['units'] = true;
         d3.select('#'+'unitToggle').text('Hide Units');
       };
    //update graphs with updated option
    clearGraphics();
    updateGraphs();
  });


  //append element for the brand size table
  spMainBlock.append('div')
    .style('display','block')
    .style('margin','auto')
    .attr('id','tbl_div');

  // add toggle button for show/hide current brand size table
    var sizeTableToggle = svgButton(svgButtons, 'table_toggle',
                                    'Show Size Table', [0+ svgBtnShift,-1.5], 8);
    sizeTableToggle.on('click', function(){

       if (stateOptions['table']){
         //if the button is clicked when a table is shown (true)
         //clears the tabel and sets the option to false
         clearSizeTable();
         } else {
           if ((stateOptions['Brand'] != initialState['Brand'] ) && (stateOptions['Fit'] != initialState['Fit'] )){
             //if the button is clicked when a table is not shown
             //clears table, sets option to true, and creates the brand table
              clearSizeTable();
              stateOptions['table'] = true;
              showSizeTable();
            };
         };
  });

  //add element to provide a brief explanation of the data/method
  spMainBlock.append('div')
  .attr('id', 'methodExplanation')
  .style('color','gray');

  //add a button to show a brief text explanation of the data and analysis behind the graphic
  var ShowMethods= svgButton(svgButtons, 'methodsToggle',
                            'Show Methods', [7.5 + svgBtnShift ,-1.5], 7)

  ShowMethods.on('click', function(){
    // conditional to show/hide text based on the option
    if (stateOptions['explanation'] == 'false'){
      stateOptions['explanation'] = 'true';

      d3.select('#'+'methodsToggle').text('Hide Methods');

      d3.select('#methodExplanation').selectAll('p')
      .data(explanation).enter()
      .append('p').text(function(d){return d;})
      .style('width','800px')
      .style('margin','auto')
      .style('margin-top','1em')
      .style('text-align','left');

    } else {
      stateOptions['explanation'] = 'false';
      d3.select('#'+'methodsToggle').text('Show Methods');
      d3.select('#methodExplanation').selectAll('p').remove();
    };

  });

  //append a dividing line
  spMainBlock.append('svg').attr('height','3px').attr('width', '1000px').attr('class','intro')
      .append('line')
      .style('stroke','gray')
      .attr('x1','0px')
      .attr('x2','1000px')
      .attr('y1','1px')
      .attr('y2','1px');






//brief explanation of the data/method
var explanation = ['Method details',
'Anthropometric measurements are taken form the 1988 Army survey, described in the source: "Gordon, C. C. et al. 1988 ANTHROPOMETRIC SURVEY OF U.S. ARMY PERSONNEL: METHODS AND SUMMARY STATISTICS. (1989)." Although the full dataset is available online, the provider requested citation be directed to that descriptive reference.',
 'There has been some shifts to the population averages since this survey, likely altering the percentage of the population that would be assigned to each size, so the results only approximate current conditions. Intuitively, though, the min and max of each dimension within a size should be relatively unchanged.',
 'Another caveat relateds to the population surveyed. These individuals were all in the armed forces. There may be differences compared to the American public at large.',
 "Size Assignment ",
 "Each person in the data set is assigned a size according to the selected size chart based on the measurements specified by the 'method' dropdown. If the individual's measurements fall within the interval for a size for all specified measurements, they are assigned that size. If the individual does not fall within the intervals for any size, they are assigned size 'None'. If the 'method' selection specifies more than one measurement, then the individual must fall within the same size across each of those dimensions or they are assigned the size 'None'.",
  'The size charts were scraped from the web May of 2017, and are available on the respective brand websites.',
  'In cases where a brand size chart listed a single value for a measurement rather than an interval for a size, an interval was created. The created intervals were ± 1 inch from the single value. For some dimensions a 1 inch deviation from the ideal can provide a reasonable fit, but in some dimensions it may be too generous. Nonetheless, the constructed interval is less than intervals some brands list in their size charts.',
  'The anthropometic data set lacked a column directly corresponding to inseam measurements, so an inseam value was constructed by taking the crotch height, as defined in the survey, and substracting 1 inch.' ];

  /*--------------------------------------------------------*/
  /*                  functions                         */
  /*--------------------------------------------------------*/
  var textTransTime = 400
  var timingArr = [9,16,9,14,15,12,13,11,13,9,10]


  function cumulSum(anArr) {
    var resultArr = anArr.reduce(function(total, timeStep, i ){
      if (total.length > 0 ) {total.push(total[i-1] + timeStep*1000);} else {total.push(timeStep*1000);};
    return total;
  },[])
return resultArr;}

  function introAnimation(){
    var introTiming = cumulSum([9,8,7,4]);

    stageZero()
    setTimeout(stageOne, introTiming[0] )
    setTimeout(stageTwo, introTiming[1] )
    setTimeout(stageThree, introTiming[2] )
    setTimeout(stagePause, introTiming[3] )}

  function continueAnimation(){
    var contTiming = cumulSum([15,12,13,11,13,9,8]);

    stageFour()
    setTimeout(stageFive, contTiming[0])
    setTimeout(stageSix, contTiming[1])
    setTimeout(stageSeven, contTiming[2] )
    setTimeout(stageEight, contTiming[3] )
    setTimeout(stageNine, contTiming[4])
    setTimeout(stageTen, contTiming[5] )
    setTimeout(stageFinish, contTiming[6])

  };

  function startScreen(parentElem){

  svg.append('text')
  .attr('id','narrativeText')
  .attr('x', svgWidth/2)
  .attr('y', 0)
  .attr('dy','1.5em')
  .attr('text-anchor','middle')
  .text("What do small, medium and large mean?")

  svg.append('text')
  .attr('id','narrativeText2')
  .attr('x', svgWidth/2)
  .attr('y', 0)
  .attr('dy','3.5em')
  .attr('text-anchor','middle')
  .text("Can't size charts be more visual?")



  var startButton = svgButton(parentElem, 'startButton',
                            'Start', [-1.3 + svgBtnShift,-2], 3.3);

  startButton.on('click', function(){
    introAnimation();
    startMenu.remove()

  }).attr('visibility','visible');


  var skipButton = svgButton(parentElem, 'skipBttn',
                            'Skip Intro', [-1.3 + svgBtnShift,0], 5);

  skipButton.on('click', function(){
    skipInro();
    startMenu.remove()

  }).attr('visibility','visible');

}

    initialGraph();
  function initialGraph() {


  histChartsLeft.initial_top = (margins.top + 2 * histChartsLeft.height +
                                internalMargins.vertical*2);
  histChartsLeft.bottom = (histChartsLeft.initial_top +
                            histChartsLeft.height);

  histChartsCenter.initial_top = histChartsLeft.initial_top;
  histChartsCenter.bottom = histChartsLeft.bottom;


  stateOptions['Gender']['data'] = 'Men'
  stateOptions['Gender']['Sizes'] = 'Men'
  var FitsnChart = currentFitsnChart();
  var fitList = FitsnChart[0]
  var curSizeChart = FitsnChart[1]
  var data = makeSizeData(
      rawData[stateOptions['Gender']['data']],
      stateOptions['Method'],
      curSizeChart);
  //call function to make the scatter plot
  makeScatter(data, svg, stateOptions['Scatter']);
  //call functions to make both columns of histograms
  histogramBuilder(data, histChartsLeft,['Chest']);
  histogramBuilder(data, histChartsCenter,['Weight'])

  d3.selectAll('.scatterData')
    .transition()
    .duration(0)
    .attr("cx",mainChart.left)
    .attr("cy",   mainChart.bottom);

  d3.selectAll('.dataFeature').attr('visibility','hidden');

}

  //like arrays, we start at zero
  function stageZero() {
      d3.select('#narrativeText').text("Can you picture someone with a 40 inch chest circumference?")
          .transition().duration(textTransTime)
          .delay(3000)
          .text("Probably not, and  yet chest circumference is key in determining clothing sizes")
          .transition();

      d3.select('#narrativeText2').text('')
      .transition().duration(textTransTime)
        .delay(6000)
        .text("Sizes may be easier to understand in terms of weight")

  }

    function stageOne() {
      d3.select('#narrativeText').text("Luckily we have body measurements from volunteers to help us");

      d3.select('#narrativeText2').text('');

      d3.selectAll('.dataFeature').attr('visibility','visible');

      updateScatter(stateOptions['Scatter']);

          //title for histograms
          histograms.append('text')
            .attr('id','levisDistr')
            .attr('x', histChartsLeft.right + internalMargins.horizontal/2)
            .attr('y', histChartsLeft.initial_top )
            .attr('dy','-1em')
            .text('')
            .attr('text-anchor','middle')
            .attr('class', 'labels')
            .transition().delay(2000).duration(textTransTime)
              .text('Size Distributions');

        svg.append('text')
          .attr('x', mainChart.left + mainChart.width/2)
          .attr('y', mainChart.top)
          .attr('dy','-1em')
          .text('')
          .attr('text-anchor','middle')
          .attr('class', 'labels')
          .transition().delay(2000).duration(textTransTime).text('Individual Measurements');

    }

    function stageTwo() {
      d3.select('#narrativeText2').text('');
      d3.select('#narrativeText').text('Levis is a well known brand')
        .transition().delay(3000).duration(textTransTime)
          .text("We'll size them using the Levis Mens Casual size chart")

    }


  function stageThree() {

    d3.select('#narrativeText')
      .text("Here are the Levis Mens Casual sizes");


    d3.select('#levisDistr').text('Levis Size Distributions')

    stateOptions['Gender']['data'] = 'Men'
    stateOptions['Gender']['Sizes'] = 'Men'
    stateOptions['Brand'] = 'Levis'

    var FitsnChart = currentFitsnChart();
    var fitList = FitsnChart[0]
    var curSizeChart = FitsnChart[1]
    var data = makeSizeData(
        rawData[stateOptions['Gender']['data']],
        stateOptions['Method'],
        curSizeChart);
    //call function to make the scatter plot
    legendPos.center = histChartsLeft.right
    legendPos.top = margins.top/1.8
    d3.selectAll('.histogram').remove();
    d3.select('.sizeLegend').remove();
    makeLegend(curSizeChart, false);
    d3.selectAll('.scatterData')
      .attr('class', function(d) { return d['Size']})
      .classed('scatterData', true)
      .transition()
      .delay(100)
      .duration(400)
      .attr("fill", function(d) {
          return colorMapping[d['Size']];
        })
      .style('opacity','0.3');
    //call functions to make both columns of histograms
    histogramBuilder(data, histChartsLeft,['Chest']);
    histogramBuilder(data, histChartsCenter,['Weight'])

  }

  function stageFour() {
    highlightSize('S')

    d3.select('#narrativeText')
      .text("We'll look closer at size S");


    d3.select('#narrativeText2').text('')
      .transition().delay(5000).duration(textTransTime)
      .text("Small fits a 35-37 inch chest giving an average weight around 150lbs")
  }

  function stagePause(){
    d3.select('#narrativeText2')
      .transition().duration(textTransTime)
      .text("Take a second to get oriented, then click continue");

  var contMenu = svg.append('g')
    .attr('class','unit_buttons')
    .attr('transform',
        'translate('+  ( svgWidth/2) + ',' +
         (0) +')');

  var continueButton = svgButton(contMenu, 'contButton',
                            'Continue', [14,2], 5);

  continueButton.on('click', function(){
    clearInterval(timerId);
    continueAnimation();
    continueButton.remove();

  }).attr('visibility','visible');

  var timerId = setInterval(function(){
    var contLabel = d3.select('#contButton');
    contLabel.classed('spUnderline', !contLabel.classed('spUnderline'))
    }, 1000);

  }

  function stageFive() {
    d3.select('#narrativeText')
      .text("Okay, that's nice but maybe you don't care about size small, you're not a size small.")
      .transition()
      .delay(8000)
      .duration(textTransTime)
      .text("Calvin Klein Regular fit sounds comparable to Levis Casual fit")

    d3.select('#narrativeText2')
      .text("")
        .transition()
        .delay(4000)
        .duration(textTransTime)
        .text("Are you sure about that? Let's look at another brand")

    d3.selectAll('.scatterData')
      .transition()
      .delay(100)
      .duration(400)
      .attr("fill", colorMapping['None'])
      .style('opacity','0.3');

    d3.selectAll('.legend_circle')
      .style('opacity','0.8');
  }

  function stageSix() {

    d3.select('#narrativeText').transition().duration(textTransTime)
      .text("Here is the sizing for Calvin Klein Regular. Very different, no?")

    d3.select('#narrativeText2')
      .text("")
        .transition()
        .delay(10000)
        .duration(textTransTime)
        .text("Now to look at size S")


    histChartsLeft.initial_top = margins.top + histChartsLeft.height;
    histChartsLeft.bottom = (histChartsLeft.initial_top +
                              histChartsLeft.height);

    histChartsCenter.initial_top = histChartsLeft.initial_top;
    histChartsCenter.bottom = histChartsLeft.bottom;


    histograms.append('text')
      .attr('id','CKDistr')
      .attr('x', histChartsLeft.right + internalMargins.horizontal/2)
      .attr('y', histChartsLeft.initial_top )
      .attr('dy','-1em')
      .text('Calvin Klein Size Distributions')
      .attr('text-anchor','middle')
      .attr('class', 'labels');


    stateOptions['Brand'] = 'Calvin Klein'
    stateOptions['Fit'] = 'Regular'
    var FitsnChart = currentFitsnChart();
    var fitList = FitsnChart[0]
    var curSizeChart = FitsnChart[1]
    var data = makeSizeData(
        rawData[stateOptions['Gender']['data']],
        stateOptions['Method'],
        curSizeChart);

    d3.selectAll('.scatterData')
      .attr('class', function(d) { return d['Size']})
      .classed('scatterData', true)
      .transition()
      .delay(100)
      .duration(400)
      .attr("fill", function(d) {
          return colorMapping[d['Size']];
        })
      .style('opacity','0.3');

    // d3.select('.chart').remove();
    // makeScatter(data, svg, stateOptions['Scatter']);
    //call functions to make both columns of histograms
    histogramBuilder(data, histChartsLeft,['Chest']);
    histogramBuilder(data, histChartsCenter,['Weight'])
  }

  function stageSeven() {
    highlightSize('S')
    d3.select('#narrativeText').transition().delay(4000).duration(textTransTime)
      .text("Calvin Klein Small fits a 41-43 inch chest, meaning someone about 190lbs")
    d3.select('#narrativeText2').text('').transition().delay(7000).duration(textTransTime)
      .text("That is nothing like a Levis Size small!")
  }

function stageEight() {

  d3.selectAll('.dataFeature.Lev')
    .style('opacity','0.3');
  d3.selectAll('.dataFeature.Lev.L')
      .style('opacity','0.8');
  d3.selectAll('.legend_circle.'+ 'L')
      .style('opacity','.8');

  d3.selectAll('.hist_bar.Lev')
    .style('fill','transparent');

    d3.selectAll('.hist_bar.Lev.L')
      .style('fill', colorMapping['L']);


  d3.select('#narrativeText').transition().duration(textTransTime)
    .text("The Calving Klein size small is a Levis size large")

  d3.select('#narrativeText2').text('').transition()
  .delay(8000).duration(textTransTime)
    .text("Clothing letter sizes can be wildly inconsistent")
}

  function stageNine() {
    d3.select('#narrativeText').transition().duration(textTransTime)
      .text("Without referencing the size chart, clothing letter sizes don't mean much")
    d3.select('#narrativeText2').text('').transition().delay(3000).text('But the size charts can tell you a lot, especially with the data shown here')

    histChartsLeft.initial_top = margins.top;
    histChartsLeft.bottom = (histChartsLeft.initial_top +
                              histChartsLeft.height);

    histChartsCenter.initial_top = histChartsLeft.initial_top;
    histChartsCenter.bottom = histChartsLeft.bottom;

  }

  function stageTen() {
    d3.select('#narrativeText')
      .text("Now it's your turn")

    d3.select('#narrativeText2').text('')
      .transition().delay(3000).duration(textTransTime)
      .text("Use this data to look at your favorite brand's sizing");


    d3.selectAll('.histogram').remove();
    d3.select('#CKDistr').remove();
    d3.select('.sizeLegend').remove();
    d3.select('#levisDistr').remove();
    legendPos.center = svgWidth/2;
    legendPos.top = 0;
    stateOptions = JSON.parse(JSON.stringify(initialState))
    var FitsnChart = currentFitsnChart();
    var fitList = FitsnChart[0]
    var curSizeChart = FitsnChart[1]
    var data = makeSizeData(
        rawData[stateOptions['Gender']['data']],
        stateOptions['Method'],
        curSizeChart);

    d3.selectAll('.scatterData')
      .attr('class', function(d) { return d['Size']})
      .classed('scatterData', true)
      .transition()
      .delay(100)
      .duration(400)
      .attr("fill", colorMapping['None'])
      .style('opacity','0.3');

    histograms.append('text')
      .attr('x', histChartsLeft.right + internalMargins.horizontal/2)
      .attr('y', histChartsLeft.initial_top )
      .attr('dy','-1em')
      .text('Measurement Distributions')
      .attr('text-anchor','middle')
      .attr('class', 'labels');


    histogramBuilder(data, histChartsLeft,['Chest', 'Weight','Hip' ]);
    histogramBuilder(data, histChartsCenter,['Waist', 'Height','Inseam']);

 }

  function stageFinish() {
    d3.select('#narrativeText').remove()

    d3.select('#narrativeText2').remove()


    var timerId = setInterval(function(){
      var initLabel = d3.select('.Brand_drp .dropbtnLabel');
      initLabel.classed('spUnderline', !initLabel.classed('spUnderline'))

      if (initLabel.text() !== 'SELECT') {
        initLabel.classed('spUnderline',  false)
        clearInterval(timerId)
      }
    }, 1000);


      clearGraphics();
      updateGraphs();
      d3.selectAll('.startHidden').style('visibility','visible');
  }
    function skipInro(){
        legendPos.center = svgWidth/2;
        legendPos.top = 0;
        stateOptions = JSON.parse(JSON.stringify(initialState))
        var FitsnChart = currentFitsnChart();
        var fitList = FitsnChart[0]
        var curSizeChart = FitsnChart[1]
        var data = makeSizeData(
            rawData[stateOptions['Gender']['data']],
            stateOptions['Method'],
            curSizeChart);

        histChartsLeft.initial_top = margins.top;
        histChartsLeft.bottom = (histChartsLeft.initial_top +
                                  histChartsLeft.height);

        histChartsCenter.initial_top = histChartsLeft.initial_top;
        histChartsCenter.bottom = histChartsLeft.bottom;
        histograms.append('text')
          .attr('x', histChartsLeft.right + internalMargins.horizontal/2)
          .attr('y', histChartsLeft.initial_top )
          .attr('dy','-1em')
          .text('Measurement Distributions')
          .attr('text-anchor','middle')
          .attr('class', 'labels');
        svg.append('text')
          .attr('x', mainChart.left + mainChart.width/2)
          .attr('y', mainChart.top)
          .attr('dy','-1em')
          .attr('text-anchor','middle')
          .attr('class', 'labels').text('Individual Measurements');


    stageFinish()
  };

  function formatData(data){
  /**take input 'data', an array of objects, iterate over keys in each *object and attempt to change to numeric type and remove *'SUBJECT_NUMBER' key/value. Return updated data.
   */
  data.forEach(function(d) {
    for (var key in d) {

      if (key == 'SUBJECT_NUMBER'){ delete d[key]} else {
      d[key] = +d[key];}
      };
     });
    return data;
    }


  function editBaseVals(objectIn) {
    /**take objectIn, object of size chart objects, containing arrays of
     *individual specifications for each size. Change size specification
     *arrays of single values into intervals consisting of arrays of
     *[lower *limit, upper limit]. Returns updated object. Recursive.
    */

    if ((objectIn instanceof Object) && !(objectIn instanceof Array)) {
      var keys = Object.keys(objectIn)

      for (var i = 0; i < keys.length; i++) {
        //call function recursively for any objects encounted
        objectIn[keys[i]] = editBaseVals(objectIn[keys[i]]);
        };
      return objectIn;
      };

    //when arrays are encountered, change to an interval if required
    if (objectIn instanceof Array) {
      if (objectIn.length == 1){
        return makeRange(objectIn);
      } else {return objectIn};
    };
  }


  function isNumber(var_in) {
    //check if datatype is number
    return var_in.constructor === Number;
  }

  function makeRange(arr_in){
    /**check if input array has numeric data, then change to two value
     *interval corresponding to the lower and upper limit of the
     *specification
     */
    if (isNumber(+arr_in[0])){
    var temp = +arr_in[0];
    var out = [temp - 1.0, temp + 1.0];
    return out;} else {return 'None';};
  }


  function makeSizeData(data, sizingMetrics, sizeChart){
    /**takes the input 'data', the array of anthropometic measurement
     *objects, and assign a clothing size for each object. Size is
     *assignment uses the fields names specified in the input array
     *'sizingMetrics' according to the input sizeChart
     */

      //gets the list of sizes for the current size chart
      var sizeKeys = sizes(sizeChart);

      // iterate over the array, assign size to each item
      data.forEach(function(d) {
        d['Size'] = assignSize(d, sizingMetrics, sizeChart, sizeKeys);
        return d;
      });

      return data;
 }


  function assignSize(person, sizingMetrics, sizeChart, sizeKeys) {
    /**return size for person (a data row) based on the field names
     *specified in the array 'sizingMetrics' for the given sizeChart for
     *the sizes listed in the 'size_key' array.
    */

    //if no sizes are listed, return a size of 'None'
    if (sizeKeys.length < 1) {return 'None'};

    //use first field name to determine starting size
    var temp_size = assignFeatSize(person, sizingMetrics[0], sizeChart, sizeKeys);

    //return starting size if only one field name was specified the first field name failed to return a size
    if (sizingMetrics.length === 1 || temp_size === 'None') {
       return temp_size;
     };

    //if multiple field names, check the person falls within the same size for the rest.
    if (sizingMetrics.length > 1) {
      for (var i = 1; i < sizingMetrics.length; i++) {

        var sizeInterval = sizeChart[temp_size][sizingMetrics[i]];
        //check the field name has valid size intervals, skip if not
        if (!(isNaN(sizeInterval[0]))) {

          //check if the value for the field falls in interval for the starting size
          if (!((person[sizingMetrics[i]] >= sizeInterval[0])
             && (person[sizingMetrics[i]] <= sizeInterval[1]))) {
              return 'None';
          };
        };
      };
    };
    return temp_size;
  }

  function assignFeatSize(person, primaryMetric, sizeChart, sizeKeys) {
    /** return size for person (a data row) based on the primaryMetric
     * (a.k.a field) for the given sizeChart (brand size chart)
     */

    //iterate over each size, check if person falls in that size's interval
    for (var i = 0; i < sizeKeys.length; i++) {
      var curKey = sizeKeys[i];

      var sizeInterval = sizeChart[curKey][primaryMetric];
      //check if the person measurement value falls in interval
      if ((person[primaryMetric] >= sizeInterval[0]) && (person[primaryMetric] <= sizeInterval[1])) {
        return curKey;
      }
    }
      //if no valid intervals were found, return size 'None'
      return 'None';
  }

  function sizes(sizeChart) {
    /**finds possible sizes listed in the current size chart and also *checks they fall in the valid size list 'sizeList', which also *specifies the order the sizes appear (except 'none')
     */

    var sizeArr = [];

    //sizes in the size chart
    var sizeKeys = Object.keys(sizeChart);

    //check if each size in the size chart is in the list of valid sizes
    sizeList.forEach( function(item){
      if (sizeKeys.includes(item)){
        //add valid sizes to array
        sizeArr.push(item);
      };
      })
    //return array of valid sizes
    return sizeArr;
    }

  function showSizeTable(){
    //creates an html table for the current size and appends it to the page when function is called

    //sets to true to indicate table being displayed
    stateOptions['table'] = true;
    //update show/hide table menu to new label
    d3.select('#'+'table_toggle').text('Hide Size Table');

    //set current brand chart table to a var for convenience
    var curTable = sizeChart[stateOptions['Gender']['Sizes']][stateOptions['Brand']][stateOptions['Fit']];

    //get relevant sizes keys in the correct order
    var sizeKeys = sizes(curTable);

    //append a table element
    var brandTable = d3.select('#tbl_div').append('table')
                        .attr('id','maintable')
                        .style('width','500px')
                        .style('margin','auto')
                        .classed('size_table', true)
                        .style('text-align', 'center');
    //add table caption
    brandTable.append('caption')
        .html('Size chart for' +' ' + stateOptions['Brand'] + ' ' +
         stateOptions['Fit'] +' '+ stateOptions['Gender']['Sizes']);


    //turn size object to a array of arrays. Should refactor into a function
    //get column headings as first array in the array of arrays.
    var tb = [Object.keys(curTable['M'])];
    tb[0].unshift('Size');

    //iterate over each size
    sizeKeys.forEach( function(rkey){

      var curRow = [rkey];
      //row: iterate over all the field names, turning the array giving the interval into a string
      for (var vkey in curTable[rkey]) {
        var v = ' ';

        //check if nan, leave v as space if nan
        if (!(isNaN(curTable[rkey][vkey][0]))){

          //if single value, return it (not expected to exist)
          if (curTable[rkey][vkey].length == 1 ){
          v =  curTable[rkey][vkey]};

          //if array of two, then make string '#-#'
          if(curTable[rkey][vkey].length == 2){
          v = (curTable[rkey][vkey][0] + '-' + curTable[rkey][vkey][1]);
          };
        }
        curRow.push(v);
      }
      tb.push(curRow);
    });

    //for the arrayified size chart, loop over each size (row)
    tb.forEach(function(r){
      //append each size row values as a table row
      brandTable.append('tr')
        .selectAll('td')
        .data(r)
        .enter()
        .append('td')
        .html(function(v) {return v;})
        });
      };

  function clearSizeTable(){
    //remove the size table and update the button label and table status
    stateOptions['table'] = false;
    d3.selectAll('.size_table').remove();
    d3.select('#'+'table_toggle').text('Show Size Table')
  }

  function svgButton(parent, buttton_id, label, offset, width = 6) {
    /*take the parent d3 selector 'parent' and creates an svg toggle button
     *as a child with the id 'button_id' and the label 'label'. offset,
     *array of two numbers, changes position by units of 'em'. width is
     *width of button specify as numeric.
     */

    //append button container element
    var unit_button = parent.append('g')
                            .attr('class','unit_button');

    //append rectange for button border
    unit_button.append('rect')
      .attr('class','start_rect')
      .classed('button_border',true)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', width+'em')
      .attr('height','1.3em' )
      .attr('y',+offset[1] +0.5+'em')
      .attr('x', -width/2 +offset[0]+'em')
      .attr('stroke-width', 1)
      .attr('stroke','#999999')
      .attr('fill','white');

      //append button label text
      unit_button.append('text')
      .attr('id', buttton_id)
      .text(label)
      .attr('y',+offset[1]+1.5+'em')
      .attr('x',-(width-1)/2+ offset[0]+'em')
      .attr('stroke','gray')
      .attr('fill','gray')
      .attr('text-anchor','start');

      //return the button container element selector
    return unit_button;
  }



  function makeDropdown(select, dropdownData, label, id,
                        initLabel, optionWidth,
                        opt_ElemType = 'div', opt_labelWidth = 160) {
    /**  make drop down button with title above
    *  select - parent element selector
    *  dropdownData - data for the dropdown
    *  label - label of the dropdown
    *  id -  id for the dropdown
    *  initLabel  -  initial text of the dropdown selection
    *  optionWidth  - width of the actual dropdown divs
    *  opt_ElemType  - element type of the button content eg div, span
    *  opt_labelWidth - width of the dropdown label
     */

    // add div to hold the dropdown button
    var dropdownTop = select.append("div")
      .attr('class', 'dropdown')
      .classed(id+'_drp', true);

    // append label if provided a string at least 1char
    if (label.length > 0){
      dropdownTop.append('div')
      .text(label)
      .attr('class', 'menu_label')
      .style('width',opt_labelWidth+'px' );
      };

    //add button element
    var dropdownButton = dropdownTop.append('button')
      .attr('class','dropbtn')
      .on('click', function() {
        /** if not classed 'show', give dropdown divs class 'show' and set
         * spMainBlock to have on click function remove class 'show' from dropdown
         * divs
         */

        //if the dropdown divs aren't showing already
        if (!d3.select('#' + id + '_dropdown' ).classed('show')) {
          // select the dropdown divs, give class 'show'
          d3.select('#' + id + '_dropdown' ).classed('show',true);

          //select spMainBlock, give function to hide dropdown
          spMainBlock.on('click',function(){
            //if the dropdown isn't clicked on, then remove class 'show'
            if (!(d3.select(d3.event.target).classed('dropOptions') ||
              d3.select(d3.event.target).classed('dropbtnLabel'))) {

                d3.selectAll('.show').classed('show',false);
                spMainBlock.on('click', null); };
              });

        } else {
          //if already classed show and dropdown is clicked on, then removes it
          d3.selectAll('.show').classed('show',false);
          spMainBlock.on('click', null);
        };
      });

    // append the dropdown button status label
    dropdownButton.append(opt_ElemType)
      .attr('class','dropbtnLabel')
      .text(initLabel);

    //append the dropdown divs, i.e. the options
    dropdownButton.append('div')
      .attr('class','dropdown-content')
      .style('width', optionWidth +'px')
      .attr('id', id + '_dropdown')
      .selectAll("p")
      .data(dropdownData)
      .enter()
      .append("p")
        .classed('dropOptions', true)
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });

      //return the d3 selector
      return dropdownTop;
    }

  function scatterDropdown(thisObj, selector, x_y){
    //on click functionaility for the scatter plot dropdown. changes axis variables and then updates scatter plot

    //set the current gender
    stateOptions['Scatter'][x_y] = d3.select(thisObj).attr('value');

    //update button label
    selector.select('.dropbtnLabel')
        .text(x_y+': ' + d3.select(thisObj).attr('value'));

    //update the graphics
    updateScatter(stateOptions['Scatter']);
  }

  function standardDropdownClick(thisObj, selector, stateSelectionKey) {
  /** on click function for the generic dropdowns. updates user selection
  * and then redraws the grapics according to that choice
  */

    //set the current brand
    if (stateSelectionKey.length == 1) {
      stateOptions[stateSelectionKey[0]] = d3.select(thisObj).attr('value');
    };

    if (stateSelectionKey.length == 2) {
      stateOptions[stateSelectionKey[0]][stateSelectionKey[1]] =
        d3.select(thisObj).attr('value');
    };

    //update button label
    selector.select('.dropbtnLabel')
      .text(d3.select(thisObj).attr('value'));

    //update the graphics
    clearGraphics();
    updateGraphs();
    }

  function clearGraphics(){
    //remove graphic elements in preparation for update
    d3.select('.chart').remove();
    d3.selectAll('.histogram').remove();
    d3.select('.sizeLegend').remove();
    clearSizeTable();
    }

  function updateGraphs(){
    //call functions to update graph

    var FitsnChart = currentFitsnChart();
    var fitList = FitsnChart[0]
    var curSizeChart = FitsnChart[1]
      //update the  method button
      updateMethodButton();

      //get the relevant data and update the size for each entry
      var data = makeSizeData(
          rawData[stateOptions['Gender']['data']],
          stateOptions['Method'],
          curSizeChart);

      //determine appropriate fitting field combinations
      updateFitButton(fitList);


      //call functions to make both columns of histograms
      histogramBuilder(data, histChartsLeft,['Chest', 'Weight','Hip' ]);
      histogramBuilder(data, histChartsCenter,['Waist', 'Height','Inseam']);

      //call function to make the legend (size key)
      makeLegend(curSizeChart);

      //call function to make the scatter plot
      makeScatter(data, svg, stateOptions['Scatter']);
    }

function currentFitsnChart() {

var curChartFits = sizeChart[stateOptions['Gender']['Sizes']][stateOptions['Brand']];

//get size chart field names for determining sizes based on the selected size chart
var fitList = Object.keys(curChartFits);

//if old fit selection is invalid for the updated results
  if (!(fitList.includes(stateOptions['Fit']))) {
    //set fit method to first field
    stateOptions['Fit'] = fitList[0];
    fit_selector.select('.dropbtnLabel')
      .text(stateOptions['Fit']);
  };

var curSizeChart = curChartFits[stateOptions['Fit']];
return [fitList, curSizeChart];}


  function updateMethodButton(){
    //update the fitting method menu dropdown to only include the appropriate fitting field/metric combinations for the current size chart

    //check that a brand is selected
    if (stateOptions['Brand'] != initialState['Brand'] ){

       // fields available in data
       var dataFields= Object.keys(rawData[stateOptions['Gender']['data']][0])

      //align measured dimensions with the current chart
      var measuredDims = Object.keys(sizeChart[stateOptions['Gender']['Sizes']][stateOptions['Brand']][stateOptions['Fit']]['M']);
    } else {
      var measuredDims =[];
    };


    var methodListFiltered = methodList.filter(function(items) {
    //filter methods to return only ones that correspond to the current size chart and the data
      return items.order.every( function(item){
        return (measuredDims.includes(item) && dataFields.includes(item));
        });
       })

      //check a brand has been selected and then check method selection is valid
    if (stateOptions['Brand'] != initialState['Brand'] ){

      //seed with false
      var methodValid = false;

      methodListFiltered.forEach(function(methodLine){
      //check if the method selection is valid for the updated selections, if not, then set to the first valid method

        if (methodLine.order.toString() == stateOptions['Method'].toString()) {
          methodValid = true;
        };
        });

        if (!(methodValid)) {
        //if invalid, set to first valid method
          stateOptions['Method'] = methodListFiltered[0].order;
          methodSelector.select('.dropbtnLabel').text( methodListFiltered[0].lab);
           };
         };

    //select the method dropdown containting the options
    var methodOpts = d3.select('#Method_dropdown');

    //remove all current options
    methodOpts.selectAll('p').remove();

    //append the new list of valid options
    methodOpts
      .selectAll('p')
      .data(methodListFiltered)
      .enter()
      .append("p")
      .classed('dropOptions', true)
      .attr("value", function(d) { return d.lab; })
      .text(function(d) { return d.lab; })
      .on("click", function() {

        //set the current method
        stateOptions['Method'] = d3.select(this)[0][0]['__data__'].order;

        //update button label
        methodSelector.select('.dropbtnLabel')
        .text(d3.select(this)[0][0]['__data__'].lab);

        //update the graphics
        clearGraphics();
        updateGraphs();
        });
      };


  function updateFitButton(fitList) {
    //update the fit options available for the current brand

    //select options' parent
    var fitOpts = d3.select('#Fit_dropdown');

    //remove options
    fitOpts.selectAll('p').remove();

    //add updated options
    fitOpts
      .selectAll('p')
      .data(fitList)
      .enter()
      .append("p")
      .classed('dropOptions', true)
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; })
      .on("click", function() {
        standardDropdownClick(this, fit_selector, ['Fit']) });

  };

/*  plot code functions     */

function make_x_ax(parentSelection, data, columnName, chartDim, clearance = 0.00) {
  //function to generate a horizonatal axis and return the axis scale as a child of  'parentSelection' for the input 'data' based on the specified column 'columnName' for the chart of dimensions chartDim.

    //get extent of x
    var xExtent = d3.extent(data, function(d) {
        return d[columnName];
    });

    //adjust extent to provide clearance between points and plot border
    xExtent[0] = xExtent[0] * (1 - clearance);
    xExtent[1] = xExtent[1] * (1 + clearance);

    //get x scaling
    var xScale = d3.scale.linear()
      .range([chartDim.left, chartDim.right])
      .domain(xExtent);

    //get axis handle
    var x_ax = d3.svg.axis()
      .scale(xScale)
      .ticks(9); // props to d3 developers for 'ticks' being a suggestion, not a hard spec

    //add the axis to the svg
    parentSelection.append("g")
      .attr("class", "x axis_tick_label")
      .attr("transform", "translate(0," + chartDim.bottom + ")")
      .call(x_ax);

    //add a title to the axis. checks if units are required in the title
    var x_axisTitle = parentSelection.append('g')
      .append('text')
      .attr('class', 'labels')
      .attr('y', chartDim.bottom)
      .attr('x',( chartDim.left +chartDim.width / 2))
      .attr('dy','2em')
      .style("text-anchor", "middle")
      .text(columnName + dispUnits(columnName,stateOptions['units']));

    //return the scale for use in plotting the data
    return xScale;
  }

  function dispUnits(columnName, units = false) {
    //if units are specified by the svg 'show/hide unit' button, returns the units (for the axis titles)
    if (units){
      if (columnName == 'Weight') {
        return ' (lbs.)';
      } else {
        return ' (in.)';
      }
    }
    return '';
  }

  function make_y_ax(parentSelection, data, columnName, chartDim) {
  //function to generate a vertical axis and return the axis scale as a child of  'parentSelection' for the input 'data' based on the specified column 'columnName' for the chart of dimensions chartDim.

    //get extent of y
    var yExtent = d3.extent(data, function(d) {
          return d[columnName];
        });

    //add some allowance
    yExtent[0] = yExtent[0] *0.99
    yExtent[1] = yExtent[1] *1.01

    //get scaling of y
    var yScale = d3.scale.linear()
      .range([chartDim.bottom, chartDim.top])
      .domain(yExtent);

    //make axis obejct
    var y_ax = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    //append axis to svg
    parentSelection.append("g")
      .attr("class", "y axis_tick_label")
      .attr("transform", "translate(" + chartDim.left + ",0)")
      .call(y_ax);

    //add axis title, checking if units are needed
    var y_axisTitle = parentSelection.append('g')
      .append('text')
      .attr('class', 'labels')
      .attr('transform', 'rotate(-90)')
      .attr('y', chartDim.left)
      .attr('x', - chartDim.height / 2 - chartDim.top)
      .attr('dy','-2em')
      .style("text-anchor", "middle")
      .text(columnName + dispUnits(columnName,stateOptions['units']));

    //return scaling for plotting the data
    return yScale;
  }


function makeScatter(data, svgSelection, xy_spec_obj) {
  //function to show the scatter plot given the data, a parent svgSelection to append it to, and the x and y field names specified in the xy_spec_obj

  //append a 'g' element for the  chart
  var chartSelection = svgSelection.append('g')
                    .attr('class','chart')

  //append circles associated with the data
  var dataCircles = chartSelection.append('g')
    .attr('class', 'chart_points')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle");

  //append and element for the chart axis
  var chartAxis = chartSelection.append("g")
    .attr('class', 'axisElem');

  // make x-axis
  var xScale = make_x_ax(chartAxis, data, xy_spec_obj.x,  mainChart, 0.01);

  //make y axis
  var yScale = make_y_ax(chartAxis, data, xy_spec_obj.y,  mainChart);

  //add attributes to the circles
  dataCircles.attr('class', function(d) { return d['Size']})
    .classed('scatterData', true)
    .attr("cx", function(d) {
        return xScale(d[xy_spec_obj.x]);
        })
    .attr("cy", function(d) {
        return yScale(d[xy_spec_obj.y]);
        })
    .attr("r", radius)
    .attr("fill", '#999999')
    .attr("fill", function(d) {
        return colorMapping[d['Size']];
      });
   }

 function updateScatter( xy_spec_obj ) {
   //update the scatter plot based on the x and y columns selected in the dropdown. Instead of updating all graphs, this function only updates the scatter plot using .transition

    //get data for making the axis elements
    var data = rawData[stateOptions['Gender']['data']];

    //select the chart container element
    var chartSelection = d3.select('.chart');

    //remove old axes
    chartSelection.selectAll('.axisElem').remove();

    // add container for updated axes
    var chartAxis = chartSelection.append("g")
      .attr('class', 'axisElem');

    //add x axis, get scale
     var xScale = make_x_ax(chartAxis, data, xy_spec_obj.x,
                            mainChart, 0.01);

     // add y axis,get scale
     var yScale = make_y_ax(chartAxis, data, xy_spec_obj.y,  mainChart);

     //update circle positions
     d3.selectAll('.scatterData')
       .transition()
       .delay(100)
       .duration(400)
       .attr("cx", function(d) {
            return xScale(d[xy_spec_obj.x]);
            })
       .attr("cy", function(d) {
            return yScale(d[xy_spec_obj.y]);
        });
    }

  // function to make interactive legend
  function makeLegend(sizeChart, interactive = true) {
    //make an interactive legend based on the current size chart.

    //get list of sizes
    var sizeList = sizes(sizeChart);

    //add size 'None'
    sizeList.unshift('None');

    // var for pane width
    var item_width = 35;

    //totale legend width
    var legend_width = sizeList.length * item_width;

    //add element to contain legend
    var sizeLegend = d3.select('#main_svg').append('g')
      .attr('class', 'sizeLegend')
      .attr('transform', "translate(" + (legendPos.center) + "," + (legendPos.top) + ")");

    //only add the key once there are sizes assigned
    if (sizeList.length > 1){

      var adjust = 0.2;


      //add label for the legend
      var legendTitle1 = sizeLegend.append("text")
      .attr('x',-legend_width/2-15+'px')
      .attr('dy', (1 + adjust)+'em')
      .attr('text-anchor', 'end');

      //add instruction note
      var legendTitle2 = sizeLegend.append("text")
      .attr('x',-legend_width/2-15+'px')
      .attr('dy', (2.25 + adjust)+'em')
      .attr('text-anchor', 'end');

      if (interactive){
        legendTitle1.text('Clothing Sizes');
        legendTitle2.text('Click for detail');

      //add a line as a bottom border
      sizeLegend.append('line')
      .style('stroke','gray')
      .attr('x1', -500 +'px')
      .attr('x2', 500 + 'px')
      .attr('y1',3 + adjust+ 'em')
      .attr('y2',3 + adjust+ 'em');
    } else {
      legendTitle1.text('Clothing');
      legendTitle2.text('Sizes');

    };
      //add graphic element for the panes
      sizeLegend = sizeLegend.selectAll('g')
      .data(sizeList)
      .enter();


      //add the size labels
      sizeLegend.append("text")
      .attr("x", function(d, i) {
        return (i + 0.5) * item_width - legend_width/2;
        })
      .text(function(d) {
          return d;
          })
      .attr('text-anchor', 'middle')
      .attr('dx', '0em')
      .attr('dy', 1 + adjust + 'em');

      //add the colored circles corresponding to each size
      sizeLegend.append('circle')
      .attr('class', function(d) {  return d;})
      .classed('legend_circle', true)
      .attr("cx", function(d, i) {
        return (i + 0.5) * item_width - legend_width / 2;
        })
      .attr("r", 1.5 * radius)
      .attr("cy", 2 + adjust + 'em')
      .attr("fill", function(d){
        return colorMapping[d];
        });

      if (interactive){
      //add a clickable rectangle that allows highlihting of sizes
      sizeLegend.append('rect')
      .attr('class', function(d) {  return 'click_pane_'+d;})
      .classed('click_pane', true)
      .attr('y', ( adjust+'em'))
      .attr('rx', 5)
      .attr('ry', 5)
      .attr("x", function(d, i) {
        return i * item_width  - legend_width/2;
        })
      .style("width", item_width + 'px')
      .attr("height", '3em')
      .style('opacity', 0.55)
      .style('fill', 'transparent')
      .on('click', function(d) {

        highlightSize(d);
      //update the styling of features to highlight the data for the current size

        spMainBlock.on('click',function(){
          //cancel highlighting when clicked on anything other than legend panes
          if (!(d3.select(d3.event.target).classed('click_pane'))) {

            d3.selectAll('.dataFeature')
              .style('opacity','0.7');
            d3.selectAll('.hist_bar').style('fill','transparent');
            d3.selectAll('.scatterData')
              .style('opacity','0.3');
            d3.selectAll('.legend_circle')
              .style('opacity','0.8');
            //cancel spMainBlock on click trigger
            spMainBlock.on('click', null); }
            });
        });
      };
    };
    }

function highlightSize(d){
  //update the histogram bar opacity
    d3.selectAll('.dataFeature')
      .style('opacity','0.3');
    d3.selectAll('.'+ d)
        .style('opacity','0.8');

    //update teh scatter plot circle opacity
    d3.selectAll('.scatterData')
      .style('opacity','0.05');
    d3.selectAll('.scatterData.'+ d)
        .style('opacity','0.45');

    // update the legend circle opacity
    d3.selectAll('.legend_circle')
      .style('opacity','0.3');
    d3.selectAll('.legend_circle.'+ d)
        .style('opacity','.8');

    //make the underlying histogram bars show
    d3.selectAll('.hist_bar').style('fill','transparent');
    d3.selectAll('.hist_bar.' + d).style('fill', colorMapping[d]);
};


  /*        functions for histograms    */
  function histogramBuilder(data, hist_chartDim, columnNameArray) {
  //function to build vertically stacked, descending, histograms for the input list of columns with the top histogram located by hist_chartDim

    //categorize data by size
    var dataBySize = facetBySize(data);

    // loop over each column name, adding a histogram of the data for each specified column
    columnNameArray.forEach( function(columnName,  i) {

      //update dimensions : top and bottom of current histogram
      //changed hist_chartDim.current_bottom to .bottom
      hist_chartDim.bottom = (hist_chartDim.initial_top +
          hist_chartDim.height + i * hist_chartDim.totalVertical);

      hist_chartDim.top = (hist_chartDim.initial_top +
          i * hist_chartDim.totalVertical);


      //object with keys being sizes and values being arrays of the data within the size for the current column
      var hist_data = arrayBySizeThisColumn(dataBySize, columnName);

      //append element to contain the histogram for the current column
      var activeHist = histograms.append('g').attr('class', 'histogram');

      //append element to contain the axis for the current histogram
      var chartAxis = activeHist.append("g")
                        .attr('class', 'axisElem');

      //make x-scale for current column
      var xScale = make_x_ax(chartAxis ,data, columnName,hist_chartDim);

      //generate hist bins, max of y dimension
      var hist_data, ymax = make_hist_bins(hist_data, xScale);

      //make yScale
      var hist_yScale = d3.scale.linear()
            .domain([0, ymax])
            .range([hist_chartDim.bottom, hist_chartDim.top]);

      //insert graphic elements
      drawCurHist(activeHist,hist_data, xScale, hist_yScale, hist_chartDim);

      });
    }

  function facetBySize(data) {
    //takes data returns data as an object faceted by size.
    var sizeFacets = {'XXS':[], 'XS':[],'S':[],'M':[],'L':[],
                      'XL':[],'XXL':[], 'None':[], 'ZHistBottomColor': []};

    data.forEach(function(row) {
      sizeFacets[row['Size']].push(row)
      });

    return sizeFacets;
  }

  function arrayBySizeThisColumn(sizeFacets, columnName) {
    //takes data and column name, returns object array were keys are the size and array values are the values for the column name for the size specified by the key.
    var sizeArrays = {'XS':[],'S':[],'M':[],
                      'L':[],'XL':[],'XXL':[], 'None':[]};

    Object.keys(sizeFacets).forEach(function(curKey) {
      sizeArrays[curKey] = sizeFacets[curKey].map(function(d){return d[columnName]});
      })
    return sizeArrays;
  }

  function make_hist_bins(hist_data, xScale) {
    //return hist bins, max of y dimension

      var ymaxs = [];
      Object.keys(hist_data).forEach(function(curKey) {
        hist_data[curKey] = d3.layout.histogram()
            .bins(xScale.ticks(20))
            (hist_data[curKey]);

        ymaxs.push(d3.max(hist_data[curKey], function(d){
            return d.y;
            }))
        });
      var ymax = d3.max(ymaxs);
    return hist_data, ymax;
  }

function drawCurHist(activeHist, hist_data, xScale, hist_yScale, hist_chartDim) {
  //given the object with keys being size and histogram data being values, plots the histogram according to the provides x and y scales as a child of the parent element selector 'activeHist'

  Object.keys(hist_data).forEach(function(curKey, i) {
    //iterate over each size, add the svg elements

    //append the grapic elements for the histograms
    var cur_hist = activeHist.append('g')
      .attr('class','histogram_' + i)
      .selectAll('.bar')
      .data(hist_data[curKey])
      .enter()
      .append('g')
        .attr('class','bar')
        .attr('transform', function(d) {
          return 'translate(' + xScale(d.x) +',' + hist_yScale(d.length) +')'; });
    var brandAbr = stateOptions['Brand'].slice(0,3);
    //  add the rectangles
    cur_hist.append('rect')
      .attr('class', curKey)
      .classed('dataFeature', true)
      .classed('hist_bar',true)
      .classed(brandAbr,true)
      .attr('x',0)
      .attr("width",  xScale(hist_data[curKey][0].x+hist_data[curKey][0].dx) - xScale(hist_data[curKey][0].x))
      .attr('height', function(d) {
        return hist_chartDim.bottom - hist_yScale(d.length);
        })
      .style('fill', 'transparent');

    // add line generator object
    var line = d3.svg.line()
      .x(function(d){ return xScale(d.x + d.dx/2); })
      .y(function(d){return hist_yScale(d.y);})
      .interpolate("monotone"); //'basis' is also good

    //add the line approximately the histogram distribution
    activeHist.append('path')
      .datum(hist_data[curKey])
      .attr("fill", "none")
      .style("stroke", colorMapping[curKey])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line)
      .attr('class', curKey)
      .classed('dataFeature', true)
      .classed(brandAbr,true);

      });
    }


};
