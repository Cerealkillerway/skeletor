Skeletor.Data = {
    Settings: new Mongo.Collection('settings'),

    Users: Meteor.users,
    Roles: new Mongo.Collection('roles'),

    Menus: new Mongo.Collection('menus'),
    Sections: new Mongo.Collection('sections'),
    Pages: new Mongo.Collection('pages')
};


Skeletor.Schemas = {

    // SETTINGS
    Settings_default: {
        __collection: 'Settings',
        __paths: {
            undoPath: ['/panel/dashboard', {}],
            redirectOnUpdate: ['/panel/settings/update', {}]
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
            // intro text
            {
                name: 'publicSettingsIntroText',
                output: 'staticTitle',
                tag: 'div',
                size: 's12'
            },

            // application details
            {
                name: 'applicationDetails',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'name',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    },
                    {
                        name: 'appName',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    },
                    {
                        name: 'siteName',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'appDetail',
                        output: 'input',
                        renderAs: 'textarea',
                        size: 's6 m4',
                        i18n: false
                    },
                    {
                        name: 'siteDetail',
                        output: 'input',
                        renderAs: 'textarea',
                        size: 's6 m4',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'mainEmail',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    },
                    {
                        name: 'webmasterEmail',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    }
                ]
            },

            {
                name: 'code',
                output: 'none',
                validation: {
                    type: 'string',
                    min: 3,
                    max: 30,
                    unique: true
                },
                i18n: false
            },

            // author details
            {
                name: 'authorDetails',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'author.name',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    },
                    {
                        name: 'author.website',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    },
                    {
                        name: 'author.websiteText',
                        output: 'input',
                        size: 's6 m4',
                        i18n: false
                    }
                ]
            },

            // paths
            {
                name: 'pathsDetails',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                name: 'defaultLandingPage',
                output: 'input',
                size: 's6 m4',
                i18n: false
            },
            {
                name: 'loginPaths',
                output: 'staticTitle',
                tag: 'h6',
                classes: ['skeleBold'],
                size: 's12'
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'login.defaultLoginPath',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    },
                    {
                        name: 'login.defaultLogoutPath',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    },
                    {
                        name: 'login.defaultRedirectPath',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    },
                    {
                        name: 'login.defaultFailPath',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    }
                ]
            },

            // animations
            {
                name: 'animations',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                name: 'animationsDuration',
                output: 'staticTitle',
                tag: 'h6',
                classes: ['skeleBold'],
                size: 's12'
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'animations.scrollTop',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    },
                    {
                        name: 'animations.scrollBottom',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    },
                    {
                        name: 'animations.scrollError',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    },
                    {
                        name: 'animations.onRendered',
                        output: 'input',
                        size: 's6 m3',
                        i18n: false
                    }
                ]
            },

            // enabled languages
            {
                name: 'enabledLanguages',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'langEnable.it',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'langEnable.en',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },

            // policy bar
            {
                name: 'policyBar',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                name: 'lsPolicyBar.displayAlways',
                output: 'checkBox',
                renderAs: 'switch',
                size: 's4 m3',
                i18n: false
            },

            // debug
            {
                name: 'debugTitle',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'debug',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'consoleLogger',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            }
        ]
    },

    // USERS
    Users_default: {
        __collection: 'Users',
        __paths: {
            undoPath: ['/panel/users', {}],
            redirectOnCreate: ['/panel/users/:username', {username: 'this'}],
            redirectOnUpdate: ['/panel/users', {}]
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 10
            },
            sort: {
                username: 1
            },
            classes: 'hoverable striped',
            itemFields: [
                {
                    name: 'username',
                    link: true
                },
                {
                    name: 'profile.roles'
                }
            ],
            sourcedFields: {
                'profile.roles': {
                    mapTo: 'name',
                    collection: 'Roles'
                }
            },
            itemActions: [
                {
                    name: 'delete',
                    confirm: true
                },
                {
                    name: 'changePassword'
                }
            ],
            detailLink: {
                basePath: '/panel/users/:username',
                params: ['username']
            },
            callbacks: {
                beforeRendering: function(listRecord) {
                    'use strict';
                    let currentUser = Meteor.user();

                    // forbid delete button for the current user
                    if (currentUser && currentUser.username === listRecord.username) {
                        listRecord.skelelistOptions = {
                            class: 'secondColor',
                            actions: {
                                delete: false
                            }
                        };
                    }

                    return listRecord;
                }
            }
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
            {
                name: 'username',
                output: 'input',
                validation: {
                    type: 'string',
                    min: 3,
                    max: 30,
                    unique: true
                },
                i18n: false
            },
            {
                name: 'password',
                output: 'input',
                renderAs: 'password',
                shadowConfirm: true,
                showOnly: 'create',
                validation: {
                    type: 'string',
                    min: 6
                },
                i18n: false
            },
            {
                name: 'userEmail',
                output: 'input',
                validation: {
                    type: 'email',
                    min: 5,
                    max: 50
                },
                i18n: false
            },
            {
                name: 'profile.roles',
                output: 'select',
                multi: true,
                source: Skeletor.Data.Roles.find(),
                sourceValue: '_id',
                sourceName: 'name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            {
                name: 'profile.name',
                output: 'input',
                validation: {
                    type: 'string',
                    max: 50
                },
                i18n: false
            },
            {
                name: 'profile.telephone',
                output: 'input',
                validation: {
                    type: 'number',
                    max: 30
                },
                i18n: false
            }
        ]
    },
    Users_changePassword: {
        __collection: 'Users',
        __toolbar: {
            template: 'userChangePasswordToolbar',
            containerId: 'skeletorUserChangePasswordToolbar'
        },
        __autoScrollTop: false,
        fields: [
            {
                name: 'newPassword',
                output: 'input',
                renderAs: 'password',
                shadowConfirm: true,
                validation: {
                    type: 'string',
                    min: 6
                },
                i18n: false
            }
        ]
    },

    // ROLES
    Roles_default: {
        __collection: 'Roles',
        __paths: {
            undoPath: ['/panel/roles', {}],
            redirectOnCreate: ['/panel/roles/:name', {name: 'this'}],
            redirectOnUpdate: ['/panel/roles/:name', {name: 'this'}]
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 10
            },
            sort: {
                name: 1
            },
            classes: 'hoverable striped',
            itemFields: [
                {
                    name: 'name',
                    link: true
                }
            ],
            itemActions: [
                {
                    name: 'delete',
                    confirm: true
                }
            ],
            detailLink: {
                basePath: '/panel/roles/:name',
                params: ['name']
            },
            callbacks: {
                beforeRendering: function(listRecord) {
                    'use strict';
                    // forbid delete button for the SUPERUSER role
                    if (listRecord.name === 'SUPERUSER') {
                        listRecord.skelelistOptions = {
                            class: 'secondColor',
                            actions: {
                                delete: false
                            }
                        };
                    }

                    return listRecord;
                }
            }
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
            {
                name: 'name',
                output: 'input',
                validation: {
                    type: 'string',
                    min: 3,
                    max: 50,
                    unique: true
                },
                i18n: false
            },

            {
                name: 'mainFunctions',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's4 m3'
            },

            // main functions titles
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'panelAccess',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                    {
                        name: 'aclManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                    {
                        name: 'pagesManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                ]
            },

            // main functions switches
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowPanelAccess',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowAcl',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowPages',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },

            // config & debug titles
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'configManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                    {
                        name: 'debugManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    }
                ]
            },

            // config & debug switches
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowConfig',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowDebug',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            }
        ],
        formCallbacks: {
            onRendered: function(currentDocument, formInstance) {
                // special handling for super user role display
                if (currentDocument.name === 'SUPERUSER') {
                    formInstance.$('.skeleformFields').hide(0);
                    formInstance.$('.skeleformToolbar').find('.skeleformUpdate').hide(0);

                    formInstance.superUserInfoTemplate = Blaze.render(Template.skeleSuperUserRole, formInstance.$('.skeleform')[0]);
                }
            }
        }
    },

    // SECTIONS
    Sections_default: {
        __collection: 'Sections',
        __paths: {
            undoPath: ['/panel/sections/:itemLang', {itemLang: 'auto'}],
            redirectOnCreate: ['/panel/sections/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}],
            redirectOnUpdate: ['/panel/sections/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 10
            },
            sort: {
                code: 1
            },
            classes: 'hoverable striped',
            itemFields: [
                {
                    name: 'name',
                    link: true
                },
                {
                    name: 'code'
                }
            ],
            itemActions: [
                {
                    name: 'delete',
                    confirm: true
                }
            ],
            detailLink: {
                basePath: '/panel/sections/:itemLang/:code',
                params: ['code', 'itemLang']
            }
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
            {
                name: 'code',
                output: 'input',
                validation: {
                    type: 'url',
                    min: 3,
                    max: 50,
                    unique: true
                }
            },
            {
                __listView: {
                    stripHTML: true,
                    truncate: {
                        max: 25
                    }
                },
                name: 'name',
                output: 'input',
                validation: {
                    type: 'string',
                    min: 3,
                    max: 50
                }
            },
            {
                name: 'description',
                output: 'editor',
                toolbar: 'full',
                size: 's12',
                image: {
                    quality: 0.6,
                    width: 400,
                    height: 400
                },
                video: {
                    width: 600,
                    height: 400
                },
                validation: {
                    type: 'string',
                    min: 3
                }
            }
        ]
    },

    // PAGES
    Pages_default: {
        __collection: 'Pages',
        __paths: {
            undoPath: ['/panel/pages/:itemLang', {itemLang: 'auto'}],
            redirectOnCreate: ['/panel/pages/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}],
            redirectOnUpdate: ['/panel/pages/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 10
            },
            sort: {
                code: 1
            },
            classes: 'hoverable striped',
            itemFields: [
                {
                    name: 'title',
                    link: true
                },
                {
                    name: 'published'
                },
                {
                    name: 'section'
                },
                {
                    name: 'menu'
                }
            ],
            sourcedFields:{
                section: {
                    mapTo: ':itemLang---name',
                    collection: 'Sections'
                },
                menu: {
                    mapTo: ':itemLang---name',
                    collection: 'Menus'
                }
            },
            itemActions: [
                {
                    name: 'delete',
                    confirm: true
                }
            ],
            detailLink: {
                basePath: '/panel/pages/:itemLang/:code',
                params: ['code', 'itemLang']
            }
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
            {
                name: 'code',
                output: 'input',
                validation: {
                    type: 'url',
                    min: 3,
                    max: 50,
                    unique: true
                }
            },
            {
                __listView: {
                    stripHTML: true,
                    truncate: {
                        max: 25
                    }
                },
                name: 'title',
                output: 'editor',
                toolbar: 'full',
                size: 's12',
                image: {
                    quality: 0.6,
                    width: 400,
                    height: 400
                },
                video: {
                    width: 600,
                    height: 400
                },
                validation: {
                    type: 'string'
                }
            },
            {
                name: 'content',
                output: 'editor',
                toolbar: 'full',
                size: 's12',
                image: {
                    quality: 0.6,
                    width: 400,
                    height: 400
                },
                video: {
                    width: 600,
                    height: 400
                },
                validation: {
                    type: 'string',
                    min: 3
                }
            },
            {
                name: 'section',
                output: 'select',
                allowBlank: true,
                source: Skeletor.Data.Sections.find({}),
                sourceValue: '_id',
                sourceName: ':itemLang---name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            {
                name: 'publish',
                output: 'staticTitle'
            },
            {
                name: 'published',
                output: 'select',
                icons: true,
                source: [
                    {
                        name: 'yes_lbl',
                        value: 1,
                        icon: '/packages/cerealkiller_skeleform/public/icons/ok.png'
                    },
                    {
                        name: 'no_lbl',
                        value: 0,
                        icon: '/packages/cerealkiller_skeleform/public/icons/cancel.png'
                    }
                ],
                validation: {
                    min: 1
                }
            },
            {
                name: 'menuItem',
                output: 'staticTitle'
            },
            {
                name: 'menu',
                output: 'select',
                allowBlank: true,
                source: Skeletor.Data.Menus.find({}),
                sourceValue: '_id',
                sourceName: ':itemLang---name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            {
                name: 'menuName',
                output: 'input',
                validation: {
                    type: 'string',
                    max: 50
                }
            },
        ]
    },

    // MENUS
    Menus_default: {
        __collection: 'Menus',
        __paths: {
            undoPath: ['/panel/menus/:itemLang', {itemLang: 'auto'}],
            redirectOnCreate: ['/panel/menus/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}],
            redirectOnUpdate: ['/panel/menus/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 10
            },
            sort: {
                code: 1
            },
            classes: 'hoverable striped',
            itemFields: [
                {
                    name: 'code',
                    link: true
                },
                {
                    name: 'name'
                }
            ],
            itemActions: [
                {
                    name: 'delete',
                    confirm: true
                }
            ],
            detailLink: {
                basePath: '/panel/menus/:itemLang/:code',
                params: ['code', 'itemLang']
            }
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
            {
                name: 'code',
                output: 'input',
                validation: {
                    type: 'url',
                    min: 3,
                    max: 50,
                    unique: true
                }
            },
            {
                __listView: {
                    stripHTML: true,
                    truncate: {
                        max: 25
                    }
                },
                name: 'name',
                output: 'input',
                validation: {
                    type: 'string',
                    min: 3,
                    max: 50
                }
            },
            {
                name: 'description',
                output: 'editor',
                toolbar: 'full',
                size: 's12',
                image: {
                    quality: 0.6,
                    width: 400,
                    height: 400
                },
                video: {
                    width: 600,
                    height: 400
                },
                validation: {
                    type: 'string',
                    //min: 3
                }
            }
        ]
    }
};
