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
      dispatch(actions.loadSearchResult(albumId));
      dispatch(actions.setTrack(response.body.item.id, response.body.item));
      const artistId = response.body.item.artists[0].id;
      dispatch(actions.loadArtist(artistId));
      dispatch(actions.loadAlbum(albumId));
    }
    return response;
  }, () => {
    dispatch(setPlaybackInfo('FAILED'));
    dispatch(actions.addError('Loading playback info failed'));
  });
};

export const loadAlbum = id => (dispatch, getState, { spotifyApi, actions }) => {
  const album = getState().albums[id];
  if (!album || album === 'FAILED') {
    dispatch(actions.setAlbum(id, 'LOADING'));
    return spotifyApi
      .getAlbum(id).then((response) => {
        dispatch(actions.setAlbum(id, response.body));
        response.body.tracks.items
          .forEach(track => dispatch(actions.setTrack(track.id, Object.assign({}, track, {
            album: {
              id: response.body.id,
            },
          }))));
        const artistId = response.body.artists[0].id;
        dispatch(actions.loadArtist(artistId));
        return response;
      }, () => {
        dispatch(actions.setAlbum(id, 'FAILED'));
        dispatch(actions.addError('Loading album failed'));
      });
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
      }, () => {
        dispatch(actions.setArtist(id, 'FAILED'));
        dispatch(actions.addError('Loading artist failed'));
      });
  }
  return Promise.resolve(artist);
};

export const loadTrack = id => (dispatch, getState, { spotifyApi, actions }) => {
  const track = getState().tracks[id];
  if (!track || track === 'FAILED') {
    dispatch(actions.setTrack(id, 'LOADING'));
    return spotifyApi
      .getTrack(id).then((response) => {
        dispatch(actions.setTrack(id, response.body));
        const albumId = response.body.album.id;
        dispatch(actions.loadSearchResult(albumId));
        dispatch(actions.loadAlbum(albumId));
        return response;
      }, () => {
        dispatch(actions.setTrack(id, 'FAILED'));
        dispatch(actions.addError('Loading track failed'));
      });
  }
  return Promise.resolve(track);
};

export const setArtist = (id, { name, images }) => ({
  type: 'SET_ARTIST',
  data: {
    id,
    value: {
      id,
      name,
      image: images.length ? images[0].url : undefined,
    },
  },
});

export const startArtistLoad = id => ({
  type: 'SET_ARTIST',
  data: {
    id,
    value: 'LOADING',
  },
});

export const failArtistLoad = id => ({
  type: 'SET_ARTIST',
  data: {
    id,
    value: 'FAILED',
  },
});
