const API_URL = 'https://www.omdbapi.com/?apikey=77e39eb1&t=';

export const getConnect = title => (
  fetch(`${API_URL}${title}`)
    .then((response) => {
      if (!response.ok) {
        return new Error('Can not load');
      }

      return response.json();
    })
);
