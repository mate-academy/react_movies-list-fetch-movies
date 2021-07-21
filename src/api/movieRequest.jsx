const baseUrl = 'https://www.omdbapi.com/?apikey=5eed3100&t=';

export const movieRequest = (title) => (
 fetch(baseUrl + title)
    .then(response => response.json())
);
