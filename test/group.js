var pbx = require('../lib/pbxProject'),
    project,
    projectHash;

var findChildInGroup = function(obj, target) {
    var found = false;

    for (var i = 0, j = obj.children.length; i < j; i++) {
        if (obj.children[i].value === target) {
            found = true;
            break;
        }
    }

    return found;
}

var findFileByUUID = function(obj, target) {
    var found = false;

    for (var k = 0, l = obj.files.length; k < l; k++) {
        if (obj.files[k].value === target) {
            found = true;
            break;
        }
    }

    return found;
}

var findByFileRef = function(obj, target) {
    var found = false;

    for (var property in obj) {
        if (!/comment/.test(property)) {
            if (obj[property].fileRef === target) {
                found = true;
                break;
            }
        }
    }
    return found;
}

var findByName = function(obj, target) {
    var found = false;
    for (var property in obj) {
        if (!/comment/.test(property)) {
            var value = obj[property];
            if (value.name === target) {
                found = true;
            }
        }
    }
    return found;
}

exports.setUp = function(callback) {
    project = new pbx('test/parser/projects/group.pbxproj');
    projectHash = project.parseSync();
    callback();
}

exports.getGroupByKey = {
    'should return PBXGroup for Classes': function(test) {
        var groupKey = project.findPBXGroupKey({name: 'Classes'});
        var group = project.getPBXGroupByKey(groupKey);
        test.ok(group.name === 'Classes');
        test.done();
    },
    'should return PBXGroup for Plugins': function(test) {
        var groupKey = project.findPBXGroupKey({name: 'Plugins'});
        var group = project.getPBXGroupByKey(groupKey);
        test.ok(group.name === 'Plugins');
        test.done();
    }
}

exports.createGroup = {
    'should create a new Test Group': function(test) {
        var found = false;
        var groups = project.getPBXObject('PBXGroup');

        var found = findByName(groups, 'Test');
        test.ok(found === false);


        var group = project.findPBXGroupKey({name:'Test'});
        test.ok(group === undefined);

        project.pbxCreateGroup('Test', 'Test');

        groups = project.getPBXObject('PBXGroup');
        found = findByName(groups, 'Test');
        test.ok(found === true);

        group = project.findPBXGroupKey({name:'Test'});
        test.ok(typeof group === 'string');
        test.done();
    }
}

exports.findGroupKey = {
    'should return a valid group key':function(test) {
        var keyByName = project.findPBXGroupKey({ name: 'Classes'});
        var keyByPath = project.findPBXGroupKey({ path: 'icons'});
        var keyByPathName = project.findPBXGroupKey({ path: '"HelloCordova/Plugins"', name: 'Plugins'});
        var nonExistingKey = project.findPBXGroupKey({ name: 'Foo'});

        test.ok(keyByName === '080E96DDFE201D6D7F000001');
        test.ok(keyByPath === '308D052D1370CCF300D202BF');
        test.ok(keyByPathName === '307C750510C5A3420062BCA9');
        test.ok(nonExistingKey === undefined);

        test.done();
    }
}

exports.addGroupToGroup = {
    'should create a new test group then add group to Classes group': function(test) {
        var testKey = project.pbxCreateGroup('Test', 'Test');
        var classesKey = project.findPBXGroupKey({name: 'Classes'});
        project.addToPbxGroup(testKey, classesKey);

        var classesGroup = project.getPBXGroupByKey(classesKey);
        var foundTestGroup = false;
        for (var i = 0, j = classesGroup.children.length; i < j; i++) {
            var child = classesGroup.children[i];
            if (child.value === testKey && child.comment === 'Test') {
                foundTestGroup = true;
            }
        }

        test.ok(foundTestGroup);

        test.done();
    }
}

