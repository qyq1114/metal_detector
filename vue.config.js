module.exports = {
    devServer: {
        proxy: {
            '/detection': {
                target: 'http://118.195.178.46/',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/detection': '/detection'
                // }
            }
        }
    }
}