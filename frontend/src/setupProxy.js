const {createProxyMiddleware} = require('http-proxy-middleware')

const proxy = {
    target: 'http://127.0.0.1:4000',
    changeOrigin: true,
    followRedirects: true
}

module.exports = function(app) {
    app.use('/api/*',
        createProxyMiddleware(proxy)
    )

    // app.use('/*', 
    //     createProxyMiddleware({
    //         target: 'https://api.paystack.co/',
    //         changeOrigin: true,
    //     })
    // )

}

