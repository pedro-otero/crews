import { artistToState, artistAlbumsToState } from './artists';

describe('REDUX: Artists', () => {
  it('maps artists without images to state', () => {
    const mappedArtist = artistToState({
      id: 'AR1',
      name: 'The Artist',
      images: [],
    });
    expect(mappedArtist).toEqual({
      name: 'The Artist',
      id: 'AR1',
    });
  });

  it('maps artist to state', () => {
    const mappedArtist = artistToState({
      id: 'AR1',
      name: 'The Artist',
      images: [{
        url: 'imgUrl',
      }],
    });
    expect(mappedArtist).toEqual({
      id: 'AR1',
      name: 'The Artist',
      image: 'imgUrl',
    });
  });

  it('maps artist albums to state', () => {
    const mappedAlbums = artistAlbumsToState({
      items: [{
        id: 'AL1',
        name: 'Album #1',
        release_date: '2018-01-05',
        images: [{
          url: 'img1',
        }],
      }, {
        id: 'AL2',
        name: 'Album #2',
        release_date: '2016-07-09',
        images: [{
          url: 'img2',
        }],
      }],
      limit: 30,
      offset: 0,
    });
    expect(mappedAlbums).toEqual([{
      id: 'AL1',
      name: 'Album #1',
      year: '2018',
      image: 'img1',
    }, {
      id: 'AL2',
      name: 'Album #2',
      year: '2016',
      image: 'img2',
    }]);
  });

  it('maps artist albums without images to state', () => {
    const mappedAlbums = artistAlbumsToState({
      items: [{
        id: 'AL1',
        name: 'Album #1',
        release_date: '2018-01-05',
        images: [],
      }],
      limit: 30,
      offset: 0,
    });

    expect(mappedAlbums).toEqual([{
      id: 'AL1',
      name: 'Album #1',
      year: '2018',
      image: undefined,
    }]);
  });
});
