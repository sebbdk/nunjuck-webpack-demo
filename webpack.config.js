const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const globEntries = require("webpack-glob-folder-entries");

function getHtmlEntryList(globPath){
  let entries = globEntries(globPath, true);
  let folderList = new Array();
  for (let folder in entries){
  	if (/\.(njk|nunjucks|html|tpl|tmpl)$/.test(entries[folder])) {
  		folderList.push(entries[folder]);
  	}
  }
  return folderList;
}

const d = './src/components';
const entryFolders = fs.readdirSync(path.resolve(d))
			.map(f => path.join(__dirname, path.join(d, f))  )
			.filter(f => fs.statSync(f).isDirectory());

function getHtmlComponentPlugins() {
	return entryFolders.map(templatePath => {
		const name = templatePath.split('\\').pop()

		const sett = {
	    	customData: { foo: 'bar' },
	    	filename: path.relative(__dirname, templatePath.replace('src\\', '') + `\\${name}.html`),
	    	template: templatePath + `\\${name}.njk`
	  	};

		return new HtmlWebpackPlugin(sett)
	});
}

module.exports = function() {
	return {
		devtool: '#source-map',
		mode: 'development',
		entry: [
			'./src/index.js'
		],
		output: {
			path: path.resolve(__dirname, 'dist')
		},
	    resolve: {
	      extensions: [ '.js' ]
	    },
		module: {
		    rules : [
				{
				  	test: /\.(njk|nunjucks|html|tpl|tmpl)$/,
				  	use: [
				    	{
				    		loader: 'nunjucks-isomorphic-loader',
				      		query: {
				        	root: [
				        		path.resolve(__dirname, 'src'),
				        		
				        	].concat(entryFolders)
				      	}
				    }
				  ]
				}
		    ]
		},
		plugins: [
		  new HtmlWebpackPlugin({
		    customData: { foo: 'bar' },
		    filename: 'index.html',
		    template: 'src/index.njk'
		  })
		].concat(getHtmlComponentPlugins())
	};
}