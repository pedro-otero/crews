export function artistToState({ id, name, images }) {
  return {
    id,
    name,
    image: images.length ? images[0].url : undefined,
  };
}

export function groupAlbums(items) {
  const group = (type, isFeatured) => ({
    name: `${isFeatured ? 'Featured: ' : ''}${type}s`,
    items: items
      .filter(album => album.album_type === type.toLowerCase())
      .filter(album => album.album_group === (isFeatured ? 'appears_on' : type.toLowerCase()))
      .map(({
        id,
        name,
        release_date: releaseDate,
        images: [firstImage = {}],
      }) => ({
        id,
        name,
        year: releaseDate.substring(0, 4),
        image: firstImage.url,
      })),
  });
  return [
    group('Album', false),
    group('Single', false),
    group('Compilation', false),
    group('Album', true),
    group('Single', true),
    group('Compilation', true),
  ].filter(category => category.items.length > 0);
}
