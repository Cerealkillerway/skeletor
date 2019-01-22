import { Counts } from 'meteor/ros:publish-counts';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';


//GENERAL PUBLICATIONS
// Find documents from a collection
Meteor.publish('findDocuments', function(collection, query, options, schemaName, page) {
    let permitted = false;
    let publishHandle = [];

    // check permissions
    if (SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'read'))) {
        permitted = true;
    }
    if (collection === 'Users' || collection === 'Roles') {
        let currentUserDocument = Meteor.user();

        if (!permitted && (currentUserDocument !== null)) {
            switch (collection) {
                case 'Users':
                query = {_id: Meteor.userId()}
                break;

                case 'Roles':
                query = {_id: {$in: currentUserDocument.profile.roles}};
                break;
            }
        }

        permitted = true;
    }

    if (!permitted) {
        throw new Meteor.Error(`unauthorized to read ${collection}`);
    }

    // handle pagination
    if (schemaName) {
        let schema = Skeletor.Schemas[schemaName];
        let listSchema = schema.__listView;
        let itemsPerPage = listSchema.options.itemsPerPage || 10;

        if (listSchema.sort) {
            let sortOptions = {};

            _.each(listSchema.sort, function(fieldName, value) {
                sortOptions[fieldName] = value.direction;
            });

            options.sort = sortOptions;
        }

        if (listSchema.options && listSchema.options.pagination) {
            options.limit = itemsPerPage;
        }

        if (page) {
            options.skip = itemsPerPage * (page - 1);
        }
    }

    publishHandle.push(Skeletor.Data[collection].find(query, options));

    return publishHandle;
});


Meteor.publish('rawFindDocuments', function(collection, query, options, schemaName, page) {
    let permitted = false;
    let publishHandle = [];

    // check permissions
    if (SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'read'))) {
        permitted = true;
    }
    if (collection === 'Users' || collection === 'Roles') {
        let currentUserDocument = Meteor.user();

        if (!permitted && (currentUserDocument !== null)) {
            switch (collection) {
                case 'Users':
                query = {_id: Meteor.userId()}
                break;

                case 'Roles':
                query = {_id: {$in: currentUserDocument.profile.roles}};
                break;
            }
        }

        permitted = true;
    }

    if (!permitted) {
        throw new Meteor.Error(`unauthorized to read ${collection}`);
    }

    let schema = Skeletor.Schemas[schemaName];
    let listSchema = schema.__listView;
    let itemsPerPage = listSchema.options.itemsPerPage || 10;
    let aggregatePipeline = [];
    let projectOptions = {
        '$project': {}
    };
    let sortOptions = {
        '$sort': {}
    }
    let handle;
    let caseInsensitivePrefix = 'skci___';

    if (Skeletor.configuration.sort && Skeletor.configuration.sort.caseInsensitivePrefix) {
        caseInsensitivePrefix = Skeletor.configuration.sort.caseInsensitivePrefix;
    }

    if (options && options.fields) {
        _.each(options.fields, function(value, fieldName) {
            projectOptions.$project[fieldName] = 1;
        });
    }

    if (listSchema.sort) {
        _.each(listSchema.sort, function(value, fieldName) {
            if (value.caseInsensitive) {
                projectOptions.$project[`${caseInsensitivePrefix}${fieldName}`] = {'$toLower': '$' + fieldName};

                sortOptions.$sort[`${caseInsensitivePrefix}${fieldName}`] = value.direction;
            }
            else {
                sortOptions.$sort[fieldName] = value.direction;
            }
        });
    }

    aggregatePipeline.push({'$match': query});
    aggregatePipeline.push(projectOptions);
    aggregatePipeline.push(sortOptions);

    if (page) {
        let skipCounter = itemsPerPage * (page - 1);

        aggregatePipeline.push({
            '$skip': skipCounter
        });
    }

    if (listSchema.options && listSchema.options.pagination) {
        aggregatePipeline.push({
            '$limit': itemsPerPage
        });
    }

    ReactiveAggregate(this, Skeletor.Data[collection], aggregatePipeline);
});


Meteor.publish('countCollection', function(collection) {
    Counts.publish(this, `${collection}Counter`, Skeletor.Data[collection].find());
});


//Meteor._sleepForMs(5000);
