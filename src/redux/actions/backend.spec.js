import * as Rx from 'rxjs';

import { loadSearchResult } from './backend';

describe('Backend actions', () => {
  describe('Successful search result', () => {
    const dispatch = jest.fn();
    const actions = {
      setSearchResult: jest.fn(),
    };
    const backend = {
      getCredits: jest.fn(() => Rx.Observable.create((subscriber) => {
        subscriber.next({});
        subscriber.complete();
      })),
    };

    beforeAll((done) => {
      const thunk = loadSearchResult('AL1');
      thunk(dispatch, null, { backend, actions }).then(done);
    });

    it('informs data is loading', () => {
      expect(actions.setSearchResult).toHaveBeenCalledWith('AL1', 'LOADING');
    });

    it('calls backend', () => {
      expect(backend.getCredits).toHaveBeenCalledWith('AL1');
    });

    it('informs load finished', () => {
      expect(actions.setSearchResult).toHaveBeenCalledWith('AL1', {});
    });
  });

  describe('Failed search result', () => {
    const dispatch = jest.fn();
    const actions = {
      setSearchResult: jest.fn(),
    };
    const backend = {
      getCredits: jest.fn(() => Rx.Observable.create((subscriber) => {
        subscriber.error();
      })),
    };

    beforeAll((done) => {
      const thunk = loadSearchResult('AL1');
      thunk(dispatch, null, { backend, actions }).then(done);
    });

    it('informs data is loading', () => {
      expect(actions.setSearchResult).toHaveBeenCalledWith('AL1', 'LOADING');
    });

    it('calls backend', () => {
      expect(backend.getCredits).toHaveBeenCalledWith('AL1');
    });

    it('informs load failed', () => {
      expect(actions.setSearchResult).toHaveBeenCalledWith('AL1', 'FAILED');
    });
  });
});
