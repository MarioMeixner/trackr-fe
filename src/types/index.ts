export type ChartData = {
  type: string;
  value: number | string;
};

export type CaseRecord = {
  theme?: string;
  sub_theme?: string;
  topic?: string;
  geography_type?: string;
  geography?: string;
  geography_code?: string;
  metric?: string;
  metric_group?: string;
  stratum?: string;
  sex?: string;
  age?: string;
  year?: number;
  month?: number;
  epiweek?: number;
  date?: string;
  metric_value?: number;
  in_reporting_delay_period?: boolean;
};

export type PayloadData = {
  count?: number;
  next?: string;
  previous?: string;
  results?: Array<CaseRecord>;
};
