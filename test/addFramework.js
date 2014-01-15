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

function nonComments(obj) {
    var keys = Object.keys(obj),
        newObj = {}, i = 0;

    for (i; i < keys.length; i++) {
        if (!/_comment$/.test(keys[i])) {
            newObj[keys[i]] = obj[keys[i]];
        }
    }

    return newObj;
}

function frameworkSearchPaths(proj) {
    var configs = nonComments(proj.pbxXCBuildConfigurationSection()),
        allPaths = [],
        ids = Object.keys(configs), i, buildSettings;

    for (i = 0; i< ids.length; i++) {
        buildSettings = configs[ids[i]].buildSettings;

        if (buildSettings['FRAMEWORK_SEARCH_PATHS']) {
            allPaths.push(buildSettings['FRAMEWORK_SEARCH_PATHS']);
        }
    }

    return allPaths;
}

exports.addFramework = {
    'should return a pbxFile': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib');
        console.log(newFile);

        test.equal(newFile.constructor, pbxFile);
        test.done()
    },
    'should set a fileRef on the pbxFile': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib');

        test.ok(newFile.fileRef);
        test.done()
    },
    'should populate the PBXFileReference section with 2 fields': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib');
            fileRefSection = proj.pbxFileReferenceSection(),
            frsLength = Object.keys(fileRefSection).length;

        test.equal(68, frsLength);
        test.ok(fileRefSection[newFile.fileRef]);
        test.ok(fileRefSection[newFile.fileRef + '_comment']);

        test.done();
    },
    'should populate the PBXFileReference comment correctly': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib');
            fileRefSection = proj.pbxFileReferenceSection(),
            commentKey = newFile.fileRef + '_comment';

        test.equal(fileRefSection[commentKey], 'libsqlite3.dylib');
        test.done();
    },
    'should add the PBXFileReference object correctly': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            fileRefSection = proj.pbxFileReferenceSection(),
            fileRefEntry = fileRefSection[newFile.fileRef];

        test.equal(fileRefEntry.isa, 'PBXFileReference');
        test.equal(fileRefEntry.lastKnownFileType, '"compiled.mach-o.dylib"');
        test.equal(fileRefEntry.name, '"libsqlite3.dylib"');
        test.equal(fileRefEntry.path, '"usr/lib/libsqlite3.dylib"');
        test.equal(fileRefEntry.sourceTree, 'SDKROOT');

        test.done();
    },
    'should populate the PBXBuildFile section with 2 fields': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            buildFileSection = proj.pbxBuildFileSection(),
            bfsLength = Object.keys(buildFileSection).length;

        test.equal(60, bfsLength);
        test.ok(buildFileSection[newFile.uuid]);
        test.ok(buildFileSection[newFile.uuid + '_comment']);

        test.done();
    },
    'should add the PBXBuildFile comment correctly': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            commentKey = newFile.uuid + '_comment',
            buildFileSection = proj.pbxBuildFileSection();

        test.equal(buildFileSection[commentKey], 'libsqlite3.dylib in Frameworks');
        test.done();
    },
    'should add the PBXBuildFile object correctly': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            buildFileSection = proj.pbxBuildFileSection(),
            buildFileEntry = buildFileSection[newFile.uuid];

        test.equal(buildFileEntry.isa, 'PBXBuildFile');
        test.equal(buildFileEntry.fileRef, newFile.fileRef);
        test.equal(buildFileEntry.fileRef_comment, 'libsqlite3.dylib');
        test.equal(buildFileEntry.settings, undefined);

        test.done();
    },
    'should add the PBXBuildFile object correctly /w weak linked frameworks': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib', { weak: true }),
            buildFileSection = proj.pbxBuildFileSection(),
            buildFileEntry = buildFileSection[newFile.uuid];

        test.equal(buildFileEntry.isa, 'PBXBuildFile');
        test.equal(buildFileEntry.fileRef, newFile.fileRef);
        test.equal(buildFileEntry.fileRef_comment, 'libsqlite3.dylib');
        test.deepEqual(buildFileEntry.settings, { ATTRIBUTES: [ 'Weak' ] });
        
        test.done();
    },
    'should add to the Frameworks PBXGroup': function (test) {
        var newLength = proj.pbxGroupByName('Frameworks').children.length + 1,
            newFile = proj.addFramework('libsqlite3.dylib'),
            frameworks = proj.pbxGroupByName('Frameworks');

        test.equal(frameworks.children.length, newLength);
        test.done();
    },
    'should have the right values for the PBXGroup entry': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            frameworks = proj.pbxGroupByName('Frameworks').children,
            framework = frameworks[frameworks.length - 1];

        test.equal(framework.comment, 'libsqlite3.dylib');
        test.equal(framework.value, newFile.fileRef);
        test.done();
    },
    'should add to the PBXFrameworksBuildPhase': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            frameworks = proj.pbxFrameworksBuildPhaseObj();

        test.equal(frameworks.files.length, 16);
        test.done();
    },
    'should have the right values for the Sources entry': function (test) {
        var newFile = proj.addFramework('libsqlite3.dylib'),
            frameworks = proj.pbxFrameworksBuildPhaseObj(),
            framework = frameworks.files[15];

        test.equal(framework.comment, 'libsqlite3.dylib in Frameworks');
        test.equal(framework.value, newFile.uuid);
        test.done();
    },
    'duplicate entries': {
        'should return false': function (test) {
            var newFile = proj.addFramework('libsqlite3.dylib');

            test.ok(!proj.addFramework('libsqlite3.dylib'));
            test.done();
        }
    },
    'should pbxFile correctly for custom frameworks': function (test) {
        var newFile = proj.addFramework('/path/to/Custom.framework', {customFramework: true});

        test.ok(newFile.customFramework);
        test.ok(!newFile.fileEncoding);
        test.equal(newFile.sourceTree, '"<group>"');
        test.equal(newFile.group, 'Frameworks');
        test.equal(newFile.basename, 'Custom.framework');
        test.equal(newFile.dirname, '/path/to');
        // XXX framework has to be copied over to PROJECT root. That is what XCode does when you drag&drop
        test.equal(newFile.path, '/path/to/Custom.framework');


        // should add path to framework search path
        var frameworkPaths = frameworkSearchPaths(proj);
            expectedPath = '"\\"/path/to\\""';
        
        for (i = 0; i < frameworkPaths.length; i++) {
            var current = frameworkPaths[i];
            test.ok(current.indexOf('"$(inherited)"') >= 0);
            test.ok(current.indexOf(expectedPath) >= 0);
        }
        test.done();
    }
}
