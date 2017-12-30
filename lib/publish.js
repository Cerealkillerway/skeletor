//GENERAL PUBLICATIONS
// Find documents from a collection
Meteor.publish('findDocuments', function(collection, query, options) {
    // check permissions
    if (!SkeleUtils.GlobalUtilities.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'read'))) {
        throw new Meteor.Error('unauthorized');
    }

    return Skeletor.Data[collection].find(query, options);
});


//Meteor._sleepForMs(5000);
