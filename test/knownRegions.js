var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    project = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    project.hash = cleanHash();
    callback();
}

exports.addKnownRegion = {
  'should add new region to existing knownRegions': function (test) {
    var knownRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'];
    test.equal(knownRegions.indexOf('Spanish'), -1);

    project.addKnownRegion('Spanish')
    knownRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'];
    test.notEqual(knownRegions.indexOf('Spanish'), -1);
    test.done();
  },

  'should not add region if it already exists in knownRegions': function (test) {
    var numberOfRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'].length;

    project.addKnownRegion('German');
    var newNumberOfRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'].length;
    test.equal(numberOfRegions, newNumberOfRegions);
    test.done();
  },

  'should create knownRegions array if it does not exist': function (test) {
    delete project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'];
    test.ok(!project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions']);

    project.addKnownRegion('German')
    test.ok(project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions']);
    test.done();
  },
}

exports.removeKnownRegion = {
  'should remove named region from knownRegions': function (test) {
    var knownRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'];
    test.notEqual(knownRegions.indexOf('German'), -1);

    project.removeKnownRegion('German');
    knownRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'];
    test.equal(knownRegions.indexOf('German'), -1);
    test.done();
  },

  'should do nothing if named region does not exist in knownRegions': function (test) {
    let numberOfRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'].length;

    project.removeKnownRegion('Korean');
    let newNumberOfRegions = project.pbxProjectSection()[project.getFirstProject()['uuid']]['knownRegions'].length;
    test.equal(numberOfRegions, newNumberOfRegions);
    test.done();
  },
}

exports.hasKnownRegion = {
  'should return true if named region exists in knownRegions': function (test) {
    test.ok(project.hasKnownRegion('German'));
    test.done();
  },

  'should return false if named region does not exist in knownRegions': function (test) {
    test.ok(!project.hasKnownRegion('Ducth'));
    test.done();
  },
}
