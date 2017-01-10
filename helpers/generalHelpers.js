// General skeleform spacebar's helpers

// check if supplied role is undeletable
UI.registerHelper('isUndeletableRole', function(role, options) {
    if ((role === 'admin') || (role === 'superuser')) {
        return true;
    }
    else return false;
});
