var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    pbxFile = require('../lib/pbxFile'),
    proj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

var PRODUCT_NAME = '"KitchenSinktablet"';

exports.addAndRemoveToFromOtherLinkerFlags = {
    'add should add the flag to each configuration section':function(test) {
        var flag = 'some/flag';
        proj.addToOtherLinkerFlags(flag);
        var config = proj.pbxXCBuildConfigurationSection();
        for (var ref in config) {
            if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != PRODUCT_NAME) continue;
            var lib = config[ref].buildSettings.OTHER_LDFLAGS;
            test.ok(lib[1].indexOf(flag) > -1);
        }
        test.done();
    },
    'remove should remove from the path to each configuration section':function(test) {
        var flag = 'some/flag';
        proj.addToOtherLinkerFlags(flag);
        proj.removeFromOtherLinkerFlags(flag);
        var config = proj.pbxXCBuildConfigurationSection();
        for (var ref in config) {
            if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != PRODUCT_NAME) continue;
            var lib = config[ref].buildSettings.OTHER_LDFLAGS;
            test.ok(lib.length === 1);
            test.ok(lib[0].indexOf(flag) == -1);
        }
        test.done();
    }
}
