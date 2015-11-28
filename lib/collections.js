Skeletor.Data = {
    Settings: new Mongo.Collection("settings"),

    Pages: new Mongo.Collection("pages"),
    Roles: new Mongo.Collection("roles"),
    Users: Meteor.users
};

// supportive clientside collections (workaround for DDP limitations)
if (Meteor.isClient) {
    Users__detail__ = new Mongo.Collection('Users__detail__');
    Roles__detail__ = new Mongo.Collection('Roles__detail__');
    Pages__detail__ = new Mongo.Collection("Pages__detail__");

    Skeletor.Data.Users__detail__ = Users__detail__;
    Skeletor.Data.Roles__detail__ = Roles__detail__;
    Skeletor.Data.Pages__detail__ = Pages__detail__;
}


Skeletor.Schemas = {
    Pages_default: {
        __collection: "Pages",
        __paths: {
            undoPath: '/panel/pages',
            redirectOnUpdate: ['/panel/pages', {}],
            redirectOnCreate: ['/panel/pages/:code', {code: 'this'}]
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
            classes: 'hoverable',
            itemFields: ['code', 'title'],
            itemActions: ['delete'],
            detailLink: {
                basePath: '/panel/pages/:code',
                params: ['code']
            }
        },
        __options: {
            loadingModal: true
        },
        code: {
            type: "url",
            output: "input",
            min: 3,
            max: 50,
            unique: true,
            i18n: false
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
        }
    },
    Sections_default: {
        __collection: "Pages",
        __paths: {
            undoPath: '/panel/sections',
            redirectOnUpdate: ['/panel/sections', {}],
            redirectOnCreate: ['/panel/sections/:code', {code: 'this'}]
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
            classes: 'hoverable',
            itemFields: ['code', 'name'],
            itemActions: ['delete'],
            detailLink: {
                basePath: '/panel/pages/:code',
                params: ['code']
            }
        },
        __options: {
            loadingModal: true
        },
        code: {
            type: "url",
            output: "input",
            min: 3,
            max: 50,
            unique: true,
            i18n: false
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
    Roles_default: {
        __collection: "Roles",
        __paths: {
            undoPath: '/panel/roles'
        },
        __listView: {
            style: 'table',
            sort: {
                username: 1
            },
            classes: 'hoverable',
            itemFields: ['name'],
            itemActions: ['delete'],
            detailLink: {
                basePath: '/panel/roles/:name',
                params: ['name']
            }
        },
        __options: {
            loadingModal: true
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
    Users_default: {
        __collection: "Users",
        __paths: {
            undoPath: '/panel/users',
            redirectOnUpdate: ['/panel/users', {}],
            redirectOnCreate: ['/panel/users/:username', {username: 'this'}]
        },
        __listView: {
            style: 'table',
            sort: {
                username: 1
            },
            classes: 'hoverable',
            itemFields: ['username', 'profile.roles'],
            itemActions: ['delete', 'changePassword'],
            detailLink: {
                basePath: '/panel/users/:username',
                params: ['username']
            }
        },
        __options: {
            loadingModal: true
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
    }
};