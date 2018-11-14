import './collections.js';

_.extend(Skeletor.Data, {
    Roles: new Mongo.Collection('roles')
});


_.extend(Skeletor.Schemas, {
    Roles_default: {
        __collection: 'Roles',
        __subManager: 'rolesSubs',
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
            classes: 'striped hoverable',
            itemFields: [
                {
                    name: 'name',
                    link: true
                }
            ],
            itemActions: [
                {
                    name: 'delete',
                    confirm: true,
                    permission: 'allowRolesDelete'
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
                size: 's12'
            },

            // main functions
            {
                name: 'panelAccess',
                output: 'staticTitle',
                tag: 'h6',
                classes: ['secondColorText'],
                size: 's4 m3'
            },
            {
                name: 'mainFunctionsDescription',
                output: 'staticTitle',
                size: 's12',
                tag: 'p',
                labelType: 'text'
            },

            {
                name: 'allowPanelAccess',
                output: 'checkBox',
                renderAs: 'switch',
                size: 's4 m3',
                i18n: false
            },


            // content
            {
                name: 'contentManagement',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                name: 'contentDescription',
                output: 'staticTitle',
                size: 's12',
                tag: 'p',
                labelType: 'text'
            },

            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'pagesManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                    {
                        name: 'sectionsManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                    {
                        name: 'menusManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    }
                ]
            },

            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowPagesRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false,
                        callbacks: {
                            onChange: function(value, fieldInstance) {
                                if (value === false) {
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowPagesCreate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowPagesUpdate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowPagesDelete').setValue(false);
                                }
                            }
                        }
                    },
                    {
                        name: 'allowSectionsRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false,
                        callbacks: {
                            onChange: function(value, fieldInstance) {
                                if (value === false) {
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowSectionsCreate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowSectionsUpdate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowSectionsDelete').setValue(false);
                                }
                            }
                        }
                    },
                    {
                        name: 'allowMenusRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false,
                        callbacks: {
                            onChange: function(value, fieldInstance) {
                                if (value === false) {
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowMenusCreate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowMenusUpdate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowMenusDelete').setValue(false);
                                }
                            }
                        }
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowPagesCreate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowSectionsCreate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowMenusCreate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowPagesUpdate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowSectionsUpdate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowMenusUpdate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowPagesDelete',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowSectionsDelete',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowMenusDelete',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },


            // ACL
            {
                name: 'aclManagement',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
            {
                name: 'aclDescription',
                output: 'staticTitle',
                size: 's12',
                tag: 'p',
                labelType: 'text'
            },

            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'usersManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    },
                    {
                        name: 'rolesManagement',
                        output: 'staticTitle',
                        tag: 'h6',
                        classes: ['secondColorText'],
                        size: 's4 m3'
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowUsersRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false,
                        callbacks: {
                            onChange: function(value, fieldInstance) {
                                if (value === false) {
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowUsersCreate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowUsersUpdate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowUsersDelete').setValue(false);
                                }
                            }
                        }
                    },
                    {
                        name: 'allowRolesRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false,
                        callbacks: {
                            onChange: function(value, fieldInstance) {
                                if (value === false) {
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowRolesCreate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowRolesUpdate').setValue(false);
                                    Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'allowRolesDelete').setValue(false);
                                }
                            }
                        }
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowUsersCreate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowRolesCreate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowUsersUpdate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowRolesUpdate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowUsersDelete',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowRolesDelete',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },


            // config & debug
            {
                name: 'configDebugManagement',
                output: 'staticTitle',
                tag: 'h5',
                classes: ['secondColorText skeleBold'],
                size: 's12'
            },
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

            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowConfigRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowDebugRead',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            },
            {
                skeleformGroup: true,
                fields: [
                    {
                        name: 'allowConfigUpdate',
                        output: 'checkBox',
                        renderAs: 'switch',
                        size: 's4 m3',
                        i18n: false
                    },
                    {
                        name: 'allowDebugUpdate',
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
