/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Home Page',
        subtitle: 'Financial and Management Accounting',
        type: 'group',
        icon: 'heroicons_outline:home',
        link: '/home',
        children: [
            {
                id: 'accounting.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'mat_outline:insights',
                link: '/projects',
            },
            {
                id: 'accounts.journals',
                title: 'Transactions',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/journals',
            },
            {
                id: 'kanban',
                title: 'Tasks',
                type: 'basic',
                icon: 'mat_outline:task',
                link: '/kanban',
            },        
            {
                id: 'accounting.finance',
                title: 'Financial Analytics',
                type: 'basic',
                icon: 'mat_outline:money',
                link: '/analytics',
            },

        ]
    },
    {
        id      : 'account.reporting',
        title   : 'Reporting',
        subtitle: 'Management and Financial',
        type    : 'collapsable',
        icon    : 'heroicons_outline:document-text',
                children: [
                    {
                        id      : 'pages.authentication.sign-in',
                        title   : 'Trial Balances',
                        type    : 'basic',
                        link    : '/reporting',
                    },
                    {
                        id      : 'pages.authentication.sign-in',
                        title   : 'Income Statements',
                        type    : 'basic',
                        link    : '/income-statements',
                    },
                    {
                        id      : 'pages.authentication.sign-in',
                        title   : 'Expense Reports',
                        type    : 'basic',
                        link    : '/expense-reports',
                    },

                ]
            },
    {
        id: 'settings',
        title: 'Setting',
        subtitle: 'Application Data Maintenance',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'accounting.general-ledger',
                title: 'Accounting',
                type: 'basic',
                icon: 'heroicons_outline:bookmark',
                link: '/gl',
            },
            // {
            //     id: 'settings.tasks',
            //     title: 'Tasks',
            //     type: 'basic',
            //     icon: 'mat_outline:settings_input_component',
            //     link: '/kanban-settings',
            // },
            {
                id: 'property.document-management',
                title: 'Evidence',
                type: 'basic',
                icon: 'heroicons_outline:document-magnifying-glass',
                link: '/doc_management',
            },

        ],
    },
    {
        id: 'support',
        title: 'Support',
        subtitle: 'Documentation and Help Center',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'help-center',
                title: 'Help Center',
                type: 'basic',
                icon: 'mat_outline:help_center',
                link: '/help',
            },
            {
                id: 'accounting.settings',
                title: 'Settings',
                type: 'basic',
                icon: 'mat_outline:settings',
                link: '/settings',
            },
            {
                id: 'accounting.learning',
                title: 'Learning',
                type: 'basic',
                icon: 'heroicons_outline:academic-cap',
                link: '/learning',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Home Page',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home',
    },
    {
        id: 'accounting',
        title: 'Dashboards',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.project',
                title: 'Project',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/dashboards/project',
            },
            {
                id: 'dashboards.analytics',
                title: 'Analytics',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
            {
                id: 'dashboards.finance',
                title: 'Finance',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/dashboards/finance',
            },
            {
                id: 'dashboards.crypto',
                title: 'Crypto',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/dashboards/crypto',
            },
        ],
    },
    {
        id: 'property',
        title: 'Property Management',
        subtitle: 'Administering Property and Assets',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'property.real-estate',
                title: 'Real Estate',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/general_ledger',
            },
        ],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Home Page',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home',
    },
    {
        id: 'accounting',
        title: 'Dashboards',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.project',
                title: 'Project',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/dashboards/project',
            },
            {
                id: 'dashboards.analytics',
                title: 'Analytics',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
            {
                id: 'dashboards.finance',
                title: 'Finance',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/dashboards/finance',
            },
            {
                id: 'dashboards.crypto',
                title: 'Crypto',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/dashboards/crypto',
            },
        ],
    },
    {
        id: 'property',
        title: 'Property Management',
        subtitle: 'Administering Property and Assets',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'property.real-estate',
                title: 'Real Estate',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/general_ledger',
            },
        ],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Home Page',
        type: 'group',
        icon: 'heroicons_outline:home',
        link: '/home',
        children: [
            {
                icon: 'heroicons_outline:home',
                title: 'Main Page',
                link: '/landing',
                type: 'basic',
            },
        ]
    },
    {
        id: 'accounting',
        title: 'Accounting',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'accounting.overview',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/home',
            },

            {
                id: 'accounting.general-ledger',
                title: 'General Ledger',
                type: 'basic',
                icon: 'heroicons_outline:bookmark',
                link: '/gl',
            },
            {
                id: 'accounts.journals',
                title: 'Transaction Entry',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/journals',
            },
            {
                id: 'accounts.tabs',
                title: 'Transation Analysis',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/analysis',
            },
            {
                id: 'accounting.finance',
                title: 'Finance',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/accounts/test',
            }
        ],
    },
    {
        id: 'property',
        title: 'Property Management',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'property.real-estate',
                title: 'Real Estate',
                type: 'basic',
                icon: 'heroicons_outline:building-office',
                link: '/general_ledger',
            },
            {
                id: 'apps.scrumboard',
                title: 'Workflow Tasks',
                type: 'basic',
                icon: 'heroicons_outline:view-columns',
                link: '/scrumboard',
            },
            {
                id: 'apps.help-center',
                title: 'Help Center',
                type: 'basic',
                icon: 'heroicons_outline:view-columns',
                link: '/help',
            },


        ],
    },
];
