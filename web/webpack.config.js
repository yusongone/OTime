
module.exports = {
    devtool: 'inline-source-map',
    entry : {
      "login":"./src/login.js"
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/lib',
      libraryTarget: "umd"
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
            test: /\.css$/,
            use: [
						{
                loader: "style-loader" // creates style nodes from JS strings
   					}, {
                loader: "css-loader" // translates CSS into CommonJS
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
/*
*/
