var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    proj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.addBuildPhase = {
    'should return a pbxBuildPhase': function (test) {
        var buildPhase = proj.addBuildPhase(['file.m'], 'PBXSourcesBuildPhase', 'My build phase');
        
        test.ok(typeof buildPhase === 'object');
        test.done()
    },
    'should set a uuid on the pbxBuildPhase': function (test) {
        var buildPhase = proj.addBuildPhase(['file.m'], 'PBXSourcesBuildPhase', 'My build phase');

        test.ok(buildPhase.uuid);
        test.done()
    },
    'should add all files to build phase': function (test) {
        var buildPhase = proj.addBuildPhase(['file.m', 'assets.bundle'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase;
        for (var index = 0; index < buildPhase.files.length; index++) {
            var file = buildPhase.files[index];
            test.ok(file.value);
        }
        
        test.done()
    },
    'should add the PBXBuildPhase object correctly': function (test) {
        var buildPhase = proj.addBuildPhase(['file.m', 'assets.bundle'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase,
            buildPhaseInPbx = proj.buildPhaseObject('PBXResourcesBuildPhase', 'My build phase');

        test.equal(buildPhaseInPbx, buildPhase);
        test.equal(buildPhaseInPbx.isa, 'PBXResourcesBuildPhase');
        test.equal(buildPhaseInPbx.buildActionMask, 2147483647);
        test.equal(buildPhaseInPbx.runOnlyForDeploymentPostprocessing, 0);
        test.done();
    },
    'should add each of the files to PBXBuildFile section': function (test) {
        var buildPhase = proj.addBuildPhase(['file.m', 'assets.bundle'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase,
            buildFileSection = proj.pbxBuildFileSection();
        
        for (var index = 0; index < buildPhase.files.length; index++) {
            var file = buildPhase.files[index];
            test.ok(buildFileSection[file.value]);
        }  

        test.done();
    },
    'should add each of the files to PBXFileReference section': function (test) {
        var buildPhase = proj.addBuildPhase(['file.m', 'assets.bundle'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase,
            fileRefSection = proj.pbxFileReferenceSection(),
            buildFileSection = proj.pbxBuildFileSection(),
            fileRefs = [];
        
        for (var index = 0; index < buildPhase.files.length; index++) {
            var file = buildPhase.files[index];
            fileRefs.push(buildFileSection[file.value].fileRef);
        }
        
        for (var index = 0; index < fileRefs.length; index++) {
            var fileRef = fileRefs[index];
            test.ok(fileRefSection[fileRef]);            
        }

        test.done();
    }
}
