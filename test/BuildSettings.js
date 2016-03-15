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

exports.addAndRemoveToFromBuildSettings = {
    'add should add the build setting to each configuration section':function(test) {
        var buildSetting = 'some/buildSetting';
        var value = 'some/buildSetting';
        proj.addToBuildSettings(buildSetting, value);
        var config = proj.pbxXCBuildConfigurationSection();
        for (var ref in config) {
            if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != PRODUCT_NAME) continue;
            test.ok(config[ref].buildSettings[buildSetting] === value);
        }
        test.done();
    },
    'remove should remove from the build settings in each configuration section':function(test) {
        var buildSetting = 'some/buildSetting';
        proj.addToBuildSettings(buildSetting, 'some/buildSetting');
        proj.removeFromBuildSettings(buildSetting);
        var config = proj.pbxXCBuildConfigurationSection();
        for (var ref in config) {
            if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != PRODUCT_NAME) continue;
            test.ok(!config[ref].buildSettings.hasOwnProperty(buildSetting));
        }
        test.done();
    }
}
