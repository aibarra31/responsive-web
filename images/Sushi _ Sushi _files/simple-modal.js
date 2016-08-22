//version 1.0.1
$.fn.simpleModal = function(options) {

	var $group = $(this);

	$(this).each(function(i){

		var cmp = {
			el:this,
			group:$group.get(),
			index:i,
			$activeModal:null,

			options:{
				target:'body',
				onBeforeOpen:function(modal){},
				onOpen:function(modal){},
				onBeforeClose:function(modal){},
				onClose:function(modal){},
				content:function(el){
					return 'No content has been set';
				},
				nextPrev:true,
				nextButton:'&lt;',
				prevButton:'&gt;',
				closeButton:'x'
			},

			init:function(el,options){
				$.extend(this.options,options);

				$(this.el).click($.proxy(function(e){
					e.preventDefault();
					this.open();
				},this));
			},

			getModal:function(){
				var $modal = $('<div class="modal" style="display:none;"><div class="modal-inner-wrapper"><div class="modal-content-wrapper"><div class="modal-content"></div></div></div></div>');
				var $close = $('<div class="modal-close">'+this.options.closeButton+'</div>');
				
				if(this.options.nextPrev){
					var $next = $('<div class="modal-next-wrapper"><div class="modal-next"><div class="modal-next-button-wrapper"><div class="modal-next-button">'+this.options.nextButton+'</div></div></div></div>');
					var $prev = $('<div class="modal-prev-wrapper"><div class="modal-prev"><div class="modal-prev-button-wrapper"><div class="modal-prev-button">'+this.options.prevButton+'</div></div></div></div>');
				}
				
				$modal.find('.modal-content').html(this.options.content(this.el)).append($next,$prev,$close);

				if(this.options.nextPrev){
					$prev.find('.modal-prev-button').click($.proxy(function(){
						this.goToPrev();
					},this));

					$next.find('.modal-next-button').click($.proxy(function(){
						this.goToNext();
					},this));
				}

				$close.click($.proxy(function(){
					this.close();
				},this));

				$modal.find('.modal-content').mousedown($.proxy(function(){
					this.closable = false;
				},this));

				$modal.click($.proxy(function(){
					if(this.closable){
						this.close();
					}
					this.closable = true;
				},this));

				return $modal;
			},


			open:function(){
				var $modal = this.getModal();
				//run onBeforeOpen event						
				this.options.onBeforeOpen($modal.get());

				//append modal to DOM
				$(this.options.target).append($modal);
				$modal.fadeIn(100);

				this.$activeModal = $modal;

				//run onOpen event
				this.options.onOpen($modal.get());
			},


			close:function(){
				//run onBeforeClose event
				this.options.onBeforeClose(this.$activeModal);

				this.$activeModal.fadeOut(100,function(){
					$(this).remove();
				});

				//run onClose event
				this.options.onClose();
			},


			goToNext:function(){
				this.close();
				var $nextModal = $(this.group).eq(this.index + 1).length ? $(this.group).eq(this.index + 1) : $(this.group).eq(0);
				$nextModal.trigger('click');
			},

			goToPrev:function(){
				this.close();
				var $group = $(this.group);
				var $nextModal = $group.eq(this.index - 1).length ? $group.eq(this.index - 1) : $group.eq($group.length - 1);
				console.log(this.index - 1);
				$nextModal.trigger('click');
			},

		};

		cmp.init(this,options);
	});

};