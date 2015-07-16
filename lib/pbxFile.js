var path = require('path'),
    util = require('util');

var DEFAULT_SOURCETREE = '"<group>"',
    DEFAULT_PRODUCT_SOURCETREE = 'BUILT_PRODUCTS_DIR',
    DEFAULT_FILEENCODING = 4,
    DEFAULT_GROUP = 'Resources',
    DEFAULT_FILETYPE = 'unknown';

var FILETYPE_BY_EXTENSION = {
        a: 'archive.ar',
        app: 'wrapper.application',
        appex: 'wrapper.app-extension',
        bundle: 'wrapper.plug-in',
        dylib: 'compiled.mach-o.dylib',
        framework: 'wrapper.framework',
        h: 'sourcecode.c.h',
        m: 'sourcecode.c.objc',
        markdown: 'text',
        mdimporter: 'wrapper.cfbundle',
        octest: 'wrapper.cfbundle',
        pch: 'sourcecode.c.h',
        plist: 'text.plist.xml',
        sh: 'text.script.sh',
        swift: 'sourcecode.swift',
        xcassets: 'folder.assetcatalog',
        xcconfig: 'text.xcconfig',
        xcdatamodel: 'wrapper.xcdatamodel',
        xcodeproj: 'wrapper.pb-project',
        xctest: 'wrapper.cfbundle',
        xib: 'file.xib'
    },
    EXTENSION_BY_PRODUCTTYPE = {
        'com.apple.product-type.application': 'app',
        'com.apple.product-type.application.watchapp': 'app',
        'com.apple.product-type.app-extension': 'appex',
        'com.apple.product-type.watchkit-extension': 'appex',
        'com.apple.product-type.bundle': 'bundle',
        'com.apple.product-type.bundle.unit-test': 'xctest',
        'com.apple.product-type.framework': 'framework',
        'com.apple.product-type.library.dynamic': 'dylib',
        'com.apple.product-type.library.static': 'a',
        'com.apple.product-type.tool': ''
    },
    GROUP_BY_FILETYPE = {
        'archive.ar': 'Frameworks',
        'compiled.mach-o.dylib': 'Frameworks',
        'wrapper.framework': 'Frameworks',
        'sourcecode.c.h': 'Sources',
        'sourcecode.c.objc': 'Sources',
        'sourcecode.swift': 'Sources'
    },
    PATH_BY_FILETYPE = {
        'compiled.mach-o.dylib': 'usr/lib/',
        'wrapper.framework': 'System/Library/Frameworks/'
    },
    SOURCETREE_BY_FILETYPE = {
        'compiled.mach-o.dylib': 'SDKROOT',
        'wrapper.framework': 'SDKROOT'
    },
    ENCODING_BY_FILETYPE = {
        'sourcecode.c.h': 4,
        'sourcecode.c.h': 4,
        'sourcecode.c.objc': 4,
        'sourcecode.swift': 4,
        'text': 4,
        'text.plist.xml': 4,
        'text.script.sh': 4,
        'text.xcconfig': 4
    };


function detectType(filePath) {
    var extension = path.extname(filePath),
        type = FILETYPE_BY_EXTENSION[extension];

    if (!type) {
        return DEFAULT_FILETYPE;
    }

    return type;
}

function defaultExtension(fileRef) {
    var extension = EXTENSION_BY_PRODUCTTYPE[fileRef.explicitFileType];

    if (!extension) {
        return;
    }

    return extension;
}

function defaultEncoding(fileRef) {
    var encoding = ENCODING_BY_FILETYPE[fileRef.lastKnownFileType];

    if (encoding) {
        return encoding;
    }
}

function defaultGroup(fileRef) {
    var groupName = GROUP_BY_FILETYPE[fileRef.lastKnownFileType];

    if (!groupName) {
        return DEFAULT_GROUP;
    }

    return groupName;
}

function defaultSourcetree(fileRef) {
    var sourcetree = SOURCETREE_BY_FILETYPE[fileRef.lastKnownFileType];

    if (fileRef.customFramework) {
        return filePath;
    }

    if (fileRef.explicitFileType) {
        return DEFAULT_PRODUCT_SOURCETREE;
    }

    return sourcetree;
}

function defaultPath(fileRef, filePath) {
    var defaultPath = PATH_BY_FILETYPE[fileRef.lastKnownFileType];

    if (fileRef.customFramework) {
        return filePath;
    }
    if (defaultPath) {
        return path.join(defaultPath, filePath);
    }

    return filePath;
}

function defaultGroup(fileRef) {
    var groupName = GROUP_BY_FILETYPE[fileRef.lastKnownFileType];

    if (!groupName) {
        return DEFAULT_GROUP;
    }

    return defaultGroup;
}

function pbxFile(filepath, opt) {
    var opt = opt || {};

    this.lastKnownFileType = opt.lastKnownFileType || detectType(filepath);

    // for custom frameworks
    if (opt.customFramework == true) {
        this.customFramework = true;
        this.dirname = path.dirname(filepath);
    }

    this.basename = path.basename(filepath);
    this.path = correctPath(this, filepath);
    this.group = correctGroup(this);

    this.sourceTree = opt.sourceTree || defaultSourceTree(this);
    this.fileEncoding = opt.fileEncoding || fileEncoding(this);

    if (opt.weak && opt.weak === true) 
        this.settings = { ATTRIBUTES: ['Weak'] };

    if (opt.compilerFlags) {
        if (!this.settings)
            this.settings = {};
        this.settings.COMPILER_FLAGS = util.format('"%s"', opt.compilerFlags);
    }
}

module.exports = pbxFile;
