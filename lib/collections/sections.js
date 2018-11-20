import './collections.js';

_.extend(Skeletor.Data, {
    Sections: new Mongo.Collection('sections')
});


_.extend(Skeletor.Schemas, {
    Sections_default: {
        __collection: 'Sections',
        __subManager: 'sectionsSubs',
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
                code: {
                    direction: 1
                }
            },
            classes: 'striped hoverable',
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
                    confirm: true,
                    permission: 'allowSectionsDelete'
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
    }
});
