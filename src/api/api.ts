const URL = 'https://www.omdbapi.com/?apikey=f11f28c0';

export function getMovie(title: string) {
  return fetch(`${URL}&t=${title}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'False') {
        throw new Error();
      }

      return data;
    });
}
