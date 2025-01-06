/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Tooltip,
} from 'antd';
import { useStopwatch } from 'react-timer-hook';
import { CaretDownOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { PlayCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '@/app/variables.module.scss';
import IconButton from '../iconButton/IconButton';
import { createTrack } from '@/actions/actions';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function Clock(): ReactElement {
  const { seconds, minutes, hours, start, pause, reset, isRunning } =
    useStopwatch();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const sectionRef = useRef<HTMLElement | any>(null);
  const clock = useRef<HTMLElement | any>();

  useGSAP(() => {
    gsap.fromTo(
      clock.current,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'bounce.out',
        yoyo: true,
      }
    );
  });

  const formatedTime = useMemo(() => {
    const h = hours > 9 ? hours : '0' + hours;
    const m = minutes > 9 ? minutes : '0' + minutes;
    const s = seconds > 9 ? seconds : '0' + seconds;
    return `${hours > 0 ? h + ':' : ''}${m}:${s}`;
  }, [hours, minutes, seconds]);

  useEffect(() => {
    form.setFieldValue('duration', `${hours}h:${minutes}m`);
  }, [hours, minutes]);

  const showForm = () => {
    setOpen(true);
    if (open) {
      gsap.to(sectionRef.current, {
        height: 0,
        overflow: 'hidden',
        opacity: 0,
        duration: 0.5,
        padding: 0,
      });
    } else {
      const sectionHeight = sectionRef.current.scrollHeight;
      gsap.to(sectionRef.current, {
        height: sectionHeight,
        overflow: 'visible',
        opacity: 1,
        duration: 0.5,
        padding: '10px 20px',
      });
    }
    gsap.to('.icon-button', {
      rotation: '+=180',
      duration: 0.3,
    });
    setOpen(!open);
  };

  const handleDelete = (): void => {
    reset(undefined, false);
  };

  const onChangeDatetime = (
    datetime: dayjs.Dayjs,
    datetimeString: string | string[],
    name: string
  ) => {
    form.setFieldValue(name, datetime);
  };

  const handleSubmit = async (values: FormData) => {
    showForm();
    reset();
    pause();
    await createTrack(JSON.stringify(values));
    form.resetFields();
    messageApi.open({
      type: 'success',
      content: 'Work logged successfully',
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      {contextHolder}
      <Flex align="center" vertical gap="0.5rem">
        <div
          style={{
            fontSize: '100px',
          }}
          ref={clock}
        >
          {formatedTime}
        </div>
        <Flex vertical gap="1rem">
          <Flex gap="1rem" justify="center">
            <IconButton onClick={showForm}>
              <CaretDownOutlined />
            </IconButton>
          </Flex>
          <Flex
            ref={sectionRef}
            style={{
              height: 0,
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            <Form
              initialValues={{
                date: dayjs(),
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: 'Please input title of issue!' },
                ]}
              >
                <Input variant="filled" placeholder="Issue title" />
              </Form.Item>
              <Flex gap="1rem">
                <Form.Item
                  name="date"
                  rules={[
                    { required: true, message: 'Please input date of start!' },
                  ]}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    variant="filled"
                    onChange={(
                      date: dayjs.Dayjs,
                      dateString: string | string[]
                    ) => onChangeDatetime(date, dateString, 'date')}
                    style={{ width: '10rem' }}
                  />
                </Form.Item>
                <Form.Item
                  name="duration"
                  rules={[
                    { required: true, message: 'Please input duration!' },
                  ]}
                >
                  <Input placeholder="Duration" variant="filled" />
                </Form.Item>
              </Flex>
              <Form.Item name="description">
                <Input variant="filled" placeholder="Description of issue" />
              </Form.Item>
              <Flex gap="0.5rem" justify="flex-end">
                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit">
                    Log
                  </Button>
                </Form.Item>
                <Form.Item label={null}>
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => handleDelete()}
                  >
                    <Button onClick={pause} variant="outlined" color="danger">
                      Discard
                    </Button>
                  </Popconfirm>
                </Form.Item>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </Flex>
      <div style={{ position: 'absolute', right: -20, top: 45 }}>
        {isRunning ? (
          <Tooltip title="pause">
            <Button
              onClick={pause}
              type="primary"
              shape="circle"
              icon={<PauseCircleOutlined />}
              size="large"
            />
          </Tooltip>
        ) : (
          <Tooltip title="play">
            <Button
              onClick={start}
              type="primary"
              shape="circle"
              icon={<PlayCircleOutlined />}
              size="large"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
}
