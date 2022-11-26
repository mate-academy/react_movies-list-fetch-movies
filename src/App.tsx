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
  // console.log(movies)

  const handleCklick = async (query: string) => {
    setIsLoading(true);

    const inputToLowercase = query.toLocaleLowerCase();

    const film = await getMovie(inputToLowercase);

    setFoundMovie(film);

    // export interface MovieData {
    //   Poster: string;
    //   Title: string;
    //   Plot: string;
    //   imdbID: string;
    // }

    //   title: string;
    //   description: string;
    //   imgUrl: string;
    //   imdbUrl: string;
    //   imdbId: string;
    // }

    // let newMovie = {
    //   title: movie.title;
    //   description: movie.plot;

    // }

    // setFoundMovie(movie);

    // const inputToLowercase = query.toLocaleLowerCase();
    // const findMovie = movies.filter((movie: Movie) => (
    //   movie.title.toLocaleLowerCase().includes(inputToLowercase)
    // ));

    // setMovies(findMovie);
    setIsLoading(false);
  };

  // eslint-disable-next-line no-console
  // console.log(movie);

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
