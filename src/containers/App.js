import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Song from '../components/song';
import './App.css';
import EmptyPlayback from '../components/empty-playback';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.addError = this.addError.bind(this);
    this.state = { errors: [], playback: true };
  }

  componentDidMount() {
    this.getPlaybackData();
  }

  componentWillUnmount() {
    if (this.creditsObservable) {
      this.creditsObservable.unsubscribe();
    }
  }

  getPlaybackData() {
    this.props.spotifyApi.getCurrentPlayback().then(({ body }) => {
      if (body) {
        const { item: track } = body;
        this.setState({
          track,
          playback: true,
        });
        this.getAlbum(track.album.id);
        this.getArtist(track.artists[0].id);
      } else {
        this.setState({ playback: false });
      }
    }, this.addError).catch(this.addError);
  }

  getAlbum(id) {
    this.props.spotifyApi.getAlbum(id).then(({ body: album }) => {
      this.setState({ album }, this.getCredits);
    }, this.addError).catch(this.addError);
  }

  getArtist(id) {
    this.props.spotifyApi.getArtist(id).then(({ body: artist }) => {
      this.setState({ artist });
    }, this.addError).catch(this.addError);
  }

  getCredits() {
    this.creditsObservable = this.props.backend.getCredits(this.state.album.id)
      .subscribe(({ bestMatch: { tracks }, progress }) => {
        const trackBestMatch = tracks.find(t => t.id === this.state.track.id);
        this.setState({
          bestMatch: trackBestMatch,
          progress,
        });
      }, this.addError);
  }

  addError({ message }) {
    this.setState({
      errors: [...this.state.errors, message],
      progress: 100,
    });
  }

  render() {
    const {
      track, album, artist, bestMatch, progress, errors, playback,
    } = this.state;
    return (
      <div>
        {errors.length > 0 &&
        <div className="errors-div">
          {errors.map((error, i) => <p key={`error-${i}`}>{error}</p>)}
          <p>Please reload the page to try again</p>
        </div>}
        {!playback && <EmptyPlayback />}
        {playback && <Song
            track={track}
            album={album}
            artist={artist}
            bestMatch={bestMatch}
            progress={progress} />}
      </div>
    );
  }
}

const mapStateToProps = ({ bestMatches }) => ({ bestMatches });

App.propTypes = {
  backend: PropTypes.func.isRequired,
  spotifyApi: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(App);
