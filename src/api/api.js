const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=8b940388';

export const getMovie = (title) => {
  try {
    fetch(`${BASE_URL}&t=${title}`)
      .then(response => response.json())
      .then(serverResponse => serverResponse.data || serverResponse);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};
