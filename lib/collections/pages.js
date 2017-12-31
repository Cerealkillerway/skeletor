import './collections.js';
import './sections.js';
import './menus.js';


_.extend(Skeletor.Data, {
    Pages: new Mongo.Collection('pages')
});


_.extend(Skeletor.Schemas, {
    Pages_default: {
        __collection: 'Pages',
        __paths: {
            undoPath: ['/panel/pages/:itemLang', {itemLang: 'auto'}],
            redirectOnCreate: ['/panel/pages/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}],
            redirectOnUpdate: ['/panel/pages/:itemLang/:code', {itemLang: 'auto', code: 'this'}, {sLang: 'auto'}]
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
                    name: 'title',
                    link: true
                },
                {
                    name: 'published'
                },
                {
                    name: 'section'
                },
                {
                    name: 'menu'
                }
            ],
            sourcedFields:{
                section: {
                    mapTo: ':itemLang---name',
                    collection: 'Sections'
                },
                menu: {
                    mapTo: ':itemLang---name',
                    collection: 'Menus'
                }
            },
            itemActions: [
                {
                    name: 'delete',
                    confirm: true,
                    permission: 'allowPagesDelete'
                }
            ],
            detailLink: {
                basePath: '/panel/pages/:itemLang/:code',
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
                name: 'title',
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
                    type: 'string'
                }
            },
            {
                name: 'content',
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
            },
            {
                name: 'section',
                output: 'select',
                allowBlank: true,
                source: Skeletor.Data.Sections.find({}),
                sourceValue: '_id',
                sourceName: ':itemLang---name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            {
                name: 'publish',
                output: 'staticTitle'
            },
            {
                name: 'published',
                output: 'select',
                icons: true,
                source: [
                    {
                        name: 'yes_lbl',
                        value: 1,
                        icon: '/packages/cerealkiller_skeleform/public/icons/ok.png'
                    },
                    {
                        name: 'no_lbl',
                        value: 0,
                        icon: '/packages/cerealkiller_skeleform/public/icons/cancel.png'
                    }
                ],
                validation: {
                    min: 1
                }
            },
            {
                name: 'menuItem',
                output: 'staticTitle'
            },
            {
                name: 'menu',
                output: 'select',
                allowBlank: true,
                source: Skeletor.Data.Menus.find({}),
                sourceValue: '_id',
                sourceName: ':itemLang---name',
                validation: {
                    min: 1
                },
                i18n: false
            },
            {
                name: 'menuName',
                output: 'input',
                validation: {
                    type: 'string',
                    max: 50
                }
            },
        ]
    }
});
