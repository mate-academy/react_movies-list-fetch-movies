const URL = 'https://www.omdbapi.com/?apikey=c501a498&t=';

const getMovieFromServer = Title => fetch(`${URL}${Title}`)
  .then(response => response.json())
  .then(result => result)
  .catch(error => error);

export default getMovieFromServer;
