export type ButtonType = 'submit' | 'button';

export interface ButtonTypes {
  dataCy: string;
  content: string;
  type: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}
