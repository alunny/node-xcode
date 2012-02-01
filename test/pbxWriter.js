var pbx = require('../lib/pbxProject'),
    fs = require('fs'),
    myProj;

function testProjectContents(filename, test) {
    var myProj = new pbx(filename),
        content = fs.readFileSync(filename, 'utf-8');

    // normalize tabs vs strings
    content = content.replace(/\t/g, '    ');

    myProj.parse(function (err, projHash) {
        var written = myProj.writeSync();

        test.equal(content, written);
        test.done();
    });
}

exports.writeSync = {
    'should write out the "hash" test': function (test) {
        testProjectContents('test/parser/projects/hash.pbxproj', test);
    },
    'should write out the "with_array" test': function (test) {
        testProjectContents('test/parser/projects/with_array.pbxproj', test);
    },
    'should write out the "section" test': function (test) {
        testProjectContents('test/parser/projects/section.pbxproj', test);
    },
    'should write out the "two-sections" test': function (test) {
        testProjectContents('test/parser/projects/two-sections.pbxproj', test);
    }
}
