import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [query, setQuery] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!isSubmitted || !query) {
      return;
    }

    setIsLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if (data.Response === 'True') {
          const normalizedMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          };

          if (normalizedMovie.imgUrl === 'N/A' || !normalizedMovie.imgUrl) {
            normalizedMovie.imgUrl =
              'https://via.placeholder.com/360x270.png?text=no%20preview';
          }

          setIsLoading(true);

          setMovie(normalizedMovie);

          setIsFailed(false);
        } else {
          setIsFailed(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsSubmitted(false);
      });
  }, [isSubmitted]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setQuery={setQuery}
          setIsSubmitted={setIsSubmitted}
          setMovies={setMovies}
          setMovie={setMovie}
          setIsFailed={setIsFailed}
          isFailed={isFailed}
          query={query}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          movie={movie}
        />
      </div>
    </div>
  );
};
