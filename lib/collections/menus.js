import './collections.js';

_.extend(Skeletor.Data, {
    Menus: new Mongo.Collection('menus')
});


_.extend(Skeletor.Schemas, {
    Menus_default: {
        __collection: 'Menus',
        __paths: {
            undoPath: ['/panel/menus/:itemLang', {itemLang: 'auto'}],
            redirectOnCreate: ['/panel/menus/:itemLang/:name', {itemLang: 'auto', name: 'this'}, {sLang: 'auto'}],
            redirectOnUpdate: ['/panel/menus/:itemLang/:name', {itemLang: 'auto', name: 'this'}, {sLang: 'auto'}]
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
                    permission: 'allowMenusDelete'
                }
            ],
            detailLink: {
                basePath: '/panel/menus/:itemLang/:name',
                params: ['name', 'itemLang']
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
                    type: 'url',
                    min: 3,
                    max: 50,
                    unique: true
                },
                i18n: false
            },
            /*{
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
            },*/
            {
                name: 'description',
                output: 'input',
                renderAs: 'textarea',
                validation: {
                    type: 'string',
                    //min: 3
                }
            }
        ]
    }
});
