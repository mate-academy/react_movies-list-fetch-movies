const API_URL = 'https://www.omdbapi.com/?apikey=ebc435ec&t=';

export interface Movie {
  Poster: string,
  Title: string,
  Plot: string,
  imdbID: string,
  Response?: string,
}

export function getMovie(title: string): Promise<Movie> {
  return fetch(`${API_URL}${title}`)
    .then(response => {
      if (!response.status) {
        throw new Error('error');
      }

      return response.json();
    });
}
