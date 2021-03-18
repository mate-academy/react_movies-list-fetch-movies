const titleUrl = 'http://www.omdbapi.com/?apikey=de242cb8&t=';

export const getFilm = breakPoint => (
  fetch(`${titleUrl}${breakPoint}`).then(response => response.json())
);
