var CARD_NUMBERS = 20;

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
	
	this.assemble = function(){
		assembleLayout();
		assembleDOM();
	}
	
	var assembleLayout = function(){
		var layout = new Layout();
		
		$("body").
			prepend(layout.header).
			append(layout.main).
			append(layout.footer);
		$("main").
			prepend(layout.buttonPlacement).
			append(layout.cardPlacement);
	}
	
	var assembleDOM = function(){
		var dom = new DOM();
		var cardSetting = new CardSetting();

		$(".buttonPlacement").
			append(dom.bubbleSortButton);
		cardSetting.set(dom.cards);
	}
}

function CardSetting(){
	var cardShuffler = new CardShuffler();

	this.set = function(cards){
		cards = cardShuffler.shuffle(cards);
		
		for(var i = 0; i < CARD_NUMBERS; i++){
			$(".cardPlacement").
				append(cards[i].card);
		}	
	}
}

function CardShuffler(){
	var indexSetting = new IndexSetting();
	var random = new RandomNumberGenerator();

	this.shuffle = function(cards){
		var indexList = [];
		for(var i = 0; i < CARD_NUMBERS; i++){
			indexList[i] = i;		
		}

		for(var i = 0; i < CARD_NUMBERS; i++){
			var randomIndex = random.getRandom(0,indexList.length-1);	
			console.log(indexList[randomIndex] );
			cards[i].prev = indexSetting.setPrevIndex(indexList[randomIndex]);
			cards[i].next = indexSetting.setNextIndex(indexList[randomIndex]);

			indexList.splice(randomIndex,1);
		}
		
		for(var i = 0; i < CARD_NUMBERS; i++){
			console.log( i + "番目");
			console.log(cards[i].prev);
			console.log(cards[i].next);
		}
		return cards;
	}	
}

function Layout(){
	var style = new LayoutStyle();
	
	this.header = style.defineHeaderCSS( $("<header>") );
	this.main = style.defineMainCSS( $("<main>") );
	this.footer = style.defineFooterCSS( $("<footer>") );
	this.buttonPlacement = style.defineButtonPlacementCSS( $("<div>") );
	this.cardPlacement = style.defineCardPlacementCSS( $("<div>") );
}

function LayoutStyle(){
	
	this.defineMainCSS = function(main){
		main.css({
			"width": "100%",
			"height": "420px",
		});
		return main;
	}
	
	this.defineHeaderCSS = function(header){
		header.css({
			"width": "100%",
			"height": "50px",
			"background-color": "black",
		});
		return header;
	}
	
	this.defineFooterCSS = function(footer){
		footer.css({
			"width": "100%",
			"height": "50px",
			"background-color": "black",
		});
		return footer;
	}
	
	this.defineButtonPlacementCSS = function(buttonPlacement){
		buttonPlacement.addClass("buttonPlacement");
		buttonPlacement.css({
			"width": "100%",
			"background-color": "gray",
		});
		return buttonPlacement;
	}
	
	this.defineCardPlacementCSS = function(cardPlacement){
		cardPlacement.addClass("cardPlacement");
		cardPlacement.css({
			"width": "100%",
			"height":"100%",
			"background-color": "#c0c0c0",
		});
		return cardPlacement;
	}
}

function DOM(){
	var cardCreator = new CardCreator();
	var button = new Button();

	this.bubbleSortButton = button.create("BubbleSort");
	this.cards = cardCreator.create();
}

function CardCreator(){
	var card = new Card();
	var indexSetting = new IndexSetting();

	this.create = function(){
		var cards = [];

		for(var i = 0; i < CARD_NUMBERS; i++){
			cards[i] = {
				card:card.create(i),
				prev:indexSetting.setPrevIndex(i),
				next:indexSetting.setNextIndex(i)
			};
		}
		return cards;
	}	
}

function Card(){
	var basic = new CardBasicSetup();
	var style = new CardStyle();
	
	this.create = function(cardName){
		var card = style.defineCardCSS( basic.setup(cardName) );
		return card;
	}
}

function CardBasicSetup(){
	this.setup = function(cardName){
		var card = $("<div>").text(cardName).attr("id",cardName);
		return card;
	}
}

function CardStyle(){
	this.defineCardCSS = function(card){
		card.css({
			"position":"relative",
			"top":"30%",
			"text-align":"center",
			"line-height":"80px",
			"font-size":"50px",
			"font-weight":"bold",
			"border":"3px solid black",
			"width" :"50px",
			"height":"80px",
			"vertical-align":"middle",
			"background-color":"white",
			"border-radius":"10px",

			"float":"left",
			"margin":"2px",
		});
		return card;
	}
}

function Button(){
	var basic = new ButtonBasicSetup();
	var style = new ButtonStyle();

	this.create = function(buttonName){
		var button = style.defineButtonCSS( basic.setup(buttonName) );
		return button;
	}
}

function ButtonBasicSetup(){
	this.setup = function(buttonName){
		var button = $("<button>").text(buttonName).attr("id",buttonName);
		return button;
	}
}

function ButtonStyle(){
	this.defineButtonCSS = function(button){
		button.css({
			"width" :"100px",
			"height":"25px"
		});
		return button;
	}
}

$(function(){
	$("body").on("click","#BubbleSort",function(){
		$("#0").animate({
			"left":"+=100px",
			"top":"+=1px"
		});
	});
});

function IndexSetting(){	
	this.setPrevIndex = function(indexNumber){
		if(indexNumber == 0){
			return null;
		}else{
			return (indexNumber - 1);	
		}
	}

	this.setNextIndex = function(indexNumber){
		if(indexNumber == CARD_NUMBERS-1){
			return null;
		}else{
			return (indexNumber + 1);	
		}
	}
}

function RandomNumberGenerator(){
	this.getRandom = function(min,max){
		return	Math.floor(Math.random() * (max - min + 1)) + min;
	}		
}
