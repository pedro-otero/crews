import { updateState } from './helpers';
import { SET_ARTIST } from './artists';

export const START_ALBUM_LOAD = 'START_ALBUM_LOAD';
export const SET_ALBUM = 'SET_ALBUM';
export const FAIL_ALBUM_LOAD = 'FAIL_ALBUM_LOAD';
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT';
export const STOP_ALBUM_SEARCH = 'STOP_ALBUM_SEARCH';

export const loadAlbum = id => (dispatch, getState, { spotifyApi, actions }) => {
  const album = getState().albums[id];
  if (!album || album.failed) {
    dispatch(actions.startAlbumLoad(id));
    return spotifyApi
      .getAlbum(id).then((response) => {
        dispatch(actions.setAlbum(response.body));
        const artistId = response.body.artists[0].id;
        dispatch(actions.loadArtist(artistId));
        return response;
      }, () => dispatch(actions.failAlbumLoad(id)));
  }
  return Promise.resolve(album);
};

export const setAlbum = (album) => {
  const {
    id, name, artists, images, tracks: { items: tracks }, release_date: releaseDate,
  } = album;
  const image = images[0].url;
  const artistId = artists[0].id;
  const year = releaseDate.substring(0, 4);
  return {
    type: SET_ALBUM,
    data: {
      id,
      name,
      artistId,
      image,
      tracks: tracks.map(track => Object.assign({ album: { id } }, track)),
      year,
    },
  };
};

export const startAlbumLoad = id => ({
  type: START_ALBUM_LOAD,
  data: {
    id,
  },
});

export const failAlbumLoad = id => ({
  type: FAIL_ALBUM_LOAD,
  data: {
    id,
  },
});

export const stopAlbumSearch = id => ({
  type: STOP_ALBUM_SEARCH,
  data: {
    id,
  },
});

export function reduce(state = {}, { type, data }) {
  const defaultAlbum = { loading: false, failed: false, tracks: [] };
  const update = updateState(state, defaultAlbum);
  switch (type) {
    case SET_ALBUM: {
      return update([{
        id: data.id,
        value: {
          ...data,
          tracks: data.tracks.map(({ id }) => id),
          loading: false,
          failed: false,
        },
      }]);
    }
    case SET_SEARCH_RESULT: {
      return update([{ id: data.id, value: { searchStarted: true, progress: data.progress } }]);
    }
    case START_ALBUM_LOAD: {
      return update([{ id: data.id, value: { loading: true, failed: false } }]);
    }
    case FAIL_ALBUM_LOAD: {
      return update([{ id: data.id, value: { loading: false, failed: true } }]);
    }
    case STOP_ALBUM_SEARCH: {
      return update([{ id: data.id, value: { loading: false, failed: false, searchStarted: false } }]);
    }
    default: {
      return state;
    }
  }
}
