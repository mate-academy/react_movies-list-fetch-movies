import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieInfo, setMovieInfo] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect(() => {
  //   window.addEventListener('click')
  //   getMovie(query)
  //     .then(moviesFromApi => {
  //       console.log(moviesFromApi)
  //       // setMovies(moviesFromApi);
  //     })
  //     .catch(error => setErrorMessage(error.message))
  //     .finally(() => setLoading(false));
  // }, [isFindMovie])

  // useEffect(() => {
  //   if (movies) {
  //     console.log(movies);
  //   }
  // }, [movies]);

  const handleLoadMovie = (q: string) => {
    setLoading(true);

    getMovie(q)
      .then(moviesFromApi => {
        if ('Error' in moviesFromApi) {
          setErrorMessage('Error');
          setMovieInfo(null);
        } else {
          setMovieInfo({
            title: moviesFromApi.Title,
            description: moviesFromApi.Plot,
            imgUrl:
              moviesFromApi.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : moviesFromApi.Poster,
            imdbUrl: `https://www.imdb.com/title/${moviesFromApi.imdbID}`,
            imdbId: moviesFromApi.imdbID,
          });
        }
      })
      .catch(error => setErrorMessage(error.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const onAddMovie = (movie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.find((film: Movie) => film.imdbId === movie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movieInfo}
          setMovie={setMovieInfo}
          isLoading={loading}
          error={errorMessage}
          setError={setErrorMessage}
          query={query}
          onQueryChange={setQuery}
          handleSubmit={handleLoadMovie}
          onAdd={onAddMovie}
        />
      </div>
    </div>
  );
};
