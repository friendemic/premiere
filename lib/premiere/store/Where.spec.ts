import Store from '../Store';
import Helper from './Helper';

describe('Store where method', () => {
    let store: Store<any>;
    let instance: any = {key: () => 'id', property: 'value'};

    beforeEach(() => {
        store = new Store<any>(null);
        store.make = jest.fn().mockReturnValue(instance);
        store.http = Helper.http('data');
    });

    it('should fetch from http request', () => {
        store.where('property', 'value');
        expect(store.http().get).toHaveBeenCalledWith('property/value');
    });

    it('should return cached promise', () => {
        store.cache.setPromise('where/property/value', 'promise' as any);
        expect(store.where('property', 'value')).toBe('promise');
    });

    it('should not return cached promise', () => {
        store.cache.setPromise('where/property/value', 'promise' as any);
        expect(store.where('property', 'value', {url: 'customUrl'})).not.toBe('promise');
    });

    it('should return cached promise with custom url', () => {
        store.cache.setPromise('where/customUrl', 'promise' as any);
        expect(store.where('property', 'value', {url: 'customUrl'})).toBe('promise');
    });

    it('should fetch from cache', () => {
        store.cache.set(instance);
        expect(store.where('property', 'value')).resolves.toBe(instance);
        expect(store.http().get).not.toHaveBeenCalled();
    });

    it('should ignore cache', () => {
        store.cache.set(instance);
        store.where('property', 'value', {ignoreCache: true});
        expect(store.http().get).toHaveBeenCalledWith('property/value');
    });

    it('should fetch with custom url', () => {
        store.where('property', 'value', {url: 'customUrl'});
        expect(store.http().get).toHaveBeenCalledWith('customUrl');
    });

    it('should convert result to model instance', () => {
        store.where('property', 'value');
        expect(store.make).toHaveBeenCalledWith('data');
    });

    it('should add to cache', () => {
        store.where('property', 'value');
        expect(store.cache.where('property', 'value')).toBeTruthy();
    });

    it('should resolve model instance', () => {
        expect(store.where('property', 'value')).resolves.toBe(instance);
    });
});
