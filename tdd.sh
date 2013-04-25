#!/bin/bash

node_modules/mocha/bin/mocha

if [ $? == 0 ]; then
    node node_modules/requirejs/bin/r.js -o baseUrl=src name=app \
        out=build/app.js cjsTranslate=true uglify.beautify=true > /dev/null 2>&1
fi
