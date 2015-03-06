/*
Author: Cheemi
Blog URL: http://cheemi.com
*/
(function(){
 
	var overlay=$('<div id="galleryOverlay">'),
		sliderHolder=$('<div id="sliderHolder">'),
		prevArrow=$('<a id="prevArrow"></a>'),
		nextArrow=$('<a id="nextArrow"></a>');
			 
	var Slider=function(){
		this.index,this.len,this.items,this.hoders;
		var _=this;
 
		this.init=function(allitems,opt){
			_.items=allitems;
			_.len=allitems.length;
			imageContainers=$([]);
			//append overlay to the body
			overlay.hide().appendTo('body');
			sliderHolder.appendTo(overlay);
			
			this.items.each(function(index){
				  imageContainers=imageContainers.add($('<div class="imageContainer">'));	
			});
 
			this.items.on("click",function(e){
				e.preventDefault();
				 
				_.index=allitems.index(this);
				//show the overlay
				_.showOverlay(_.index);
				_.offsetSlider(_.index);
				//show the correct image
				_.showImage(_.index);
		
			});	
			 
			
			if(!("ontouchstart" in window)){
			 
				overlay.append(prevArrow).append(nextArrow);
				nextArrow.click(function(e){
					e.preventDefault();
					_.showNext();
					 
				});
				
				prevArrow.click(function(e){
					e.preventDefault();
					_.showPrevious();
					 
				});
				 
			  
			} 
				// close the overlay
			sliderHolder.append(imageContainers).on("click",function(e){
				 
				if(!$(e.target).is('img')){
					_.hideOverlay();	
				}
				
			});	
			 
 
			 var lastScale=0,
			 screenWidth=window.screen.width;
			 var hammer = $(".imageContainer").hammer({
			    prevent_default: true,
			    scale_treshold: 0,
			    drag_horizontal: true,
			    drag_vertical: true,
			    drag_min_distance: 0
			});
			  hammer.bind('transformstart', function (e) {
				  e.preventDefault();
			     dragview.OnDragStart(e);
			  	
			  });
			 hammer.bind('transform', function (e) {
 				e.preventDefault();
	  		var touchA=e.originalEvent.touches[0];
					_.setScale([e.position.x,e.position.y],e.scale );
					lastScale=e.scale;
					dragview.OnDrag(e);
				  dragview.WatchDrag();
 
			});
			 
			   hammer.bind('transformend', function (e) {
			   // _.setScale([0,0],e.scale*0.8,true );
			  });
			    hammer.bind('doubletap', function (e) {
					e.preventDefault();
			  _.setScale([0,0],1,true );
			  	
			  });
			   hammer.bind('tap', function (e) {
					e.preventDefault();
					
			  		if(!$(e.target).is('img')){
					_.hideOverlay();	
				}
			  	
			  });
			  hammer.bind('swipe',function(e){
				  if(e.direction=="left"){
					   _.showNext();
					     
				  }
				  else if(e.direction=="right"){
					  _.showPrevious();
					   
				  }
					 
			  });
			   if(("ontouchstart" in window)){
			  var dragview = new DragView($('.c_active img'));
			  
 			hammer.bind('drag', function (e) {
				 
			     dragview.OnDrag(e);
				 
				  dragview.WatchDrag(lastScale);
				  
				  
				  
				 
			});
			hammer.bind('dragstart', function (e) {
				 e.preventDefault();
			     dragview.OnDragStart(e);
				 
				   
			}); 
			hammer.bind('dragend', function (e) {
				 e.preventDefault();
				 
			     if(e.direction=="left"&&e.distance>Math.round(screenWidth/4*3)){
					 _.showNext();
				 }else if(e.direction=="right"&&e.distance>Math.round(screenWidth/4*3)){
					_.showPrevious(); 
				 }else{
					$('.c_active img').css("left","0px");	 
				 }
				 
				   
			});
			  }
		};
	   
		//scale element
		this.setScale=function(center,scale, animate){
			var  el=document.getElementsByClassName('c_active');
				 el=el[0];
			if(el!=null){
			if(animate) {
				  el.style.webkitTransition = '-webkit-transform 0.2s ease-out';
			 
			} else {
				  el.style.webkitTransition = 'none';
				  lastScale=0;
			}
			var tx = center[0] + scale * (0 - center[0]);
			var ty = center[1] + scale *  (0 - center[1]);
			ty = ty - 0;
			  el.style.webkitTransform = 'matrix3d('+scale+', 0, 0, 0, 0, '+scale+', 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
			  //'matrix3d('+scale+',0,0,0,0,'+scale+',0,0,0,0,1,0,'+tx+','+ty+',0,1)';
			 }
		};
		//Show the overlay
		this.showOverlay=function(){
			overlay.show();
			setTimeout(function(){
				overlay.addClass("visible");	
			},80);	
		};
		//hide the overlay
		this.hideOverlay=function(){
			overlay.hide().removeClass("visible");	
		};
		//set the slider
		this.offsetSlider=function(index){ 
 
			sliderHolder.css("left",(-index*100)+'%');
				 
			 
		};
		//show the correct image
		this.showImage=function(index){
			
			if(index<0||index>_.len-1){
				return ;
			};
			
			 
			 _.loadImage(_.items.eq(index).attr('href'), function(){
				imageContainers.removeClass('c_active'); 
			imageContainers.eq(index).addClass('c_active').html(this);
			});
	 		
		};
 		
		this.loadImage=function(src, callback){
			var img = $('<img>').on('load', function(){
				callback.call(img);
			});
		
			img.attr('src',src);
		};
		//show the next image
		this.showNext=function(){
			  _.setScale([0,0],1,true );
			if(_.index+1<_.len){
				_.index++;
				 
				 this.offsetSlider(_.index);
				 
				this.showImage(_.index);
				 
			}
			else{
				//handler the last image
				sliderHolder.addClass('rightEnd');
				setTimeout(function(){
					sliderHolder.removeClass('rightEnd');
				},500);
			}
		};
		//show the previous image
		this.showPrevious=function(){
			_.setScale([0,0],1,true );
			if(_.index>0){
				_.index--;
				this.offsetSlider(_.index);
				this.showImage(_.index);
			}
			else{
				//handler the first image
				sliderHolder.addClass('leftEnd');
				setTimeout(function(){
					sliderHolder.removeClass('leftEnd');
				},500);
			}
		};
	};	
	
	$.fn.cswipe=function(o){
		(new Slider).init($(this),o);
	};
	
	function DragView(target){
		  this.target = target[0];
			    this.drag = [];
			    this.lastDrag = {};

			    this.WatchDrag = function (lastScale) {
					 
			        if ($('.c_active img').length == 0) return true;
  
			        if (!this.drag.length) {
			            return;
			        }
					 
			        for (var d = 0; d < this.drag.length; d++) {
			            var x_offset = -(this.lastDrag.x - this.drag[d].pos.pageX);
			            var y_offset = -(this.lastDrag.y - this.drag[d].pos.pageY);

						  if(lastScale>0){
						 $(".c_active img").css("top",y_offset + "px");
						 $('.c_active img').css("left",x_offset + "px");
				 } 	 
						 
			        }
			    }
				
			    this.OnDragStart = function (event) {
					
			        if ($('.c_active img').length == 0) return;
			         var touches = event.originalEvent.touches;
					 
			            this.lastDrag = {
							"x":touches[0].pageX,
			               "y":touches[0].pageY
			            };
			            return; 
			        
					 
			    };

			    this.OnDrag = function (event) {
					
			        if ($('.c_active img').length == 0) return;
					 
			        this.drag = [];
			        var touches = event.originalEvent.touches;
					 
			        for (var t = 0; t < touches.length; t++) {
			            this.drag.push({
			                pos: touches[t]
			            });
			        }
					 
			    };
				 
	};
})(jQuery);