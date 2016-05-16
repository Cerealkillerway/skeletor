Skeletor.Data = {
    Settings: new Mongo.Collection('settings'),

    Users: Meteor.users,
    Roles: new Mongo.Collection('roles'),

    Menus: new Mongo.Collection('menus'),
    Sections: new Mongo.Collection('sections'),
    Pages: new Mongo.Collection('pages')
};

// supportive clientside collections (workaround for DDP limitations)
if (Meteor.isClient) {
    Users__detail__ = new Mongo.Collection('Users__detail__');
    Roles__detail__ = new Mongo.Collection('Roles__detail__');

    Menus__detail__ = new Mongo.Collection('Menus__detail__');
    Sections__detail__ = new Mongo.Collection('Sections__detail__');
    Pages__detail__ = new Mongo.Collection('Pages__detail__');


    Skeletor.Data.Users__detail__ = Users__detail__;
    Skeletor.Data.Roles__detail__ = Roles__detail__;

    Skeletor.Data.Menus__detail__ = Menus__detail__;
    Skeletor.Data.Sections__detail__ = Sections__detail__;
    Skeletor.Data.Pages__detail__ = Pages__detail__;
}


Skeletor.Schemas = {

    // USERS
    Users_default: {
        __collection: 'Users',
        __paths: {
            undoPath: ['/panel/users', {}],
            redirectOnUpdate: ['/panel/users', {}],
            redirectOnCreate: ['/panel/users/:username', {username: 'this'}]
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
            itemFields: ['username', 'profile.roles'],
            itemActions: ['delete', 'changePassword'],
            detailLink: {
                basePath: '/panel/users/:username',
                params: ['username']
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
                name: 'password',
                output: 'input',
                renderAs: 'password',
                shadowConfirm: true,
                validation: {
                    type: 'string',
                    min: 6
                },
                i18n: false,
                useOnly: 'create'
            },
            {
                name: 'profile.roles',
                output: 'select',
                source: Skeletor.Data.Roles.find({}),
                sourceValue: 'name',
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
        __collection: 'users',
        __toolbar: {
            template: 'userChangePasswordToolbar',
            containerId: 'skeletorUserChangePasswordToolbar'
        },
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
            undoPath: ['/panel/roles', {}]
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
            itemFields: ['name'],
            itemActions: ['delete'],
            detailLink: {
                basePath: '/panel/roles/:name',
                params: ['name']
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
            }
        ]
    },

    // SECTIONS
    Sections_default: {
        __collection: 'Sections',
        __paths: {
            undoPath: ['/panel/sections/:itemLang', {'itemLang': 'auto'}],
            redirectOnUpdate: ['/panel/sections/:itemLang', {itemLang: 'auto'}],
            redirectOnCreate: ['/panel/sections/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
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
            itemFields: ['code', 'name'],
            itemActions: ['delete'],
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
                    truncate: 50
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
            undoPath: ['/panel/pages/:itemLang', {'itemLang': 'auto'}],
            redirectOnCreate: ['/panel/pages/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
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
            itemFields: ['code', 'published', 'section', 'menu'],
            sourcedFields:{
                section: {
                    mapTo: ':itemLang.name',
                    collection: 'Sections'
                },
                menu: {
                    mapTo: ':itemLang.name',
                    collection: 'Menus'
                }
            },
            itemActions: ['delete'],
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
                    truncate: 50
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
                sourceName: ':itemLang.name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            {
                name: 'publish',
                output: 'staticTitle',
                mini: true
            },
            {
                name: 'published',
                output: 'select',
                icons: true,
                source: [
                    {
                        name: 'Sì',
                        value: 1,
                        icon: '/packages/cerealkiller_skeleform/public/icons/ok.png'
                    },
                    {
                        name: 'No',
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
                output: 'staticTitle',
                mini: true
            },
            {
                name: 'menu',
                output: 'select',
                allowBlank: true,
                source: Skeletor.Data.Menus.find({}),
                sourceValue: '_id',
                sourceName: ':itemLang.name',
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
            undoPath: ['/panel/menus/:itemLang', {'itemLang': 'auto'}],
            redirectOnCreate: ['/panel/menus/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
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
            itemFields: ['code', 'name'],
            itemActions: ['delete'],
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
                    truncate: 50
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
