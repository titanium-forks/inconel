#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench');

var PLATFORM = 'windows';
var EXCLUDE_REGEX = /^alloy\/(?:sync|widgets)/;
var SCRIPT_REGEX = /\.(?:hjs|js|json)$/;

var projectDir = process.argv[2] || '.',
	hyperloopDir = path.join(projectDir, 'hyperloop'),
	rootDir = path.join(projectDir, 'Resources', PLATFORM);

// ensure we have a valid directories
if (!fs.existsSync(projectDir)) {
	die('"%s" does not exist', projectDir);
} else if (!fs.existsSync(path.join(projectDir, 'tiapp.xml'))) {
	die('"%s" does not contain a tiapp.xml file', projectDir);
}

// create hyperloop structure
wrench.rmdirSyncRecursive(hyperloopDir, true);
wrench.mkdirSyncRecursive(hyperloopDir, 0755);

// copy in critical alloy files for hyperloop app
wrench.readdirSyncRecursive(rootDir).forEach(function(file) {

	// skip alloy files not handled by hyperloop
	if (EXCLUDE_REGEX.test(file)) { return; }

	var src = path.join(rootDir, file),
		dst = path.join(hyperloopDir, file),
		dirname = path.dirname(file),
		prefix = '';

	// make sure dest dir exists
	wrench.mkdirSyncRecursive(path.dirname(dst));

	// just copy non-script files
	if (!SCRIPT_REGEX.test(file)) {
		if (!fs.statSync(src).isDirectory()) {
			copyFileSync(src, dst);
		}
		return;
	}

	// create relative path for ti.current require()
	if (dirname === '.') {
		prefix = './';
	} else {
		for (var i = 0; i < dirname.split('/').length; i++) {
			prefix += '../';
		}
	}

	// copy file, with require hack
	var code = fs.readFileSync(src, 'utf8').replace(/require\((['"])/g, 'require($1' + prefix);
	fs.writeFileSync(dst, code);
});

console.log('Alloy app in "%s" converted to hyperloop at "%s"', projectDir, hyperloopDir);

function copyFileSync(src, dst) {
	fs.writeFileSync(dst, fs.readFileSync(src));
}

function die() {
	var args = Array.prototype.slice.call(arguments, 0);
	if (args[0]) { args[0] = '[ERROR] ' + args[0]; }
	console.error.apply(console, args);
	process.exit(1);
}
