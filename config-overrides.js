const { set } = require('lodash')

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    set(config, 'devServer.writeToDisk', true)
    return config;
}