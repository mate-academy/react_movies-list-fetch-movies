import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  propAddMovie: (movie: Movie) => void,
};

export const FoundMovies: React.FC<Props> = ({ movies, propAddMovie }) => ( // , propAddMovie
  <>
    {movies.map((movie: Movie) => (
      <div key={movie.imdbID} className="card-container">
        <MovieCard
          movies={movies}
          movie={movie}
          propAddMovie={propAddMovie}
        />
      </div>
    ))}
  </>
);
