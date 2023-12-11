import React from 'react';
import './MovieCard.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  movie: Movie | MovieData;
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const {
    imgUrl: movieImgUrl,
    title: movieTitle,
    description: movieDescription,
    imdbUrl: movieImdbUrl,
  } = movie as Movie;

  const {
    Poster: movieDataImgUrl,
    Title: movieDataTitle,
    Plot: movieDataPlot,
    imdbID: movieDataImdbId,
  } = movie as MovieData;

  let imageUrl = '';

  if (!movieImgUrl && movieDataImgUrl === 'N/A') {
    imageUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  } else {
    imageUrl = movieImgUrl;
  }

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={imageUrl || movieDataImgUrl}
            alt="Film logo"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img
                src="images/imdb-logo.jpeg"
                alt="imdb"
              />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8" data-cy="movieTitle">
              {movieTitle || movieDataTitle}
            </p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {movieDescription || movieDataPlot}
          <br />
          <a
            href={movieImdbUrl || `https://www.imdb.com/title/${movieDataImdbId}`}
            data-cy="movieURL"
          >
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
