# Grunt Plugin: ESDoc

[![Build status](https://travis-ci.org/vanruesc/grunt-plugin-esdoc.svg?branch=master)](https://travis-ci.org/vanruesc/grunt-plugin-esdoc)
[![npm version](https://badge.fury.io/js/grunt-plugin-esdoc.svg)](https://badge.fury.io/js/grunt-plugin-esdoc)
[![Dependencies](https://david-dm.org/vanruesc/grunt-plugin-esdoc.svg?branch=master)](https://david-dm.org/vanruesc/grunt-plugin-esdoc)

A Grunt plugin for the ES2015+ documentation tool [ESDoc](https://esdoc.org/).


## Getting Started

This plugin requires Grunt >= 0.4.0

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) 
guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. 
Once you're familiar with that process, you may install this plugin with this command:

```sh
npm install grunt-plugin-esdoc
``` 

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks("grunt-plugin-esdoc");
```


## Usage

##### MyClass.js

```js
/**
 * Description of MyClass.
 */

export default class MyClass {

	/**
	 * Description of the method.
	 *
	 * @param {Number} param - Description of the parameter.
	 * @return {Number} Description of the return value.
	 */

	method(param) {}

}
```

##### Gruntfile.js

```js
grunt.initConfig({
	esdoc: {
		options: {
			plugins: [{
				name: "esdoc-standard-plugin"
			}]
		},
		compile: {
			src: "src",
			dest: "docs"
		}
	}
});
```

Call the `esdoc` task to generate the documentation. Use `--verbose` to see all ESDoc log messages.

```bash
grunt esdoc [--verbose]
```

You may also integrate the task into your build sequence:

```js
grunt.registerTask("default", ["lint", "test", "esdoc"]);
```


## Configuration

All [ESDoc options](https://esdoc.org/manual/config.html) defined under `options` are passed to ESDoc.
You may also specify additional plugin-specific options:

| Option            | Description                                                                                                                     | Default |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|---------|
| coverageThreshold | Affects the color of the coverage report in the console. Has no effect if coverage is not available. Expressed as a percentage. | 100.0   |
| verbose           | Enables exhaustive ESDoc logging.                                                                                               | false   |

```js
grunt.initConfig({
	esdoc: {
		options: {
			verbose: true,
			coverageThreshold: 95.0,
			plugins: [{
				name: "esdoc-standard-plugin",
				option: {
					test: {
						source: "./test/",
						interfaces: ["suite", "test"],
						includes: ["(spec|Spec|test|Test)\\.js$"],
						excludes: ["\\.config\\.js$"]
					}
				}
			}]
		},
		compile: {
			src: "./path/to/src",
			dest: "./path/to/esdoc/output"
		}
	}
});
```

Alternatively, you can specify a `config` path to a file containing the configuration options for ESDoc.

##### esdoc.json

```js
{
	"source": "src",
	"destination": "docs",
	"coverageThreshold": 95.0,
	"plugins": [{"name": "esdoc-standard-plugin"}]
}
```

##### Gruntfile.js

```js
grunt.initConfig({
	esdoc: {
		compile: {
			options: {
				config: "esdoc.json"
			}
		}
	}
});
```

Note that `src` and `dest` override `source` and `destination` if they are defined.


## Contributing

Maintain the existing coding style. Lint and test your code.
