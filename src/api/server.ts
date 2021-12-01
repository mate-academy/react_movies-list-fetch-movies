const BASE_URL = 'https://www.omdbapi.com/?apikey=84fc5cf6&t=';

const request = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};

export function getFilm(nameFilm: string): Promise<Movie[]> {
  return request(nameFilm);
}

export function getFilms(nameFilm: string): Promise<Movie> {
  return request(nameFilm);
}
