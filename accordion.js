/**
 * Accordion - v1.1.0
 * Copyright 2021 Abel Brencsan
 * Released under the MIT License
 */

var Accordion = function(options) {

	'use strict';

	// Test required options
	if (typeof options.items == 'object') {
		for (var i = 0; i < options.items.length; i++) {
			if (typeof options.items[i].trigger !== 'object') throw 'Accordion item "trigger" option must be an object';
			if (typeof options.items[i].element !== 'object') throw 'Accordion item "element" option must be an object';
		}
	}
	else {
		throw 'Accordion "items" option must be an object';
	}

	// Default accordion instance options
	var defaults = {
		items: [],
		initialIndex: null,
		initCallback: null,
		destroyCallback: null,
		isOpenedClass: 'is-opened',
		isActiveClass: 'is-active'
	};

	// Extend accordion instance options with defaults
	for (var key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Accordion instance variables
	this.hasOpenedItem = false;
	this.isInitialized = false;

};

Accordion.prototype = function () {

	'use strict';

	var accordion = {

		/**
		 * Initialize accordion, open initial item when initial index is set. (public)
		 */
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				accordion.handleEvents.call(this, event);
			};
			for (var i = 0; i < this.items.length; i++) {
				this.items[i].trigger.addEventListener('click', this);
				this.items[i].trigger.setAttribute('aria-expanded','false');
				this.items[i].element.setAttribute('aria-hidden','true');
				this.items[i].isOpened = false;
				if (this.initialIndex === i) accordion.open.call(this, this.items[i]);
			}
			this.isInitialized = true;
			if (this.initCallback) this.initCallback.call(this);
		},

		/**
		 * Open given accordion item, set maximum height of its element. (public)
		 * @param item object
		 */
		open: function(item) {
			if (item.isOpened) return;
			item.trigger.classList.add(this.isActiveClass);
			item.trigger.setAttribute('aria-expanded','true');
			item.element.classList.add(this.isOpenedClass);
			item.element.setAttribute('aria-hidden','false');
			item.element.style.maxHeight = Array.prototype.reduce.call(item.element.childNodes, function(p, c) {return p + (c.offsetHeight || 0);}, 0) + 'px';
			item.isOpened = true;
			this.hasOpenedItem = true;
			if (item.openCallback) item.openCallback.call(this, item);
		},

		/**
		 * Close given accordion item, reset maximum height of its element. (public)
		 * @param item object
		 */
		close: function(item) {
			if (!item.isOpened) return;
			item.trigger.classList.remove(this.isActiveClass);
			item.trigger.setAttribute('aria-expanded','false');
			item.element.classList.remove(this.isOpenedClass);
			item.element.setAttribute('aria-hidden','true');
			item.element.style.maxHeight = '0px';
			item.isOpened = false;
			this.hasOpenedItem = false;
			if (item.closeCallback) item.closeCallback.call(this, item);
		},

		/**
		 * Recalculate maximum height of opened accordion item's element. Call this function when inner height has been possibly changed (window resize, breakpoint change, etc...). (public)
		 */
		recalcHeight: function() {
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].isOpened) this.items[i].element.style.maxHeight = Array.prototype.reduce.call(this.items[i].element.childNodes, function(p, c) {return p + (c.offsetHeight || 0);}, 0) + 'px';
			}
		},

		/**
		 * Close all accordion items. (private)
		 */
		closeAll: function() {
			for (var i = 0; i < this.items.length; i++) {
				accordion.close.call(this, this.items[i]);
			}
		},

		/**
		 * Handle events. (private)
		 * On trigger click: close accordion item if it is opened; otherwise open it and close all other accordion items.
		 * @param event object
		 */
		handleEvents: function(event) {
			if (event.type == 'click') {
				for (var i = 0; i < this.items.length; i++) {
					if (this.items[i].trigger.contains(event.target)) {
						event.preventDefault();
						if (this.items[i].isOpened) {
							accordion.close.call(this, this.items[i]);
						}
						else {
							accordion.closeAll.call(this);
							accordion.open.call(this, this.items[i]);
						}
					}
				}
			}
		},

		/**
		 * Destroy accordion. It removes all related classes and events. (public)
		 */
		destroy: function() {
			if (!this.isInitialized) return;
			accordion.closeAll.call(this);
			for (var i = 0; i < this.items.length; i++) {
				this.items[i].trigger.removeEventListener('click', this);
				this.items[i].trigger.removeAttribute('aria-expanded');
				this.items[i].element.removeAttribute('aria-hidden');
			}
			this.hasOpenedItem = false;
			this.isInitialized = false;
			if (this.destroyCallback) this.destroyCallback.call(this);
		}
	};

	return {
		init: accordion.init,
		open: accordion.open,
		close: accordion.close,
		recalcHeight: accordion.recalcHeight,
		destroy: accordion.destroy
	};

}();
