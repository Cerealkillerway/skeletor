// this object provides a match between a collection and operation to perform
// and permissions needed
// extend this object in your app with permissions for your custom collections
Skeletor.Utilities.authMatch = {
    // SETTINGS
    settings: {
        read: true,
        create: 'allowConfig',
        update: 'allowConfig',
        delete: 'allowConfig'
    },

    // ACL
    users: {
        read: true,
        create: 'allowAcl',
        update: 'allowAcl',
        delete: 'allowAcl'
    },
    roles: {
        read: true,
        create: 'allowAcl',
        update: 'allowAcl',
        delete: 'allowAcl'
    },

    // PAGES AND CONTENTS
    pages: {
        read: true,
        create: 'allowPages',
        update: 'allowPages',
        delete: 'allowPages'
    },
    sections: {
        read: true,
        create: 'allowPages',
        update: 'allowPages',
        delete: 'allowPages'
    },
    menus: {
        read: true,
        create: 'allowPages',
        update: 'allowPages',
        delete: 'allowPages'
    }
};

Skeletor.Utilities.getPermissions = function(collection, operation, extras) {
    collection = collection.toLowerCase();

    // if authMatch property is a function, execute it
    // and pass to it 'extras' as argument
    if (typeof Skeletor.Utilities.authMatch[collection][operation] === 'function') {
        return Skeletor.Utilities.authMatch[collection][operation](extras);
    }

    return Skeletor.Utilities.authMatch[collection][operation];
};
