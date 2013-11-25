var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    pbxFile = require('../lib/pbxFile'),
    proj = new pbx('.');

var pbxFile = {
  path:'some/path/include',
  dirname: 'some/path',
  customFramework: true
}
function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

var PRODUCT_NAME = '"KitchenSinktablet"';

exports.addAndRemoveToFromFrameworkSearchPaths = {
    'add should add the path to each configuration section':function(test) {
        proj.addToFrameworkSearchPaths(pbxFile);
        var config = proj.pbxXCBuildConfigurationSection();
        for (var ref in config) {
            if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != PRODUCT_NAME) continue;
            var lib = config[ref].buildSettings.FRAMEWORK_SEARCH_PATHS;
            test.ok(lib[1].indexOf('some/path') > -1);
        }
        test.done();
    },
    'remove should remove from the path to each configuration section':function(test) {
        proj.addToFrameworkSearchPaths(pbxFile);
        proj.removeFromFrameworkSearchPaths(pbxFile);
        var config = proj.pbxXCBuildConfigurationSection();
        for (var ref in config) {
            if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != PRODUCT_NAME) continue;
            var lib = config[ref].buildSettings.FRAMEWORK_SEARCH_PATHS;
            test.ok(lib.length === 1);
            test.ok(lib[0].indexOf('some/path') == -1);
        }
        test.done();
    }
}
