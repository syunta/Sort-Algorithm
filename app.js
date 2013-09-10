function StartApp(){
	var app = new AppBase();
	app.test();
}

function AppBase(){
	this.test = function(){
		var event = new EventHandler();
		event.test();
	}
}

function EventHandler(){
	this.test = function(){
		$("body").text("this is a test.");
	}
}