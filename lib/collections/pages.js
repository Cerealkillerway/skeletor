import './collections.js';
import './sections.js';
import './menus.js';


_.extend(Skeletor.Data, {
    Pages: new Mongo.Collection('pages')
});


_.extend(Skeletor.Schemas, {
    Pages_default: {
        __collection: 'Pages',
        __subManager: 'pagesSubs',
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
                title: {
                    direction: 1
                }
            },
            classes: 'striped hoverable',
            info: {
                showTotalNumber: true
            },
            itemFields: [
                {
                    name: 'title',
                    link: true
                },
                {
                    name: 'published'
                },
                {
                    name: 'section',
                    allowUndefined: true
                },
                {
                    name: 'menu',
                    allowUndefined: true
                },
                {
                    name: 'placeholderItem',
                    allowUndefined: true
                }
            ],
            sourcedFields:{
                section: {
                    mapTo: 'name',
                    schemaName: 'Sections_default'
                },
                menu: {
                    mapTo: 'name',
                    schemaName: 'Menus_default'
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
                    type: 'string',
                    min: 3
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
                subscription: function() {
                    Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, {});

                    return Skeletor.subsManagers.sectionsSubs.ready();
                },
                source: Skeletor.Data.Sections.find(),
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
                output: 'checkBox',
                renderAs: 'switch'
            },
            {
                name: 'placeholder',
                output: 'staticTitle'
            },
            {
                name: 'placeholderItem',
                output: 'select',
                allowBlank: true,
                source: function() {
                    let placeholders = [];

                    _.each(Skeletor.pagePlaceholders, function(placeHolderCategory) {
                        for (placeholder of placeHolderCategory) {
                            placeholders.push({value: placeholder});
                        }
                    });

                    return placeholders;
                },
                sourceValue: 'value',
                sourceName: 'value',
                validation: {
                    type: 'string'
                },
                i18n: false
            },
            {
                name: 'menuItem',
                output: 'staticTitle'
            },
            {
                name: 'menu',
                output: 'select',
                allowBlank: true,
                subscription: function() {
                    Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, {});

                    return Skeletor.subsManagers.menusSubs.ready();
                },
                source: Skeletor.Data.Menus.find(),
                sourceValue: '_id',
                sourceName: 'name',
                validation: {
                    type: 'string'
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
            {
                name: 'menuIcon',
                output: 'input',
                validation: {
                    type: 'string',
                    max: 50
                }
            }
        ]
    }
});
