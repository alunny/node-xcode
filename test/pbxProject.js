var pbx = require('../lib/pbxProject'),
    buildConfig = require('./fixtures/buildFiles'),
    jsonProject = require('./fixtures/full-project'),
    fs = require('fs'),
    project;

exports['creation'] = {
    'should create a pbxProject with the new operator': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        test.ok(myProj instanceof pbx);
        test.done();
    },
    'should create a pbxProject without the new operator': function (test) {
        var myProj = pbx('test/parser/projects/hash.pbxproj');

        test.ok(myProj instanceof pbx);
        test.done();
    }
}

exports['parseSync function'] = {
  'should return the hash object': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj')
          , projHash = myProj.parseSync();
        test.ok(projHash);
        test.done();
  },
  'should contain valid data in the returned objects hash': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj')
          , projHash = myProj.parseSync();
        test.ok(projHash);

        test.equal(projHash.hash.project.archiveVersion, 1);
        test.equal(projHash.hash.project.objectVersion, 45);
        test.equal(projHash.hash.project.nonObject, '29B97313FDCFA39411CA2CEF');
    
        test.done();
  },
}

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
    'should handle projects with comments in the header': function (test) {
        var myProj = new pbx('test/parser/projects/comments.pbxproj');

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
    },
    'it should pass an error object back when the parsing fails': function (test) {
        var myProj = new pbx('test/parser/projects/fail.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(err);
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

exports['generateUuid function'] = {
    'should return a 24 character string': function (test) {
       var project = new pbx('.'),
           newUUID;

       project.hash = buildConfig;
       newUUID = project.generateUuid();

       test.equal(newUUID.length, 24);
       test.done();
    },
    'should be an uppercase hex string': function (test) {
       var project = new pbx('.'),
           uHex = /^[A-F0-9]{24}$/,
           newUUID;

       project.hash = buildConfig;
       newUUID = project.generateUuid();

       test.ok(uHex.test(newUUID));
       test.done();
    }
}

var bcpbx = 'test/parser/projects/build-config.pbxproj';
var original_pbx = fs.readFileSync(bcpbx, 'utf-8');

exports['updateProductName function'] = {
    setUp:function(callback) {
        callback();
    },
    tearDown:function(callback) {
        fs.writeFileSync(bcpbx, original_pbx, 'utf-8');
        callback();
    },
    'should change the PRODUCT_NAME field in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.updateProductName('furious anger');
            var newContents = myProj.writeSync();
            test.ok(newContents.match(/PRODUCT_NAME\s*=\s*"furious anger"/));
            test.done();
        });
    }
}

exports['updateBuildProperty function'] = {
    setUp:function(callback) {
        callback();
    },
    tearDown:function(callback) {
        fs.writeFileSync(bcpbx, original_pbx, 'utf-8');
        callback();
    },
    'should change build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.updateBuildProperty('TARGETED_DEVICE_FAMILY', '"arm"');
            var newContents = myProj.writeSync();
            test.ok(newContents.match(/TARGETED_DEVICE_FAMILY\s*=\s*"arm"/));
            test.done();
        });
    }
}

exports['productName field'] = {
    'should return the product name': function (test) {
        var newProj = new pbx('.');
        newProj.hash = jsonProject;

        test.equal(newProj.productName, 'KitchenSinktablet');
        test.done();
    }
}

exports['hasFile'] = {
    'should return true if the file is in the project': function (test) {
        var newProj = new pbx('.');
        newProj.hash = jsonProject;

        //  sourceTree: '"<group>"'
        test.ok(newProj.hasFile('AppDelegate.m'))
        test.done()
    },
    'should return false if the file is not in the project': function (test) {
        var newProj = new pbx('.');
        newProj.hash = jsonProject;

        //  sourceTree: '"<group>"'
        test.ok(!newProj.hasFile('NotTheAppDelegate.m'))
        test.done()
    }
}

exports['addPluginFile function'] = {
    'should add files to the .pbxproj file using the Mac path seperator on Windows': function (test) {
        var myProj = new pbx('test/parser/projects/add-files.pbxproj');

        myProj.parse(function (err, hash) {
            myProj.addPluginFile('myPlugin\\newFile.m');

            var newContents = myProj.writeSync();
            test.ok(newContents.match(/path\s*=\s*"?myPlugin\/newFile\.m"?;/));
            test.done();
        });
    }
}
