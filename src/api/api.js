const URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=e3692833';

export const findMovieByTitle = async title => fetch(`${URL}&t=${title}`)
  .then(response => response.json());
