function StartApp(){
	var app = new AppBase();
	app.start();
}

function AppBase(){
	this.start = function(){
		var ui = new UI();
		ui.draw();
	}
}
function UI(){
	var assembler = new UIAssembler();
	
	this.draw = function(){
		assembler.assemble();
	}
}

function UIAssembler(){
	var dom = new DOM();
	var layout = new Layout();
	
	this.assemble = function(){
		assembleLayout();
		assembleDOM();
	}
	
	var assembleLayout = function(){
		$("body").
			prepend(layout.$header).
			append(layout.$main).
			append(layout.$footer);
		$("main").
			prepend(layout.$buttonPlacement);
	}
	
	var assembleDOM = function(){
		$(".buttonPlacement").
			append(dom.$bubbleSort.button);
	}
}

function Layout(){
	var style = new LayoutStyle();
	
	this.$header = style.defineHeaderCSS( $("<header>") );
	this.$main = style.defineMainCSS( $("<main>") );
	this.$footer = style.defineFooterCSS( $("<footer>") );
	this.$buttonPlacement = style.defineButtonPlacementCSS( $("<div>") );
}

function LayoutStyle(){
	this.defineMainCSS = function($main){
		$main.css({
			"width": "100%",
			"height": "500px",
		});
		return $main;
	}
	
	this.defineHeaderCSS = function($header){
		$header.css({
			"width": "100%",
			"height": "50px",
			"background-color": "black",
		});
		return $header;
	}
	
	this.defineFooterCSS = function($footer){
		$footer.css({
			"width": "100%",
			"height": "50px",
			"background-color": "black",
		});
		return $footer;
	}
	
	this.defineButtonPlacementCSS = function($buttonPlacement){
		$buttonPlacement.addClass("buttonPlacement");
		$buttonPlacement.css({
			"width": "100%",
			"background-color": "gray",
		});
		return $buttonPlacement;
	}
}

function DOM(){
	this.$bubbleSort = new Button("BubbleSort");
}

function Button(buttonName){
	var basic = new ButtonBasicSetup();
	var style = new ButtonStyle();
	
	this.button = style.defineButtonCSS( basic.setup(buttonName) );
}

function ButtonBasicSetup(){
	this.setup = function(buttonName){
		var $button = $("<button>").text(buttonName).attr("id",buttonName);
		return $button;
	}
}

function ButtonStyle(){
	this.defineButtonCSS = function($button){
		$button.css({
			"width" :"100px",
			"height":"25px"
		});
		return $button;
	}
}

$(function(){
	$("body").on("click","#BubbleSort",function(){
		alert("OK");
	});
});