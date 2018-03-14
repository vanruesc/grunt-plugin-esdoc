import esdoc from "esdoc";
import path from "path";

/**
 * Generates documentation files for a given configuration.
 *
 * @private
 * @param {Object} grunt - The Grunt instance.
 * @param {Object} options - The ESDoc options.
 */

function generateDocumentation(grunt, options) {

	if(options.source === null) {

		grunt.fail.error("No source path specified");

	} else if(!grunt.file.exists(options.source)) {

		grunt.fail.error("Invalid source path");

	} else if(options.destination === null) {

		grunt.fail.error("No destination path specified");

	} else {

		try {

			esdoc.generate(options);

			// Read the coverage results and report them via the console.
			const coveragePath = path.join(options.destination, "coverage.json");

			// Don't report coverage if it's not available.
			if(grunt.file.exists(coveragePath)) {

				const coverageReport = grunt.file.readJSON(coveragePath);
				const coverage = coverageReport.coverage;
				const expected = coverageReport.expectCount;
				const actual = coverageReport.actualCount;
				const unsatisfactory = (Number.parseFloat(coverage.replace("%", "")) < options.coverageThreshold);

				grunt.log[unsatisfactory ? "warn" : "ok"]("Coverage: " + coverage);
				grunt.log[unsatisfactory ? "warn" : "ok"]("Files: " + actual + "/" + expected);

			}

		} catch(error) {

			grunt.fail.fatal(error);

		}

	}

}

/**
 * Registers the ESDoc Grunt task.
 *
 * @param {Object} grunt - The Grunt instance.
 */

export default function registerESDocTask(grunt) {

	grunt.registerMultiTask("esdoc", "A documentation generator for JavaScript.", function() {

		// Keep a reference to the original log function.
		const log = console.log;

		// Define defaults for plugin-specific options.
		const options = this.options({
			coverageThreshold: 100.0,
			verbose: false,
			config: null,
			destination: null,
			source: null
		});

		if(options.config !== null) {

			Object.assign(options, grunt.file.readJSON(options.config));

		}

		if(!options.verbose && !grunt.option("verbose")) {

			// Hack console.log to mute ESDoc's output.
			console.log = function() {};

		}

		if(this.files.length > 0) {

			this.files.forEach(function(file) {

				if(file.src !== undefined && file.src.length === 1) {

					options.source = file.src[0];

				}

				if(file.dest !== undefined) {

					options.destination = file.dest;

				}

				generateDocumentation(grunt, options);

			});

		} else {

			generateDocumentation(grunt, options);

		}

		// Restore the log function.
		console.log = log;

	});

}
