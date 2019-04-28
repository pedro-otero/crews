/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import request from 'superagent';

import { reduce as playbackInfo, playbackInfoActions } from '../playbackInfo';
import { loadSearchResult, setSearchResult } from '../actions/backend';
import {
  setArtist,
  startArtistLoad,
  loadArtist,
  failArtistLoad,
  reduce as artists,
  loadArtistAlbums,
} from '../artists';
import {
  loadAlbum,
  startAlbumLoad,
  failAlbumLoad,
  setAlbum,
  reduce as albums,
} from '../albums';
import {
  loadTrack,
  setTrack,
  startTrackLoad,
  failTrackLoad,
  reduce as tracks,
} from '../tracks';
import { reduce as auth } from '../user';
import { reduce as profile, userProfileActions } from '../profile';
import { addError, clearErrors, reduce } from '../errors';
import { savedTracksReducer, setSavedTracks, savedAlbumsReducer, setSavedAlbums } from '../library';
import { viewTrack } from '../view';
import { reduce as swipe } from 'state/swipe';
import { reduce as progress } from 'state/progress';

const devTools = global.window.__REDUX_DEVTOOLS_EXTENSION__ &&
  global.window.__REDUX_DEVTOOLS_EXTENSION__();

const albumActions = {
  loadAlbum, startAlbumLoad, failAlbumLoad, setAlbum,
};
const trackActions = {
  loadTrack, setTrack, startTrackLoad, failTrackLoad, viewTrack,
};
const artistActions = {
  setArtist, startArtistLoad, loadArtist, failArtistLoad, loadArtistAlbums,
};

const store = (spotifyApi) => createStore(
  combineReducers({
    tracks,
    albums,
    artists,
    user: combineReducers({
      auth,
      playbackInfo,
      profile,
      library: combineReducers({
        tracks: savedTracksReducer,
        albums: savedAlbumsReducer,
      }),
    }),
    errors: reduce,
    swipe,
    progress,
  }),
  devTools,
  applyMiddleware(thunkMiddleware.withExtraArgument({
    spotifyApi,
    actions: {
      ...artistActions,
      ...albumActions,
      ...trackActions,
      loadSearchResult,
      setSearchResult,
      addError,
      clearErrors,
      ...playbackInfoActions,
      ...userProfileActions,
      setSavedTracks,
      setSavedAlbums,
    },
    config: {
      request,
      backendUrl: `${process.env.REACT_APP_BE_DOMAIN}/data/album`,
    },
  })),
);

export default store;
