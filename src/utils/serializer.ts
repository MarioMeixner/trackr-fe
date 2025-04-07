import { components } from '@/lib/api';
import { FormData } from '@/types';

const serializeTrack = (
  values: FormData
): components['schemas']['CreateTrackDto'] => {
  return {
    title: values.title,
    description: values.description || '',
    duration: values.duration,
    date: values.date.toISOString(),
    startTime: '',
    endTime: '',
    authorId: '',
  };
};

export { serializeTrack };
