import { atom } from 'nanostores';

export const refreshTrigger = atom<number>(0);

export const searchQuery = atom<string>('');
export const statusFilter = atom<string>('');
export const channelFilter = atom<string>('');
export const locationFilter = atom<string>('');
export const currentPage = atom<number>(1);
