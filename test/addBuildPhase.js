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
            var file = buildPhase.files[index],
                fileRef = buildFileSection[file.value].fileRef;
                
            test.ok(fileRefSection[fileRef]);            
        }

        test.done();
    },
    'should not add files to PBXFileReference section if already added': function (test) {
        var fileRefSection = proj.pbxFileReferenceSection(),
            initialFileReferenceSectionItemsCount = Object.keys(fileRefSection),
            buildPhase = proj.addBuildPhase(['AppDelegate.m', 'main.m'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase,
            afterAdditionBuildFileSectionItemsCount = Object.keys(fileRefSection);
        
        test.deepEqual(initialFileReferenceSectionItemsCount, afterAdditionBuildFileSectionItemsCount);
        test.done();
    },
    'should not add files to PBXBuildFile section if already added': function (test) {
        var buildFileSection  = proj.pbxBuildFileSection(),
            initialBuildFileSectionItemsCount  = Object.keys(buildFileSection),
            buildPhase = proj.addBuildPhase(['AppDelegate.m', 'main.m'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase,
            afterAdditionBuildFileSectionItemsCount = Object.keys(buildFileSection);
        
        test.deepEqual(initialBuildFileSectionItemsCount, afterAdditionBuildFileSectionItemsCount);
        test.done();
    },
    'should add only missing files to PBXFileReference section': function (test) {
        var fileRefSection = proj.pbxFileReferenceSection(),
            buildFileSection = proj.pbxBuildFileSection(),
            initialFileReferenceSectionItemsCount = Object.keys(fileRefSection),
            buildPhase = proj.addBuildPhase(['file.m', 'AppDelegate.m'], 'PBXResourcesBuildPhase', 'My build phase').buildPhase,
            afterAdditionBuildFileSectionItemsCount = Object.keys(fileRefSection);
        
        for (var index = 0; index < buildPhase.files.length; index++) {
            var file = buildPhase.files[index],
                fileRef = buildFileSection[file.value].fileRef;
                
            test.ok(fileRefSection[fileRef]);            
        }
        
        test.deepEqual(initialFileReferenceSectionItemsCount.length, afterAdditionBuildFileSectionItemsCount.length - 2);
        test.done();
    }
}
