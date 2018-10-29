/* eslint-disable import/no-extraneous-dependencies,max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import SavedTracks from './saved-tracks';

const outer = {
  display: 'flex',
  justifyContent: 'center',
};

const inner = {
  border: '1px solid grey',
  width: '300px',
};

const tracks = [{
  id: 1,
  title: 'First Single',
  artist: 'Hot Band',
  album: 'Sleeper Hit',
}, {
  id: 1,
  title: 'Chart Topper',
  artist: 'Hot Band',
  album: 'Sleeper Hit',
}, {
  id: 1,
  title: 'Guns and Bitches',
  artist: 'Sum Rappa',
  album: 'Reference To Marijuana',
}, {
  id: 1,
  title: 'Unexpected Flop',
  artist: 'Hot Band',
  album: 'Sleeper Hit',
}, {
  id: 1,
  title: 'Song She Wrote',
  artist: 'Pop Diva',
  album: 'Pahp Deevah',
}, {
  id: 1,
  title: 'Song With a F*****g lot of cursing',
  artist: 'Sum Rappa',
  album: 'Reference To Marijuana',
}];

storiesOf('Saved tracks', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Default', () => (
    <div style={outer}>
      <div style={inner}>
        <SavedTracks tracks={tracks} />
      </div>
    </div>
  ));
