const retry = require('../index');

describe('retry', () => {

    afterAll(() => {
		jest.restoreAllMocks();
	});

    it('should retry process but failed', async () => {
        const func = async () => {throw new Error('WTF')};
        const mock = jest.fn(func);

        try {
            await retry(mock);
            throw new Error('This test should have thrown an error !!!!');
        } catch (e) {
            expect(mock).toHaveBeenCalled();
            expect(mock.mock.calls.length).toBe(3);
            expect(e.message).toEqual('WTF');
        }
    })

    it('should retry process but failed without exponential interval', async () => {
        const func = async () => {throw new Error('WTF')};
        const mock = jest.fn(func);

        try {
            await retry(mock, null, {retriesMax: 4, interval: 100, exponential: false});
            throw new Error('This test should have thrown an error !!!!');
        } catch (e) {
            expect(e.message).toEqual('WTF');
            expect(mock).toHaveBeenCalled();
            expect(mock.mock.calls.length).toBe(4);
        }
    })

    it('should retry process but failed without interval', async () => {
        const func = async () => {throw new Error('WTF')};
        try {
            await retry(func, [], {retriesMax: 3});
            throw new Error('This test should have thrown an error !!!!');
        } catch(e) {
            expect(e.message).toEqual('WTF');
        }
    })

    it('should not retry process and return value', async () => {
        const func = async () => {return new Promise((resolve) => resolve('OK'))};
        try {
            const res = await retry(func);
            expect(res).toEqual('OK');
        } catch (e) {
            throw new Error('This test shouldn\'t fail !!!!');
        }
    })

    it('should not retry process and return value (inline style)', async () => {
        try {
            const res = await retry(async () => {return new Promise((resolve) => resolve('OK'))});
            expect(res).toEqual('OK');
        } catch (e) {
            throw new Error('This test shouldn\'t fail !!!!');
        }
    })

    it('should not retry process and return value (sync function)', async () => {
        try {
            const res = await retry(() => {return 'OK';});
            expect(res).toEqual('OK');
        } catch (e) {
            throw new Error('This test shouldn\'t fail !!!!');
        }
    })

    it('should retry process and fail (sync function)', async () => {
        try {
            await retry(() => {throw new Error('My sync function has just crashed !')});
            throw new Error('This test should fail !!!!');
        } catch (e) {
            expect(e.message).toEqual('My sync function has just crashed !');
        }
    })

    it('should retry process and fail (promise syntaxe)', async () => {
        try {
            await retry(async () => {return new Promise((resolve, reject) => {
                reject(new Error('My promise has just failed !'));
            })});
            throw new Error('This test should fail !!!!');
        } catch (e) {
            expect(e.message).toEqual('My promise has just failed !');
        }
    })

    it('should not retry process and fail (not retryable)', async () => {
        const func = async () => {
            const err = new Error('Not retryable');
            err.retryable = false;
            throw err;
        };
        const mock = jest.fn(func);

        try {
            await retry(mock, null, {retriesMax: 4, interval: 100, exponential: false});
            throw new Error('This test should have thrown an error !!!!');
        } catch (e) {
            expect(e.message).toEqual('Not retryable');
            expect(mock).toHaveBeenCalled();
            expect(mock.mock.calls.length).toBe(1);
        }
    })

    describe("Callback style", () => {
        it('should retry process and fail without args', async () => {
            try {
                await retry((cb) => {
                    cb(new Error('My callback has just failed !'));
                }, null, {isCb: true});
                throw new Error('This test should fail !!!!');
            } catch (e) {
                expect(e.message).toEqual('My callback has just failed !');
            }
        })

        it('should retry process and fail with args', async () => {
            try {
                await retry((arg1, cb) => {
                    cb(new Error(`My callback has just failed with arg : ${arg1.value}`));
                }, [{value: "arg1"}], {isCb: true});
                throw new Error('This test should fail !!!!');
            } catch (e) {
                expect(e.message).toEqual(`My callback has just failed with arg : arg1`);
            }
        })

        it('should not retry process', async () => {
            try {
                const res = await retry((arg1, cb) => {
                    cb(null, 1);
                }, [{value: "arg1"}], {isCb: true});
                expect(res).toEqual(1);
            } catch (e) {
                throw new Error('This test should not fail !!!!');
            }
        })
    });
})