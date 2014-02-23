var fs = require('fs-extra'),
	_ = require('lodash');

function resetPkg(env, callback) {
	if (!fs.existsSync('./package.base.json')) 
		return callback(new Error('Cannot reset package.json because no package.base.json could be found.'));
	
	fs.copy('./package.base.json', './package.json', function(err) {
		if (err) return callback(err);
		fs.removeSync('./package.base.json');
		return callback();
	});
}
	
module.exports = function(env, callback) {
	try {
		var usedBasePkg = false;
		var pkg;

		if (env === 'base') {
			return resetPkg(env, callback);
		}
		else {
			if (fs.existsSync('./package.base.json')) {
				pkg = fs.readFileSync('./package.base.json');
				usedBasePkg = true;
			}
			else {
				pkg = fs.readFileSync('./package.json');
			}
			var envPkg = fs.readFileSync('./package.' + env + '.json');

			var pkgJson = JSON.parse(pkg);
			var envPkgJson = JSON.parse(envPkg);

			for(var prop in envPkgJson) {
				pkgJson[prop] = envPkgJson[prop];
			}
			if (usedBasePkg) {
				fs.writeJson('./package.json', pkgJson, function(err) {
					return callback(err, pkgJson);
				});	
			}
			else {
				fs.copy('./package.json', './package.base.json', function(err) {
					if (err) return callback(err);
					fs.writeJson('./package.json', pkgJson, function(err) {
						return callback(err, pkgJson);
					});	
				});	
			}
		}
		
		
	}
	catch(e) {
		return callback(e);
	}
};