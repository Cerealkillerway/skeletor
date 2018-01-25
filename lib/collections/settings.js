import './collections.js';

_.extend(Skeletor.Data, {
    Settings: new Mongo.Collection('settings')
});


_.extend(Skeletor.Schemas, {
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
                name: 'langs',
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
            }
        ]
    }
});
