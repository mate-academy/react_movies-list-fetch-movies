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

  isEqualMovieExist = (movie: Movie) => {
    return this.state.movies.some(currentMovie => currentMovie.imdbID === movie.imdbID);
  };

  addMovieToList = (movie?: Movie): void => {
    if (movie && !this.isEqualMovieExist(movie)) {
      this.setState((prevState) => {
        return {
          movies: prevState.movies.concat(movie),
        };
      });
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
          <FindMovie onAdd={this.addMovieToList} />
        </div>
      </div>
    );
  }
}
