var PEG = require('pegjs'),
    fs = require('fs'),
    pbx = fs.readFileSync('test/projects/two-sections.pbxproj', 'utf-8'),
    grammar = fs.readFileSync('pbxproj.pegjs', 'utf-8'),
    parser = PEG.buildParser(grammar),
    rawProj = parser.parse(pbx),
    project = rawProj.project;

exports['should parse a project with two sections'] = function (test) {
    // if it gets this far it's worked
    test.done();
}

exports['should have both sections on the project object'] = function (test) {
    test.ok(project.objects['PBXTargetDependency']);
    test.ok(project.objects['PBXSourcesBuildPhase']);
    test.done();
}
