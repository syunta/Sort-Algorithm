$(function(){
	StartApp();

	function StartApp(){
		var app = new AppBase();
		app.run();
	}
	
	function AppBase(){
		this.run = function(){
			var dataSourceLayer = new DataSource();
			dataSourceLayer.createUILayer();
		}
	

		/* DataSource */
		function DataSource(){
			var cnst = new Constant();
			var timer = new DelayTimer();
			var doublyLinkedCardsCreator = new DoublyLinkedCardsCreator();
			var cards = doublyLinkedCardsCreator.create();

			function Constant(){
				this.CARD_NUMBERS = 5;	
			}

			function DoublyLinkedCardsCreator(){
				var indexSetter = new IndexSetter();
				this.create = function(){
					var cards = [];
					for(var cardNumber = cnst.CARD_NUMBERS-1; 0 <= cardNumber; cardNumber--){
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
					if(indexNumber == cnst.CARD_NUMBERS-1){
						return null;
					}else{
						return (indexNumber + 1);	
					}
				}
				this.setNextIndex = function(indexNumber){
					if(indexNumber == 0){
						return null;
					}else{
						return (indexNumber - 1);
					}
				}
			}

			this.createUILayer = function(){
				var UILayer = new UI();
				UILayer.draw();
				UILayer.createEventLayer();

				/* UI */
				function UI(){
					this.draw = function(){
						var assembler = new UIAssembler();
						assembler.assemble();
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
							for(var i = cards.length-1; 0 <= i; i--){
								cards[i].css({"left":(((cards.length-1)-i)*60)+"px"});
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

					this.createEventLayer = function(){
						var eventListener = new EventListener();
						eventListener.set();
						
						/* Events */
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
								BubbleSort: bubbleSort.run,
								Shuffle   : shuffle.run
							};
						}

						function EventController(delay){
							var queue = [];

							var deQueue = function(){
								if(0 < queue.length){
									return queue.shift();
								}else{
									return null;	
								}
							}

							this.enQueue = function(eventFunction){
								if(eventFunction instanceof Array){
									for(var i = 0; i < eventFunction.length; i++){
										this.enQueue(eventFunction[i]);
									}
								}else{
									queue.push(eventFunction);
								}
							}

							this.run = function(){
								setProcessOrder();
							}

							var setProcessOrder = function(){
								var eventFunction = deQueue();
								if(eventFunction != null){
									eventFunction();
									setTimeout(setProcessOrder,delay);
								}else{
									return;	
								}
							}
						}

						function CardDataController(){
							this.insert = function(movingCard,left,right){
								if(cards[movingCard].next != null){
									cards[ cards[movingCard].next ].prev = cards[movingCard].prev;
								}
								if(cards[movingCard].prev != null){
									cards[ cards[movingCard].prev ].next = cards[movingCard].next;
								}

								if(left != null){
									cards[left].next = movingCard;
									cards[movingCard].prev = left;
								}else{
									cards[movingCard].prev = null;	
								}

								if(right != null){
									cards[right].prev = movingCard;
									cards[movingCard].next = right;
								}else{
									cards[movingCard].next = null;	
								}
							}

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

						function CardMotion(){
							this.move = function(cardNumber,movement){
								$("#"+cardNumber).animate({"left":movement+"px"});
							}
							this.swap = function(currentIndex,prevIndex){
								var currentPosition = $("#"+cards[currentIndex].number).position();
								var prevPosition = $("#"+cards[prevIndex].number).position();

								this.move(cards[currentIndex].number,prevPosition.left);
								this.move(cards[prevIndex].number,currentPosition.left);
							}
							this.changeBackGround = function(target){
								$("#"+target).css({
									"background-color":"yellow"	
								});
							}
							this.returnBackGround = function(target){
								$("#"+target).css({
									"background-color":"white"	
								});
							}
						}

						function Shuffle(){
							this.run = function(){
								var cardArranger = new CardArranger();
								var cardController = new CardDataController();
								var delayTime = 400;
								var eventController = new EventController(delayTime);

								eventController.enQueue( function(){cardArranger.arrange(0)} );
								eventController.enQueue( cardController.mix );
								eventController.enQueue( function(){cardArranger.arrange(60)} );
								eventController.run();
							}	
						}
						
						function CardArranger(){
							var indexFinder = new IndexFinder();
							var motion = new CardMotion();

							this.arrange = function(additionalMoveLength){
								var currentIndex = indexFinder.findFirst();
								var nextIndex = cards[currentIndex].next;
								var moveLength = 0;
								while(true){
									motion.move(
										cards[currentIndex].number,
										moveLength
									);
									if(nextIndex == null){break;}
									moveLength += additionalMoveLength;
									currentIndex = nextIndex;
									nextIndex = cards[currentIndex].next;
								}
							}
						}

						function BubbleSort(){
							this.run = function(){
								var delayTime = 410;
								var eventController = new EventController(delayTime);
								var motion = new CardMotion();
								var indexFinder = new IndexFinder();
								var lastIndexSetter = new LastIndexSetter();
								var oneStep = new BubbleSortOneStep();

								var currentIndex;

								for(var i = 0; i < cnst.CARD_NUMBERS-1; i++){
									eventController.enQueue( lastIndexSetter.set );
									for(var j = 0; j < ((cnst.CARD_NUMBERS-1) - i); j++){
										eventController.enQueue( oneStep.excute );
									}
								}
								eventController.enQueue( function(){motion.returnBackGround(currentIndex);} );
								eventController.run();

								function LastIndexSetter(){
									this.set = function(){
										motion.returnBackGround(currentIndex);
										currentIndex = indexFinder.findLast();
										motion.changeBackGround(currentIndex);
									}	
								}

								function BubbleSortOneStep(){
									var cardController = new CardDataController();

									this.excute = function(){
										var prevIndex = cards[currentIndex].prev;

										if(cards[currentIndex].number < cards[prevIndex].number){
											motion.swap(prevIndex,currentIndex);
											cardController.insert(currentIndex,cards[prevIndex].prev,prevIndex);
										}else{
											motion.returnBackGround(currentIndex);
											currentIndex = cards[currentIndex].prev;	
											motion.changeBackGround(currentIndex);
										}
									}	
								}
							}
						}


						function RandomNumberGenerator(){
							this.getRandom = function(min,max){
								return	Math.floor(Math.random() * (max - min + 1)) + min;
							}		
						}

						function IndexFinder(){
							this.findFirst = function(){
								var firstIndex;
								for(var i = 0; i < cnst.CARD_NUMBERS; i++){
									if(cards[i].prev == null){
										firstIndex = i;
										break;	
									}
								}
								return firstIndex;
							}
							this.findLast = function(){
								var lastIndex;
								for(var i = 0; i < cnst.CARD_NUMBERS; i++){
									if(cards[i].next == null){
										lastIndex = i;
										break;	
									}
								}
								return lastIndex;
							}
						}
					}
				}
			}
		}
	}
});
