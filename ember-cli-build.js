'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');

module.exports = function (defaults) {
	let app = new EmberApp(defaults, {
		// Add options here
		nodeAssets: {
			'popper.js': {
				srcDir: 'dist/umd',
				import: {
					include: ['popper.js'],
					processTree(input) {
						return fastbootTransform(input);
					}
				},
				public: ['popper.js.map']
			}
		}
	});

	// bootstrap
	const bootstrapTree = new Funnel('node_modules/bootstrap/scss', {
		destDir: 'bootstrap'
	});
	app.trees.styles = mergeTrees([app.trees.styles, bootstrapTree]);
	app.import('node_modules/bootstrap/dist/js/bootstrap.js');

	// vis
	app.import('node_modules/vis/dist/vis.css');
	app.import('node_modules/vis/dist/vis.js', {
		using: [
			{ transformation: 'amd', as: 'vis' }
		]
	});

	return app.toTree();
};
