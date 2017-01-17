Skeletor.checkPermissions = function checkPermissions(type) {
    'use strict';
    let userRoles;
    let allowedRoles = [];
    let result = false;

    if (Meteor.isClient) {
        userRoles = Skeletor.currentUserRoles.get();

        if (userRoles) {
            userRoles = userRoles.fetch();
        }
    }
    console.log(userRoles);

    switch (type) {
        /*case 'particularTreatment':
        Array.prototype.push.apply(allowedRoles, []);
        break;*/

        default:
        allowedRoles.push(type);
    }

    checkIfAllowed = function(userRoles, evaluatingRole) {
        return _.find(userRoles, function(role) {
            return role[evaluatingRole];
        });
    };

    for (let i = 0; i < allowedRoles.length; i++) {
        let evaluatingRole = allowedRoles[i];
        let isAllowed = checkIfAllowed(userRoles, evaluatingRole);

        if (isAllowed !== undefined) {
            result = true;
            break;
        }
    }

    return result;
};
