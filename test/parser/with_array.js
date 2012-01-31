var PEG = require('pegjs'),
    fs = require('fs'),
    pbx = fs.readFileSync('test/parser/projects/with_array.pbxproj', 'utf-8'),
    grammar = fs.readFileSync('lib/parser/pbxproj.pegjs', 'utf-8'),
    parser = PEG.buildParser(grammar),
    rawProj = parser.parse(pbx),
    project = rawProj.project;

exports['should parse arrays with commented entries'] = function (test) {
    test.ok(project.files instanceof Array);
    test.equal(project.files.length, 2);
    test.done()
}

exports['should parse arrays with uncommented entries'] = function (test) {
    test.ok(project.ARCHS instanceof Array);
    test.equal(project.ARCHS.length, 2);
    test.done()
}

exports['should parse empty arrays'] = function (test) {
    test.ok(project.empties instanceof Array);
    test.equal(project.empties.length, 0);
    test.done();
}
