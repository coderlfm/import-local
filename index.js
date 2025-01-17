'use strict';
const path = require('path');
const resolveCwd = require('resolve-cwd');
const pkgDir = require('pkg-dir');
const os = require('os')

module.exports = filename => {
	const globalDir = pkgDir.sync(path.dirname(filename));
	const relativePath = path.relative(globalDir, filename);
	const pkg = require(path.join(globalDir, 'package.json'));
	const localFile = resolveCwd.silent(path.join(pkg.name, relativePath));
	const localNodeModules = path.join(process.cwd(), 'node_modules');
	const fileInLocalPath = path.relative(localNodeModules, filename);
	const filenameInLocalNodeModules = fileInLocalPath.startsWith('..') || (os.type() === 'Windows_NT' && path.isAbsolute(fileInLocalPath));

	// Use `path.relative()` to detect local package installation,
	// because __filename's case is inconsistent on Windows
	// Can use `===` when targeting Node.js 8
	// See https://github.com/nodejs/node/issues/6624
	return filenameInLocalNodeModules && localFile && path.relative(localFile, filename) !== '' && require(localFile);
};
