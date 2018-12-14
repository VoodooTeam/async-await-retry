/**
 * Retry system with async / await
 * 
 * @param {Function} fn : function to execute
 * @param {Array} args : arguments of fn function
 * @param {Object} config : arguments of fn function
 * @property {Number} config.retriesMax : number of retries, by default 3
 * @property {Number} config.interval : interval (in ms) between retry, by default 0
 * @property {Boolean} config.exponential : use exponential retry interval, by default true
 * @property {Number} config.factor: interval incrementation factor
 */
module.exports = async (fn, args = [], config = {}) => {
    const retriesMax = config.retriesMax || 3;
    let interval = config.interval || 0;
    const exponential = config.hasOwnProperty('exponential') ? config.exponential : true;
    const factor = config.factor || 2;

    for (let i = 0; i < retriesMax; i++) {
        try {
            const val = await fn.apply(null, args);
            return val;
        } catch (error) {
            if(retriesMax === i+1) throw error;

            interval = exponential ? interval * factor : interval;
            // if interval is set to zero, do not use setTimeout, gain 1 event loop tick
            if (interval) await new Promise(r => setTimeout(r, interval));
        }
    }
};