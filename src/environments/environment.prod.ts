// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // apiEndpont: 'http://localhost:8080/',
  // apiEndpont: 'https://localhost:8081/',
  apiEndpont: 'https://crm-capstone-ws.azurewebsites.net/',
  socketServer: 'https://crm-capstone-ws.azurewebsites.net/',
  // socketServer: 'http://localhost:8080/',
  // socketServer: 'https://localhost:8081/',
  token: 'crm-token',
  api: {
    basic: {
      role: {
        main: 'api/v1/Role',
        getById: 'api/v1/Role/',
        active: 'api/v1/Role/Active',
        deactive: 'api/v1/Role/Deactive',
      },
      notification: {
        main: 'api/v1/Notification',
        getById: 'api/v1/Notification/',
        seen: 'api/v1/Notification/Seen',
      },
      group: {
        main: 'api/v1/Group',
        getById: 'api/v1/Group/',
        active: 'api/v1/Group/Active',
        deactive: 'api/v1/Group/Deactive',
      },
      category: {
        main: 'api/v1/Category',
        getById: 'api/v1/Category/',
        active: 'api/v1/Category/Active',
        deactive: 'api/v1/Category/Deactive',
      },
      device: {
        main: 'api/v1/Device',
        getById: 'api/v1/Device/',
        active: 'api/v1/Device/Active',
        deactive: 'api/v1/Device/Deactive',
      },
      account: {
        main: 'api/v1/Account',
        getById: 'api/v1/Account/',
        active: 'api/v1/Account/Active',
        deactive: 'api/v1/Account/Deactive',
      },
      customer: {
        main: 'api/v1/Customer',
        getById: 'api/v1/Customer/',
        active: 'api/v1/Customer/Active',
        deactive: 'api/v1/Customer/Deactive',
      },
      product: {
        main: 'api/v1/Product',
        getById: 'api/v1/Product/',
        active: 'api/v1/Product/Active',
        deactive: 'api/v1/Product/Deactive',
      },
      ticket: {
        main: 'api/v1/Ticket',
        getById: 'api/v1/Ticket/',
        active: 'api/v1/Ticket/Active',
        deactive: 'api/v1/Ticket/Deactive',
      },
      event: {
        main: 'api/v1/Event',
        getById: 'api/v1/Event/',
        active: 'api/v1/Event/Active',
        deactive: 'api/v1/Event/Deactive',
      },
      trigger: {
        main: 'api/v1/Trigger',
        getById: 'api/v1/Trigger/',
        active: 'api/v1/Trigger/Active',
        deactive: 'api/v1/Trigger/Deactive',
      },
    },
    extra: {
      auth: {
        main: 'api/v1/Auth',
        getById: 'api/v1/Auth/',
        active: 'api/v1/Auth/Active',
        deactive: 'api/v1/Auth/Deactive',
        authenticate: 'api/v1/Auth/Authentication',
        login: 'api/v1/Auth/Login',
      },
      email: {
        main: 'api/v1/Email',
      },
      search: {
        main: 'api/v1/Search',
      },
    },
    deal: {
      activity: {
        main: 'api/v1/Activity',
        getById: 'api/v1/Activity/',
        active: 'api/v1/Activity/Active',
        deactive: 'api/v1/Activity/Deactive',
      },
      stage: {
        main: 'api/v1/Stage',
        getById: 'api/v1/Stage/',
        active: 'api/v1/Stage/Active',
        deactive: 'api/v1/Stage/Deactive',
      },
      pipeline: {
        main: 'api/v1/Pipeline',
        getById: 'api/v1/Pipeline/',
        active: 'api/v1/Pipeline/Active',
        deactive: 'api/v1/Pipeline/Deactive',
      },
      deal: {
        main: 'api/v1/Deal',
        getById: 'api/v1/Deal/',
        active: 'api/v1/Deal/Active',
        deactive: 'api/v1/Deal/Deactive',
      },
      dealDetail: {
        main: 'api/v1/DealDetail',
        getById: 'api/v1/DealDetail/',
        active: 'api/v1/DealDetail/Active',
        deactive: 'api/v1/DealDetail/Deactive',
      },
      note: {
        main: 'api/v1/Note',
        getById: 'api/v1/Note/',
        active: 'api/v1/Note/Active',
        deactive: 'api/v1/Note/Deactive',
      },
      attachment: {
        main: 'api/v1/Attachment',
        getById: 'api/v1/Attachment/',
        active: 'api/v1/Attachment/Active',
        deactive: 'api/v1/Attachment/Deactive',
      },
    },
  },
  categories: [
    {
      label: 'Dashboard',
      value: 'dashboard',
      icon: 'home',
      pack: 'eva',
    },
    {
      label: 'Activity',
      value: 'activity',
      icon: 'activity',
      pack: 'eva',
    },
    {
      label: 'Lead',
      value: 'lead',
      icon: 'paper-plane',
      pack: 'eva',
    },
    {
      label: 'Deal',
      value: 'deal',
      icon: 'donate',
      pack: 'font-awesome',
    },
    {
      label: 'Customer',
      value: 'customer',
      icon: 'phone',
      pack: 'eva',
    },
    {
      label: 'Account',
      value: 'account',
      icon: 'person-done',
      pack: 'eva',
    },
    {
      label: 'Employee',
      value: 'employee',
      icon: 'mic',
      pack: 'eva',
    },
    {
      label: 'Role',
      value: 'role',
      icon: 'pin',
      pack: 'eva',
    },
    {
      label: 'Process',
      value: 'process',
      icon: 'browser',
      pack: 'eva',
    },
    {
      label: 'Ticket',
      value: 'ticket',
      icon: 'pricetags',
      pack: 'eva',
    },
    {
      label: 'Feedback',
      value: 'feedback',
      icon: 'headphones',
      pack: 'eva',
    },
    {
      label: 'Product',
      value: 'product',
      icon: 'shopping-cart',
      pack: 'eva',
    },
    {
      label: 'Event',
      value: 'event',
      icon: 'calendar',
      pack: 'eva',
    },

  ],
  more_categories: [
    {
      label: 'Customer',
      value: 'customer',
      icon: 'phone',
      pack: 'eva',
    },
    {
      label: 'Ticket',
      value: 'ticket',
      icon: 'pricetags',
      pack: 'eva',
    },
    {
      label: 'Feedback',
      value: 'feedback',
      icon: 'headphones',
      pack: 'eva',
    },
    {
      label: 'Product',
      value: 'product',
      icon: 'shopping-cart',
      pack: 'eva',
    },
    {
      label: 'Employee',
      value: 'employee',
      icon: 'headset',
      pack: 'font-awesome',
    },
  ],
  filterTabs: [
    // {
    //   label: 'Group',
    //   value: 'group',
    //   icon: 'layers',
    //   pack: 'eva',
    // },
    {
      label: 'Lead',
      value: 'lead',
      icon: 'binoculars',
      pack: 'font-awesome',
    },
    {
      label: 'Deal',
      value: 'deal',
      icon: 'donate',
      pack: 'font-awesome',
    },
    {
      label: 'Customer',
      value: 'customer',
      icon: 'phone',
      pack: 'eva',
    },
    {
      label: 'Activity',
      value: 'activity',
      icon: 'calendar-alt',
      pack: 'font-awesome',
    },
    // {
    //   label: 'Employee',
    //   value: 'employee',
    //   icon: 'mic',
    //   pack: 'eva',
    // },
    // {
    //   label: 'Pipeline',
    //   value: 'pipeline',
    //   icon: 'browser',
    //   pack: 'eva',
    // },
    // {
    //   label: 'Role',
    //   value: 'role',
    //   icon: 'pin',
    //   pack: 'eva',
    // },
    // {
    //   label: 'Product',
    //   value: 'product',
    //   icon: 'shopping-cart',
    //   pack: 'eva',
    // },
    // {
    //   label: 'Event',
    //   value: 'event',
    //   icon: 'calendar',
    //   pack: 'eva',
    // },
    {
      label: 'Attachment',
      value: 'attachment',
      icon: 'attach-outline',
      pack: 'eva',
    },
  ],
  createMenus: [
    {
      label: 'Activity',
      value: 'activity',
      icon: 'calendar-plus',
      pack: 'font-awesome',
      can: 'canCreateActivity',
    },
    {
      label: 'Customer',
      value: 'customer',
      icon: 'phone',
      pack: 'eva',
      can: 'canCreateCustomer',
    },
    {
      label: 'Event',
      value: 'event',
      icon: 'calendar',
      pack: 'eva',
      can: 'canCreateEvent',
    },
    {
      label: 'Deal',
      value: 'deal',
      icon: 'donate',
      pack: 'font-awesome',
      can: 'canCreateDeal',
    },
    {
      label: 'Product',
      value: 'product',
      icon: 'shopping-cart',
      pack: 'eva',
      can: 'canCreateProduct',
    },
    {
      label: 'Employee',
      value: 'employee',
      icon: 'headset',
      pack: 'font-awesome',
      can: 'canCreateEmployee',
    },
    {
      label: 'Role',
      value: 'role',
      icon: 'pin',
      pack: 'eva',
      can: 'canCreateRole',
    },
    {
      label: 'Note',
      value: 'note',
      icon: 'comment-alt',
      pack: 'font-awesome',
      can: 'canCreateNote',
    },
    {
      label: 'Attachment',
      value: 'attachment',
      icon: 'attach-outline',
      pack: 'eva',
      can: 'canCreateAttachment',
    },
    {
      label: 'Import',
      value: 'import',
      icon: 'cloud-upload-outline',
      pack: 'eva',
    },
  ],
  firebase: {
    config: {
      apiKey: 'AIzaSyBgvcUE1_rdM6_dfStrYSdUQhIv8USNdy0',
      authDomain: 'm-crm-company.firebaseapp.com',
      databaseURL: 'https://m-crm-company.firebaseio.com',
      projectId: 'm-crm-company',
      storageBucket: 'm-crm-company.appspot.com',
      messagingSenderId: '827605403995',
      appId: '1:827605403995:web:d3693496db3d4ebf99727e',
      measurementId: 'G-KB93V2FMWR'
    },
  },
  stringee: {
    sid: 'SKG3Y1zHDriSAoY1s5QtZvlrXvrWWnY4',
    serect: 'TDdsMXN5QVd5YmJRRXNhMk9FaUFncXlFcmpLZE1HaA==',
    api: 'https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php',
    endpoint: 'https://api.stringee.com/v1/room2',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
