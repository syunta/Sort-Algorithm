$(function(){
	StartApp();

	function StartApp(){
		var app = new AppBase();
		app.run();
	}
	
	function AppBase(){
		this.run = function(){
			var ui = new UI();
			var eventListener = new EventListener();

			ui.draw();
			eventListener.set();
		}

		/* DataSource */
		function Constant(){
			this.getCARD_NUMBERS = function(){
				return 20;
			}
		}

		function DoublyLinkedCardsCreator(){
			var cnst = new Constant();
			var indexSetter = new IndexSetter();
			this.create = function(){
				var cards = [];
				for(var cardNumber = cnst.getCARD_NUMBERS()-1; 0 <= cardNumber; cardNumber--){
					cards[cardNumber] = {
						number: cardNumber,
						prev  : indexSetter.setPrevIndex(cardNumber),
						next  : indexSetter.setNextIndex(cardNumber),
						group : null
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
			var cnst = new Constant();
			this.setPrevIndex = function(indexNumber){
				if(indexNumber == cnst.getCARD_NUMBERS()-1){
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

		/* UI */
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
					append(dom.insertionSortButton).
					append(dom.shuffleButton);
				cardSetter.set(dom.cards);
			}
		}

		function CardSetter(){
			var timer = new DelayTimer();

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
			var cnst = new Constant();
			var cardCreator = new CardCreator();
			var buttonCreator = new ButtonCreator();

			this.bubbleSortButton = buttonCreator.create("BubbleSort");
			this.insertionSortButton = buttonCreator.create("InsertionSort");
			this.shuffleButton = buttonCreator.create("Shuffle");
			this.cards = [];

			for(var cardNumber = 0; cardNumber < cnst.getCARD_NUMBERS(); cardNumber++){
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
			var insertionSort = new InsertionSort();
			var shuffle = new Shuffle();

			return {
				BubbleSort: bubbleSort.run,
				InsertionSort: insertionSort.run,
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

		var cards = new CardDataController();
		function CardDataController(){
			var cnst = new Constant();
			var doublyLinkedCardsCreator = new DoublyLinkedCardsCreator();
			var cards = doublyLinkedCardsCreator.create();

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
				
				for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
					indexList[i] = i;		
				}

				var randomIndexList = [];
				for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
					var randomIndex = random.getRandom(0,indexList.length-1);	
					randomIndexList[i] = indexList[randomIndex];
					indexList.splice(randomIndex,1);
				}

				for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
					if(i == 0){
						cards[ randomIndexList[i] ].prev = null;
					}else{
						cards[ randomIndexList[i] ].prev = randomIndexList[i-1];	
					}

					if(i == cnst.getCARD_NUMBERS() - 1){
						cards[ randomIndexList[i] ].next = null;
					}else{
						cards[ randomIndexList[i] ].next = randomIndexList[i+1];
					}
				}
			}

			this.getNumber = function(index){
				return cards[index].number;	
			}
			this.getNext = function(index){
				return cards[index].next;	
			}
			this.getPrev = function(index){
				return cards[index].prev;	
			}
			this.getGroup = function(index){
				return cards[index].group;
			}
			this.setGroup = function(index,groupName){
				cards[index].group = groupName;
			}
			this.resetGroup = function(){
				for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
					cards[i].group = null;
				}
			}
		}

		function CardMotion(){
			this.move = function(cardNumber,movement){
				$("#"+cardNumber).animate({"left":movement+"px"});
			}
			this.swap = function(currentIndex,prevIndex){
				var currentPosition = $( "#"+cards.getNumber(currentIndex) ).position();
				var prevPosition = $( "#"+cards.getNumber(prevIndex) ).position();

				this.move(cards.getNumber(currentIndex),prevPosition.left);
				this.move(cards.getNumber(prevIndex),currentPosition.left);
			}
			this.changeBackGround = function(target,color){
				$("#"+target).css({
					"background-color": color	
				});
			}
		}

		function Shuffle(){
			this.run = function(){
				var cardArranger = new CardArranger();
				var delayTime = 400;
				var eventController = new EventController(delayTime);

				eventController.enQueue( function(){cardArranger.arrange(cards,0)} );
				eventController.enQueue( cards.mix );
				eventController.enQueue( function(){cardArranger.arrange(cards,60)} );
				eventController.run();
			}	
		}
		
		function CardArranger(){
			var indexFinder = new IndexFinder();
			var motion = new CardMotion();

			this.arrange = function(cards,additionalMoveLength){
				var currentIndex = indexFinder.findFirst(cards);
				var nextIndex = cards.getNext(currentIndex);
				var moveLength = 0;
				while(true){
					motion.move(
						cards.getNumber(currentIndex),
						moveLength
					);
					if(nextIndex == null){break;}
					moveLength += additionalMoveLength;
					currentIndex = nextIndex;
					nextIndex = cards.getNext(currentIndex);
				}
			}
		}

		function BubbleSort(){
			this.run = function(){
				var cnst = new Constant();
				var delayTime = 410;
				var eventController = new EventController(delayTime);
				var motion = new CardMotion();
				var indexFinder = new IndexFinder();
				var oneStep = new BubbleSortOneStep();

				var currentIndex;

				for(var i = 0; i < cnst.getCARD_NUMBERS()-1; i++){
					eventController.enQueue( oneStep.setLastIndex );
					for(var j = 0; j < ((cnst.getCARD_NUMBERS()-1) - i); j++){
						eventController.enQueue( oneStep.excute );
					}
				}
				eventController.enQueue( function(){motion.changeBackGround(currentIndex,"white");} );
				eventController.run();

				function BubbleSortOneStep(){
					this.excute = function(){
						var prevIndex = cards.getPrev(currentIndex);

						if( cards.getNumber(currentIndex) < cards.getNumber(prevIndex) ){
							motion.swap(prevIndex,currentIndex);
							cards.insert(currentIndex,cards.getPrev(prevIndex),prevIndex);
						}else{
							motion.changeBackGround(currentIndex,"white");
							currentIndex = cards.getPrev(currentIndex);
							motion.changeBackGround(currentIndex,"yellow");
						}
					}	
					this.setLastIndex = function(){
						motion.changeBackGround(currentIndex,"white");
						currentIndex = indexFinder.findLast(cards);
						motion.changeBackGround(currentIndex,"yellow");
					}	
				}
			}
		}

		function InsertionSort(){
			this.run = function(){
				var cnst = new Constant();
				var delayTime = 410;
				var eventController = new EventController(delayTime);
				var motion = new CardMotion();
				var indexFinder = new IndexFinder();
				var oneStep = new InsertionSortOneStep();

				var insertionTarget;
				var nextInsertionTarget;
				var comparisonTarget;

				eventController.enQueue( oneStep.setInitialInsertionTarget );
				eventController.enQueue( oneStep.setInitialComparisonTarget );
				eventController.enQueue( oneStep.excute );
				eventController.run();

				function InsertionSortOneStep(){
					this.groupTogether = function(){
							
					}
					this.setInitialInsertionTarget = function(){
						insertionTarget = cards.getNext( indexFinder.findFirst(cards) );
						nextInsertionTarget = cards.getNext(insertionTarget);
						motion.changeBackGround(insertionTarget,"yellow");
					}
					this.setInsertionTarget = function(){
						insertionTarget = nextInsertionTarget;
						nextInsertionTarget = cards.getNext(insertionTarget);
						motion.changeBackGround(insertionTarget,"yellow");
					}
					this.setInitialComparisonTarget = function(){
						comparisonTarget = cards.getPrev(insertionTarget);
						motion.changeBackGround(comparisonTarget,"aqua");
					}
					this.setComparisonTarget = function(){
						comparisonTarget = cards.getPrev(comparisonTarget);
						motion.changeBackGround(comparisonTarget,"aqua");
					}
					this.excute = function(){
						if( cards.getNumber(comparisonTarget) > cards.getNumber(insertionTarget) ){
							motion.swap(insertionTarget,comparisonTarget);
							cards.insert(insertionTarget,null,comparisonTarget);
						}
						for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
							console.log(i + "”Ô–Ú");
							console.log( cards.getPrev(i) );
							console.log( cards.getNext(i) );
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
			var cnst = new Constant();
			this.findFirst = function(cards){
				var firstIndex;
				for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
					if(cards.getPrev(i) == null){
						firstIndex = i;
						break;	
					}
				}
				return firstIndex;
			}
			this.findLast = function(cards){
				var lastIndex;
				for(var i = 0; i < cnst.getCARD_NUMBERS(); i++){
					if(cards.getNext(i) == null){
						lastIndex = i;
						break;	
					}
				}
				return lastIndex;
			}
		}
	}
});
