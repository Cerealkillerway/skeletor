// performs security checks and validation before executing methods
// data          => data collected from the form that have to be inserted in the database
// schemaName    => the name of the schema used for the form
// operaton      => a string that can be "insert", "update" or "delete"
Skeletor.Utilities.handleMethodRequest = function(data, schemaName, operation) {
    // operations:
    // insert
    // update
    // delete

    'use strict';
    let schema = Skeletor.Schemas[schemaName];
    let collection = schema.__collection;

    // check permissions
    if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'create'))) {
        throw new Meteor.Error('unauthorized');
    }
    /*else {
        if (Meteor.isServer) {
            console.log('server method: auth ok!');
        }
        if (Meteor.isClient) {
            console.log('client method: auth ok!');
        }
    }*/

    if (operation !== 'delete') {
        let isValid = Skeletor.Skeleform.validate.checkData(data, schemaName);

        if (!isValid.valid) {
            throw new Meteor.Error(JSON.stringify(isValid), 'serverSideValidation');
        }
    }

    switch (operation) {
        case 'insert':
            if (schema.__options.tracked) {
                data.created = {
                    user: Meteor.userId(),
                    date: moment().format('MMMM Do YYYY, h:mm:ss a')
                };
            }
            break;

        case 'update':
            if (schema.__options.tracked) {
                data.updated = {
                    user: Meteor.userId(),
                    date: moment().format('MMMM Do YYYY, h:mm:ss a')
                };
            }
            break;

        case 'delete':
            break;
    }

    return {
        collection
    };
};


// performs appropriate subscriptions to needed data for a form or a list based on the schema
// instance        => the template instance
// schemaName      => the name of the schema used by the template
// type            => 'list' or 'detail'
Skeletor.Utilities.autoSubscribe = function(instance, schemaName, type) {
    let schema = Skeletor.Schemas[schemaName];

    if (type === 'list') {
        instance.skeleSubsReady = new ReactiveVar(false);

        let listSchema = schema.__listView;
        let fieldsToShow = listSchema.itemFields;
        let options = {};
        let detailLinkParams = listSchema.detailLink.params;
        let externalSubscriptions = {};

        function includeField(fieldSchema, fieldName, currentLang, options) {
            let defaultLang = Skeletor.configuration.lang.default;

            // initialize options object
            if (!options) {
                options = {};
            }
            if (!options.fields) {
                options.fields = {};
            }

            if (fieldSchema.i18n === undefined || fieldSchema.i18n === true) {
                options.fields[`${currentLang}---${fieldName}`] = 1;

                if (currentLang !== defaultLang) {
                    options.fields[`${defaultLang}---${fieldName}`] = 1;
                }
            }
            else {
                options.fields[`${fieldName}`] = 1;
            }
        }

        instance.autorun(() => {
            let readyHandles = [];
            let unCachedSubs = false;
            let currentLang = Skeletor.FlowRouter.getParam('itemLang');
            let sourcedFields = schema.__listView.sourcedFields;
            // option object for sourced fields;
            // it contains a object for every external schema (ex. Pages_default: {fields: {...}, subManager: ..., collection: ...})
            // for every schema it contains the fields options, a subManager field that tells if the subscription is cached
            // and a collection field;
            let sourcedOptions = {};

            // create options object
            // fields inclusion based on itemFields (fields to display in the list view)
            for (let fieldToShow of fieldsToShow) {
                let fieldName = fieldToShow.name;
                let fieldSchema;

                // handle if field is sourced from another schema
                if (sourcedFields && sourcedFields[fieldName]) {
                    SkeleUtils.GlobalUtilities.logger(`sourced field: ${fieldName}`, 'skeleformCommon');
                    let extSchemaName = sourcedFields[fieldName].schemaName;
                    let extSchema = Skeletor.Schemas[extSchemaName]

                    if (!sourcedOptions[extSchemaName]) {
                        sourcedOptions[extSchemaName] = {};
                    }
                    let extOptions = sourcedOptions[extSchemaName];
                    let extFieldName = sourcedFields[fieldName].mapTo

                    fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(extSchema.fields, extFieldName);
                    includeField(fieldSchema, extFieldName, currentLang, extOptions);

                    if (extSchema.__subManager) {
                        extOptions.subManager = extSchema.__subManager;
                    }
                    extOptions.collection = extSchema.__collection;
                }

                // default: field from current schema
                fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, fieldName);
                includeField(fieldSchema, fieldName, currentLang, options);
            }

            // fields inclusion based on detailLinkParams (if a param is not already included, add it now)
            for (let param of detailLinkParams) {
                if (param !== 'itemLang') {
                    let fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, param);

                    includeField(fieldSchema, param, currentLang, options);
                }
            }


            SkeleUtils.GlobalUtilities.logger('Auto subscribing to data with options:', 'SkeleUtils');
            SkeleUtils.GlobalUtilities.logger(options);
            SkeleUtils.GlobalUtilities.logger('Auto subscribing to external data with options:', 'SkeleUtils');
            SkeleUtils.GlobalUtilities.logger(sourcedOptions);

            // subscribe
            // subscription of fields from current schema
            let subManager = schema.__subManager;
            let collection = schema.__collection;

            if (subManager) {
                Skeletor.subsManagers[subManager].subscribe('rawFindDocuments', collection, {}, options, schemaName);
                readyHandles.push(Skeletor.subsManagers[subManager]);
            }
            else {
                Meteor.subscribe('rawFindDocuments', collection, {}, options, schemaName);
                unCachedSubs = true;
            }

            // subscription of fields from external schemas
            _.each(sourcedOptions, (options, schemaName) => {
                if (options.subManager) {
                    let subManager = Skeletor.subsManagers[options.subManager];

                    subManager.subscribe('rawFindDocuments', options.collection, {}, {fields: options.fields}, schemaName);

                    if (readyHandles.indexOf(subManager) < 0) {
                        readyHandles.push(subManager);
                    }
                }
                else {
                    Meteor.subscribe('rawFindDocuments', options.collection, {}, {fields: options.fields}, schemaName);
                }
            });

            // set ready
            instance.skeleSubsReady.set(() => {
                let result = true;

                for (let handle of readyHandles) {
                    result = result && handle.ready();
                }

                if (unCachedSubs) {
                    result = result && instance.subscriptionsReady();
                }

                return result;
            });
        });
    }

    if (type === 'detail') {

    }
}
