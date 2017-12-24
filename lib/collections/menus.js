import './collections.js';

_.extend(Skeletor.Data, {
    Menus: new Mongo.Collection('menus')
});


_.extend(Skeletor.Schemas, {
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
});
