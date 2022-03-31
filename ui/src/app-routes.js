import { withNavigationWatcher } from './contexts/navigation';
import ERPHome from './Pages/ERP-Home/ERPHome';

const routes = [
  { path: "/Home", component: ERPHome }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
