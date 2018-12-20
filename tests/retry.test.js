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
})