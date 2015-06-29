var jsonProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(jsonProject),
    pbx = require('../lib/pbxProject'),
    pbxFile = require('../lib/pbxFile'),
    myProj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    myProj.hash = cleanHash();
    callback();
}

exports['addToPbxFileReferenceSection function'] = {
    'should add file and comment to fileReferenceSection': function (test) {
        var file = new pbxFile('file.m');
        file.fileRef = myProj.generateUuid();
        
        myProj.addToPbxFileReferenceSection(file)

        test.equal(myProj.pbxFileReferenceSection()[file.fileRef].isa, 'PBXFileReference');
        test.equal(myProj.pbxFileReferenceSection()[file.fileRef].lastKnownFileType, 'sourcecode.c.objc');
        test.equal(myProj.pbxFileReferenceSection()[file.fileRef].name, '"file.m"');
        test.equal(myProj.pbxFileReferenceSection()[file.fileRef].path, '"file.m"');
        test.equal(myProj.pbxFileReferenceSection()[file.fileRef].sourceTree, '"<group>"');
        test.equal(myProj.pbxFileReferenceSection()[file.fileRef].fileEncoding, 4);
        test.equal(myProj.pbxFileReferenceSection()[file.fileRef + "_comment"], 'file.m');
        test.done();
    },
    'should add file with preset explicitFileType to fileReferenceSection correctly': function (test) {
        var appexFile = { fileRef: myProj.generateUuid(), isa: 'PBXFileReference', explicitFileType: '"wrapper.app-extension"', path: "WatchKit Extension.appex"};

        myProj.addToPbxFileReferenceSection(appexFile)

        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].isa, 'PBXFileReference');
        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].explicitFileType, '"wrapper.app-extension"');
        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].path, '"WatchKit Extension.appex"');
        test.done();
    },
    'should add file with preset includeInIndex to fileReferenceSection correctly': function (test) {
        var appexFile = { fileRef: myProj.generateUuid(), isa: 'PBXFileReference', includeInIndex: 0, path: "WatchKit Extension.appex"};
        
        myProj.addToPbxFileReferenceSection(appexFile)

        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].isa, 'PBXFileReference');
        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].includeInIndex, 0);
        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].path, '"WatchKit Extension.appex"');
        test.done();
    },
    'should add file with preset sourceTree to fileReferenceSection correctly': function (test) {
        var appexFile = { fileRef: myProj.generateUuid(), isa: 'PBXFileReference', sourceTree: 'BUILT_PRODUCTS_DIR', path: "WatchKit Extension.appex"};
        
        myProj.addToPbxFileReferenceSection(appexFile)

        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].isa, 'PBXFileReference');
        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].sourceTree, 'BUILT_PRODUCTS_DIR');
        test.equal(myProj.pbxFileReferenceSection()[appexFile.fileRef].path, '"WatchKit Extension.appex"');
        test.done();
    }
}