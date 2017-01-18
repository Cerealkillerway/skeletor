// General skeleform helpers
Skeletor.generalHelpers = {
    skeleCheckPermissions: function(permissionType, failCallback) {
        let isAllowed = Skeletor.checkPermissions(permissionType);

        if (!isAllowed) {
            // if necessary fire the failCallback
            if (failCallback) {
                failCallback();
            }
        }

        return isAllowed;
    },

    skeleSubsReady: function(subscription) {
        // if particular subscription state is requested, look for a reactive var
        // with name subscription + 'Ready'
        if (subscription) {
            return Template.instance()[subscription + 'Ready'].get();
        }
        // otherwise return standard skeleSubsReady reactive var
        else {
            return Template.instance().skeleSubsReady.get();
        }
    }
};
