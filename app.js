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
	var assembler = new UIAssembler();
	
	this.draw = function(){
		$("body").append( assembler.assembledPage );
	}
}

function UIAssembler(){
	var dom = new DOM();
	var layout = new Layout();
	
	this.assembledPage = dom.$bubbleSortButton;
	// TODO
}

function Layout(){
	var css = new LayoutStyle();
	
	var $main = $("<main>");
	
	this.panorama = $main;
}

function LayoutStyle(){
	// TODO
}

function DOM(){
	var css = new DOMStyle();
	
	this.$bubbleSortButton
		= css.defineButton( $("<button>").text("BubbleSort") );
}

function DOMStyle(){
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