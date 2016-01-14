//GENERAL PUBLICATIONS
// Find documents from a collection
Meteor.publish("findDocuments", function(collection, query, options, detail) {
    //if (permissionType && !checkPermissions(permissionType, this.userId)) throw new Meteor.Error("unauthorized");

    var data = Skeletor.Data[collection].find(query, options);

    if (detail) {
        Mongo.Collection._publishCursor(data, this, collection + "__detail__");
    }

    return data;
});


//Meteor._sleepForMs(5000);