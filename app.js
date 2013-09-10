function StartApp(){
	var app = new AppBase();
	app.test();
}

function AppBase(){
	this.test = function(){
		// TODO;
	}
}

$(function(){
	$("#bubbleSort").click(function(){
		$("body").text("hello");
	});
});