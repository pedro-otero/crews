import * as types from './types';

export const getCredits = () => function (dispatch, getState, { backend }) {
  return backend.getCredits(getState().song.album.id)
    .then(({ bestMatch: { tracks }, progress }) => {
      const credits = tracks.find(t => t.id === getState().song.track.id);
      dispatch({ type: types.LOAD_CREDITS_SUCCESS, credits });
      dispatch({ type: types.SET_PROGRESS, progress });
    });
};

export const getCurrentPlayback = () => function (dispatch, getState, { spotifyApi }) {
  return spotifyApi.getCurrentPlayback()
    .then(({ body: playback }) => {
      dispatch({ type: types.LOAD_PLAYBACK_SUCCESS, track: playback.item });
      spotifyApi.getAlbum(playback.item.album.id).then(({ body: album }) => {
        dispatch({ type: types.LOAD_ALBUM_SUCCESS, album });
        dispatch(getCredits());
      });
      spotifyApi.getArtist(playback.item.artists[0].id).then(({ body: artist }) => {
        dispatch({ type: types.LOAD_ARTIST_SUCCESS, artist });
      });
    });
};
