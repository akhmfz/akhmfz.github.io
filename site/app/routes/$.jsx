import { Error } from '~/layouts/error';

export const meta = () => {
  return [{ title: '404 | Muhammad Akhmal' }];
};

export default function NotFound() {
  return <Error error={{ status: 404, statusText: 'Not found' }} />;
}
