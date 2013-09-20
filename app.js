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
			prepend(layout.$buttonPlacement).
			append(layout.$cardPlacement);
	}
	
	var assembleDOM = function(){
		$(".buttonPlacement").
			append(dom.$bubbleSort.button);
		$(".cardPlacement").
			append(dom.$1.card);
	}
}

function Layout(){
	var style = new LayoutStyle();
	
	this.$header = style.defineHeaderCSS( $("<header>") );
	this.$main = style.defineMainCSS( $("<main>") );
	this.$footer = style.defineFooterCSS( $("<footer>") );
	this.$buttonPlacement = style.defineButtonPlacementCSS( $("<div>") );
	this.$cardPlacement = style.defineCardPlacementCSS( $("<div>") );
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
	
	this.defineCardPlacementCSS = function($cardPlacement){
		$cardPlacement.addClass("cardPlacement");
		$cardPlacement.css({
			"width": "100%",
			"height":"100%",
			"background-color": "#c0c0c0",
		});
		return $cardPlacement;
	}
}

function DOM(){
	this.$bubbleSort = new Button("BubbleSort");
	this.$1 = new Card("1");
}

function Card(cardName){
	var basic = new CardBasicSetup();
	var style = new CardStyle();
	
	this.card = style.defineCardCSS( basic.setup(cardName) );
}

function CardBasicSetup(){
	this.setup = function(cardName){
		var $card = $("<div>").text(cardName).attr("id",cardName);
		return $card;
	}
}

function CardStyle(){
	this.defineCardCSS = function($card){
		$card.css({
			"position":"relative",
			"text-align":"center",
			"line-height":"161px",
			"font-size":"100px",
			"font-weight":"bold",
			"border":"3px solid black",
			"width" :"100px",
			"height":"161px",
			"background-color":"white",
			"border-radius":"15px",
		});
		return $card;
	}
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
		$("#1").animate({
			"left":"+=100px",
			"top":"+=1px"
		});
	});
});
