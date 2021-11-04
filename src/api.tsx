const serverKey = '936c02dd';
const apiURL = `https://www.omdbapi.com/?apikey=${serverKey}&t=`;

export function getFilm(title: string) {
  return fetch(`${apiURL}${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
