const API_URL = 'https://www.omdbapi.com/?apikey=d71546d5&t=';

export const getMovie = title => fetch(`${API_URL}${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
