var app = require('../src/app'),
      assert = require('assert');

describe( 'App', function(){
  it( 'has an asyncronous init function', function(done){
    assert.ok( typeof app.init == 'function' );
    app.init(function(){
      done();
    });
  });
});
