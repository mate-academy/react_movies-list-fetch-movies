const URL = 'http://www.omdbapi.com/?apikey=c501a498&t=';

const getMovieFromServer = async Title => fetch(`${URL}${Title}`)
  .then(response => response.json())
  .then(result => result)
  .catch(error => error);

export default getMovieFromServer;
