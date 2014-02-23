var fs = require('fs-extra');

function resetPkg(env, callback) {
	if (!fs.existsSync('./package.base.json')) 
		return callback(new Error('Cannot reset package.json because no package.base.json could be found.'));
	
	fs.copy('./package.base.json', './package.json', function(err) {
		if (err) return callback(err);
		fs.removeSync('./package.base.json');
		return callback();
	});
}

function preparePkg(env, callback) {
	var pkg;
	if (fs.existsSync('./package.base.json')) {
		pkg = fs.readJsonSync('./package.base.json');
	}
	else {
		pkg = fs.readJsonSync('./package.json');
		fs.copySync('./package.json', './package.base.json');
	}
	var pkgEnv = fs.readJsonSync('./package.' + env + '.json');
	
	for(var prop in pkgEnv) {
		pkg[prop] = pkgEnv[prop];
	}
	
	fs.writeJsonSync('./package.json', pkg);
	return callback();
}
	
module.exports = function(env, callback) {
	try {
		if (env === 'base') {
			return resetPkg(env, callback);
		}
		else {
			return preparePkg(env, callback);	
		}
	}
	catch(e) {
		return callback(e);
	}
};