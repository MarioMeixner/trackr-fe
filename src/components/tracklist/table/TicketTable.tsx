'use client';

import { Track } from '@/types';
import {
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Table,
  TableProps,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { ReactElement, useState } from 'react';
import { mutate } from 'swr';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: Track;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          key={dataIndex}
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function TicketTable({
  data,
}: {
  data?: Track[];
}): ReactElement<Track[]> {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [notificationApi, contextHolder] = notification.useNotification();

  const isEditing = (record: Track) => record.id === editingKey;

  const edit = (record: Partial<Track> & { id: string }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.id as string);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/track', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error('Failed to delete track');
    }

    mutate('/api/track');
    notificationApi.success({
      message: 'Track deleted successfully',
      placement: 'bottomRight',
    });
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Track;

      const newData = [...(data ?? [])];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setEditingKey('');
      } else {
        newData.push(row);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      editable: true,
      render: (_: unknown, record: Track) => {
        return <span>{dayjs(record.date).format('DD.MM.YYYY')}</span>;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      editable: true,
    },
    {
      title: 'Spent time',
      dataIndex: 'duration',
      key: 'duration',
      width: '25%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      render: (_: unknown, record: Track) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginInlineEnd: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Flex justify="space-around">
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={() => handleDelete(record.id)}
              type="danger"
            >
              Delete
            </Typography.Link>
          </Flex>
        );
      },
    },
  ];

  const mergedColumns: TableProps<Track>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Track) => ({
        record,
        inputType: col.dataIndex === 'time' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table<Track>
        rowKey={(record) => record.id}
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{ onChange: cancel }}
        style={{ width: '60rem' }}
      />
      {contextHolder}
    </Form>
  );
}
