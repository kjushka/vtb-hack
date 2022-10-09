import { api } from './';

const getOfferById = (id) => api.get(`/posts/${id}`);
const getOffers = () => api.get(`/posts`);

export { getOffers, getOfferById };