import { CardMedia } from '@mui/material';
import IllustrationErrorPage from 'assets/images/illustration/ErrorPage.svg';
import PageRoot from './styled';

export default function ErrorPage() {
  return (
    <PageRoot>
      <CardMedia component="img" src={IllustrationErrorPage} />
    </PageRoot>
  );
}
