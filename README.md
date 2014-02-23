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