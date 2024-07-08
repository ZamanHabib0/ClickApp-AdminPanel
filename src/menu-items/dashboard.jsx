// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { useGetMenu } from 'api/menu';

// assets
import { Refresh, Home3, HomeTrendUp, Box1 } from 'iconsax-react';

const icons = {
  navigation: Home3,
  dashboard: HomeTrendUp,
  components: Box1,
  loading: Refresh
};

const loadingMenu = {
  id: 'group-dashboard-loading',
  title: <FormattedMessage id="dashboard" />,
  type: 'group',
  icon: icons.loading,
  children: [
    {
      id: 'dashboard1',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      icon: icons.dashboard,
      url: '/dashboard/default',
      breadcrumbs: false
    }
  ]
};

// ==============================|| MENU ITEMS - API ||============================== //

export function MenuFromAPI() {
  const { menu, menuLoading } = useGetMenu();

  if (menuLoading) return loadingMenu;

  const itemList = (item) => {
    return fillItem(item);
  };

  const childrenList = menu?.children?.map((item) => {
    return itemList(item);
  });

  let menuList = fillItem(menu, childrenList);
  return menuList;
}

function fillItem(item, children) {
  return {
    ...item,
    title: <FormattedMessage id={`${item?.title}`} />,
    // @ts-ignore
    icon: icons[item?.icon],
    url: item.url ? item.url : undefined, // Ensure url is present
    breadcrumbs: item.breadcrumbs ? item.breadcrumbs : undefined,
    ...(children && { children })
  };
}