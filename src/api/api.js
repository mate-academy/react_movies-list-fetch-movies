const API_URL = `http://omdbapi.com/?apikey=300b7b6c&t=`;

export const getFilm = title => fetch(`${API_URL}${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
