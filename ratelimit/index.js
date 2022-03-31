const rateLimit = require("express-rate-limit");

const setupRateLimit = (app, services) => {
    services.forEach(service => {
        if (service.rateLimit) {
            app.use(service.url, rateLimit(service.rateLimit));
        }
    })
}

exports.setupRateLimit = setupRateLimit
