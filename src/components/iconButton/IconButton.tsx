import { ReactElement } from 'react';
import './iconButton.scss';

export default function IconButton({
  children,
  onClick,
}: {
  children: ReactElement;
  onClick: () => void;
}): ReactElement {
  return (
    <button onClick={onClick} className="icon-button">
      {children}
    </button>
  );
}
