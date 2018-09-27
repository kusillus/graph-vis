import vis from 'vis';
const node = document.getElementById('visualization');
const data = require('./dummies/dummies.json');
const data1 = require('./dummies/dummies_1.json');
const post_data = require('./dummies/post_data.json');
var infoNode = `<div class="info_node bg-light" style="top:{axis_x}px;left:{axis_y}px;">
	<div class="d-flex justify-content-between">
		<div class="info_user">
			<img class="user_img_profile" src="{user_img}" alt="">
			<div class="user_names">
				<span class="">
					<strong>{user_name}</strong>
				</span>
				<span class="subtitle">
					<a href="{user_account_link}" target="_blank">{user_account}</a>
				</span>
				<div>
					<i class="fab fa-{social_icon}-square"></i>
				</div>
			</div>
		</div>
		<div class="reach-info">
			<div class="text-center">
				<i class="fas fa-signature"></i>
				<span class="pr-2">{post_rich}</span>
			</div>
			<div class="sentiment d-flex">
				<div class="px-1 text-success">
					<i class="far fa-smile"></i>
					<span>{sentiment_positive}</span>%
				</div>
				<div class="px-1 text-warning">
					<i class="far fa-meh"></i>
					<span>{sentiment_neutro}</span>%
				</div>
				<div class="px-1 text-danger">
					<i class="far fa-angry"></i>
					<span>{sentiment_negative}</span>%
				</div>
			</div>
		</div>
	</div>
	<div class="node_post">
		<span class="post_content">
		{post_content}
		</span>
		<div class="post_extrainfo">
			<span>
					<i class="far fa-clock"></i>
				<span>
					{post_date}
				</span>
			</span>	
			<span>
				<i class="ml-1 fas fa-map-marker-alt"></i>
				<span>
					{post_position}
				</span>
				<div>
					<a href="{user_post_link}" target="_blank">Ir a la publicación</a>
				</div>
			</span>	
		</div>
	</div>
</div>`;


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
}

document.getElementById('reset_data').addEventListener('click', () => {
	cleanView();
	resetAllNodes();
})

startNetwork();
function cleanView() {
	var infoNode = document.getElementById('idPanel');
	if(infoNode) infoNode.parentElement.removeChild(infoNode);
}

network.on("click", function (params) {
	var id = params.nodes[0];
	var axis = params.pointer.DOM;
	cleanView();
	if(id) {
		var new_infoNode =  findDataNode(id, axis);
		if(new_infoNode) {
			var target = document.querySelector('#container_body');
			var div = document.createElement('div');
			div.setAttribute('id', 'idPanel');
			div.innerHTML = new_infoNode;
			target.parentNode.insertBefore(div, target);
		}
	}
});

function calculateAxis(total, axis) {
	if(axis > (total/2)) {
		return axis - 290;
	} else {
		return axis;
	}
}

function findDataNode(id, axis) {
	// Aqui consumimos el servicio para obtener la data y reemplazar los campos en la variable
	var fullWidth = (window.innerWidth || document.documentElement.clientWidth);
	var fullHeight = (window.innerHeight || document.documentElement.clientHeight);
	var new_infoNode = '';
	var pointX = calculateAxis(fullWidth,axis.x);
	// var pointY = calculateAxis(fullHeight,axis.y);
	Object.keys(post_data).forEach(function(x) {
		var item = post_data[x];
		if(id === item.id) {
			new_infoNode =  infoNode.replace(/{user_name}/g, item.name);
			new_infoNode =  new_infoNode.replace(/{user_img}/g, item.img);
			new_infoNode =  new_infoNode.replace(/{social_icon}/g, item.network);
			new_infoNode =  new_infoNode.replace(/{user_account}/g, item.username);
			new_infoNode =  new_infoNode.replace(/{post_rich}/g, item.rich);
			new_infoNode =  new_infoNode.replace(/{sentiment_positive}/g, item.sentiment.positive);
			new_infoNode =  new_infoNode.replace(/{sentiment_neutro}/g, item.sentiment.neutro);
			new_infoNode =  new_infoNode.replace(/{sentiment_negative}/g, item.sentiment.negative);
			new_infoNode =  new_infoNode.replace(/{post_content}/g, item.post);
			new_infoNode =  new_infoNode.replace(/{post_date}/g, item.date);
			new_infoNode =  new_infoNode.replace(/{post_position}/g, item.from);
			new_infoNode =  new_infoNode.replace(/{user_account_link}/g, item.userlink);
			new_infoNode =  new_infoNode.replace(/{user_post_link}/g, item.postlink);
			new_infoNode =  new_infoNode.replace(/{axis_x}/g, pointX);
			new_infoNode =  new_infoNode.replace(/{axis_y}/g, axis.y);
		} 
	})
	return new_infoNode;
}
