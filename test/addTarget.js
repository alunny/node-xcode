var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    proj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

var TARGET_NAME = 'TestExtension',
    TARGET_TYPE = 'app_extension',
    TARGET_SUBFOLDER_NAME = 'TestExtensionFiles';

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.addTarget = {
    'should throw when target name is missing': function (test) {
        test.throws(function() {
            proj.addTarget(null, TARGET_TYPE);
        });
        
        test.done();
    },
    'should throw when target type missing': function (test) {
        test.throws(function() {
            proj.addTarget(TARGET_NAME, null);
        });
        
        test.done();
    },
    'should create a new target': function (test) {
        var target = proj.addTarget(TARGET_NAME, TARGET_TYPE, TARGET_SUBFOLDER_NAME);
        
        test.ok(typeof target == 'object');
        test.ok(target.uuid);
        test.ok(target.pbxNativeTarget);
        test.ok(target.pbxNativeTarget.isa);
        test.ok(target.pbxNativeTarget.name);
        test.ok(target.pbxNativeTarget.productName);
        test.ok(target.pbxNativeTarget.productReference);
        test.ok(target.pbxNativeTarget.productType);
        test.ok(target.pbxNativeTarget.buildConfigurationList);
        test.ok(target.pbxNativeTarget.buildPhases);
        test.ok(target.pbxNativeTarget.buildRules);
        test.ok(target.pbxNativeTarget.dependencies);
                
        test.done();
    },
    'should create a new target and add source, framework, resource and header files and the corresponding build phases': function (test) {
        var target = proj.addTarget(TARGET_NAME, TARGET_TYPE, TARGET_SUBFOLDER_NAME),
            options = { 'target' : target.uuid };
   
        var sourceFile = proj.addSourceFile('Plugins/file.m', options),
            sourcePhase = proj.addBuildPhase([], 'PBXSourcesBuildPhase', 'Sources', target.uuid),
            resourceFile = proj.addResourceFile('assets.bundle', options),
            resourcePhase = proj.addBuildPhase([], 'PBXResourcesBuildPhase', 'Resources', target.uuid),
            frameworkFile = proj.addFramework('libsqlite3.dylib', options);
            frameworkPhase = proj.addBuildPhase([], 'PBXFrameworkBuildPhase', 'Frameworks', target.uuid),
            headerFile = proj.addHeaderFile('file.h', options);
        
        test.ok(sourcePhase);
        test.ok(resourcePhase);
        test.ok(frameworkPhase);
          
        test.equal(sourceFile.constructor, pbxFile);
        test.equal(resourceFile.constructor, pbxFile);
        test.equal(frameworkFile.constructor, pbxFile);
        test.equal(headerFile.constructor, pbxFile);
        
        test.ok(typeof target == 'object');
        test.ok(target.uuid);
        test.ok(target.pbxNativeTarget);
        test.ok(target.pbxNativeTarget.isa);
        test.ok(target.pbxNativeTarget.name);
        test.ok(target.pbxNativeTarget.productName);
        test.ok(target.pbxNativeTarget.productReference);
        test.ok(target.pbxNativeTarget.productType);
        test.ok(target.pbxNativeTarget.buildConfigurationList);
        test.ok(target.pbxNativeTarget.buildPhases);
        test.ok(target.pbxNativeTarget.buildRules);
        test.ok(target.pbxNativeTarget.dependencies);
    
        test.done();
        
    }   
}
