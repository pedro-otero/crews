import { notifier, setter } from 'state/base/actions';
import { buildReducer, fail, set, startLoad } from 'state/base/reducers';
import { loadThunk } from './base/helpers';

export const START_ARTIST_LOAD = 'START_ARTIST_LOAD';
export const SET_ARTIST = 'SET_ARTIST';
export const FAIL_ARTIST_LOAD = 'FAIL_ARTIST_LOAD';
export const START_ARTIST_ALBUMS_LOAD = 'START_ARTIST_ALBUMS_LOAD';
export const SET_ARTIST_ALBUMS = 'SET_ARTIST_ALBUMS';
export const FAIL_ARTIST_ALBUMS_LOAD = 'FAIL_ARTIST_ALBUMS_LOAD';

export const startArtistLoad = notifier(START_ARTIST_LOAD);

export const loadArtist = id => (dispatch, getState, { spotifyApi, actions }) => loadThunk(
  id,
  getState().artists,
  dispatch,
  actions.startArtistLoad,
  spotifyApi.getArtist,
  actions.setArtist,
  actions.failArtistLoad,
);

export const setArtist = setter(SET_ARTIST, artistToState);

export const failArtistLoad = notifier(FAIL_ARTIST_LOAD);

export const startArtistAlbumsLoad = notifier(START_ARTIST_ALBUMS_LOAD);

export const failArtistAlbumsLoad = notifier(FAIL_ARTIST_ALBUMS_LOAD);

export function artistToState({ id, name, images }) {
  return {
    id,
    name,
    image: images.length ? images[0].url : undefined,
  };
}

export function artistAlbumsToState({ items }) {
  return items.map(({
    id,
    name,
    release_date: releaseDate,
    images: [firstImage],
  }) => ({
    id,
    name,
    year: releaseDate.substring(0, 4),
    image: firstImage.url,
  }));
}

export function setArtistAlbums(id, response) {
  return {
    type: SET_ARTIST_ALBUMS,
    data: {
      id,
      items: artistAlbumsToState(response),
      nextPage: response.next ? {
        offset: response.offset + response.limit,
        limit: response.limit,
      } : null,
    },
  };
}

export function loadArtistAlbums(id) {
  return function (dispatch, getState, { spotifyApi }) {
    dispatch(startArtistAlbumsLoad(id));
    const { albums: { nextPage = {} } } = getState().artists[id];
    if (nextPage === null) return;
    const { offset = 0, limit = 20 } = nextPage;
    return spotifyApi.getArtistAlbums(id, { offset, limit })
      .then((response) => {
        dispatch(setArtistAlbums(id, response.body));
      });
  };
}

export const reduce = buildReducer([
  [START_ARTIST_LOAD, startLoad],
  [SET_ARTIST, set()],
  [FAIL_ARTIST_LOAD, fail],
  [START_ARTIST_ALBUMS_LOAD, (state, { data: { id } }) => {
    const artist = state[id];
    const { albums = {} } = artist;
    return {
      ...state,
      [id]: {
        ...artist,
        albums: {
          ...albums,
          isLoading: true,
          isFailed: false,
        },
      },
    };
  }],
  [FAIL_ARTIST_ALBUMS_LOAD, (state, { data: { id } }) => {
    const artist = state[id];
    return {
      ...state,
      [id]: {
        ...artist,
        albums: {
          isLoading: false,
          isFailed: true,
          items: [],
        },
      },
    };
  }],
  [SET_ARTIST_ALBUMS, (state, { data: { id, items, nextPage } }) => {
    const artist = state[id];
    const jointItems = [...(artist.albums.items || []), ...items];
    return {
      ...state,
      [id]: {
        ...artist,
        albums: {
          isLoading: true,
          isFailed: false,
          items: jointItems,
          nextPage,
        },
      },
    };
  }],
]);
