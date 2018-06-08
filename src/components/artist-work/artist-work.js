import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Banner from '../banner/banner';
import Cover from '../cover/cover';
import Label from '../label/label';

import './artist-work.css';

const ArtistWork = ({
  title, artist, background, image, year, children, path,
}) => (
  <Banner
      src={background}
      className="content">
    <Link
        to={path}
        className="RR-link">
      <Cover
          src={image}
          imageClass="image"
          year={year}
          yearClass="albumYear" />
    </Link>
    <div>
      <Label
          className="artistName"
          value={artist} />
      <Label
          className="title"
          value={title} />
      {children}
    </div>
  </Banner>
);

ArtistWork.propTypes = {
  artist: PropTypes.string,
  background: PropTypes.string,
  children: PropTypes.array,
  image: PropTypes.string,
  path: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.string,
};

export default ArtistWork;
