import { Issue } from '@/types';
import { DatePicker, Flex, Form, FormInstance, Input } from 'antd';
import dayjs from 'dayjs';
import { ReactElement } from 'react';

export default function TicketForm({
  form,
}: {
  form: FormInstance<Issue>;
}): ReactElement {
  const onChangeDatetime = (
    datetime: dayjs.Dayjs,
    datetimeString: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: any
  ) => {
    form.setFieldValue(name, datetime);
    console.log(datetime, datetimeString, name);
  };

  const onSubmit = (values: Issue) => {
    console.log(values);
    closePopup();
  };

  const closePopup = () => {
    form.resetFields();
  };

  return (
    <Flex vertical>
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input title of issue!' }]}
        >
          <Input variant="filled" placeholder="Issue title" />
        </Form.Item>
        <Flex gap="1rem">
          <Form.Item
            name="startDate"
            rules={[{ required: true, message: 'Please input date of start!' }]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              variant="filled"
              onChange={(date: dayjs.Dayjs, dateString: string | string[]) =>
                onChangeDatetime(date, dateString, 'startDate')
              }
              style={{ width: '10rem' }}
            />
          </Form.Item>
          <Form.Item
            name="duration"
            rules={[{ required: true, message: 'Please input duration!' }]}
          >
            <Input placeholder="Duration" variant="filled" />
          </Form.Item>
        </Flex>
        <Form.Item
          name="endDate"
          rules={[{ required: true, message: 'Please input date of end!' }]}
          initialValue={dayjs()}
        >
          <DatePicker
            format="DD.MM.YYYY"
            variant="filled"
            onChange={(date: dayjs.Dayjs, dateString: string | string[]) =>
              onChangeDatetime(date, dateString, 'endDate')
            }
            style={{ width: '10rem' }}
          />
        </Form.Item>
        <Form.Item name="description">
          <Input variant="filled" placeholder="Description of issue" />
        </Form.Item>
      </Form>
    </Flex>
  );
}
