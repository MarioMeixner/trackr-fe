import { ReactElement } from 'react';
import Text from 'antd/es/typography/Text';

export default function UserInfo({
  username,
}: {
  username: string;
}): ReactElement {
  return (
    <Text style={{ fontSize: '1.25em' }}>
      Welcome <b>{username}</b>! 👋
    </Text>
  );
}
