// performs security checks and validation before executing methods
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
Skeletor.Utilities.autoSubscribe = function(instance, schemaName, type) {
    let schema = Skeletor.Schemas[schemaName];

    if (type === 'list') {
        instance.skeleSubsReady = new ReactiveVar(false);

        let fieldsToShow = schema.__listView.itemFields;
        let options = {
            fields: {}
        };

        instance.autorun(() => {
            let currentLang = Skeletor.FlowRouter.getParam('itemLang');
            let defaultLang = Skeletor.configuration.lang.default;

            // create options object
            // fields inclusion
            for (let fieldToShow of fieldsToShow) {
                let fieldName = fieldToShow.name;
                let fieldSchema = SkeleUtils.GlobalUtilities.findFieldInSchema(schema, fieldName);

                options.fields[`${currentLang}---${fieldName}`] = 1;

                if (fieldSchema.i18n === undefined || fieldSchema.i18n === true) {
                    if (currentLang !== defaultLang) {
                        options.fields[`${defaultLang}---${fieldName}`] = 1;
                    }
                }
            }

            SkeleUtils.GlobalUtilities.logger('Auto subscribing to data with options:', 'SkeleUtils');
            SkeleUtils.GlobalUtilities.logger(options);

            // subscribe
            let subManager = schema.__subManager;
            let collection = schema.__collection;
            let readyHandles = [];
            let unCachedSubs = false;

            if (subManager) {
                Skeletor.subsManagers[subManager].subscribe('rawFindDocuments', collection, {}, options, schemaName);
                readyHandles.push(Skeletor.subsManagers[subManager]);
            }
            else {
                Meteor.subscribe('rawFindDocuments', collection, {}, options, schemaName);
                unCachedSubs = true;
            }

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
}
