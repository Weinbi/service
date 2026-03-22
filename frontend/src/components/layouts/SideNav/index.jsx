import { Link } from 'react-router';
import SimplebarClient from '@/components/client-wrapper/SimplebarClient';
import AppMenu from './AppMenu';
import HoverToggle from './HoverToggle';
import logo from '@/assets/images/logo.png';
import vite from '@/assets/images/vite.svg';
const Sidebar = () => {
  return <aside id="app-menu" className="app-menu">
    <Link to="/" className="logo-box sticky top-0 flex min-h-topbar-height items-center justify-start px-6 backdrop-blur-xs">
      <div className="logo-dark">
        <img src={logo} className="logo-lg h-8" alt="Dark logo" />
        <img src={vite} className="logo-sm h-8" alt="Small logo" />
      </div>
    </Link>

    <HoverToggle />

    <div className="relative min-h-0 flex-grow">
      <SimplebarClient className="size-full">
        <AppMenu />
      </SimplebarClient>
    </div>
  </aside>;
};
export default Sidebar;