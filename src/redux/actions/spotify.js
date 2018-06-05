export const setPlaybackInfo = data => ({
  type: 'SET_PLAYBACK_INFO',
  data,
});

export const loadPlaybackInfo = () => (dispatch, getState, { spotifyApi, actions }) => {
  dispatch(setPlaybackInfo('LOADING'));
  return spotifyApi.getCurrentPlayback().then((response) => {
    dispatch(setPlaybackInfo(response.body));
    if (response.body) {
      const albumId = response.body.item.album.id;
      if (!getState().searches[albumId]) {
        dispatch(actions.loadSearchResult(albumId));
      }
      dispatch(actions.setTrack(response.body.item.id, response.body.item));
      const artistId = response.body.item.artists[0].id;
      if (!getState().artists[artistId]) {
        dispatch(actions.loadArtist(artistId));
      }
      if (!getState().albums[albumId]) {
        dispatch(actions.loadAlbum(albumId));
      }
    }
    return response;
  }, () => dispatch(setPlaybackInfo('FAILED')));
};

export const loadAlbum = id => (dispatch, getState, { spotifyApi, actions }) => {
  const album = getState().albums[id];
  if (!album || album === 'FAILED') {
    dispatch(actions.setAlbum(id, 'LOADING'));
    return spotifyApi
      .getAlbum(id).then((response) => {
        dispatch(actions.setAlbum(id, response.body));
        return response;
      }, () => dispatch(actions.setAlbum(id, 'FAILED')));
  }
  return Promise.resolve(album);
};

export const loadArtist = id => (dispatch, getState, { spotifyApi, actions }) => {
  const artist = getState().artists[id];
  if (!artist || artist === 'FAILED') {
    dispatch(actions.setArtist(id, 'LOADING'));
    return spotifyApi
      .getArtist(id).then((response) => {
        dispatch(actions.setArtist(id, response.body));
        return response;
      }, () => dispatch(actions.setArtist(id, 'FAILED')));
  }
  return Promise.resolve(artist);
};
