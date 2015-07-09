var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    proj = new pbx('.'),
    debugConfiguration = {
		isa: 'XCBuildConfiguration',
		buildSettings: {
			GCC_PREPROCESSOR_DEFINITIONS: [
				'"DEBUG=1"',
				'"$(inherited)"',
            ],
			INFOPLIST_FILE: "Info.Plist",
			LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
			PRODUCT_NAME: '"${TARGET_NAME}"',
			SKIP_INSTALL: 'YES'
		},
		name: 'Debug'                
    },
    releaseConfiguration = {
		isa: 'XCBuildConfiguration',
		buildSettings: {
			INFOPLIST_FILE: "Info.Plist",
			LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
			PRODUCT_NAME: '"${TARGET_NAME}"',
			SKIP_INSTALL: 'YES'
		},
		name: 'Release'
	};

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.addXCConfigurationList = {
    'should return an XCConfigurationList': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment');

        test.ok(typeof xcConfigurationList === 'object');
        test.done();
    },
    'should set a uuid on the XCConfigurationList': function (test) {
         var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment');

        test.ok(xcConfigurationList.uuid);
        test.done();
    },
    'should add configurations to pbxBuildConfigurationSection': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            pbxBuildConfigurationSection = myProj.pbxXCBuildConfigurationSection(),
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment'),
            xcConfigurationListConfigurations = xcConfigurationList.xcConfigurationList.buildConfigurations;

        for (var index = 0; index < xcConfigurationListConfigurations.length; index++) {
            var configuration = xcConfigurationListConfigurations[index];
            test.ok(pbxBuildConfigurationSection[configuration.value]);
        }

        test.done();
    },
    'should add XCConfigurationList to pbxXCConfigurationListSection': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            pbxXCConfigurationListSection = myProj.pbxXCConfigurationList();
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment');

        test.ok(pbxXCConfigurationListSection[xcConfigurationList.uuid]);
        test.done();
    },
    'should add XCConfigurationList object correctly': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            pbxXCConfigurationListSection = myProj.pbxXCConfigurationList();
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment'),
            xcConfigurationListInPbx = pbxXCConfigurationListSection[xcConfigurationList.uuid];
            
        test.deepEqual(xcConfigurationListInPbx, xcConfigurationList.xcConfigurationList);
        test.done();
    },
    'should add correct configurations to XCConfigurationList and to pbxBuildConfigurationSection': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            pbxXCConfigurationListSection = myProj.pbxXCConfigurationList();
            pbxBuildConfigurationSection = myProj.pbxXCBuildConfigurationSection(),
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment'),
            xcConfigurationListConfigurations = xcConfigurationList.xcConfigurationList.buildConfigurations,
            expectedConfigurations = [],
            xcConfigurationListInPbx = pbxXCConfigurationListSection[xcConfigurationList.uuid];

        for (var index = 0; index < xcConfigurationListConfigurations.length; index++) {
            var configuration = xcConfigurationListConfigurations[index];
            expectedConfigurations.push(pbxBuildConfigurationSection[configuration.value]);
        }
            
        test.deepEqual(expectedConfigurations, [debugConfiguration, releaseConfiguration]);
        test.deepEqual(xcConfigurationListInPbx.buildConfigurations, xcConfigurationListConfigurations);
        test.done();
    },
    'should set comments for pbxBuildConfigurations': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj').parseSync(),
            pbxBuildConfigurationSection = myProj.pbxXCBuildConfigurationSection(),
            xcConfigurationList = myProj.addXCConfigurationList([debugConfiguration, releaseConfiguration], 'Release', 'XCConfigurationList Comment'),
            xcConfigurationListConfigurations = xcConfigurationList.xcConfigurationList.buildConfigurations;

        for (var index = 0; index < xcConfigurationListConfigurations.length; index++) {
            var configuration = xcConfigurationListConfigurations[index];
            test.ok(pbxBuildConfigurationSection[configuration.value + '_comment']);
        }
            
        test.done();
    }
}
