var qwery = require('qwery'),
    bonzo = require('bonzo'),
    bean = require('bean');

function App() {
}

App.selector= qwery;
App.dom= bonzo;
App.event= bean;

function checkDef( val ) {
    if( val === undefined ) {
        throw new Error( 'Number out of range' );
    }
}
function _doConvert( arabic, single, five, ten ) {
    var i = parseInt( arabic, 10 );
    switch( i ) {
        case 1: return single;
        case 2: return single + single;
        case 3: return single + single + single;
        case 4: checkDef( five ); return single + five;
        case 5: checkDef( five ); return five;
        case 6: checkDef( five ); return five + single;
        case 7: checkDef( five ); return five + single + single;
        case 8: checkDef( five ); return five + single + single + single;
        case 9: checkDef( ten ); return single + ten;
        case 0: return "";
    }
    if( isNaN(i) || i+"" != arabic+"" )
    {
        throw new Error( 'Cannot convert' );
    }
    throw new Error( 'Number out of range' );
}
App.convertArabicToRoman = function(arabic){
    try{
    var thousands = _doConvert( Math.floor(arabic / 1000), "M" );
    arabic = arabic % 1000;
    var hundreds = _doConvert( Math.floor(arabic / 100), "C", "D", "M" );
    arabic = arabic % 100;
    var tens = _doConvert( Math.floor(arabic / 10), "X", "L", "C" );
    arabic = arabic % 10;
    return thousands + hundreds + tens + _doConvert( arabic, "I", "V", "X" );
    } catch( e ) {
        return e.message;
    }
}
App.action= function(e) {
        var self = this;
        self.fetchInput( function(value) {
            var ret = self.convertArabicToRoman( value );
            self.writeOutput( ret, function(){});
        });
        e.stop();
    };
App.init= function( callback ) {
        this.event.on( this.selector( '#convert' )[0], 'click', this.action.bind( this ) );
        callback();
    };
App.fetchInput= function( callback /*value*/ ){
        callback( this.dom( this.selector('#field1') ).val() );
    };
App.writeOutput= function( value, callback ){
        callback( this.dom( this.selector('#output') ).text( value ) );
    };

module.exports = App;
