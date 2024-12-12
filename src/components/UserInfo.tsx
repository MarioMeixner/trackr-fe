import { ReactElement } from 'react';
import Text from 'antd/es/typography/Text';

export default function UserInfo({
  username,
}: {
  username: string;
}): ReactElement {
  return (
    <Text style={{ fontSize: '1.25em' }}>
      Hey <b>{username}</b>! 👋
    </Text>
  );
}
