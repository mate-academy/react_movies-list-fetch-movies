import { MovieCardDescripton } from '../../../../types/Movie';

export const MoveCardDescription: React.FC<MovieCardDescripton> = ({
  imdbUrl,
  description,
}) => (
  <div className="content" data-cy="movieDescription">
    {description}
    <br />
    <a href={imdbUrl} data-cy="movieURL">
      IMDB
    </a>
  </div>
);
