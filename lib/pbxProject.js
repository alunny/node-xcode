var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    path = require('path'),
    fork = require('child_process').fork,
    pbxWriter = require('./pbxWriter')

function pbxProject(filename) {
    this.filepath = path.resolve(filename)
}

util.inherits(pbxProject, EventEmitter)

pbxProject.prototype.parse = function (cb) {
    var worker = fork(__dirname + '/parseJob.js', [this.filepath])

    worker.on('message', function (msg) {
        if (msg.code) {
            this.emit('error', msg);
        } else {
            this.hash = msg;
            this.emit('end', null, msg)
        }
    }.bind(this));

    if (cb)
        this.on('end', cb);

    return this;
}

pbxProject.prototype.writeSync = function () {
    this.writer = new pbxWriter(this.hash);
    return this.writer.writeSync();
}

module.exports = pbxProject;
