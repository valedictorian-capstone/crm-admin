// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpont: 'http://localhost:8080/',
  // 'apiEndpont': 'https://crm-capstione-be.azurewebsites.net/',
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
    },
    'bpmn-api': {
      comment: {
        main: 'api/v1/Comment',
        getById: 'api/v1/Comment/',
        active: 'api/v1/Comment/Active',
        deactive: 'api/v1/Comment/Deactive',
      },
      condition: {
        main: 'api/v1/Condition',
        getById: 'api/v1/Condition/',
        active: 'api/v1/Condition/Active',
        deactive: 'api/v1/Condition/Deactive',
      },
      'work-flow': {
        main: 'api/v1/WorkFlow',
        getById: 'api/v1/WorkFlow/',
        active: 'api/v1/WorkFlow/Active',
        deactive: 'api/v1/WorkFlow/Deactive',
      },
      'work-flow-step': {
        main: 'api/v1/WorkFlowStep',
        getById: 'api/v1/WorkFlowStep/',
        active: 'api/v1/WorkFlowStep/Active',
        deactive: 'api/v1/WorkFlowStep/Deactive',
      },
      'work-flow-step-instance': {
        main: 'api/v1/WorkFlowStepInstance',
        getById: 'api/v1/WorkFlowStepInstance/',
        active: 'api/v1/WorkFlowStepInstance/Active',
        deactive: 'api/v1/WorkFlowStepInstance/Deactive',
      },
      'work-flow-connection': {
        main: 'api/v1/WorkFlowConnection',
        getById: 'api/v1/WorkFlowConnection/',
        active: 'api/v1/WorkFlowConnection/Active',
        deactive: 'api/v1/WorkFlowConnection/Deactive',
      },
      'work-flow-instance': {
        main: 'api/v1/WorkFlowInstance',
        getById: 'api/v1/WorkFlowInstance/',
        active: 'api/v1/WorkFlowInstance/Active',
        deactive: 'api/v1/WorkFlowInstance/Deactive',
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
    'product-api': {
      product: {
        main: 'api/v1/Product',
        getById: 'api/v1/Product/',
        active: 'api/v1/Product/Active',
        deactive: 'api/v1/Product/Deactive',
      },
      'product-extra-information-data': {
        main: 'api/v1/ProductExtraInformationData',
        getById: 'api/v1/ProductExtraInformationData/',
        active: 'api/v1/ProductExtraInformationData/Active',
        deactive: 'api/v1/ProductExtraInformationData/Deactive',
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
      label: 'Trang chủ',
      value: 'dashboard',
      icon: 'home',
    },
    {
      label: 'Nhóm',
      value: 'group',
      icon: 'team',
    },
    {
      label: 'Khách hàng',
      value: 'customer',
      icon: 'phone'
    },
    {
      label: 'Sản phẩm/dịch vụ',
      value: 'product',
      icon: 'skin',
    },
    {
      label: 'Nhân sự',
      value: 'account',
      icon: 'user',
    },
    {
      label: 'Phòng ban',
      value: 'department',
      icon: 'solution',
    },
    {
      label: 'Điều kiện',
      value: 'condition',
      icon: 'tag',
    },
    {
      label: 'Khuôn mẫu',
      value: 'pattern',
      icon: 'layout',
    },
    {
      label: 'Biểu mẫu',
      value: 'form',
      icon: 'profile',
    },
    {
      label: 'Chiến lược',
      value: 'strategy',
      icon: 'project',
    },
    {
      label: 'Quy trình',
      value: 'work-flow',
      icon: 'partition',
    },
    {
      label: 'Tiến trình',
      value: 'process',
      icon: 'sync',
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
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
