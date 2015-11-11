Permissions = {
    default: {
        insert: 'adminOperations',
        update: 'adminOperations',
        delete: 'adminOperations'
    },
    Pages: {
        insert: 'adminOperations',
        update: 'editorOperations',
        delete: 'adminOperations'
    }
};

getPermissionType = function(collection, operation) {
    var permission = Permissions[collection];

    if (permission && permission[operation]) permission = permission[operation];
    else permission = Permissions.default[operation.toLowerCase()];

    return permission;
};

checkPermissions = function checkPermissions(type, userId) {
    // if user is not logged return false immediatly
    if (!userId) return false;

    var userDocument = Meteor.user();
    var userRoles = userDocument.profile.roles;
    //if the user is a superuser -> immediatly allow everything
    if (userRoles.indexOf('superuser')) return true;

    switch (type) {	
        case 'panelAccess':
        if (userRoles.indexOf('admin')) return true;
        break;

        case 'editorOperations':
        if (userRoles.indexOf('editor')) return true;
        break;

        case 'adminOperations':
        if (userRoles.indexOf('admin')) return true;
        break;
    }
    return false;
};
