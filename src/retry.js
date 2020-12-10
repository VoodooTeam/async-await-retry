const getPromise = (fn, args) => {
    return new Promise((resolve, reject) => {
        if (!args) args = [];
        args.push((err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
        fn.apply(null, args);
    });
};

const clone = (obj) => {
    if (obj === null || typeof obj !== "object") {
        return obj;
    } else if (Array.isArray(obj)) {
        let clonedArr = [];
        for (const data of obj) {
            clonedArr.push(clone(data));
        }
        return clonedArr;
    } else {
        let clonedObj = {};
        const keys = Object.keys(obj);
        for (const key of keys) {
            clonedObj[key] = clone(obj[key]);
        }
        return clonedObj;
    }
}

const onAttemptFailFallback = async (data) => {
    const interval = data.exponential ? data.interval * data.factor : data.interval;
    // if interval is set to zero, do not use setTimeout, gain 1 event loop tick
    if (interval) await new Promise(r => setTimeout(r, interval + data.jitter));
}

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
 * @property {Number} config.isCb: is fn a callback style function ?
 * @property {Function} config.onAttemptFail: use a callback when an error has occured
 */
module.exports = async (fn, args = [], config = {}) => {
    const retriesMax = config.retriesMax || 3;
    let interval = config.interval || 0;
    const jitter = config.jitter ? Math.floor(Math.random() * config.jitter) + 1 : 0;
    const exponential = Object.prototype.hasOwnProperty.call(config, 'exponential') ? config.exponential : true;
    const factor = config.factor || 2;
    const onAttemptFail = typeof config.onAttemptFail === 'function' ? config.onAttemptFail : onAttemptFailFallback;

    for (let i = 0; i < retriesMax; i++) {
        try {
            if (!config.isCb) {
                const val = await fn.apply(null, args);
                return val;
            } else {
                const val = await getPromise(fn, clone(args));
                return val;
            }
        } catch (error) {
            if(retriesMax === i+1 || (Object.prototype.hasOwnProperty.call(error, 'retryable') && !error.retryable)) throw error;
            const result = await onAttemptFail({
                error,
                currentRetry: i,
                retriesMax,
                interval,
                exponential,
                factor,
                jitter
            });
            if (!result && typeof config.onAttemptFail === 'function') return
        }
    }
};