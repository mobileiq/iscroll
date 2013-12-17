	
	// Custom code to handle pointer events
	_updatePointer : function(pointer) {
		var l = this._pointers.length,
			pointerId = pointer.pointerId;

		while(l>0) {
			if(this._pointers[(l-1)].pointerId === pointerId) {
				this._pointers[(l-1)] = pointer;
				return;
			}
			pointer.touches = this._pointers;
			l--;
		}
	},

	_removePointer : function(pointer) {
		var l = this._pointers.length,
			pointerId = pointer.pointerId;

		while(l > 0) {
			if(this._pointers[(l-1)].pointerId === pointerId) {
				this._pointers.splice((l-1), 1);
			}
			l--;
		}
		pointer.touches = this._pointers;
	},

	_addPointer : function(pointer) {
		if(this._pointers.length > 2) {
			pointer.touches = this._pointers;
			return;
		}
		this._pointers.push(pointer);
		pointer.touches = this._pointers;
	},


	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'MSPointerDown':
			case 'pointerdown':
			case 'mousedown':
				// Only start on the first one.
				if(utils.hasPointer) {
					this._addPointer(e);
				}

				this._start(e);
				
				// Check for the touches and then start
				if ( this.options.zoom && e.touches && e.touches.length > 1 ) {
					this._zoomStart(e);
				}
				break;
			case 'touchmove':
			case 'MSPointerMove':
			case 'mousemove':
			case 'pointermove':
				// Update the positions as necessary
				if(utils.hasPointer) {
					this._updatePointer(e);
				}

				if ( this.options.zoom && e.touches && e.touches[1] ) {
					this._zoom(e);
					return;
				}

				// Check to ensure that we have something in here (sometimes we can have an empty array)
				if(this._pointers.length === 1 || !utils.hasPointer) {
					this._move(e);	
				}
				
				break;
			case 'touchend':
			case 'MSPointerUp':
			case 'pointerup':
			case 'mouseup':
			case 'touchcancel':
			case 'MSPointerCancel':
			case 'pointercancel':
			case 'mousecancel':
				if(utils.hasPointer) {
					this._removePointer(e);	
				}
				
				if ( this.scaled ) {
					this._zoomEnd(e);
					return;
				}
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'DOMMouseScroll':
			case 'mousewheel':
				if ( this.options.wheelAction == 'zoom' ) {
					this._wheelZoom(e);
					return;	
				}
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
		}
	}

};