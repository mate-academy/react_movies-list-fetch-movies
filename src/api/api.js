const BASE_URL = 'https://www.omdbapi.com/?apikey=39e399d8&t=';

export const request = title => (
  fetch(`${BASE_URL}${title}`)
    .then(response => response.json())
    .catch(() => new Error('Error'))
);
