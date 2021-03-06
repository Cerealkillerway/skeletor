_.extend(Skeletor.Data, {
    Users: Meteor.users
});


_.extend(Skeletor.Schemas, {
    Users_default: {
        __collection: 'Users',
        __subManager: 'usersSubs',
        __paths: {
            undoPath: ['/panel/users', {}],
            redirectOnCreate: ['/panel/users/:username', {username: 'this'}],
            redirectOnUpdate: ['/panel/users/:username', {username: 'this'}]
        },
        __methods: {
            create: 'skeleCreateUser',
            update: 'skeleUpdateUser'
        },
        __listView: {
            style: 'table',
            options: {
                pagination: true,
                itemsPerPage: 20,
                autoLoad: true
            },
            sort: {
                username: {
                    direction: 1
                }
            },
            classes: 'striped hoverable',
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
                    schemaName: 'Roles_default'
                }
            },
            itemActions: [
                {
                    name: 'delete',
                    confirm: true,
                    permission: 'allowUsersDelete'
                },
                {
                    name: 'changePassword',
                    permission: 'allowUsersUpdate'
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
                            class: 'skelelistCurrentUser',
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
            timeMachine: true
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
                size: 's12 m3',
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
                name: 'associatedEmails',
                output: 'staticTitle',
                tag: 'h6',
                classes: ['secondColorText']
            },
            {
                skeleformGroup: true,
                replicaSet: {
                    name: 'emails',
                    i18n: false,
                    frameClasses: ['emailsFrame'],
                    minCopies: 1,
                    maxCopies: 4,
                    sortable: true
                },
                fields: [
                    {
                        name: 'address',
                        output: 'input',
                        size: 's12',
                        validation: {
                            type: 'email',
                            min: 5,
                            max: 50,
                            showErrorFor: 'Email already exists.'
                        },
                        i18n: false
                    },
                ]
            },

            /*{
                name: 'userEmail',
                output: 'input',
                validation: {
                    type: 'email',
                    min: 5,
                    max: 50,
                    showErrorFor: 'Email already exists.'
                },
                i18n: false,
                mapTo: function(fieldInstance) {
                    return 'emails';
                }
            },*/
            {
                name: 'profile.roles',
                output: 'select',
                multi: true,
                subscription: function(fieldInstance) {
                    let handle = Meteor.subscribe('findDocuments', 'Roles', {}, {}, 'Roles_default', 'all');

                    return handle.ready();
                },
                source: Skeletor.Data.Roles.find(),
                sourceValue: '_id',
                sourceName: 'name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            /*{
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
            }*/
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
    }
});
