var pbx = require('../lib/pbxProject'),
    fs = require('fs'),
    myProj;

function testProjectContents(filename) {

}

exports.writeSync = {
    'should write out the simple "hash" test': function (test) {
        var file = 'test/parser/projects/hash.pbxproj',
            myProj = new pbx(file),
            contents = fs.readFileSync(file, 'utf-8');

        myProj.parse(function (err, projHash) {
            var written = myProj.writeSync();

            test.equal(written, contents);
            test.done();
        })
    },
    'should write out the simple "with_array" test': function (test) {
        var file = 'test/parser/projects/with_array.pbxproj',
            myProj = new pbx(file),
            contents = fs.readFileSync(file, 'utf-8');

        myProj.parse(function (err, projHash) {
            var written = myProj.writeSync();

            test.equal(written, contents);
            test.done();
        })
    },
    'should write out the simple "section" test': function (test) {
        var file = 'test/parser/projects/section.pbxproj',
            myProj = new pbx(file),
            contents = fs.readFileSync(file, 'utf-8');

        myProj.parse(function (err, projHash) {
            var written = myProj.writeSync();

            test.equal(written, contents);
            test.done();
        })
    }
}
