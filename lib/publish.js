//GENERAL PUBLICATIONS
// Find documents from a collection
Meteor.publish('findDocuments', function(collection, query, options) {
    let permitted = false;

    // check permissions
    if (SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'read'))) {
        permitted = true;
    }
    if (collection === 'Users' || collection === 'Roles') {
        let currentUserDocument = Meteor.user();

        if (!permitted) {
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
        throw new Meteor.Error('unauthorized to read ${collection}');
    }

    return Skeletor.Data[collection].find(query, options);
});


//Meteor._sleepForMs(5000);
