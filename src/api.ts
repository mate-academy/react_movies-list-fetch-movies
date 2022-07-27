import { Movie } from './type/Movie';

// eslint-disable-next-line max-len
const BASE_URL = 'https://www.omdbapi.com/?apikey=44e885bc&t=';

function wait(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function get(url: string): Promise<Movie> {
  const fullURL = BASE_URL + url;

  return wait(1000)
    .then(() => fetch(fullURL))
    .then(res => res.json());
}

export const getMovie = (title: string) => get(title);
