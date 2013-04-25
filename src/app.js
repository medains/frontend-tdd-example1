var qwery = require('qwery'),
    bonzo = require('bonzo'),
    bean = require('bean');

var App = {
    selector: qwery,
    dom: bonzo,
    event: bean,

    action: function(e) {
        var self = this;
        self.fetchInput( function(value) {
            self.writeOutput( value, function(){
                console.log( "Action applied" );
            });
        });
        e.preventDefault();
    },
    init: function( callback ) {
        this.event.on( this.selector( '#convert' )[0], 'click', this.action.bind( this ) );
        callback();
    },
    fetchInput: function( callback /*value*/ ){
        callback( this.dom( this.selector('#field1') ).val() );
    },
    writeOutput: function( value, callback ){
        callback( this.dom( this.selector('#output') ).text( value ) );
    }
};

module.exports = App;
