var jsdom = require('jsdom').jsdom;
document = jsdom( '<html/>' );
window = document.createWindow();
navigator = { userAgent: '' }
var assert = require('assert'),
    sinon = require('sinon'),
    util = require('util');

describe( 'App', function(){
  var app;

  beforeEach(function(done){
      app = require( '../src/app' );
      done();
  });
  describe('Dom related', function() {
      beforeEach(function(done){
          app.selector = sinon.stub();
          app.dom = sinon.stub();
          app.event = {
              on: sinon.stub()
          };
          app.action = {
              bind: function(){ return 'ACTION'; }
          }
          done();
      });
      it( 'fetchInput fetches input value using selector+dom', function( done ) {
          app.selector.returns( {} );
          app.dom.returns( { val: function(){ return '7'; } } );
          app.fetchInput( function(value) {
              assert.equal( value, '7' );
              done();
          });
      });
      it( 'writeOutput saves value using selector+dom', function( done ) {
          app.selector.returns( {} );
          var textFunc = sinon.spy();
          app.dom.returns( { text: textFunc } );
          app.writeOutput( 'XVI', function(response) {
              sinon.assert.calledWith( textFunc, 'XVI' );
              done();
          });
      });
      it( 'init sets up action function as event handler for button click', function(done) {
          app.selector.returns( [{}] );
          app.init( function() {
              sinon.assert.calledWith( app.event.on, {}, 'click', 'ACTION' );
              done();
          });
      });
  })
});
