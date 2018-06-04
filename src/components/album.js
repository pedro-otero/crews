import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Banner from './banner';
import Cover from './cover';
import Label from './label';

export const Album = ({ artist, album }) => {
  const artistImg = artist && artist.images.length ? artist.images[0].url : undefined;
  return <Fragment>
    {artist && album &&
      <Banner
          src={artistImg}
          className="content">
        <Cover
            album={album}
            imageClass="albumCover"
            yearClass="albumYear" />
        <div>
          <Label
              className="artistName"
              value={album.artists[0].name} />
          <Label
              className="trackName"
              value={album.name} />
        </div>
      </Banner>}
  </Fragment>;
};

Album.propTypes = {
  album: PropTypes.object,
  artist: PropTypes.object,
  id: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Album);
