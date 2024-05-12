/**
 * Accordion
 * Copyright 2024 Abel Brencsan
 * Released under the MIT License
 */
const Accordion = function(options) {

	'use strict';

	// Test required options
	if (options.items.constructor.name == 'Array') {
		for (let i = 0; i < options.items.length; i++) {
			if (typeof options.items[i].trigger !== 'object') {
				throw 'Accordion item "trigger" option must be an `Element`';
			}
			if (typeof options.items[i].element !== 'object') {
				throw 'Accordion item "element" option must be an `Element`';
			}
		}
	}
	else {
		throw 'Accordion "items" option must be an `Array`';
	}

	// Default accordion instance options
	let defaults = {
		items: [],
		initialIndex: null,
		initCallback: null,
		destroyCallback: null,
		isOpenedClass: 'is-opened',
		isActiveClass: 'is-active'
	};

	// Extend accordion instance options with defaults
	for (let key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Accordion instance variables
	this.hasOpenedItem = false;
	this.isInitialized = false;
};

Accordion.prototype = function () {

	'use strict';

	let accordion = {

		/**
		 * Initialize accordion.
		 * Open initial item when initial index is set.
		 * 
		 * @public
		 */
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				accordion.handleEvents.call(this, event);
			};
			for (let i = 0; i < this.items.length; i++) {
				this.items[i].trigger.addEventListener('click', this);
				this.items[i].trigger.setAttribute('aria-expanded','false');
				this.items[i].element.setAttribute('aria-hidden','true');
				this.items[i].isOpened = false;
				if (this.initialIndex === i) {
					accordion.open.call(this, this.items[i]);
				}
			}
			this.isInitialized = true;
			if (this.initCallback) this.initCallback.call(this);
		},

		/**
		 * Open given accordion item and set maximum height of its element.
		 * 
		 * @public
		 * @param {object} item
		 */
		open: function(item) {
			if (item.isOpened) return;
			item.trigger.classList.add(this.isActiveClass);
			item.trigger.setAttribute('aria-expanded','true');
			item.element.classList.add(this.isOpenedClass);
			item.element.setAttribute('aria-hidden','false');
			item.element.style.maxHeight = accordion.calcHeight.call(this, item.element);
			item.isOpened = true;
			this.hasOpenedItem = true;
			if (item.openCallback) item.openCallback.call(this, item);
		},

		/**
		 * Close given accordion item and reset maximum height of its element.
		 * 
		 * @public
		 * @param {object} item
		 */
		close: function(item) {
			if (!item.isOpened) return;
			item.trigger.classList.remove(this.isActiveClass);
			item.trigger.setAttribute('aria-expanded','false');
			item.element.classList.remove(this.isOpenedClass);
			item.element.setAttribute('aria-hidden','true');
			item.element.style.maxHeight = '';
			item.isOpened = false;
			this.hasOpenedItem = false;
			if (item.closeCallback) item.closeCallback.call(this, item);
		},

		/**
		 * Recalculate maximum height of opened accordion item's element.
		 * Call this function when inner height has been changed.
		 * 
		 * @public
		 */
		recalcHeight: function() {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].isOpened) {
					this.items[i].element.style.maxHeight = accordion.calcHeight.call(this, this.items[i].element);
				}
			}
		},

		/**
		 * Get maximum height of given element in pixels as a string.
		 * 
		 * @private
		 * @param {Element} item
		 * @return {string}
		 */
		calcHeight: function(elem) {
			return elem.scrollHeight + 'px';
		},

		/**
		 * Close all accordion items.
		 * 
		 * @private
		 */
		closeAll: function() {
			for (let i = 0; i < this.items.length; i++) {
				accordion.close.call(this, this.items[i]);
			}
		},

		/**
		 * Handle events.
		 * On trigger click: Close current accordion and close all other ones.
		 * 
		 * @private
		 * @param {Event} event
		 */
		handleEvents: function(event) {
			if (event.type == 'click') {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].trigger.contains(event.target)) {
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
		 * Destroy accordion. It removes all related classes and events.
		 * 
		 * @public
		 */
		destroy: function() {
			if (!this.isInitialized) return;
			accordion.closeAll.call(this);
			for (let i = 0; i < this.items.length; i++) {
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
