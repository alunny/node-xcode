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

exports.pbxItemByComment = {
    'should return PBXTargetDependency': function (test) {
        var pbxItem = proj.pbxItemByComment('PBXTargetDependency', 'PBXTargetDependency');

        test.ok(pbxItem);
        test.equals(pbxItem.isa, 'PBXTargetDependency');
        test.done()
    },
    'should return PBXContainerItemProxy': function (test) {
        var pbxItem = proj.pbxItemByComment('libPhoneGap.a', 'PBXReferenceProxy');
        
        test.ok(pbxItem);
        test.equals(pbxItem.isa, 'PBXReferenceProxy');
        test.done()
    },
    'should return PBXResourcesBuildPhase': function (test) {
        var pbxItem = proj.pbxItemByComment('Resources', 'PBXResourcesBuildPhase');
        
        test.ok(pbxItem);
        test.equals(pbxItem.isa, 'PBXResourcesBuildPhase');
        test.done()
    },
    'should return PBXShellScriptBuildPhase': function (test) {
        var pbxItem = proj.pbxItemByComment('Touch www folder', 'PBXShellScriptBuildPhase');
        
        test.ok(pbxItem);
        test.equals(pbxItem.isa, 'PBXShellScriptBuildPhase');
        test.done()
    },
    'should return null when PBXNativeTarget not found': function (test) {
        var pbxItem = proj.pbxItemByComment('Invalid', 'PBXTargetDependency');
        
        test.equal(pbxItem, null);
        test.done()
    }
}
