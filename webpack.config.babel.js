import { join } from 'path';

export default {
    entry: './src/index',
    output: {
        path: join(__dirname, 'lib/umd'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'ReduxSelectEntities',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
            },
        ],
    },
};
