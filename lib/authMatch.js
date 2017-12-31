// this object provides a match between a collection and operation to perform
// and permissions needed
// extend this object in your app with permissions for your custom collections
Skeletor.Utilities.authMatch = {
    // SETTINGS
    settings: {
        read: true,
        update: 'allowConfigUpdate'
    },

    // ACL
    users: {
        read: 'allowUsersRead',
        create: 'allowUsersCreate',
        update: 'allowUsersUpdate',
        delete: 'allowUsersDelete'
    },
    roles: {
        read: 'allowRolesRead',
        create: 'allowRolesCreate',
        update: 'allowRolesUpdate',
        delete: 'allowRolesDelete'
    },

    // PAGES AND CONTENTS
    pages: {
        read: 'allowPagesRead',
        create: 'allowPagesCreate',
        update: 'allowPagesUpdate',
        delete: 'allowPagesDelete'
    },
    sections: {
        read: 'allowSectionsRead',
        create: 'allowSectionsCreate',
        update: 'allowSectionsUpdate',
        delete: 'allowSectionsDelete'
    },
    menus: {
        read: 'allowMenusRead',
        create: 'allowMenusCreate',
        update: 'allowMenusUpdate',
        delete: 'allowMenusDelete'
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
