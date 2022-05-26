import React from 'react';
import classNames from 'classnames';

type Props = {
  isVisibleModal: boolean
  setIsVisibleModal: (boolVal: boolean) => void,
};

export const Modal: React.FC<Props> = ({
  isVisibleModal,
  setIsVisibleModal,
}) => {
  return (
    <div className={classNames(
      'modal',
      { 'is-active': isVisibleModal },
    )}
    >
      <div className="modal-background" />
      <div className="modal-content">
        <p
          style={{ fontSize: '50px', color: 'white' }}
        >
          Film is already in the list
        </p>
      </div>
      <button
        type="button"
        className="modal-close is-large"
        aria-label="close"
        onClick={() => setIsVisibleModal(false)}
      />
    </div>
  );
};
