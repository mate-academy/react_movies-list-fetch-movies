import classnames from 'classnames';
import { MovieCardImg } from '../../../../types/Movie';

export const MoveCardImg: React.FC<MovieCardImg> = ({
  url,
  alt,
  dataCy,
  className,
}) => (
  <figure className={classnames('image', className)}>
    <img
      src={url}
      alt={alt}
      data-cy={dataCy}
    />
  </figure>
);
