import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import generateReducer from '../reducers/generate-reducer';
import generateCreator from '../actions/generate-creator';
import setPlaybackInfo from '../reducers/spotify';
import { loadArtist, loadAlbum } from '../actions/spotify';

const setAlbum = generateCreator('SET_ALBUM');
const setArtist = generateCreator('SET_ARTIST');
const setTrack = generateCreator('SET_TRACK');

const store = spotifyApi => createStore(
  combineReducers({
    searches: generateReducer('SET_SEARCH_RESULT'),
    tracks: generateReducer('SET_TRACK'),
    albums: generateReducer('SET_ALBUM'),
    artists: generateReducer('SET_ARTIST'),
    playbackInfo: setPlaybackInfo,
  }),
  applyMiddleware(thunkMiddleware.withExtraArgument({
    spotifyApi,
    actions: {
      setTrack,
      setAlbum,
      setArtist,
      loadArtist,
      loadAlbum,
    },
  })),
);

export default store;
