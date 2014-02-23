var jitsuenv = require('../lib/jitsu-env'),
	expect = require('chai').expect,
	fs = require('fs-extra');

process.chdir('./test');

describe('jitsu-env', function() {
	beforeEach(function() {
		fs.copySync('./files/package.json', './package.json');
		fs.copySync('./files/package.staging.json', './package.staging.json');
	});

	afterEach(function() {
		fs.removeSync('./package.json');
		fs.removeSync('./package.staging.json');
		fs.removeSync('./package.base.json');
	});

	describe('jitsu-env <env>', function() {

		describe('existing package.<env>.json, no package.base.json', function() {
			beforeEach(function(done) {
				jitsuenv('staging', done);
			});

			it('should add new properties from package.<env>.json to package.json', function() {
				var pkg = fs.readJsonSync('./package.json');
				expect(pkg).to.have.property('newProperty', 'value');
			});

			it('should overwrite existing properties in package.json with values from package.<env>.json', function() {
				var pkg = fs.readJsonSync('./package.json');
				expect(pkg).to.have.property('subdomain', 'staging-myapp');
				expect(pkg.domains).to.have.members(["staging-domain1.myapp.com"]);
			});

			it('should preserve values in package.json which do not exist in package.<env>.json', function() {
				var pkg = fs.readJsonSync('./package.json');
				expect(pkg).to.have.property('name', 'my-app');
			});

			it('should copy original package.json to package.base.json', function() {
				var pkgBase = fs.readJsonSync('./package.base.json');
				expect(pkgBase).to.have.property('name', 'my-app');
				expect(pkgBase).to.not.have.property('newProperty');
			});
		});

		describe('existing package.<env>.json, existing package.base.json', function() {
			beforeEach(function(done) {
				fs.copySync('./files/package.base.json', './package.base.json');
				jitsuenv('staging', done);
			});

			it('should use package.base.json for merging instead of package.json', function() {
				var pkg = fs.readJsonSync('./package.json');
				expect(pkg).to.have.property('name', 'my-app-base');
			});
		});

		describe('no package.<env>.json', function() {
			
			it('should return err', function(done) {
				jitsuenv('xyz', function(err) {
					expect(err).to.exist;
					done();
				});
			});	
		});
	});

	describe('jitsu-env base', function() {

		describe('no package.base.json', function() {
			it('should return err', function(done) {
				jitsuenv('base', function(err) {
					expect(err).to.exist;
					done();
				});
			});
		});

		describe('existing package.base.json', function() {
			beforeEach(function(done) {
				fs.copySync('./files/package.base.json', './package.base.json');
				jitsuenv('base', done);
			});

			it('should reset package.json', function() {
				var pkg = fs.readJsonSync('./package.json');
				expect(pkg).to.not.have.property('author');
			});
			
			it('should delete package.base.json after resetting package.json', function() {
				expect(fs.existsSync('./package.base.json')).to.be.false;
			});
		});

	});	
});