import { redirect } from 'next/navigation';
import React, { ReactNode, ReactElement } from 'react';

export default function ErrorBoundary({
  children,
  errorStatus,
}: {
  children: ReactNode;
  errorStatus?: number;
}): ReactElement {
  if (errorStatus) {
    switch (errorStatus) {
      case 404:
        redirect(`/not-found`);
        break;
      default:
        redirect('/error');
    }
  }
  return <>{children}</>;
}
