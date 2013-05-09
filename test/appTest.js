var jsdom = require('jsdom').jsdom;
document = jsdom( '<html/>' );
window = document.createWindow();
navigator = { userAgent: '' }
var assert = require('assert'),
    sinon = require('sinon'),
    util = require('util');
var app = require('../src/app');

describe( 'App', function(){
  afterEach(function(){
      for( element in app ) {
        if( app[element].restore ) {
            app[element].restore();
        }
      }
  });
  describe('Convert', function() {
      it( 'returns errors', function(){
          var pass = true;
          try {
              app.convertArabicToRoman( '4000' );
              pass = false;
          }
          catch( e ) {
              assert.equal( 'Number out of range', e.message );
          }
          try {
              app.convertArabicToRoman( '-1' );
              pass = false;
          }
          catch( e ) {
              assert.equal( 'Number out of range', e.message );
          }
          try {
              app.convertArabicToRoman( 'dfjlsf' );
              pass = false;
          }
          catch( e ) {
              assert.equal( 'Cannot convert', e.message );
          }
          try {
              app.convertArabicToRoman( '7 years' );
              pass = false;
          }
          catch( e ) {
              assert.equal( 'Cannot convert', e.message );
          }
          assert.ok(pass, 'Exception not thrown' );
      });
      it( 'converts single digits', function(){
          assert.equal( '', app.convertArabicToRoman( '0' ), '0 != ""' );
          assert.equal( 'I', app.convertArabicToRoman( '1' ), '1 != I' );
          assert.equal( 'II', app.convertArabicToRoman( '2' ), '2 != II' );
          assert.equal( 'III', app.convertArabicToRoman( '3' ), '3 != II' );
          assert.equal( 'IV', app.convertArabicToRoman( '4' ), '4 != IV' );
          assert.equal( 'V', app.convertArabicToRoman( '5' ), '5 != V' );
          assert.equal( 'VI', app.convertArabicToRoman( '6' ), '6 != VI' );
          assert.equal( 'VII', app.convertArabicToRoman( '7' ), '7 != VII' );
          assert.equal( 'VIII', app.convertArabicToRoman( '8' ), '8 != VIII' );
          assert.equal( 'IX', app.convertArabicToRoman( '9' ), '9 != IX' );
      });
      it( 'converts tens', function(){
          assert.equal( 'X',    app.convertArabicToRoman( '10' ), '10 != X' );
          assert.equal( 'XX',   app.convertArabicToRoman( '20' ), '20 != XX' );
          assert.equal( 'XXX',  app.convertArabicToRoman( '30' ), '30 != XXX' );
          assert.equal( 'XL',   app.convertArabicToRoman( '40' ), '40 != XL' );
          assert.equal( 'L',    app.convertArabicToRoman( '50' ), '50 != L' );
          assert.equal( 'LX',   app.convertArabicToRoman( '60' ), '60 != LX' );
          assert.equal( 'LXX',  app.convertArabicToRoman( '70' ), '70 != LXX' );
          assert.equal( 'LXXX', app.convertArabicToRoman( '80' ), '80 != LXXX' );
          assert.equal( 'XC',   app.convertArabicToRoman( '90' ), '90 != XC' );
      });
      it( 'converts hundreds', function(){
          assert.equal( 'C',    app.convertArabicToRoman( '100' ), '100 != C' );
          assert.equal( 'CC',   app.convertArabicToRoman( '200' ), '200 != CC' );
          assert.equal( 'CCC',  app.convertArabicToRoman( '300' ), '300 != CCC' );
          assert.equal( 'CD',   app.convertArabicToRoman( '400' ), '400 != CD' );
          assert.equal( 'D',    app.convertArabicToRoman( '500' ), '500 != D' );
          assert.equal( 'DC',   app.convertArabicToRoman( '600' ), '600 != DC' );
          assert.equal( 'DCC',  app.convertArabicToRoman( '700' ), '700 != DCC' );
          assert.equal( 'DCCC', app.convertArabicToRoman( '800' ), '800 != DCCC' );
          assert.equal( 'CM',   app.convertArabicToRoman( '900' ), '900 != CM' );
      });
      it( 'converts thousands', function(){
          assert.equal( 'M',    app.convertArabicToRoman( '1000' ), '1000 != M' );
          assert.equal( 'MM',   app.convertArabicToRoman( '2000' ), '2000 != MM' );
          assert.equal( 'MMM',  app.convertArabicToRoman( '3000' ), '3000 != MMM' );
      });
      it( 'combines digits', function(){
          assert.equal( 'XXIII', app.convertArabicToRoman( '23' ), '23 != XXIII' );
          assert.equal( 'MMMCMXCIX', app.convertArabicToRoman( '3999' ), '3999 != MMMCMXCIX' );
      });
  });
  describe('Action', function() {
      beforeEach(function(done){
          sinon.stub( app, 'fetchInput' ).yields( '12' );
          sinon.stub( app, 'writeOutput' ).yields();
          sinon.stub( app, 'convertArabicToRoman' ).returns( 'VII' );
          done();
      });
      it( 'reads input, converts it, writes the output', function() {
          app.action({ stop: sinon.stub() } );
          sinon.assert.calledWith(app.convertArabicToRoman, '12' );
          sinon.assert.calledWith(app.writeOutput, 'VII' );
      });
      it( 'catches errors, writes them, flagged', function() {
          app.convertArabicToRoman.throws( new Error( 'foobar' ) );
          app.action({ stop:sinon.stub() } );
          sinon.assert.calledWith(app.writeOutput, 'foobar', true );
      });
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
          app.selector.returns( [{}] );
          app.dom.returns( { val: function(){ return '7'; } } );
          app.fetchInput( function(value) {
              assert.equal( value, '7' );
              done();
          });
      });
      it( 'writeOutput saves value using selector+dom', function( done ) {
          app.selector.returns( [{}] );
          var removeFunc = sinon.spy();
          var addFunc = sinon.stub().returns( { removeClass: removeFunc } );
          var textFunc = sinon.stub().returns( { addClass: addFunc } );
          app.dom.returns( { text: textFunc } );
          app.writeOutput( 'XVI', function(response) {
              sinon.assert.calledWith( textFunc, 'XVI' );
              sinon.assert.calledWith( addFunc, 'alert-success' );
              sinon.assert.calledWith( removeFunc, 'alert-error' );
              done();
          });
      });
      it( 'writeOutput saves error using selector+dom', function( done ) {
          app.selector.returns( [{}] );
          var removeFunc = sinon.spy();
          var addFunc = sinon.stub().returns( { removeClass: removeFunc } );
          var textFunc = sinon.stub().returns( { addClass: addFunc } );
          app.dom.returns( { text: textFunc } );
          app.writeOutput( 'error', true, function(response) {
              sinon.assert.calledWith( textFunc, 'error' );
              sinon.assert.calledWith( addFunc, 'alert-error' );
              sinon.assert.calledWith( removeFunc, 'alert-success' );
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
