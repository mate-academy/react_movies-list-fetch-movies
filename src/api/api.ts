export const getMovie = (query: string): Promise<Movie> => {
  return fetch(`http://www.omdbapi.com/?apikey=ef5f9f&t=${query}`).then(response => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
};
