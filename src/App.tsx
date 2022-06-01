import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  pushMovie = (movie: Movie) => {
    const { movies } = this.state;

    if (!movies
      .some(movieFromState => movieFromState.imdbID === movie.imdbID)
    ) {
      this.setState((state) => ({
        movies: [
          ...state.movies,
          movie,
        ],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie pushMovie={this.pushMovie} />
        </div>
      </div>
    );
  }
}
