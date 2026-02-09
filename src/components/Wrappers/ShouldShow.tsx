import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  showCondition: boolean;
}

const ShouldShow = ({ showCondition, children }: Props) => {
  return showCondition ? <>{children}</> : null;
};

export default ShouldShow;
