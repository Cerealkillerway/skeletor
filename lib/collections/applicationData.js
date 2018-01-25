_.extend(Skeletor.Schemas, {
    applicationData_default: {
        __collection: 'Settings',
        __paths: {
            undoPath: ['/panel/dashboard', {}],
            redirectOnUpdate: ['/panel/application-data/update', {}]
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        fields: [
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
            }
        ]
    }
});
