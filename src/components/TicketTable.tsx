'use client';

import { DataType } from '@/types';
import {
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  TableProps,
  Typography,
} from 'antd';
import { ReactElement, useState } from 'react';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: DataType;
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

const originData: DataType[] = [
  {
    key: '1',
    date: '1.1.2024',
    title: '#123',
    time: 1123,
  },
  {
    key: '2',
    date: '2.1.2024',
    title: '#321',
    time: 123123,
  },
  {
    key: '3',
    date: '3.1.2024',
    title: '#1212',
    time: 12312,
  },
];

export default function TicketTable(): ReactElement {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: string }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key as string);
  };

  const handleDelete = (key: string) => {
    const newData = data.filter((i) => i.key !== key);
    setData(newData);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      editable: true,
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
      dataIndex: 'time',
      key: 'time',
      width: '25%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      render: (_: unknown, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
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
              onClick={() => handleDelete(record.key)}
              type="danger"
            >
              Delete
            </Typography.Link>
          </Flex>
        );
      },
    },
  ];

  const mergedColumns: TableProps<DataType>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
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
      <Table<DataType>
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
    </Form>
  );
}
