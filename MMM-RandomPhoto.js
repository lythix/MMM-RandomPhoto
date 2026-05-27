/* global Module */

/* Magic Mirror
 * Module: MMM-RandomPhoto
 *
 * By Diego Vieira <diego@protos.inf.br>
 * ICS Licensed.
 */

Module.register("MMM-RandomPhoto",{
	defaults: {
		opacity: 0.3,
		animationSpeed: 500,
		updateInterval: 60,
		url: 'https://unsplash.it/1920/1080/?random'
	},

	start: function() {
		this.currentSlot = 1;
		this.scheduleNextLoad(0);
	},

	scheduleNextLoad: function(delayMs) {
		var self = this;
		setTimeout(function() {
			self.load();
		}, delayMs);
	},

	load: function() {
		var self = this;
		var nextDelay = self.config.updateInterval * 1000;
		var activeSelector = self.currentSlot === 1 ? '#mmm-photos-placeholder1' : '#mmm-photos-placeholder2';
		var inactiveSelector = self.currentSlot === 1 ? '#mmm-photos-placeholder2' : '#mmm-photos-placeholder1';

		var url = self.config.url + (self.config.url.indexOf('?') > -1 ? '&' : '?') + (new Date().getTime());
		var img = new Image();

		img.onload = function() {
			$(inactiveSelector)
				.stop(true, true)
				.attr('src', url)
				.css('opacity', 0)
				.animate({
					opacity: self.config.opacity
				}, self.config.animationSpeed);

			$(activeSelector)
				.stop(true, true)
				.animate({
					opacity: 0
				}, self.config.animationSpeed);

			self.currentSlot = self.currentSlot === 1 ? 2 : 1;
			self.scheduleNextLoad(nextDelay);
		};

		img.onerror = function() {
			self.scheduleNextLoad(nextDelay);
		};

		img.src = url;
		
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = '<img class="fit-screen" id="mmm-photos-placeholder1" style="opacity: 0; position: absolute" /><img class="fit-screen" id="mmm-photos-placeholder2" style="opacity: 0; position: absolute" />'; // Add class 'fit-screen'
		return wrapper;
	},
	getScripts: function() {
		return [
			this.file('node_modules/jquery/dist/jquery.min.js')
		]
	},
	getStyles: function() {
		return [
			this.file('MMM-RandomPhoto.css') // Reference the CSS file
		]
	}
});
