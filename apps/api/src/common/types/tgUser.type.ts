import { type User } from '@tma.js/init-data-node';

export type TelegramUser = Omit<User, 'id'> & {
  id: string;
};
