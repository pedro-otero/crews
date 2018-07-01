/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import * as playbackInfo from '../playbackInfo';
import { loadSearchResult } from '../actions/backend';
import { setArtist, startArtistLoad, loadArtist, failArtistLoad, reduce as artists } from '../artists';
import { loadAlbum, startAlbumLoad, failAlbumLoad, setAlbum, reduce as albums } from '../albums';
import { addTrackCredits, loadTrack, setTrack, startTrackLoad, failTrackLoad, reduce as tracks } from '../tracks';
import { addError, clearErrors, reduce } from '../errors';

const devTools = global.window.__REDUX_DEVTOOLS_EXTENSION__ &&
  global.window.__REDUX_DEVTOOLS_EXTENSION__();

const albumActions = {
  loadAlbum, startAlbumLoad, failAlbumLoad, setAlbum,
};
const trackActions = {
  loadTrack, setTrack, startTrackLoad, failTrackLoad,
};
const artistActions = {
  setArtist, startArtistLoad, loadArtist, failArtistLoad,
};

const store = (spotifyApi, backend) => createStore(
  combineReducers({
    tracks,
    albums,
    artists,
    playbackInfo: playbackInfo.reduce,
    errors: reduce,
  }),
  devTools,
  applyMiddleware(thunkMiddleware.withExtraArgument({
    spotifyApi,
    backend,
    actions: {
      ...artistActions,
      ...albumActions,
      ...trackActions,
      addTrackCredits,
      loadSearchResult,
      addError,
      clearErrors,
      setPlaybackInfo: playbackInfo.setPlaybackInfo,
    },
  })),
);

export default store;
