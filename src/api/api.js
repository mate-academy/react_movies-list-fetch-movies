export const getMovie = request => fetch(`
  https://www.omdbapi.com/?apikey=c38f8b77&t=${request}
  `)
  .then((responce) => {
    if (!responce.ok) {
      throw new Error(`${responce.status} - ${responce.statusText}`);
    }

    return responce.json();
  });
