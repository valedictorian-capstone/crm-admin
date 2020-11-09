// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  token: 'crm-token',
  apiEndpont: 'https://crm-capstione-be.azurewebsites.net/',
  api: {
    'basic-api': {
      role: {
        main: 'api/v1/Role',
        getById: 'api/v1/Role/',
        active: 'api/v1/Role/Active',
        deactive: 'api/v1/Role/Deactive',
      },
      department: {
        main: 'api/v1/Department',
        getById: 'api/v1/Department/',
        active: 'api/v1/Department/Active',
        deactive: 'api/v1/Department/Deactive',
      },
      group: {
        main: 'api/v1/Group',
        getById: 'api/v1/Group/',
        active: 'api/v1/Group/Active',
        deactive: 'api/v1/Group/Deactive',
      },
      pattern: {
        main: 'api/v1/Pattern',
        getById: 'api/v1/Pattern/',
        active: 'api/v1/Pattern/Active',
        deactive: 'api/v1/Pattern/Deactive',
      },
      permission: {
        main: 'api/v1/Permission',
        getById: 'api/v1/Permission/',
        active: 'api/v1/Permission/Active',
        deactive: 'api/v1/Permission/Deactive',
      },
      'extra-information': {
        main: 'api/v1/ExtraInformation',
        getById: 'api/v1/ExtraInformation/',
        active: 'api/v1/ExtraInformation/Active',
        deactive: 'api/v1/ExtraInformation/Deactive',
      },
    },
    'extra-api': {
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
    },
    'bpmn-api': {
      comment: {
        main: 'api/v1/Comment',
        getById: 'api/v1/Comment/',
        active: 'api/v1/Comment/Active',
        deactive: 'api/v1/Comment/Deactive',
      },
      task: {
        main: 'api/v1/Task',
        getById: 'api/v1/Task/',
        active: 'api/v1/Task/Active',
        deactive: 'api/v1/Task/Deactive',
      },
      condition: {
        main: 'api/v1/Condition',
        getById: 'api/v1/Condition/',
        active: 'api/v1/Condition/Active',
        deactive: 'api/v1/Condition/Deactive',
      },
      process: {
        main: 'api/v1/Process',
        getById: 'api/v1/Process/',
        active: 'api/v1/Process/Active',
        deactive: 'api/v1/Process/Deactive',
      },
      'process-step': {
        main: 'api/v1/ProcessStep',
        getById: 'api/v1/ProcessStep/',
        active: 'api/v1/ProcessStep/Active',
        deactive: 'api/v1/ProcessStep/Deactive',
      },
      'process-step-instance': {
        main: 'api/v1/ProcessStepInstance',
        getById: 'api/v1/ProcessStepInstance/',
        active: 'api/v1/ProcessStepInstance/Active',
        deactive: 'api/v1/ProcessStepInstance/Deactive',
      },
      'process-connection': {
        main: 'api/v1/ProcessConnection',
        getById: 'api/v1/ProcessConnection/',
        active: 'api/v1/ProcessConnection/Active',
        deactive: 'api/v1/ProcessConnection/Deactive',
      },
      'process-instance': {
        main: 'api/v1/ProcessInstance',
        getById: 'api/v1/ProcessInstance/',
        active: 'api/v1/ProcessInstance/Active',
        deactive: 'api/v1/ProcessInstance/Deactive',
      },
    },
    'account-api': {
      account: {
        main: 'api/v1/Account',
        getById: 'api/v1/Account/',
        active: 'api/v1/Account/Active',
        deactive: 'api/v1/Account/Deactive',
      },
      'account-extra-information-data': {
        main: 'api/v1/AccountExtraInformationData',
        getById: 'api/v1/AccountExtraInformationData/',
        active: 'api/v1/AccountExtraInformationData/Active',
        deactive: 'api/v1/AccountExtraInformationData/Deactive',
      },
    },
    'service-api': {
      service: {
        main: 'api/v1/Service',
        getById: 'api/v1/Service/',
        active: 'api/v1/Service/Active',
        deactive: 'api/v1/Service/Deactive',
      },
    },
    'customer-api': {
      customer: {
        main: 'api/v1/Customer',
        getById: 'api/v1/Customer/',
        active: 'api/v1/Customer/Active',
        deactive: 'api/v1/Customer/Deactive',
      },
      'customer-extra-data': {
        main: 'api/v1/CustomerExtraData',
        getById: 'api/v1/CustomerExtraData/',
        active: 'api/v1/CustomerExtraData/Active',
        deactive: 'api/v1/CustomerExtraData/Deactive',
      },
      'customer-extra-information-data': {
        main: 'api/v1/CustomerExtraInformationData',
        getById: 'api/v1/CustomerExtraInformationData/',
        active: 'api/v1/CustomerExtraInformationData/Active',
        deactive: 'api/v1/CustomerExtraInformationData/Deactive',
      },
    },
    'form-api': {
      'form-control': {
        main: 'api/v1/FormControl',
        getById: 'api/v1/FormControl/',
        active: 'api/v1/FormControl/Active',
        deactive: 'api/v1/FormControl/Deactive',
      },
      'form-data': {
        main: 'api/v1/FormData',
        getById: 'api/v1/FormData/',
        active: 'api/v1/FormData/Active',
        deactive: 'api/v1/FormData/Deactive',
      },
      'form-group': {
        main: 'api/v1/FormGroup',
        getById: 'api/v1/FormGroup/',
        active: 'api/v1/FormGroup/Active',
        deactive: 'api/v1/FormGroup/Deactive',
      },
      'form-value': {
        main: 'api/v1/FormValue',
        getById: 'api/v1/FormValue/',
        active: 'api/v1/FormValue/Active',
        deactive: 'api/v1/FormValue/Deactive',
      },
    },
  },
  categories: [
    {
      label: 'Dashboard',
      value: 'dashboard',
      icon: 'home',
      type: 'item'
    },
    {
      label: 'Tracking',
      type: 'group',
      icon: 'activity',
      values: [],
      value: 'tracking-group',
      items: [

      ],
    },
    {
      label: 'Customer',
      type: 'group',
      icon: 'wifi',
      values: ['group', 'lead', 'opportunity', 'contact', 'account'],
      value: 'customer-group',
      items: [
        {
          label: 'Group',
          value: 'group',
          icon: 'layers',
          type: 'item'
        },
        {
          label: 'Lead',
          value: 'lead',
          icon: 'paper-plane',
          type: 'item'
        },
        {
          label: 'Opportunity',
          value: 'opportunity',
          icon: 'person-add',
          type: 'item'
        },
        {
          label: 'Contact',
          value: 'contact',
          icon: 'phone',
          type: 'item'
        },
        {
          label: 'Account',
          value: 'account',
          icon: 'person-done',
          type: 'item'
        },
      ],
    },
    {
      label: 'Employee',
      icon: 'monitor',
      type: 'group',
      values: ['department', 'employee', 'role'],
      value: 'employee-group',
      items: [
        {
          label: 'Department',
          value: 'department',
          icon: 'cube',
          type: 'item'
        },
        {
          label: 'Employee',
          value: 'employee',
          icon: 'mic',
          type: 'item'
        },
        {
          label: 'Role',
          value: 'role',
          icon: 'pin',
          type: 'item'
        },
      ],
    },
    {
      label: 'Bpmn',
      icon: 'settings-2',
      type: 'group',
      values: ['process', 'form'],
      value: 'bpmn-group',
      items: [
        {
          label: 'Form',
          value: 'form',
          icon: 'book',
          type: 'item',
        },
        {
          label: 'Process',
          value: 'process',
          icon: 'browser',
          type: 'item',
        },
      ],
    },
    {
      label: 'Main',
      icon: 'tv',
      type: 'group',
      values: ['service', 'strategy', 'event'],
      value: 'main-group',
      items: [
        {
          label: 'Service',
          value: 'service',
          icon: 'flash',
          type: 'item'
        },
        {
          label: 'Strategy',
          value: 'strategy',
          icon: 'volume-up',
          type: 'item'
        },
        {
          label: 'Event',
          value: 'event',
          icon: 'calendar',
          type: 'item'
        },
      ]
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
      appId: '1:827605403995:web:bb661f7481360f9a99727e',
      measurementId: 'G-XJD981CY3Y'
    },
  },
  controls: [
    {
      type: 'input',
      subtype: 'text'
    },
    {
      type: 'input',
      subtype: 'number'
    },
    {
      type: 'input',
      subtype: 'password'
    },
    {
      type: 'select',
      subtype: ''
    },
    {
      type: 'multi-select',
      subtype: ''
    },
    {
      type: 'auto-complete',
      subtype: ''
    },
    {
      type: 'date-picker',
      subtype: ''
    },
    {
      type: 'time-picker',
      subtype: ''
    },
    {
      type: 'text-area',
      subtype: ''
    },
    {
      type: 'switch',
      subtype: ''
    },
    {
      type: 'rate',
      subtype: ''
    },
    {
      type: 'radio',
      subtype: ''
    },
    {
      type: 'slider',
      subtype: ''
    },
    {
      type: 'paragraph',
      subtype: ''
    },
    {
      type: 'label',
      subtype: ''
    },
    {
      type: 'header',
      subtype: ''
    },
    {
      type: 'file-upload',
      subtype: ''
    },
    {
      type: 'date-range',
      subtype: ''
    },
    {
      type: 'check-box',
      subtype: ''
    }
  ],
  types: [
    {
      name: 'activity',
      label: 'Activity',
      subTypes: [
        { name: 'task', label: 'Task'}
      ]
    },
    {
      name: 'gateway',
      label: 'GateWay',
      subTypes: [
        { name: 'exclusive', label: 'Exclusive'},
        { name: 'inclusive', label: 'Inclusive'},
        { name: 'parallel', label: 'Parallel'},
      ]
    },
    {
      name: 'event',
      label: 'Event',
      subTypes: [
        { name: 'start', label: 'Start'},
        { name: 'end', label: 'End'},
      ]
    }
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
