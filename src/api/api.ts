const API_URL = 'https://www.omdbapi.com/';
const KEY = '24aecfbf';

function request(url: string) {
  return fetch(url)
    .then(responce => {
      if (!responce.ok) {
        throw Error(`${responce.status} - ${responce.statusText}`);
      }

      return responce.json();
    });
}

export function getMovie(title: string): Promise<Movie> {
  return request(`${API_URL}?apikey=${KEY}&t=${title}`);
}
