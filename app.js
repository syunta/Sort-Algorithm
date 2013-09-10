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
	}
	
	var assembleDOM = function(){
		$("main").
			append(dom.$bubbleSort.button);
	}
}

function Layout(){
	var css = new LayoutStyle();
	
	this.$header = css.defineHeader( $("<header>") );
	this.$main = css.defineMain( $("<main>") );
	this.$footer = css.defineFooter( $("<footer>") );
}

function LayoutStyle(){
	this.defineMain = function($main){
		$main.css({
			"width" :"100%",
			"height" :"500px",
		});
		return $main;
	}
	
	this.defineHeader = function($header){
		$header.css({
			"width" :"100%",
			"height" :"50px",
			"background-color" :"black",
		});
		return $header;
	}
	
	this.defineFooter = function($footer){
		$footer.css({
			"width" :"100%",
			"height" :"50px",
			"background-color" :"black",
		});
		return $footer;
	}
}

function DOM(){
	this.$bubbleSort = new Button("BubbleSort");
}

function Button(buttonName){
	var css = new ButtonStyle();
	
	this.button = css.defineButton( $("<button>").text(buttonName).attr("id",buttonName) );
}

function ButtonStyle(){
	this.defineButton = function($button){
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