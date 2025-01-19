'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  notification,
  Popconfirm,
  TimePicker,
  Tooltip,
} from 'antd';
import { useStopwatch } from 'react-timer-hook';
import {
  CaretDownOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '@/app/variables.module.scss';
import IconButton from '../iconButton/IconButton';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetTrackToEdit, selectTracker } from '@/redux/slices/trackerSlice';
import { mutate } from 'swr';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function Clock(): ReactElement<void> {
  const dispatch = useAppDispatch();
  const { track, isEditing } = useAppSelector(selectTracker);
  const { seconds, minutes, hours, start, pause, reset, isRunning } =
    useStopwatch();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const sectionRef = useRef<HTMLElement | any>(undefined);
  const clock = useRef<HTMLElement | any>(undefined);

  useGSAP(() => {
    gsap.fromTo(
      clock.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'bounce.out', yoyo: true }
    );
  });

  const formatedTime = useMemo(() => {
    const h = hours > 9 ? hours : '0' + hours;
    const m = minutes > 9 ? minutes : '0' + minutes;
    const s = seconds > 9 ? seconds : '0' + seconds;
    return `${hours > 0 ? h + ':' : ''}${m}:${s}`;
  }, [hours, minutes, seconds]);

  const endSubmitingOrEditing = (): void => {
    if (isEditing && track) {
      dispatch(resetTrackToEdit());
      form.resetFields();
    }
  };

  const getDuration = (hours: number, minutes: number): string => {
    return `${hours > 0 ? hours + 'h' : ''}${minutes + 'm'}`;
  };

  const showForm = () => {
    setOpen(!open);
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
    gsap.to('.icon-button', { rotation: '+=180', duration: 0.3 });
  };

  const handleDelete = (): void => {
    endSubmitingOrEditing();
    reset(undefined, false);
    showForm();
  };

  const onChangeDatetime = (
    datetime: dayjs.Dayjs,
    datetimeString: string | string[],
    name: string
  ) => {
    form.setFieldsValue({ [name]: datetime });
  };

  const onChangeRange = (dateStrings: [string, string]) => {
    const [start, end] = dateStrings;

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);
    const difference = Math.abs(endMinutes - startMinutes);
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60 === 0 ? 0 : difference % 60;

    form.setFieldValue('startTime', start);
    form.setFieldValue('endTime', end);
    form.setFieldValue('duration', getDuration(hours, minutes));
  };

  const handleSubmit = async (values: FormData) => {
    showForm();
    reset();
    pause();
    const response = await fetch('/api/track', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, id: track.id }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create todo');
    }
    form.resetFields();
    mutate('/api/track');
    notificationApi.success({
      message: 'Work updated successfully',
      placement: 'bottomRight',
    });
    endSubmitingOrEditing();
  };

  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        duration: getDuration(hours, minutes),
      });
    }
  }, [hours, minutes, form]);

  useEffect(() => {
    if (track.id !== '') {
      form.setFieldsValue({
        id: track.id,
        title: track.title,
        description: track.description,
        date: dayjs(track.date),
        duration: track.duration,
      });
      if (!open) {
        showForm();
      }
    }
  }, [track]);

  return (
    <div style={{ position: 'relative' }}>
      {contextHolder}
      <Flex align="center" vertical gap="0.5rem">
        <div style={{ fontSize: '100px' }} ref={clock}>
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
            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
          >
            <Form
              form={form}
              initialValues={{ date: dayjs() }}
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
                    onChange={(date) => onChangeDatetime(date!, '', 'date')}
                    style={{ width: '10rem' }}
                  />
                </Form.Item>
                <Form.Item name="timeRange">
                  <TimePicker.RangePicker
                    placeholder={['Start time', 'End time']}
                    variant="filled"
                    format="HH:mm"
                    minuteStep={15}
                    onChange={(_, dateStrings) =>
                      onChangeRange(dateStrings as [string, string])
                    }
                  />
                </Form.Item>
              </Flex>
              <Flex>
                <Form.Item
                  name="duration"
                  rules={[
                    { required: true, message: 'Please input duration!' },
                  ]}
                >
                  <Input
                    placeholder="Duration"
                    variant="filled"
                    suffix={<ClockCircleOutlined />}
                  />
                </Form.Item>
              </Flex>
              <Form.Item name="description">
                <Input placeholder="Description of issue" variant="filled" />
              </Form.Item>
              <Flex gap="0.5rem" justify="flex-end">
                <Button type="primary" htmlType="submit">
                  {isEditing ? 'Edit' : 'Log'}
                </Button>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete()}
                >
                  <Button danger>Discard</Button>
                </Popconfirm>
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
