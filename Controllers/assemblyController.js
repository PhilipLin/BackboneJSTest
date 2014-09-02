//CONTROLLER DEFINITION
var assemblyCtrl = Backbone.View.extend({

    initialize: function(){
        this.viewData = {content : [], scrollbar: 20};//Data that gets rendered, default values
        //Reading in View
        $.get('Views/assemblyView.html', $.proxy(function(view){

            this.view = view;
            this.$el.html(_.template(this.view, this.viewData));//so I can select class attributes in render()
            this.helper = new assemblyCtrlHelper(this.model.getLineCount());//NEW HELPER that has functions we use for event handling/others
            this.helper.updateProperties();//initializing
            $('html').css('overflow', 'hidden');//disables scrolling may differ depending on view
            this.reSize();//listen for resizing of the window, (MUCH FASTER THAN ADDING IT TO EVENTS)
            this.render();//render first and then listen for changes
            this.listenTo(this.model, 'change', this.render); //whenever model changes fire event

        },this), 'text');

    },
    render: function(){
        this.viewData = {
            content: this.model.getLines().slice(this.helper.displayProperties.lineindex, this.helper.displayProperties.lineindex+this.helper.displayProperties.linecount), 
            start: this.helper.displayProperties.lineindex,
            scrollbar: this.helper.scrollbarProperties.startpos + this.helper.scrollbarProperties.buffer,
        };
        this.$el.html(_.template(this.view, this.viewData));
    },
    events: {
        'click .lineviewer-down': 'clickDown',
        'click .lineviewer-up': 'clickUp',
        'mousewheel .lineviewer-content': 'scrollUpDown',
        'mousemove': 'scrollbarMouseMove',
        'mouseup': 'scrollbarMouseUp',
        'mousedown .lineviewer-button': 'scrollbarMouseDown'
    },
    //RESIZING LISTENER
    reSize: function() {
        $( window ).resize($.proxy(function() {
            this.helper.updateProperties();//re-initializing properties for windowsize change
            this.render();
        }, this));
    },
    //FUNCTIONS MODIFYING DISPLAY PROPERTIES
    clickUp: function() {
        this.helper.adjustLineIndex(-1);
        this.render();
    },
    clickDown: function(event) {
        this.helper.adjustLineIndex(1);
        this.render();
	},
    scrollUpDown: function(event) {
        this.helper.scrollUpDown(event);
        this.render();
    },
    //FUNCTIONS MODIFYING SCROLLBAR PROPERTIES
    scrollbarMouseUp: function(event){
        if(this.helper.scrollbarProperties.mousedown){
            this.helper.scrollbarMouseUp(event);
            this.render();
        }
    },
    scrollbarMouseDown: function(event){
        this.helper.scrollbarMouseDown(event);
    },
    scrollbarMouseMove: function(event){
        this.helper.scrollbarMouseMove(event);
    }
});
//CREATE MODEL AND THEN SEND IT INTO THE CONTROLLER WHICH RENDERS IT TO THE VIEW
$.ajax('bushbio.txt', {
    accepts: 'text/plain'
}).done($.proxy(function(file) {
    var lineviewerModel = new LineViewerModel(file.split("\n"));
    lineviewerModel.randomChange();//Random Change
    var start = new assemblyCtrl({ el: $("#spa_view"), model: lineviewerModel});
}, this));






