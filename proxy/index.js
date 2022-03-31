const { createProxyMiddleware } = require('http-proxy-middleware');
const loadBalancer = require('../util/loadBalancer');

const setupProxies = (app, routes) => {
    routes.forEach(service => {
        const currentInstanceIndex = loadBalancer[service.loadBalanceStrategy](service)
        app.use(service.url, createProxyMiddleware({
            ...service.instances[currentInstanceIndex],
            onProxyReq: (proxyReq, req, res) => {
                // console.log(proxyReq.method)
            },
            onProxyRes: (proxyRes, req, res) => {
                // log original request and proxied request info
                const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path} ## ${proxyRes.statusMessage}`;
                console.log(exchange); // [GET] [200] / -> http://www.example.com
            },
            onError: function onError(err, req, res) {
                console.error(err);
                res.status(500);
                res.json({ error: 'Error when connecting to remote server.' });
            },
            logLevel: 'debug',
        }));
    })
}

exports.setupProxies = setupProxies
