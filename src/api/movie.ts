const BASE_URL = 'https://www.omdbapi.com/?apikey=7e698ae0';

function wait(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function get<T>(url: string): Promise<T> {
  return wait(1000)
    .then(() => fetch(BASE_URL + url))
    .then(response => {
      return (response.json());
    });
}

export const getMovie = (title:string): Promise<Movie> => {
  return get(`&t=${title}`);
};
