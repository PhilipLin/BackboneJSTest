var LineViewerModel = Backbone.Model.extend({
	defaults: {
      lines : [],
      //Because i would need to destroy and recreate the list using set to trigger 'change' event
      //I use this setHelper to trigger the 'change' event, so I can save memory/space
      setHelper: true
    },
    initialize: function(lines){
        this.set('lines',lines);
    },
    getLines: function(){
    	return this.get('lines');
    },
    getLine: function(index) {
		return this.get('lines')[index];
	},
	setLine: function(index,value) {
		this.get('lines')[index] = value;
		this.set('setHelper', !this.get('setHelper'));//false to true, true to false
	},
	getLineCount: function() {
		return this.get('lines').length;
	},
	randomChange: function(){
	    setInterval($.proxy(function(){
	    	this.setLine(10, Math.random());
	    }, this), 1000);
	}
});




