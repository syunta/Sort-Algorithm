$(function(){
	StartApp();

	function StartApp(){
		var app = new AppBase();
		app.run();
	}
	
	function AppBase(){
		this.run = function(){
			var dataSourceLayer = new DataSource();
			dataSourceLayer.createUpperLayer();
		}
		
		var cnst = new Constant();
		var timer = new DelayTimer();
		var doublyLinkedCardsCreator = new DoublyLinkedCardsCreator();
		var cards = doublyLinkedCardsCreator.create();

		function Constant(){
			this.CARD_NUMBERS = 20;	
		}

		function DoublyLinkedCardsCreator(){
			var indexSetter = new IndexSetter();
			this.create = function(){
				var cards = [];
				for(var cardNumber = 0; cardNumber < cnst.CARD_NUMBERS; cardNumber++){
					cards[cardNumber] = {
						number: cardNumber,
						prev  : indexSetter.setPrevIndex(cardNumber),
						next  : indexSetter.setNextIndex(cardNumber)
					}
				}
				return cards;
			}
		}

		function DelayTimer(){
			this.delay = 0;
			this.add = function(additionalTime){
				this.delay += additionalTime;
			}
			this.reset = function(){
				this.delay = 0;	
			}
		}

		function IndexSetter(){	
			this.setPrevIndex = function(indexNumber){
				if(indexNumber == 0){
					return null;
				}else{
					return (indexNumber - 1);	
				}
			}

			this.setNextIndex = function(indexNumber){
				if(indexNumber == cnst.CARD_NUMBERS-1){
					return null;
				}else{
					return (indexNumber + 1);
				}
			}
		}

		function DataSource(){
			this.createUpperLayer = function(){
				var UILayer = new UI();
				var eventListener = new EventListener();

				eventListener.set();
				UILayer.draw();
			}

			function EventListener(){
				this.set = function(){
					$("body").on("click","button",function(){
						var eventHandler = new EventHandler();
						eventHandler($(this).attr("id"));
					});
				}
			}

			function EventHandler(){
				var eventList = new EventList();
				
				return function(eventType){
					eventList[eventType]();
				}
			}

			function EventList(){
				var bubbleSort = new BubbleSort();
				var shuffle = new Shuffle();

				return {
					BubbleSort:bubbleSort,
					Shuffle:shuffle
				};
			}

			function BubbleSort(){
				return function(){
					alert("バブルソートの処理:");	
				}
			}

			function Shuffle(){
				return function(){
					var cardMixer = new CardMixer();
					var cardArranger = new CardArranger();

					timer.reset();

					cardArranger.arrange(100,0);
					cardMixer.mix();
					cardArranger.arrange(40,60);
				}
			}

			function CardMixer(){
				this.mix = function(){
					var random = new RandomNumberGenerator();
					var indexList = [];
					
					for(var i = 0; i < cnst.CARD_NUMBERS; i++){
						indexList[i] = i;		
					}

					var randomIndexList = [];
					for(var i = 0; i < cnst.CARD_NUMBERS; i++){
						var randomIndex = random.getRandom(0,indexList.length-1);	
						randomIndexList[i] = indexList[randomIndex];
						indexList.splice(randomIndex,1);
					}

					for(var i = 0; i < cnst.CARD_NUMBERS; i++){
						if(i == 0){
							cards[ randomIndexList[i] ].prev = null;
						}else{
							cards[ randomIndexList[i] ].prev = randomIndexList[i-1];	
						}

						if(i == cnst.CARD_NUMBERS - 1){
							cards[ randomIndexList[i] ].next = null;
						}else{
							cards[ randomIndexList[i] ].next = randomIndexList[i+1];
						}
					}
				}	
			}

			function CardArranger(){
				this.arrange = function(additionalTime,additionalMoveLength){
					var firstIndexFinder = new FirstIndexFinder();
					var currentIndex = firstIndexFinder.find(cards);
					var nextIndex = cards[currentIndex].next;
					var moveLength = 0;

					while(true){
						$("#"+cards[currentIndex].number).delay(timer.delay).animate({"left":(moveLength)+"px",});
						
						if(nextIndex == null){break;}
						
						timer.add(additionalTime);
						moveLength += additionalMoveLength;
						currentIndex = nextIndex;
						nextIndex = cards[currentIndex].next;
					}
				}
			}

			function UI(){
				this.draw = function(){
					var assembler = new UIAssembler();
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
					var cardSetter = new CardSetter();

					$(".buttonPlacement").
						append(dom.bubbleSortButton).
						append(dom.shuffleButton);
					cardSetter.set(dom.cards);
				}
			}

			function CardSetter(){
				this.set = function(cards){
					timer.reset();
					for(var i = 0; i < cards.length; i++){
						cards[i].css({"left":(i*60)+"px"});
						$(".cardPlacement").append(cards[i]);
						cards[i].delay(timer.delay).fadeIn();
						
						timer.add(100);
					}
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
						"position":"relative",
						"width": "100%",
						"height":"100%",
						"background-color": "#c0c0c0",
					});
					return cardPlacement;
				}
			}

			function DOM(){
				var cardCreator = new CardCreator();
				var buttonCreator = new ButtonCreator();

				this.bubbleSortButton = buttonCreator.create("BubbleSort");
				this.shuffleButton = buttonCreator.create("Shuffle");
				this.cards = [];

				for(var cardNumber = 0; cardNumber < cnst.CARD_NUMBERS; cardNumber++){
					this.cards[cardNumber] = cardCreator.create(cardNumber);
				}
			}

			function CardCreator(){
				var basic = new CardBasicSetup();
				var style = new CardStyle();

				this.create = function(cardNumber){
					var card = style.defineCardCSS( basic.setup(cardNumber) );
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
						"position":"absolute",
						"top":"30%",
						"text-align":"center",
						"line-height":"80px",
						"font-size":"40px",
						"font-weight":"bold",
						"border":"3px solid black",
						"width" :"50px",
						"height":"80px",
						"background-color":"white",
						"border-radius":"10px",

						"display":"none",
					});
					return card;
				}
			}

			function ButtonCreator(){
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

			function RandomNumberGenerator(){
				this.getRandom = function(min,max){
					return	Math.floor(Math.random() * (max - min + 1)) + min;
				}		
			}

			function FirstIndexFinder(){
				this.find = function(cards){
					var firstIndex;
					for(var i = 0; i < cnst.CARD_NUMBERS; i++){
						if(cards[i].prev == null){
							firstIndex = i;
							break;	
						}
					}
					return firstIndex;
				}
			}
		}
	}
});
