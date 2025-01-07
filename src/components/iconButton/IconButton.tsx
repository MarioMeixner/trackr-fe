import { ReactElement } from 'react';
import './iconButton.scss';

export default function IconButton({
  children,
  onClick,
}: {
  children: ReactElement<void>;
  onClick: () => void;
}): ReactElement<void> {
  return (
    <button onClick={onClick} className="icon-button">
      {children}
    </button>
  );
}
