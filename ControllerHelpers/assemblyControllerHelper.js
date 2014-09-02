var assemblyCtrlHelper = function(model_linecount){
    this.displayProperties = {lineindex: 0, linecount: 0, total: model_linecount};
    this.scrollbarProperties = {buffer:0, ydown: 0, mousedown:false, startpos: 0, endpos: 0};
    //UPDATING WHEN RESIZING
    this.updateProperties = function(){
        var font_height = parseInt($('.lineviewer').css('font-size'), 10);
        var height = parseInt($('.lineviewer').css('height'), 10);
        this.displayProperties.linecount = Math.ceil(height / font_height);
        this.scrollbarProperties.endpos = parseInt($('.lineviewer-nav').css('height')) - parseInt($('.lineviewer-up').css('height')) - parseInt($('.lineviewer-down').css('height')) - parseInt($('.lineviewer-button').css('height'));
        this.scrollbarProperties.startpos = parseInt($('.lineviewer-up').css('height'));
    };
    //FUNCTIONS FOR SCROLL/CLICKUP/CLICKDOWN
    this.adjustLineIndex= function(delta) {
        var index = this.displayProperties.lineindex + delta;
        if(index < 0) {
            this.displayProperties.lineindex = 0;
        }
        else if(index > (this.displayProperties.total - this.displayProperties.linecount)) {
            this.displayProperties.lineindex = this.displayProperties.total - this.displayProperties.linecount;
        }
        else{
            this.displayProperties.lineindex = index;
            this.scrollbarMove_ScrollClick(delta);
        }
    };
    this.scrollUpDown =  function(event) {
        this.adjustLineIndex(Math.round(-event.originalEvent.wheelDelta/20));
    };
    //FUNCTIONS FOR THE SCROLL BAR
    this.scrollbarMouseUp = function(event){
        this.scrollbarProperties.buffer = this.scrollbarProperties.buffer + event.pageY - this.scrollbarProperties.ydown;
        if(this.scrollbarProperties.buffer < 0){
            this.scrollbarProperties.buffer = 0;
        }
        else if(this.scrollbarProperties.buffer > this.scrollbarProperties.endpos){
            this.scrollbarProperties.buffer = this.scrollbarProperties.endpos;
        }
        this.scrollbarProperties.mousedown = false;
        this.displayProperties.lineindex = Math.floor(this.scrollbarProperties.buffer * (this.displayProperties.total-this.displayProperties.linecount) / this.scrollbarProperties.endpos);
    };
    this.scrollbarMouseDown = function(event){
    	this.scrollbarProperties.ydown = event.pageY;
        this.scrollbarProperties.mousedown = true;
    };
    this.scrollbarMouseMove = function(event){
        if(this.scrollbarProperties.mousedown){
            var pos = (this.scrollbarProperties.buffer + event.pageY - this.scrollbarProperties.ydown);;
            if((0 < pos) && (pos < this.scrollbarProperties.endpos)){
                $('.lineviewer-button').css({top:this.scrollbarProperties.startpos+pos});
            }
        }
    };
    //Effects from scrolling and clicking up/down impacting the scrollbar
    this.scrollbarMove_ScrollClick = function(number_of_lines){
    	var change = this.scrollbarProperties.endpos * number_of_lines / this.displayProperties.total;
        this.scrollbarProperties.buffer = this.scrollbarProperties.buffer + change;
    };
}