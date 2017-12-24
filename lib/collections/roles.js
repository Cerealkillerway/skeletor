import './collections.js';

_.extend(Skeletor.Data, {
    Roles: new Mongo.Collection('roles')
});


_.extend(Skeletor.Schemas, {
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
    }
});
