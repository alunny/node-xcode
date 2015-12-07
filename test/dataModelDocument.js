var jsonProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(jsonProject),
    path = require('path'),
    pbx = require('../lib/pbxProject'),
    pbxFile = require('../lib/pbxFile'),
    proj = new pbx('.'),
    singleDataModelFilePath = __dirname + '/fixtures/single-data-model.xcdatamodeld',
    multipleDataModelFilePath = __dirname + '/fixtures/multiple-data-model.xcdatamodeld';

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.dataModelDocument = {
    'should return a pbxFile': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath);

        test.equal(newFile.constructor, pbxFile);
        test.done()
    },
    'should set a uuid on the pbxFile': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath);

        test.ok(newFile.uuid);
        test.done()
    },
    'should set a fileRef on the pbxFile': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath);

        test.ok(newFile.fileRef);
        test.done()
    },
    'should set an optional target on the pbxFile': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath, undefined, { target: target }),
            target = proj.findTargetKey('TestApp');

        test.equal(newFile.target, target);
        test.done()
    },
    'should populate the PBXBuildFile section with 2 fields': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath),
            buildFileSection = proj.pbxBuildFileSection(),
            bfsLength = Object.keys(buildFileSection).length;

        test.equal(59 + 1, bfsLength);
        test.ok(buildFileSection[newFile.uuid]);
        test.ok(buildFileSection[newFile.uuid + '_comment']);

        test.done();
    },
    'should populate the PBXFileReference section with 2 fields for single model document': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath),
            fileRefSection = proj.pbxFileReferenceSection(),
            frsLength = Object.keys(fileRefSection).length;

        test.equal(66 + 2, frsLength);
        test.ok(fileRefSection[newFile.models[0].fileRef]);
        test.ok(fileRefSection[newFile.models[0].fileRef + '_comment']);

        test.done();
    },
    'should populate the PBXFileReference section with 2 fields for each model of a model document': function (test) {
        var newFile = proj.addDataModelDocument(multipleDataModelFilePath),
            fileRefSection = proj.pbxFileReferenceSection(),
            frsLength = Object.keys(fileRefSection).length;

        test.equal(66 + 2 * 2, frsLength);
        test.ok(fileRefSection[newFile.models[0].fileRef]);
        test.ok(fileRefSection[newFile.models[0].fileRef + '_comment']);
        test.ok(fileRefSection[newFile.models[1].fileRef]);
        test.ok(fileRefSection[newFile.models[1].fileRef + '_comment']);

        test.done();
    },
    'should add to resources group by default': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath);
            groupChildren = proj.pbxGroupByName('Resources').children,
            found = false;

        for (var index in groupChildren) {
            if (groupChildren[index].comment === 'single-data-model.xcdatamodeld') {
                found = true;
                break;
            }
        }
        test.ok(found);
        test.done();
    },
    'should add to group specified by key': function (test) {
        var group = 'Frameworks',
            newFile = proj.addDataModelDocument(singleDataModelFilePath, proj.findPBXGroupKey({ name: group }));
            groupChildren = proj.pbxGroupByName(group).children;

        var found = false;
        for (var index in groupChildren) {
            if (groupChildren[index].comment === path.basename(singleDataModelFilePath)) {
                found = true;
                break;
            }
        }
        test.ok(found);
        test.done();
    },
    'should add to group specified by name': function (test) {
        var group = 'Frameworks',
            newFile = proj.addDataModelDocument(singleDataModelFilePath, group);
            groupChildren = proj.pbxGroupByName(group).children;

        var found = false;
        for (var index in groupChildren) {
            if (groupChildren[index].comment === path.basename(singleDataModelFilePath)) {
                found = true;
                break;
            }
        }
        test.ok(found);
        test.done();
    },
    'should add to the PBXSourcesBuildPhase': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath),
            sources = proj.pbxSourcesBuildPhaseObj();

        test.equal(sources.files.length, 2 + 1);
        test.done();
    },
    'should create a XCVersionGroup section': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath),
            xcVersionGroupSection = proj.xcVersionGroupSection();

        test.ok(xcVersionGroupSection[newFile.fileRef]);
        test.done();
    },
    'should populate the XCVersionGroup comment correctly': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath),
            xcVersionGroupSection = proj.xcVersionGroupSection(),
            commentKey = newFile.fileRef + '_comment';

        test.equal(xcVersionGroupSection[commentKey], path.basename(singleDataModelFilePath));
        test.done();
    },
    'should add the XCVersionGroup object correctly': function (test) {
        var newFile = proj.addDataModelDocument(singleDataModelFilePath),
            xcVersionGroupSection = proj.xcVersionGroupSection(),
            xcVersionGroupEntry = xcVersionGroupSection[newFile.fileRef];

        test.equal(xcVersionGroupEntry.isa, 'XCVersionGroup');
        test.equal(xcVersionGroupEntry.children[0], newFile.models[0].fileRef);
        test.equal(xcVersionGroupEntry.currentVersion, newFile.currentModel.fileRef);
        test.equal(xcVersionGroupEntry.name, path.basename(singleDataModelFilePath));
        test.equal(xcVersionGroupEntry.path, singleDataModelFilePath);
        test.equal(xcVersionGroupEntry.sourceTree, '"<group>"');
        test.equal(xcVersionGroupEntry.versionGroupType, 'wrapper.xcdatamodel');

        test.done();
    }
}
