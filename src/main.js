import vis from 'vis'
const node = document.getElementById('visualization');
const data = require('./dummies.json');
const data1 = require('./dummies_1.json');
var network = '',
	options = {},
	nodes = {},
	edges = {},
	count = 0;

/*
	Negativo: #d01622,
	Neutro: #008ae4,
	Positivo: #38c02a
*/

function startNetwork () {
	options = {
		interaction: {
			tooltipDelay: 200
		},
		nodes: {
			shape: 'dot',
			borderWidth: 1,
			font: {
				color: '#FFFFFF'
			}
		},
		groups: {
			facebook: {
				shape: 'circularImage',
				image: 'https://svgshare.com/i/8St.svg',
			},
			twitter: {
				shape: 'circularImage',
				image: 'https://svgshare.com/i/8TF.svg',
			},
			youtube: {
				shape: 'circularImage',
				image: 'https://svgur.com/i/8Tn.svg',
			}
		}
	};
	nodes = new vis.DataSet(data.nodes);
	edges = new vis.DataSet(data.edges);
	network = new vis.Network(node, {nodes, edges}, options);
}
function resetAllNodes() {
	nodes.clear();
	edges.clear();
	if( count <= 0 ){
		nodes.add(data1.nodes);
		edges.add(data1.edges);	
		count = 1;
	} else {
		nodes.add(data.nodes);
		edges.add(data.edges);
		count = 0;
	}
	console.log(count);
}



document.getElementById('reset_data').addEventListener('click', () => {
	resetAllNodes();
})

startNetwork();


network.on("click", function (params) {
	params.event = "[original event]";
	document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
	console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
});