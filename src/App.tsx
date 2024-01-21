import { useEffect, useState } from 'react';
import './App.scss';
import { getMovie } from './api';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [startSearchingMovie, setStartSearchingMovie] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);

  const changeTitle = (value: string) => setQuery(value);

  const addMovie = (movie: Movie) => {
    const movies = [...moviesList];

    return setMoviesList([...movies, movie]);
  };

  const resetForm = () => {
    setQuery('');
    setFoundMovie(null);
    setErrorMessage('');
  };

  useEffect(() => {
    if (startSearchingMovie) {
      setIsloading(true);

      getMovie(query)
        .then(response => {
          if ('Error' in response) {
            setErrorMessage("Can't find a movie with such a title");
          } else if ('Title' in response) {
            setFoundMovie({
              title: response.Title,
              description: response.Plot,
              imgUrl: response.Poster,
              imdbUrl: '',
              imdbId: response.imdbID,
            });
          }
        })
        .finally(() => {
          setStartSearchingMovie(false);
          setIsloading(false);
        });
    }
  }, [query, startSearchingMovie]);

  return (
    <div className="page">
      <div className="page-content">

        <MoviesList movies={moviesList} />
      </div>

      <div className="sidebar">
        <FindMovie
          errorMessage={errorMessage}
          onChangeSearch={changeTitle}
          query={query}
          searchMovie={() => setStartSearchingMovie(true)}
          onBackspacePress={() => setErrorMessage('')}
          foundMovie={foundMovie}
          isLoading={isLoading}
          addingMovie={addMovie}
          resetForm={resetForm}
          moviesList={moviesList}
          onHideErrorMessage={() => setErrorMessage('')}
        />
      </div>
    </div>
  );
};
