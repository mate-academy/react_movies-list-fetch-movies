/* eslint-disable no-console */
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=b6f7cb18';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const url = `${API_URL}&t=${query}`;

  return fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log('data from api =', data); // Log the parsed response body

      return data;
    })
    .catch(error => {
      console.error(error);

      return {
        Response: 'False',
        Error: 'unexpected error',
      };
    });
}

// export function getMovie(query: string): Promise<MovieData | ResponseError> {
//   return fetch(`${API_URL}&t=${query}`)
//     .then(res => {
//       if (!res.ok) {
//         // Handle network error or non-2xx status code
//         throw new Error('Network error or unexpected status code');
//       }

//       return res.json();
//     })
//     .then(data => {
//       if (data.Response === 'True') {
//         // Movie found
//         return data;
//       }

//       // Movie not found
//       return {
//         Response: 'False',
//         Error: data.Error || 'Movie not found',
//       };
//     })
//     .catch(error => {
//       // Handle any other errors
//       return {
//         Response: 'False',
//         Error: error.message || 'Unexpected error',
//       };
//     });
// }

// const handleFind = (term: string) => {
//   getMovie(term)
//     .then(movieData => {
//       if (isResponseError(movieData)) {
//         setError(movieData.Error || 'Can’t find movie with such title');
//         console.error(movieData.Error);
//       } else {
//         const normalizedMovie = normalizeMovieData(movieData);

//         setCurrentMovie(normalizedMovie);
//         setError(null);
//       }
//     })
//     .catch(error => {
//       setError('Unexpected error occurred');
//       // Set error state if there's a network error or other issue
//       console.error(error);
//     })
//     .finally(() => {
//       // Code here will run whether the promise was resolved or rejected.
//       // For example, you could stop a loading spinner here.
//     });
// };

// const handleAddMovie = (movie: Movie) => {
//   // addMovie(movie);  // Example usage of the parameter
// };
