module.exports = {
    devtool: 'inline-source-map',
    entry:{
      "popup":"./src/popup/popup.js",
      "background":"./src/background.js"
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/app/lib'
    },
		module: {
        rules: [
				{
	 				test: /\.js$/,
					exclude: [/node_modules/],
					use: [{
						loader: 'babel-loader',
						options: { presets: ['es2015','react','stage-1'] },
					}]
        },
        {
            test: /\.less$/,
            use: [
						{
                loader: "style-loader" // creates style nodes from JS strings
   					}, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "less-loader" // compiles Less to CSS
            }]
        }]
    }
};
