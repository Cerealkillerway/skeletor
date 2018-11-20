import './collections.js';

_.extend(Skeletor.Data, {
    Menus: new Mongo.Collection('menus')
});


_.extend(Skeletor.Schemas, {
    Menus_default: {
        __collection: 'Menus',
        __subManager: 'menusSubs',
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
                name: {
                    direction: 1
                }
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
        __methods: {
            update: 'skeleUpdateMenu'
        },
        __options: {
            tracked: true,
            //loadingModal: true
        },
        formCallbacks: {
            beforeSave: function(dataContext, gatheredValue) {
                let $menuItems = $('.menuItems').children('.collection-item');
                gatheredValue.menuItems = {};

                $menuItems.each(function(index, menuItem) {
                    let pageId = $(menuItem).find('.pageId').html();

                    gatheredValue.menuItems[pageId] = index + 1;
                });

                return gatheredValue;
            }
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
            {
                name: 'description',
                output: 'input',
                renderAs: 'textarea',
                validation: {
                    type: 'string',
                    //min: 3
                },
            },
            {
                skeleformGroup: true,
                name: 'position',
                fields: [
                    {
                        name: 'availableTemplates',
                        output: 'select',
                        allowBlank: true,
                        source: function() {
                            let templates = [];

                            _.each(Skeletor.availableTemplates, function(templatePositions, templateName) {
                                templates.push({value: templateName});
                            });

                            return templates;
                        },
                        sourceValue: 'value',
                        sourceName: 'value',
                        validation: {
                            type: 'string'
                        },
                        size: 's4 m3',
                        i18n: false,
                        callbacks: {
                            onChange: function(value, fieldInstance) {
                                let templatePositions = Skeletor.SkeleUtils.GlobalUtilities.getFieldInstance(fieldInstance.data.formContext, 'templatePositions');
                                let availablePositions = [];

                                availablePositions =_.map(_.find(Skeletor.availableTemplates, function(templatePositions, templateName) {
                                    return templateName == value;
                                }), function(position) {
                                    return {value: position};
                                });

                                templatePositions.setSource(availablePositions);
                            }
                        }
                    },
                    {
                        name: 'templatePositions',
                        output: 'select',
                        allowBlank: true,
                        source: function(fieldInstance) {
                            let positions = [];

                            /*_.each(Skeletor.availableTemplates, function(template) {
                                for (position of template) {
                                    positions.push({value: position});
                                }
                            });

                            return positions;*/
                            return [];
                        },
                        sourceValue: 'value',
                        sourceName: 'value',
                        validation: {
                            type: 'string'
                        },
                        size: 's4 m3',
                        i18n: false
                    }
                ]
            }
        ]
    }
});
