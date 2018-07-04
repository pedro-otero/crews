export default (SpotifyWebApi, location) => ({ clientId, redirectUri, throttle }) => {
  const commands = [];
  let timer;
  const methods = ['getMyCurrentPlaybackState', 'getAlbum', 'getArtist', 'getTrack'];
  const api = new SpotifyWebApi({ clientId, redirectUri });
  api.setAccessToken(localStorage.getItem('token'));

  const processRejection = reject => (e) => {
    const { statusCode } = e;
    if (statusCode === 401) {
      location.reload();
      return;
    } else if (statusCode === 429) {
      clearInterval(timer);
      // This fixed 500 value HAS TO BE CHANGED for the one in the Retry-After header
      // that is not exposed by the Spotify Web API wrapper.
      // See issue https://github.com/thelinmichael/spotify-web-api-node/issues/217
      setTimeout(start, 500);
      return;
    }
    reject(e);
  };

  function start() {
    timer = setInterval(() => {
      if (commands.length) {
        const [method, args, resolve, reject] = commands[0];
        api[method](...args).then((response) => {
          commands.shift();
          resolve(response);
        }, processRejection(reject));
      }
    }, throttle);
  }

  start();

  return methods.reduce((publicApi, method) => Object.assign({}, publicApi, {
    [method]: (...args) => new Promise((resolve, reject) =>
      commands.push([method, args, resolve, reject])),
  }), {});
};
