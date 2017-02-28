/***********************************************

タイトル：Yslider
製作者：yama3japan
リリース日：2015/5/11
最終更新日：2015/5/11

************************************************/

$(function(){
	//設定
	var setMainSlider = ".form-slide"; // スライド要素
	var slideSpped = 500; // スライドスピード
	var nextSwitch = ".next-switch"; // スライドを進めるスイッチ
	var prevSwitch = ".prev-switch"; // スライドを戻すスイッチ
	var pagenation = ".pagenation"; // ページャ
	var nextWord = "次へ"; // ページャ進むテキスト
	var prevWord = "前へ"; // ページャ戻るテキスト
	
	//動き部分
	$(setMainSlider).each(function(){
		$(this).children('div').wrapAll('<div class="slider-wrapper"><div class="slide-move"></div></div>');
		
		var scrollCount = 1;
		
		$(window).load(function(){
			
			sizeAdjust();
			pageArrow();
			
			function sizeAdjust() {	
				var slideCount = $(".slide-move").children().length; // スライド数を取得
				var slideWidth = $(".slider-wrapper").width(); // 大枠の幅
				var childElementWidth = slideCount * slideWidth; // スライド枠の幅
			
				if (scrollCount == 1) {
					var setLeft = 0;
				} else {
					var setLeft = (scrollCount - 1) * slideWidth;
				}
				
				$(".slider-wrapper").css({
					width: "100%",
					position: "relative",
					overflow: "hidden"
				});
				$(".slide-move").css({
					width: childElementWidth,
					position: "relative",
					left: -(setLeft),
					overflow: "hidden"
				});
				$(".slide-move").children().css({
					float: "left",
					width: slideWidth
				});
			}

			$(".slide-move").children().css({
				visibility: "hidden"
			});
			$(".slide-move").children(":first-child").css("visibility","visible");
				
			//次へボタンの動作
			$(nextSwitch).click(function() {
				nextMove();
			});
			function nextMove() {
				$(".slide-move:not(:animated)").each(function() {
					scrollCount ++;
					var slideWidth = $(".slider-wrapper").width(); // 大枠の幅
					var moveLength = slideWidth; // スライドさせる距離
					var visibleSlide = $(".slide-move").children().eq(scrollCount - 1) // 表示してるスライド
					$(".slide-move:not(:animated)").animate({ left: "-=" + (moveLength)},slideSpped);
					$(".slide-move").children().css("visibility","visible");
					setTimeout(function() {
						$(".slide-move").children().not(visibleSlide).css("visibility","hidden");
					},slideSpped);
					pageArrow();
					$(".pagenation-wrapper a.active").next("a").addClass("active").siblings().removeClass("active");
				});
			}
			
			//戻るボタンの動作
			$(prevSwitch).click(function() {
				prevMove();
			});
			function prevMove() {
				$(".slide-move:not(:animated)").each(function() {
					scrollCount --;
					var slideWidth = $(".slider-wrapper").width(); // 大枠の幅
					var moveLength = slideWidth; // スライドさせる距離
					var visibleSlide = $(".slide-move").children().eq(scrollCount - 1) // 表示してるスライド
					$(".slide-move:not(:animated)").animate({ left: "+=" + (moveLength)},slideSpped);
					$(".slide-move").children().css("visibility","visible");
					setTimeout(function() {
						$(".slide-move").children().not(visibleSlide).css("visibility","hidden");
					},slideSpped);
					pageArrow();
					$(".pagenation-wrapper a.active").prev("a").addClass("active").siblings().removeClass("active");
				});
			}
			
			//ディスプレイサイズ変更時の動作
			$(window).resize(function() {
				sizeAdjust();
			});

			//フリック操作
			var box = $(".slide-move")[0];
			box.addEventListener("touchstart", touchHandler, false);
			box.addEventListener("touchmove", touchHandler, false);
			box.addEventListener("touchend", touchHandler, false);
			
			function touchHandler(e) {
				var touch = e.touches[0];
				if (e.type == "touchstart"){
					startX = touch.pageX;
				}
				if (e.type == "touchmove"){
					e.preventDefault();
					curX = touch.pageX;
				}
				if (e.type == "touchend"){
					if (startX < curX - 50) { //右へフリック
						if (scrollCount == 1) {
							//alert("これ以上戻れません")
						} else {
							prevMove();
						}
					} else if (startX > curX + 50) { //左へフリック
						if (scrollCount == $(".slide-move").children().length) {
							//alert("これ以上進めません")
						} else {
							nextMove();
						}
					} 
				}
			}

			
			//ページャ設定
			var prevSwitchClass = prevSwitch.replace("\.","");
			var nextSwitchClass = nextSwitch.replace("\.","");
			var agent = navigator.userAgent;
			if (agent.search(/Android 2./) != -1){ //Android2系対応
				$(pagenation).append('<div class="pagenation-wrapper"><span class="slide-btn ' + prevSwitchClass +'" id="prev-arrow"><span class="list-arrow-mark oldDroid reverse"></span>'+ prevWord +'</span><span class="slide-btn ' + nextSwitchClass + '" id="next-arrow"><span class="list-arrow-mark oldDroid"></span>'+ nextWord +'</span></div>')
			} else{
				$(pagenation).append('<div class="pagenation-wrapper"><span class="slide-btn ' + prevSwitchClass +'" id="prev-arrow"><span class="list-arrow-mark reverse"></span>'+ prevWord +'</span><span class="slide-btn ' + nextSwitchClass + '" id="next-arrow"><span class="list-arrow-mark"></span>'+ nextWord +'</span></div>')
			};
			
				//左右の矢印
				$("#prev-arrow").hide()
				function pageArrow() {
					var slideCount = $(".slide-move").children().length; // スライド数を取得
					if (scrollCount == 1) { // 初めのスライド
						$("#prev-arrow").hide()
						$("#next-arrow").show()
					} else if(scrollCount == slideCount) { // 最後のスライド
						$("#prev-arrow").show()
						$("#next-arrow").hide()
					} else { //それ以外
						$("#prev-arrow").show()
						$("#next-arrow").show()
					}
				}
				
				//ページャアイコン
				$(".slide-move").children().each(function(){ // スライドの数だけページャアイコン生成
					$(".pagenation-wrapper").append('<a href="javascript:void(0);"></a>')
				});
				$(".pagenation-wrapper a:first").each(function(){ // 最初のアイコンにclass追加
					$(this).addClass("active")
				});
				$(".pagenation-wrapper a").click(function(){ // ページャクリックでスライド移動
					var connectCont = $(".pagenation-wrapper a").index(this); // 0 START
					var slideWidth = $(".slider-wrapper").width(); // 大枠の幅
					var moveLength = slideWidth * connectCont; // スライドさせる距離
					scrollCount = connectCont + 1;
					var visibleSlide = $(".slide-move").children().eq(scrollCount - 1) // 表示してるスライド
					$(".slide-move:not(:animated)").animate({ left: "-" + (moveLength)},slideSpped);
					$(".slide-move").children().css("visibility","visible");
					setTimeout(function() {
						$(".slide-move").children().not(visibleSlide).css("visibility","hidden");
					},slideSpped);
					$(".pagenation-wrapper a").removeClass("active");
					$(this).addClass("active");
					pageArrow()
				});
				$("#prev-arrow").click(function(){ // 戻る←ボタンクリックでスライド移動
					prevMove();
				});
				$("#next-arrow").click(function(){ // 進む→ボタンクリックでスライド移動
					nextMove();
				});
		});
	});	
});