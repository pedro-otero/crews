import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Song } from './song';
import initialState from '../../store/initalState';

Enzyme.configure({ adapter: new Adapter() });

describe('Song component', () => {
  describe('initial state', () => {
    const wrapper = shallow(<Song
      data={initialState.song.credits}
      track={initialState.song.track}
      album={initialState.song.album}
      artist={initialState.song.artist}/>);

  it('hides composers list', () => {
    expect(wrapper.find('span[className="composers"]')).toHaveLength(0);
  });

  it('hides producers list', () => {
    expect(wrapper.find('span[className="producers"]')).toHaveLength(0);
  });
  });
});