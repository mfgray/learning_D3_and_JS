require.config({
    paths: {
        'd3': 'd3.min',
    },
    shim: {
        'draw': {
                deps: ['d3.global','queue'],
                exports: 'draw'
            }
    }
});

define("d3.global", ["d3"], function(_) {
  d3 = _;
});

define("queue.global", ["queue"], function(_) {
  queue = _;
});

require(['d3','queue','draw'],function(d3,queue,draw){
  queue()
	.defer(d3.csv, '../data/mens_data_columns.csv')
  .defer(d3.csv, '../data/womens_data_columns.csv')
  .defer(d3.json, '../data/sizeChartsFit.json')
	.await(draw);
});
