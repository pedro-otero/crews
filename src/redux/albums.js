export const loadAlbum = id => (dispatch, getState, { spotifyApi, actions }) => {
  const album = getState().albums[id];
  if (!album || album === 'FAILED') {
    dispatch(actions.startAlbumLoad(id));
    return spotifyApi
      .getAlbum(id).then((response) => {
        dispatch(actions.setAlbum(id, response.body));
        const artistId = response.body.artists[0].id;
        dispatch(actions.loadArtist(artistId));
        return response;
      }, () => dispatch(actions.failAlbumLoad(id)));
  }
  return Promise.resolve(album);
};

export const setAlbum = (id, album) => {
  const {
    name, artists, images, tracks: { items: tracks }, release_date: releaseDate,
  } = album;
  const image = images[0].url;
  const artist = artists[0].id;
  const year = releaseDate.substring(0, 4);
  return {
    type: 'SET_ALBUM',
    data: {
      id,
      value: {
        id,
        name,
        artist,
        image,
        tracks: tracks.map(track => Object.assign({ album: { id } }, track)),
        year,
      },
    },
  };
};

export const startAlbumLoad = id => ({
  type: 'START_ALBUM_LOAD',
  data: {
    id,
  },
});

export const failAlbumLoad = id => ({
  type: 'FAIL_ALBUM_LOAD',
  data: {
    id,
  },
});

export function reduce(state = {}, { type, data }) {
  const defaultAlbum = { loading: false, failed: false };
  switch (type) {
    case 'SET_ALBUM': {
      const album = { ...(state[data.id] || defaultAlbum) };
      Object.assign(album, {
        ...data.value,
        ...defaultAlbum,
        tracks: data.value.tracks.map(({ id }) => id),
      });
      return Object.assign({ ...state }, { [data.id]: album });
    }
    case 'START_ALBUM_LOAD': {
      const album = { ...(state[data.id] || defaultAlbum) };
      Object.assign(album, { loading: true, failed: false });
      return Object.assign({ ...state }, { [data.id]: album });
    }
    case 'FAIL_ALBUM_LOAD': {
      const album = { ...(state[data.id] || defaultAlbum) };
      Object.assign(album, { loading: false, failed: true });
      return Object.assign({ ...state }, { [data.id]: album });
    }
    default: {
      return state;
    }
  }
}
