export const getMovie = (title: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=1061a671&t=${title}`)
    .then(response => response.json())
    .then(response => {
      if (response.Error) {
        throw new Error('Error');
      }

      return response;
    });
};
