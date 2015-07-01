var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    proj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.addTargetDependency = {
    'should return undefined when no target specified': function (test) {
        var buildPhase = proj.addTargetDependency();
        
        test.ok(typeof buildPhase === 'undefined');
        test.done()
    },
    'should throw when target not found in nativeTargetsSection': function (test) {
        test.throws(function() {
            proj.addTargetDependency('invalidTarget');
        });
        test.done()
    },
    'should throw when any dependency target not found in nativeTargetsSection': function (test) {
        test.throws(function() {
            proj.addTargetDependency('1D6058900D05DD3D006BFB54', ['invalidTarget']);
        });
        test.done()
    },
    'should return the pbxTarget': function (test) {
        var target = proj.addTargetDependency('1D6058900D05DD3D006BFB54', ['1D6058900D05DD3D006BFB54']);
        
        test.ok(typeof target == 'object');
        test.ok(target.uuid);
        test.ok(target.target);
        test.done();
    },
    'should add targetDependencies to target': function (test) {
        var targetInPbxProj = proj.pbxNativeTarget()['1D6058900D05DD3D006BFB55'];
        test.deepEqual(targetInPbxProj.dependencies, []);
        
        var target = proj.addTargetDependency('1D6058900D05DD3D006BFB55', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target;
        test.deepEqual(targetInPbxProj.dependencies, target.dependencies)
        test.done()
    },
    'should create a PBXTargetDependency for each dependency target': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB54', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target;
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependency = target.dependencies[index].value;
            test.ok(pbxTargetDependencySection[dependency]);
        }
        
        test.done()
    },
    'should set right comment for each dependency target': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB54', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target;
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependencyCommentKey = target.dependencies[index].value + '_comment';
            test.equal(pbxTargetDependencySection[dependencyCommentKey], 'PBXTargetDependency');
        }

        test.done()
    },
    'should create a PBXContainerItemProxy for each PBXTargetDependency': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            pbxContainerItemProxySection = proj.hash.project.objects['PBXContainerItemProxy'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB54', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target;
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependency = target.dependencies[index].value,
                targetProxy = pbxTargetDependencySection[dependency]['targetProxy'];

            test.ok(pbxContainerItemProxySection[targetProxy]);
        }
        
        test.done()
    },
    'should set each PBXContainerItemProxy`s remoteGlobalIDString correctly': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            pbxContainerItemProxySection = proj.hash.project.objects['PBXContainerItemProxy'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB55', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target,
            remoteGlobalIDStrings = [];
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependency = target.dependencies[index].value,
                targetProxy = pbxTargetDependencySection[dependency]['targetProxy'];

            remoteGlobalIDStrings.push(pbxContainerItemProxySection[targetProxy]['remoteGlobalIDString']);
        }
        
        test.deepEqual(remoteGlobalIDStrings, ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']);
        test.done()
    },
    'should set each PBXContainerItemProxy`s remoteInfo correctly': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            pbxContainerItemProxySection = proj.hash.project.objects['PBXContainerItemProxy'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB55', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target,
            remoteInfoArray = [];
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependency = target.dependencies[index].value,
                targetProxy = pbxTargetDependencySection[dependency]['targetProxy'];

            remoteInfoArray.push(pbxContainerItemProxySection[targetProxy]['remoteInfo']);
        }
        
        test.deepEqual(remoteInfoArray, ['"KitchenSinktablet"', '"TestApp"']);
        test.done()
    },
    'should set each PBXContainerItemProxy`s containerPortal correctly': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            pbxContainerItemProxySection = proj.hash.project.objects['PBXContainerItemProxy'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB55', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target;
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependency = target.dependencies[index].value,
                targetProxy = pbxTargetDependencySection[dependency]['targetProxy'];

            test.equal(pbxContainerItemProxySection[targetProxy]['containerPortal'], proj.hash.project['rootObject']);
        }
        
        test.done()
    },
    'should set each PBXContainerItemProxy`s proxyType correctly': function (test) {
        var pbxTargetDependencySection = proj.hash.project.objects['PBXTargetDependency'],
            pbxContainerItemProxySection = proj.hash.project.objects['PBXContainerItemProxy'],
            target = proj.addTargetDependency('1D6058900D05DD3D006BFB55', ['1D6058900D05DD3D006BFB54', '1D6058900D05DD3D006BFB55']).target;
            
        for (var index = 0; index < target.dependencies.length; index++) {
            var dependency = target.dependencies[index].value,
                targetProxy = pbxTargetDependencySection[dependency]['targetProxy'];

            test.equal(pbxContainerItemProxySection[targetProxy]['proxyType'], 1);
        }
        
        test.done()
    }
}
