import { atom } from 'nanostores';

export const refreshTrigger = atom<number>(0);

// Order filters
export const searchQuery = atom<string>('');
export const statusFilter = atom<string>('');
export const channelFilter = atom<string>('');
export const locationFilter = atom<string>('');
export const currentPage = atom<number>(1);

// Product filters
export const productSearchQuery = atom<string>('');
export const productCategoryFilter = atom<string>('');
export const productStatusFilter = atom<string>('');
export const productCurrentPage = atom<number>(1);

// Customer filters
export const customerSearchQuery = atom<string>('');
export const customerLocationFilter = atom<string>('');
export const customerTypeFilter = atom<string>('');
export const customerCurrentPage = atom<number>(1);
