import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import 'bulma';

export const App = () => {
  const [movies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState([]);

  const handleCklick = async (query: string) => {
    setIsLoading(true);

    // const inputToLowercase = query.toLocaleLowerCase();

    const film = await getMovie(query);

    const newMovie = {
      title: film.Title,
      description: film.Plot,
      imgUrl:
      imdbUrl:
      imdbId: film.imdbID,
    }

    setFoundMovie(newMovie);

    setIsLoading(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          findMovie={handleCklick}
          isLoading={isLoading}
          movie={foundMovie}
        />
      </div>
    </div>
  );
};

// const listOfMovies = await getMovie();
// setMovies(listOfMovies);

// const handleCklick = async (query: string) => {
//   setIsLoading(true);

//   const inputToLowercase = query.toLocaleLowerCase();

//   const findMovie = movies.filter((movie: Movie) => (
//     movie.title.toLocaleLowerCase().includes(inputToLowercase)
//   ));

//   setMovies(findMovie);
//   // if movie. incluses 'inputInfo'
//   setIsLoading(false);
// };

// getMovie(query)
// .then(movie => {
//   if (movie.title.toLocaleLowerCase().includes(inputToLowercase)) {
//     setMovies(movie);
//   }
// });
