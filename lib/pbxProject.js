var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    path = require('path'),
    fork = require('child_process').fork

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

module.exports = pbxProject;
