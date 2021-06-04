const API_URL = `http://www.omdbapi.com/?apikey=7df4c501&t=`;

export const getMovie = title => (
  fetch(`${API_URL}${title}`)
    .then(response => (
      response.json()
    ))
);
