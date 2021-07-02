
const BASE_URL = 'https://www.omdbapi.com/?apikey=b8cd40cf&s=';

// export const getMoviesFromServer = async (
//   title,
//   setTitle,
//   handleAdd,
//   handleError,
// ) => {
//   const response = await fetch(`${BASE_URL}${title}`);

//   if (!response.ok) {
//     return false;
//   }

//   const resultObject = await response.json();

//   if (resultObject.Error) {
//     handleError(resultObject.Error);

//     return false;
//   }

//   const moviesFromServer = await resultObject.Search;
//   const moviesList = await Promise.all(moviesFromServer.map(movie => (
//     fetch(`https://www.omdbapi.com/?apikey=b8cd40cf&i=${movie.imdbID}`)
//       .then(r => r.json()))));

//   handleAdd(moviesList.map(movie => ({
//     title: movie.Title,
//     description: movie.Plot,
//     movie: movie.imdbID,
//     imgUrl: movie.Poster,
//     imdbId: movie.imdbID,
//   })));

//   setTitle('');

//   return true;
// };

export const getMoviesFromServer = async(
  title,
) => {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response.ok) {
    return false;
  }

  const resultObject = await response.json();

  if (resultObject.Error) {
    return new Error(resultObject.Error);
  }

  const moviesFromServer = await resultObject.Search;
  const moviesList = await Promise.all(
    moviesFromServer.map(movie => (
      fetch(`https://www.omdbapi.com/?apikey=b8cd40cf&i=${movie.imdbID}`)
        .then(r => r.json()))),
  );

  return moviesList.map(movie => ({
    title: movie.Title,
    description: movie.Plot,
    movie: movie.imdbID,
    imgUrl: movie.Poster,
    imdbId: movie.imdbID,
  }));
};
