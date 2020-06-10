
		function $(obj){return document.getElementById(obj)}
		var maxWidth=$("in").getElementsByTagName("ul")[0].getElementsByTagName("li").length*200;
		var isScroll=false;
		var modiLeft;

		$("scroll").onmousedown=function(evt){
		isScroll=true;
		evt=(evt)?evt:((window.event)?window.event:null);
		if(evt.offsetX){
		modiLeft=parseInt(evt.offsetX)}
		else{modiLeft=parseInt(evt.layerX)}}

		document.onmouseout=function(){isScroll=false;}

		document.onmousemove=function(evt){
		evt=(evt)?evt:((window.event)?window.event:null);
		if(evt&&isScroll){
		$("scroll").style.left=parseInt(evt.clientX)-parseInt($("scrollBar").offsetLeft)-modiLeft+"px";
		if(parseInt($("scroll").style.left)<0){$("scroll").style.left=0+"px"}
		if(parseInt($("scroll").style.left)>770){$("scroll").style.left=770+"px"}
		$("in").scrollLeft=parseInt($("scroll").style.left)*((maxWidth-770)/770);}}

	var targetx = 800;
	var dx;
	var a=null;


	function moveLeft(){
		var le=parseInt($("in").scrollLeft);
		if(le>300){targetx=parseInt($("in").scrollLeft)-800;}
		else{targetx=parseInt($("in").scrollLeft)-le-1}
		scLeft();
	}




	function moveRight(){
		var le=parseInt($("in").scrollLeft)+800;
		var maxL=maxWidth-800;
		if(le<maxL){targetx=parseInt($("in").scrollLeft)+800;}
		else{targetx=maxL}
		scRight();
	}
	




	function scLeft(){
		dx=parseInt($("in").scrollLeft)-targetx;
		$("in").scrollLeft-=dx*.25;
		$("scroll").style.left=parseInt($("in").scrollLeft)*(770/(maxWidth-800))+"px";
		if(parseInt($("scroll").style.left)<0){$("scroll").style.left=0+"px"}
		if(parseInt($("scroll").style.left)>770){$("scroll").style.left=770+"px"}
		clearScroll=setTimeout(scLeft,50);
		if(dx*.25<1){clearTimeout(clearScroll)}
	}





	function scRight(){
		dx=targetx-parseInt($("in").scrollLeft);
		$("in").scrollLeft+=dx*.25;
		$("scroll").style.left=parseInt($("in").scrollLeft)*(770/(maxWidth-800))+"px";
		if(parseInt($("scroll").style.left)<0){$("scroll").style.left=0+"px"}
		if(parseInt($("scroll").style.left)>770){$("scroll").style.left=770+"px"}
		a=setTimeout(scRight,50);
		if(dx*.25<1){clearTimeout(a)}
	}






 


var data=[

{   name: "news1",
    value: "1000",
    type:"type1"},

{   name: "news2", 
    value: "700", 
    type:"type1"},

 {   name: "news3", 
    value: "500",
    type:"type1" },

{   name: "news4", 
    value: "400",
    type:"type1" },

 {   name: "news5", 
    value: "400",
    type:"type1" },

 
 {   name: "news6", 
    value: "300" ,
	type:"type1"},

  {   name: "news7", 
    value: "200", 
	type:"type1"},

    {   name: "news8", 
    value: "100",
    type:"type1" },

{   name: "news9", 
    value: "80" ,
	type:"type1"},

    {   name: "news10", 
    value: "70",
    type:"type1" },


 
  ]








 

var color = d3.scale.category20();
var width = 200;
var height= 500;

var dataobj = { children: data};
var pack = d3.layout.pack();
pack = pack.padding(2).size([200,500]).sort(function(a,b) { return b.value - a.value; });

var nodes = pack.nodes(dataobj);
nodes = nodes.filter(function(it) { return it.parent; });


var force = d3.layout.force()
.charge(-150)
.linkDistance(100)
.size([width, height]);



 var svg = d3.select("body").selectAll("svg");

 svg.data(nodes)

/*
  var svg =d3.select("#news_type").append("svg")
                    .attr("width", width)
                    .attr("height", height);
               
*/



var news=svg.selectAll("circle")                
  .data(nodes)                         
  .enter()                             
  .append("circle")
  .attr({
    cx: function(it) { return it.x; }, 
    cy: function(it) { return it.y; },
    r : function(it) { return it.r; }, 
    fill: function(it) { return color(it.name); },
    stroke: "#444", 
 });

 var news_name =svg.selectAll("text")
 .data(nodes)
 .enter()
  .append("text")
  .attr({
    x: function(it) { return it.x; },
    y: function(it) { return it.y; },
    "text-anchor": "middle", })
   .text(function(it)  { return it.name;})












//});


