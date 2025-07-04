export const today = (): { start: Date; end: Date } => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export enum FormEnum {
  signUp = 'signup',
  login = 'login',
}
