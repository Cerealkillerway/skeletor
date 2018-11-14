import { Counts } from 'meteor/ros:publish-counts';


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
            options.sort = listSchema.sort;
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


Meteor.publish('countCollection', function(collection) {
    Counts.publish(this, `${collection}Counter`, Skeletor.Data[collection].find());
});


//Meteor._sleepForMs(5000);
