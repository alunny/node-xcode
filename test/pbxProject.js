var pbx = require('../lib/pbxProject'),
    buildConfig = require('./fixtures/buildFiles'),
    project;

exports['parse function'] = {
    'should emit an "end" event': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse().on('end', function (err, projHash) {
            test.done();
        })
    },
    'should take the end callback as a parameter': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse(function (err, projHash) {
            test.done();
        })
    },
    'should allow evented error handling': function (test) {
        var myProj = new pbx('NotARealPath.pbxproj');

        myProj.parse().on('error', function (err) {
            test.equal(typeof err, "object");
            test.done();
        })
    },
    'should pass the hash object to the callback function': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(projHash);
            test.done();
        })
    },
    'should attach the hash object to the pbx object': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(myProj.hash);
            test.done();
        })
    }
}

exports['allUuids function'] = {
   'should return the right amount of uuids': function (test) {
       var project = new pbx('.'),
           uuids;

       project.hash = buildConfig;
       uuids = project.allUuids();

       test.equal(uuids.length, 4);
       test.done();
   }
}
