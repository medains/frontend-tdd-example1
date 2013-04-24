var App  = require( '../scripts/app' ),
    thing = require( '../scripts/thing' ),
    sinon = require( 'sinon' ),
    assert = require( 'assert' ),
    util = require( 'util' );

describe( 'App', function(){
    it( 'returnFalse', function() {
        sinon.stub(thing, "specialFunc").returns(5);
        assert.ok( !App.returnFalse() );
    });
});
