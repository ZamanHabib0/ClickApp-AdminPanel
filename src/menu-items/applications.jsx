// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { Add, Link1, KyberNetwork, Messages2, Money, Kanban, Profile2User, Bill, UserSquare, ShoppingBag ,Category,Speaker,User,Book} from 'iconsax-react';

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
  User : User,
  Book : Book
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'EducationalInstitute',
      title: <FormattedMessage id="Educational Institute" />,
      type: 'item',
      icon: icons.Book,
      url: '/educational-institute/list',
      children: [
      
      ]
    },
    {
      id: 'MembershipNumber',
      title: <FormattedMessage id="Membership Number" />,
      type: 'item',
      icon: icons.Money,
      url: '/Membership/Membership-Number',
      children: [
      
      ]
    },
    // {
    //   id: 'AccountSettings',
    //   title: <FormattedMessage id="Account Settings" />,
    //   type: 'item',
    //   icon: icons.Money,
    //   url: '/account/settings',
    //   children: [
      
    //   ]
    // },
   
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
          id: 'Aavilable Services',
          title: <FormattedMessage id="Aavilable Services" />,
          type: 'item',
          // icon: icons.add,
          url: '/Aavilable-Services',
        },
        {
          id: 'customer-list',
          title: <FormattedMessage id="Vendor list" />,
          type: 'item',
          url: '/vendor-list',
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
