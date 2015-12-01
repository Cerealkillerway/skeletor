Skeletor.Data = {
    Settings: new Mongo.Collection('settings'),

    Users: Meteor.users,
    Roles: new Mongo.Collection('roles'),

    Sections: new Mongo.Collection('sections'),
    Pages: new Mongo.Collection('pages')
};

// supportive clientside collections (workaround for DDP limitations)
if (Meteor.isClient) {
    Users__detail__ = new Mongo.Collection('Users__detail__');
    Roles__detail__ = new Mongo.Collection('Roles__detail__');

    Sections__detail__ = new Mongo.Collection('Sections__detail__');
    Pages__detail__ = new Mongo.Collection('Pages__detail__');


    Skeletor.Data.Users__detail__ = Users__detail__;
    Skeletor.Data.Roles__detail__ = Roles__detail__;

    Skeletor.Data.Sections__detail__ = Sections__detail__;
    Skeletor.Data.Pages__detail__ = Pages__detail__;
}


Skeletor.Schemas = {

    // USERS
    Users_default: {
        __collection: "Users",
        __paths: {
            undoPath: '/panel/users',
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
        username: {
            type: "text",
            output: "input",
            min: 3,
            max: 30,
            unique: true,
            i18n: false
        },
        userEmail: {
            type: "email",
            output: "input",
            min: 5,
            max: 50,
            i18n: false,
        },
        password: {
            type: "text",
            output: "input",
            renderAs: "password",
            shadowConfirm: true,
            min: 6,
            i18n: false,
            useOnly: 'create'
        },
        "profile.roles": {
            output: "select",
            source: Skeletor.Data.Roles.find({}),
            sourceValue: "name",
            sourceName: "name",
            min: 1,
            i18n: false
        },
        "profile.name": {
            type: "text",
            output: "input",
            max: 50,
            i18n: false
        },
        "profile.telephone": {
            type: "number",
            output: "input",
            max: 30,
            i18n: false
        }
    },
    Users_changePassword: {
        __collection: "users",
        __toolbar: {
            template: "userChangePasswordToolbar",
            containerId: "skeletorUserChangePasswordToolbar"
        },
        newPassword: {
            type: "text",
            output: "input",
            renderAs: "password",
            shadowConfirm: true,
            min: 6,
            i18n: false
        }
    },

    // ROLES
    Roles_default: {
        __collection: "Roles",
        __paths: {
            undoPath: '/panel/roles'
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
        name: {
            type: "text",
            output: "input",
            min: 3,
            max: 50,
            unique: true,
            i18n: false
        }
    },

    // SECTIONS
    Sections_default: {
        __collection: "Sections",
        __paths: {
            undoPath: '/panel/sections/' + Skeletor.configuration.lang.default,
            redirectOnUpdate: ['/panel/sections/:itemLang', {itemLang: Skeletor.configuration.lang.default}],
            redirectOnCreate: ['/panel/sections/:itemLang/:code', {itemLang: Skeletor.configuration.lang.default, code: 'this'}]
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
        code: {
            type: "url",
            output: "input",
            min: 3,
            max: 50,
            unique: true
        },
        name: {
            __listView: {
                stripHTML: true,
                truncate: 50
            },
            type: "text",
            output: "input",
            min: 3,
            max: 50
        },
        description: {
            type: "text",
            output: "editor",
            toolbar: "full",
            size: "s12",
            image: {
                quality: 0.6,
                width: 400,
                height: 400
            },
            video: {
                width: 600,
                height: 400
            },
            min: 3
        }
    },

    // PAGES
    Pages_default: {
        __collection: "Pages",
        __paths: {
            undoPath: '/panel/pages/' + Skeletor.configuration.lang.default,
            redirectOnUpdate: ['/panel/pages/:itemLang', {itemLang: Skeletor.configuration.lang.default}],
            redirectOnCreate: ['/panel/pages/:itemLang/:code', {itemLang: Skeletor.configuration.lang.default, code: 'this'}]
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 10
            },
            sort: {
                section: 1,
                code: 1
            },
            classes: 'hoverable striped',
            itemFields: ['code', 'title', 'section'],
            sourcedFields:{
                section: {
                    mapTo: ':itemLang.name',
                    collection: 'Sections'
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
        code: {
            type: "url",
            output: "input",
            min: 3,
            max: 50,
            unique: true
        },
        title: {
            __listView: {
                stripHTML: true,
                truncate: 50
            },
            type: "text",
            output: "editor",
            toolbar: "full",
            size: "s12",
            image: {
                quality: 0.6,
                width: 400,
                height: 400
            },
            video: {
                width: 600,
                height: 400
            }
        },
        content: {
            type: "text",
            output: "editor",
            toolbar: "full",
            size: "s12",
            image: {
                quality: 0.6,
                width: 400,
                height: 400
            },
            video: {
                width: 600,
                height: 400
            },
            min: 3
        },
        published: {
            output: "select",
            icons: true,
            source: [
                {
                    name: "Sì",
                    value: 1,
                    icon: '/packages/cerealkiller_skeleform/public/icons/ok.png'
                },
                {
                    name: "No",
                    value: 0,
                    icon: '/packages/cerealkiller_skeleform/public/icons/cancel.png'
                }
            ],
            min: 1
        },
        section: {
            output: "select",
            allowBlank: true,
            source: Skeletor.Data.Sections.find({}),
            sourceValue: "_id",
            sourceName: ":itemLang.name",
            min: 1,
            i18n: false
        },
    }
};