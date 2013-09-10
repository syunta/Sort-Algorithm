function StartApp(){
	var app = new AppBase();
	app.test();
}

function AppBase(){
	this.test = function(){
		var ui = new UI();
		ui.draw();
	}
}
function UI(){
	var dom = new DOM();
	
	this.draw = function(){
		$("body").append( dom.$bubbleSortButton );
	}
}

function DOM(){
	var css = new CSS();
	
	this.$bubbleSortButton 
		= css.defineButton( $("<button>").text("BubbleSort") );
}

function CSS(){
	this.defineButton = function($button){
		$button.css({
			"width" :"100px",
			"height":"25px"
		});
		
		return $button;
	}
}

$(function(){
	$("#bubbleSort").click(function(){
		$("body").text("hello");
	});
});