/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Noble Ledger',
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
                id: 'navigation-features.level.0',
                title: 'Journal Management',
                icon: 'heroicons_outline:check-circle',
                type: 'collapsable',
                    children: [
                        {
                            id: 'accounts.wizard-journals',
                            title: 'New Transactions',
                            type: 'basic',
                            icon: 'heroicons_outline:document-plus',
                            link: '/new-journals',
                        },
                        
                        {
                            id: 'accounts.list-journals',
                            title: 'Open  Transactions',
                            type: 'basic',
                            icon: 'heroicons_outline:document-check',
                            link: '/list-journals',
                        },
                        {
                            id: 'accounts.ap-journals',
                            title: 'Accounts Payable',
                            type: 'basic',
                            icon: 'mat_outline:sell',
                            link: '/ap-journals',
                        },
                        {
                            id: 'accounts.ar-journals',
                            title: 'Accounts Receivable',
                            type: 'basic',
                            icon: 'mat_outline:shopping_basket',
                            link: '/ar-journals',
                        },

                        {
                            id: 'accounts.edit-journals',
                            title: 'Edit Transactions',
                            type: 'basic',
                            icon: 'heroicons_outline:currency-dollar',
                            link: '/edit-journals',
                        },                        
                        {
                            id: 'accounts.journals',
                            title: 'Settings',
                            type: 'basic',
                            icon: 'mat_outline:admin_panel_settings',
                            link: '/journals',
                        },
                    ],
        
            },            
            {
                id: 'budgeting',
                title: 'Budget Analysis',
                type: 'basic',
                icon: 'heroicons_outline:calculator',
                link: '/budget',
            },        
            
            {
                id: 'accounting.reporting',
                title: 'Financial Reporting',
                type: 'basic',
                icon: 'mat_outline:money',
                link: '/reporting',
            },
            {
                id: 'kanban',
                title: 'Projects',
                type: 'basic',
                icon: 'mat_outline:task',
                link: '/kanban',
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
                title: 'Reference Management',
                type: 'basic',
                icon: 'heroicons_outline:bookmark',
                link: '/gl',
            },
            {
                id: 'property.document-management',
                title: 'Artifacts',
                type: 'basic',
                icon: 'heroicons_outline:document-magnifying-glass',
                link: '/docs',
            },
            {
                id: 'accounting.settings',
                title: 'Settings',
                type: 'basic',
                icon: 'mat_outline:settings',
                link: '/settings',
            },
        ],
    },
    {
        id: 'divider-2',
        type: 'divider',
    },
    {
        id: 'support',
        title: 'Support',
        subtitle: 'Documentation and Help Center',
        type: 'group',        
        icon: 'heroicons_outline:bars-3',
        children: [
            {
                id: 'navigation-features.level.0',
                title: 'Support',
                icon: 'heroicons_outline:check-circle',
                type: 'collapsable',
                    children: [
                        {
                            id: 'chat',
                            title: 'Chat',
                            type: 'basic',
                            icon: 'mat_outline:chat',
                            link: '/chat',
                        },
                        {
                            id: 'help-center',
                            title: 'Blog',
                            type: 'basic',
                            icon: 'mat_outline:help_center',
                            link: '/blog',
                        },

                        {
                            id: 'accounting.learning',
                            title: 'Documentation',
                            type: 'basic',
                            icon: 'heroicons_outline:academic-cap',
                            link: '/documentation',
                        },
                    ],
        
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Noble Ledger',
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
            // {
            //     id: 'finance',
            //     title: 'Finance',
            //     type: 'basic',
            //     icon: 'heroicons_outline:currency-dollar',
            //     link: '/finance',
            // },        
            {
                id: 'accounts.journals',
                title: 'Transactions',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/journals',
            },            
            {
                id: 'accounts.edit-journals',
                title: 'Edit Transactions',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/edit-journals',
            },                        
            {
                id: 'budgeting',
                title: 'Budget Analysis',
                type: 'basic',
                icon: 'heroicons_outline:calculator',
                link: '/budget',
            },        
            
            {
                id: 'accounting.reporting',
                title: 'Financial Reporting',
                type: 'basic',
                icon: 'mat_outline:money',
                link: '/reporting',
            },
            {
                id: 'kanban',
                title: 'Projects',
                type: 'basic',
                icon: 'mat_outline:task',
                link: '/kanban',
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
                title: 'Reference Management',
                type: 'basic',
                icon: 'heroicons_outline:bookmark',
                link: '/gl',
            },
            {
                id: 'property.document-management',
                title: 'Artifacts',
                type: 'basic',
                icon: 'heroicons_outline:document-magnifying-glass',
                link: '/docs',
            },
            {
                id: 'accounting.settings',
                title: 'Settings',
                type: 'basic',
                icon: 'mat_outline:settings',
                link: '/settings',
            },
        ],
    },
    {
        id: 'divider-2',
        type: 'divider',
    },
    {
        id: 'support',
        title: 'Support',
        subtitle: 'Documentation and Help Center',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'chat',
                title: 'Chat',
                type: 'basic',
                icon: 'mat_outline:chat',
                link: '/chat',
            },
            {
                id: 'help-center',
                title: 'Help Center',
                type: 'basic',
                icon: 'mat_outline:help_center',
                link: '/help',
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

export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Noble Ledger',
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
                title: 'Transaction Analysis',
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
