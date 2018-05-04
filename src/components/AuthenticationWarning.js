import React from 'react';
import PropTypes from 'prop-types';

const AuthenticationWarning = ({ clientId, redirectUri, scopes }) => {
  const params = {
    client_id: clientId,
    response_type: 'token',
    redirect_uri: redirectUri,
    state: 'reactApp',
    scope: scopes,
    show_dialog: 'false',
  };
  const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  const url = `https://accounts.spotify.com/authorize?${queryString}`;

  return (
    <div className="container container-table">
      <div className="jumbotron">
        <h1 className="display-3">Hey there!</h1>
        <p>You need to login to Spotify to use this app</p>
        <input
          type="button"
          className="btn btn-success"
          onClick={() => { window.location = url; }} value="Login"/>
      </div>
    </div>
  );
};

AuthenticationWarning.propTypes = {
  clientId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  scopes: PropTypes.string.isRequired,
};

export default AuthenticationWarning;
