var PEG = require('pegjs'),
    fs = require('fs'),
    pbx = fs.readFileSync('test/projects/hash.pbxproj', 'utf-8'),
    grammar = fs.readFileSync('pbxproj.pegjs', 'utf-8'),
    parser = PEG.buildParser(grammar),
    rawProj = parser.parse(pbx),
    project = rawProj.project;

exports['should have the top-line comment in place'] = function (test) {
    test.equals(rawProj.headComment, '!$*UTF8*$!');
    test.done()
}

exports['should parse a numeric attribute'] = function (test) {
    test.strictEqual(project.archiveVersion, 1);
    test.done()
}

exports['should parse an empty object'] = function (test) {
    var empty = project.classes;
    test.equal(Object.keys(empty).length, 0);
    test.done()
}
