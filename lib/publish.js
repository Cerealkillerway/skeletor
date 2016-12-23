//GENERAL PUBLICATIONS
// Find documents from a collection
Meteor.publish("findDocuments", function(collection, query, options, detail) {
    //if (permissionType && !checkPermissions(permissionType, this.userId)) throw new Meteor.Error("unauthorized");

    return Skeletor.Data[collection].find(query, options);
});


//Meteor._sleepForMs(5000);
