// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { handlerCustomerDialog } from 'api/customer';
import { NavActionType } from 'config';

// assets
import { Add, Link1, KyberNetwork, Messages2, Money, Kanban, Profile2User, Bill, UserSquare, ShoppingBag ,Category,Speaker,User} from 'iconsax-react';

// type

// icons
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  Money: Money,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  category : Category,
  add: Add,
  link: Link1,
  Speaker : Speaker,
  User : User
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'MembershipNumber',
      title: <FormattedMessage id="Membership Number" />,
      type: 'item',
      icon: icons.Money,
      url: '/Membership/Membership-Number',
      children: [
      
      ]
    },
    {
      id: 'Category',
      title: <FormattedMessage id="Category" />,
      type: 'item',
      icon: icons.category,
      url: '/category/category-list',
      children: [
      
      ]
    },
    {
      id: 'Vendor',
      title: <FormattedMessage id="Vendor" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'customer-list',
          title: <FormattedMessage id="Vendor list" />,
          type: 'item',
          url: '/vendor-list',
          actions: [
            {
              type: NavActionType.FUNCTION,
              label: 'Add Customer',
              function: () => handlerCustomerDialog(true),
              icon: icons.add
            }
          ]
        },
        {
          id: 'customer-card',
          title: <FormattedMessage id="Offer" />,
          type: 'item',
          url: '/apps/customer/offer'
        }
      ]
    },

    {
      id: 'Users',
      title: <FormattedMessage id="Users" />,
      type: 'item',
      icon: icons.User,
      url: '/user-list',
      children: [
      
      ]
    },
    {
      id: 'advertisment',
      title: <FormattedMessage id="Advertisment" />,
      type: 'item',
      icon: icons.Speaker,
      url: '/advertisment',
      children: [
      
      ]
    },
    {
      id: 'Report',
      title: <FormattedMessage id="Report" />,
      type: 'item',
      icon: icons.kanban,
      url: '/Report',
      children: [
      
      ]
    },
   
  ]
};

export default applications;