exports.addSourceFileToGroup = {
    'should create group + add source file' : function(test) {
        var testKey = project.pbxCreateGroup('Test', 'Test');
        var file = project.addSourceFile('Notifications.m', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        var foundInBuildFileSection = findByFileRef(project.pbxBuildFileSection(), file.fileRef);
        test.ok(foundInBuildFileSection);

        var foundInBuildPhase = findFileByUUID(project.pbxSourcesBuildPhaseObj(), file.uuid);
        test.ok(foundInBuildPhase);

        test.done();
    }
}

exports.removeSourceFileFromGroup = {
    'should create group + add source file then remove source file' : function(test) {
        var testKey = project.pbxCreateGroup('Test', 'Test');
        var file = project.addSourceFile('Notifications.m', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        var foundInBuildFileSection = findByFileRef(project.pbxBuildFileSection(), file.fileRef);
        test.ok(foundInBuildFileSection);

        var foundInBuildPhase = findFileByUUID(project.pbxSourcesBuildPhaseObj(), file.uuid);
        test.ok(foundInBuildPhase);

        project.removeSourceFile('Notifications.m', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(!foundInGroup);

        var foundInBuildFileSection = findByFileRef(project.pbxBuildFileSection(), file.fileRef);
        test.ok(!foundInBuildFileSection);

        var foundInBuildPhase = findFileByUUID(project.pbxSourcesBuildPhaseObj(), file.uuid);
        test.ok(!foundInBuildPhase);

        test.done();
    }
}

exports.addHeaderFileToGroup = {
    'should create group + add header file' : function(test) {
        var testKey = project.pbxCreateGroup('Test', 'Test');
        var file = project.addHeaderFile('Notifications.h', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        test.done();
    }
}

exports.removeHeaderFileFromGroup = {
    'should create group + add source file then remove header file' : function(test) {
        var testKey = project.pbxCreateGroup('Test', 'Test');
        var file = project.addHeaderFile('Notifications.h', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        project.removeHeaderFile('Notifications.h', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(!foundInGroup);

        test.done();
    }
}

exports.addResourceFileToGroup = {
    'should add resource file (PNG) to the splash group' : function(test) {
        
        var testKey = project.findPBXGroupKey({path:'splash'});
        var file = project.addResourceFile('DefaultTest-667h.png', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        test.done();
    }
}

exports.removeResourceFileFromGroup = {
    'should add resource file (PNG) then remove resource file from splash group' : function(test) {
        var testKey = project.findPBXGroupKey({path:'splash'});
        var file = project.addResourceFile('DefaultTest-667h.png', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        project.removeResourceFile('DefaultTest-667h.png', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXGroupByKey(testKey),file.fileRef );
        test.ok(!foundInGroup);

        test.done();
    }
}

exports.retrieveBuildPropertyForBuild = {
    'should retrieve valid build property ':function(test) {
        var releaseTargetedDeviceFamily = project.getBuildProperty('TARGETED_DEVICE_FAMILY', 'Release');
        var debugTargetedDeviceFamily = project.getBuildProperty('TARGETED_DEVICE_FAMILY', 'Debug');
        var nonExistingProperty = project.getBuildProperty('FOO', 'Debug');
        var nonExistingBuild = project.getBuildProperty('TARGETED_DEVICE_FAMILY', 'Foo');

        test.equal(releaseTargetedDeviceFamily, '"1,2"');
        test.equal(debugTargetedDeviceFamily,'"1"');
        test.equal(nonExistingProperty, undefined);
        test.equal(nonExistingBuild, undefined);

        test.done();
    }
}

exports.retrieveBuildConfigByName = {
    'should retrieve valid build config':function(test) {
        var releaseBuildConfig = project.getBuildConfigByName('Release');
        for (var property in releaseBuildConfig) {
            var value = releaseBuildConfig[property];
            test.ok(value.name === 'Release');
        }

        var debugBuildConfig = project.getBuildConfigByName('Debug');
        for (var property in debugBuildConfig) {
            var value = debugBuildConfig[property];
            test.ok(value.name === 'Debug');
        }

        var nonExistingBuildConfig = project.getBuildConfigByName('Foo');
        test.deepEqual(nonExistingBuildConfig, {});

        test.done();
    }
}

/* This proves the issue in 0.6.7
exports.validatePropReplaceException = {
    'should throw TypeError for updateBuildProperty VALID_ARCHS when none existed' : function(test) {
        test.throws(
            function() {
                project.updateBuildProperty('VALID_ARCHS', '"armv7 armv7s');
            },
            TypeError,
            "Object object has no method 'hasOwnProperty'"
        );
        test.done();
    }
}
*/

exports.validatePropReplaceFix = {
    'should create build configuration for VALID_ARCHS when none existed' : function(test) {
        project.updateBuildProperty('VALID_ARCHS', '"armv7 armv7s"', 'Debug');
        test.done();
    }
}

exports.validateHasFile = {
    'should return true for has file MainViewController.m': function(test) {
        var result = project.hasFile('MainViewController.m');
        test.ok(result.path == "MainViewController.m");
        test.done();
    }
}

exports.testWritingPBXProject = {

    'should successfully write to PBXProject TargetAttributes': function(test) {
        var pbxProjectObj = project.getPBXObject('PBXProject');
        var pbxProject;
        for (var property in pbxProjectObj) {
            if (!/comment/.test(property)) {
                pbxProject = pbxProjectObj[property];
            }
        }

        var target;
        var projectTargets = pbxProject.targets;
        for (var i = 0, j = pbxProject.targets.length; i < j; i++ ) {
            target = pbxProject.targets[i].value;
        }

        pbxProject.attributes.TargetAttributes = {};
        pbxProject.attributes.TargetAttributes[target] = {
            DevelopmentTeam: 'N6X4RJZZ5D',
            SystemCapabilities: {
                "com.apple.BackgroundModes": {
                    enabled : 0
                },
                "com.apple.DataProtection" : {
                    enabled : 0
                },
                "com.apple.Keychain" : {
                    enabled: 1
                }
            }
        };

        var output = project.writeSync();

        test.done();
    }
}
