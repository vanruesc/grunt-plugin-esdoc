/**
 * grunt-plugin-esdoc v1.0.0 build Mar 14 2018
 * https://github.com/vanruesc/grunt-plugin-esdoc
 * Copyright 2018 Raoul van Rüschen, Zlib
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var esdoc = _interopDefault(require('esdoc'));
var path = _interopDefault(require('path'));

function generateDocumentation(grunt, options) {

		if (options.source === null) {

				grunt.fail.warn("No source path specified");
		} else if (!grunt.file.exists(options.source)) {

				grunt.fail.warn("Invalid source path");
		} else if (options.destination === null) {

				grunt.fail.warn("No destination path specified");
		} else {

				try {

						esdoc.generate(options);

						var coveragePath = path.join(options.destination, "coverage.json");

						if (grunt.file.exists(coveragePath)) {

								var coverageReport = grunt.file.readJSON(coveragePath);
								var coverage = coverageReport.coverage;
								var expected = coverageReport.expectCount;
								var actual = coverageReport.actualCount;
								var unsatisfactory = Number.parseFloat(coverage.replace("%", "")) < options.coverageThreshold;

								grunt.log[unsatisfactory ? "warn" : "ok"]("Coverage: " + coverage);
								grunt.log[unsatisfactory ? "warn" : "ok"]("Files: " + actual + "/" + expected);
						}
				} catch (error) {

						grunt.fail.fatal(error);
				}
		}
}

function registerESDocTask(grunt) {

		grunt.registerMultiTask("esdoc", "A documentation generator for JavaScript.", function () {
				var log = console.log;

				var options = this.options({
						coverageThreshold: 100.0,
						verbose: false,
						config: null,
						destination: null,
						source: null
				});

				if (options.config !== null) {

						Object.assign(options, grunt.file.readJSON(options.config));
				}

				if (!options.verbose && !grunt.option("verbose")) {
						console.log = function () {};
				}

				if (this.files.length > 0) {

						this.files.forEach(function (file) {

								if (file.src !== undefined && file.src.length === 1) {

										options.source = file.src[0];
								}

								if (file.dest !== undefined) {

										options.destination = file.dest;
								}

								generateDocumentation(grunt, options);
						});
				} else {

						generateDocumentation(grunt, options);
				}

				console.log = log;
		});
}

module.exports = registerESDocTask;
