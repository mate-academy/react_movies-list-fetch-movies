export const getMovie = (title: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=4ccc88c9&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

// http://www.omdbapi.com/?i=tt3896198&apikey=4ccc88c9
