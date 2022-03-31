const SERVICES = [
    {
        loadBalanceStrategy: "ROUND_ROBIN",
        index: 0,
        url: '/testapi1',
        rateLimit: {
            windowMs: 1 * 60 * 1000,
            max: 100
        },
        instances: [
            {
                target: "http://92.204.138.94:8099/api_getway",
                changeOrigin: true,
                pathRewrite: {
                    [`^/testapi1`]: '',
                },
            },
        ]
    },
    {
        loadBalanceStrategy: "ROUND_ROBIN",
        index: 0,
        url: '/mdfunctions',
        rateLimit: {
            windowMs: 1 * 60 * 1000,
            max: 1000
        },
        instances: [
            {
                target: "http://92.204.138.94:8059/mdfunctions",
                changeOrigin: true,
                pathRewrite: {
                    [`^/mdfunctions`]: '',
                },
            },
        ]
    }
]

exports.SERVICES = SERVICES;
