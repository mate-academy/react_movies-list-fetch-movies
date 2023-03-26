interface Props {
  textError: string;
}

export const LoadingError: React.FC<Props> = ({ textError }) => (
  <div className="notification is-danger is-light">
    {`An error occured when loading ${textError}!`}
  </div>
);
