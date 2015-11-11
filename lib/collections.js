Skeletor.Data = {
    Settings: new Mongo.Collection("settings"),

    Pages: new Mongo.Collection("pages"),
    Roles: new Mongo.Collection("roles"),
    Users: Meteor.users
};

// supportive clientside collections
if (Meteor.isClient) {
    Pages__detail__ = new Mongo.Collection("Pages__detail__");

    Skeletor.Data.Pages__detail__ = Pages__detail__;
}