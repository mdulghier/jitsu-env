[![Build Status](https://travis-ci.org/mdulghier/jitsu-env.png?branch=master)](https://travis-ci.org/mdulghier/jitsu-env)
[![Coverage Status](https://coveralls.io/repos/mdulghier/jitsu-env/badge.png)](https://coveralls.io/r/mdulghier/jitsu-env)
[![Dependency Status](https://david-dm.org/mdulghier/jitsu-env.png)](https://david-dm.org)

# Nodejitsu Environment Manager

Prepares your package.json for deployment in different Nodejitsu applications.



## Installation

```
$ npm install -g jitsu-env
```

## Usage

Create a `package.<env>.json` file for each environment you'd like to deploy to.
e.g. `package.staging.json`.

Then run

```
$ jitsu-env staging
```

to copy properties specified in package.staging.json into package.json. The original package.json is copied to package.base.json.

To reset your package.json to the original values simply call

```
$ jitsu-env base
```

## Example

### package.json

```
{
	"name": "my-app"
}
```

### package.staging.json

```
{
	"name": "my-app-staging",
	"subdomain": "staging-myapp",
	"domains": [
		"staging-www.myapp.com",
		"staging-api.myapp.com"
	],
	"scripts": {
		"predeploy": "gulp build:staging"
	}
}
```

### package.production.json

```
{
	"name": "my-app",
	"subdomain": "myapp",
	"domains": [
		"www.myapp.com",
		"api.myapp.com"
	],
	"scripts": {
		"predeploy": "gulp build:production"
	}
}
```