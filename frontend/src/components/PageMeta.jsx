import { appName } from '@/helpers/constants';

const PageMeta = ({ title }) => {
  return <title>
    {title ? `${title} | ${appName}` : appName}
  </title>;
};
export default PageMeta;