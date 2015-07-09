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

exports.pbxTargetByName = {
    'should return PBXNativeTarget': function (test) {
        var pbxTarget = proj.pbxTargetByName('KitchenSinktablet');
        
        test.ok(pbxTarget);
        test.equals(pbxTarget.isa, 'PBXNativeTarget');
        test.done()
    },
    'should return null when PBXNativeTarget not found': function (test) {
        var pbxTarget = proj.pbxTargetByName('Invalid');
        
        test.equal(pbxTarget, null);
        test.done()
    }
}
