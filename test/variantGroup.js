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
    project = new pbx('test/parser/projects/variantgroup.pbxproj');
    projectHash = project.parseSync();
    callback();
}

exports.getVariantGroupByKey = {
    'should return PBXVariantGroup for Localizable.strings': function(test) {
        var groupKey = project.findPBXVariantGroupKey({name: 'Localizable.strings'});
        var group = project.getPBXVariantGroupByKey(groupKey);
        test.ok(group.name === 'Localizable.strings');
        test.done();
    }
}

exports.createVariantGroup = {
    'should create a new Test Variant Group': function(test) {
        delete project.getPBXObject('PBXVariantGroup');

        var found = false;
        var groups = project.getPBXObject('PBXVariantGroup');

        var found = findByName(groups, 'Test');
        test.ok(found === false);

        var group = project.findPBXVariantGroupKey({name:'Test'});
        test.ok(group === undefined);

        project.pbxCreateVariantGroup('Test');

        groups = project.getPBXObject('PBXVariantGroup');
        found = findByName(groups, 'Test');
        test.ok(found === true);

        group = project.findPBXVariantGroupKey({name:'Test'});
        test.ok(typeof group === 'string');
        test.done();
    }
}

exports.findVariantGroupKey = {
    'should return a valid group key':function(test) {
        var keyByName = project.findPBXVariantGroupKey({ name: 'Localizable.strings'});
        var nonExistingKey = project.findPBXVariantGroupKey({ name: 'Foo'});

        test.ok(keyByName === '07E3BDBC1DF1DEA500E49912');
        test.ok(nonExistingKey === undefined);

        test.done();
    }
}

exports.createLocalisationVariantGroup = {
    'should create a new localisation variationgroup then add group to Resources group': function(test) {
        delete project.getPBXObject('PBXVariantGroup');

        var localizationVariantGp = project.addLocalizationVariantGroup('InfoPlist.strings');

        var resourceGroupKey =  project.findPBXGroupKey({name: 'Resources'});
        var resourceGroup = project.getPBXGroupByKey(resourceGroupKey);
        var foundInResourcesGroup = findChildInGroup(resourceGroup, localizationVariantGp.fileRef );
        test.ok(foundInResourcesGroup);

        var foundInResourcesBuildPhase = false;
        var sources = project.pbxResourcesBuildPhaseObj();
        for (var i = 0, j = sources.files.length; i < j; i++) {
            var file = sources.files[i];
            if (file.value === localizationVariantGp.uuid) {
                foundInResourcesBuildPhase = true;
            }
        }
        test.ok(foundInResourcesBuildPhase);

        test.done();
    }
}

exports.addResourceFileToLocalisationGroup = {
    'should add resource file to the TestVariantGroup group' : function(test) {

        var infoPlistVarGp = project.addLocalizationVariantGroup('InfoPlist.strings');
        var testKey = infoPlistVarGp.fileRef;
        var file = project.addResourceFile('Resources/en.lproj/Localization.strings', {variantGroup: true}, testKey);

        var foundInLocalisationVariantGroup = findChildInGroup(project.getPBXVariantGroupByKey(testKey), file.fileRef );
        test.ok(foundInLocalisationVariantGroup);

        var foundInResourcesBuildPhase = false;
        var sources = project.pbxResourcesBuildPhaseObj();
        for (var i = 0, j = sources.files.length; i < j; i++) {
            var sourceFile = sources.files[i];
            if (sourceFile.value === file.fileRef) {
                foundInResourcesBuildPhase = true;
            }
        }
        test.ok(!foundInResourcesBuildPhase);

        var buildFileSection = project.pbxBuildFileSection();
        test.ok(buildFileSection[file.uuid] === undefined);

        test.done();
    }
}

exports.removeResourceFileFromGroup = {
    'should add resource file then remove resource file from Localizable.strings group' : function(test) {
        var testKey = project.findPBXVariantGroupKey({name:'Localizable.strings'});
        var file = project.addResourceFile('Resources/zh.lproj/Localization.strings', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXVariantGroupByKey(testKey),file.fileRef );
        test.ok(foundInGroup);

        project.removeResourceFile('Resources/zh.lproj/Localization.strings', {}, testKey);

        var foundInGroup = findChildInGroup(project.getPBXVariantGroupByKey(testKey),file.fileRef );
        test.ok(!foundInGroup);

        test.done();
    }
}