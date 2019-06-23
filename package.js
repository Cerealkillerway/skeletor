Package.describe({
    name: 'cerealkiller:skeletor',
    version: '5.0.0',
    summary: 'CRUD app skeleton!',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // namespace
    api.addFiles([
        'namespace.js'
    ],
    ['client', 'server']);


    api.versionsFrom('METEOR@1.8.0.2');


    // dependencies
    api.use([
        'cerealkiller:skelelang',
    ],
    ['client', 'server']);


    // packages
    api.use([
        'jquery',
        'blaze-html-templates@1.1.2',
        'reactive-var',
        'kadira:blaze-layout@2.3.0',
        'fourseven:scss@4.5.4',
        'materialize:materialize@0.100.2'
    ],
    ['client']);


    api.use([
        'mongo',
        'session',
        'ecmascript',
        'underscore@1.0.0',
        'meteorhacks:subs-manager@1.6.4',
        'ostrio:flow-router-extra@3.4.7',
        'staringatlights:fast-render@3.0.3',
        'momentjs:moment@2.19.2',
        'cerealkiller:skeleutils',
        'gfk:underscore-deep@1.0.0'
    ],
    ['client', 'server']);


    // need skeleform, skelelist and skelesite, but allow them to be loaded last
    api.use([
        'cerealkiller:skeleform',
        'cerealkiller:skelelist'
    ],
    {unordered: true});


    // static assets
    api.addAssets([
        'public/icons/lang/en.jpg',
        'public/icons/lang/it.jpg'
    ],
    ['client']);


    // styles
    api.addFiles([
        'styles/skeletor.scss',
        'styles/_extendables.scss'
    ],
    ['client']);


    // templates
    api.addFiles([
        'templates/panel-main-menu.html',
        'templates/panel-dashboard.html',
        'templates/login.html',
        'templates/panel-layouts.html',
        'templates/panel-footer.html',
        'templates/panel-toolbars.html',
        'templates/common-assets.html',
        'templates/settings/setting-create.html',
        'templates/application-data/application-data-create.html',
        'templates/users/users-list.html',
        'templates/users/user-create.html',
        'templates/roles/roles-list.html',
        'templates/roles/role-create.html',
        'templates/debug.html'
    ],
    ['client']);


    // libraries
    api.addFiles([
        'lib/publish.js',
        'lib/methods-server.js'
    ],
    ['server']);


    api.addFiles([
        'events/debug-events.js',
        'events/panel-layout-events.js',
        'events/panel-footer-events.js',
        'events/panel-toolbars-events.js',

        'helpers/panel-layout-helpers.js',
        'helpers/panel-toolbars-helpers.js'
    ],
    ['client']);


    api.addFiles([
        'lib/utils.js',
        'lib/main-init.js',
        'lib/router-panel.js',
        'lib/methods.js',
        'lib/auth-match.js',
        'lib/collections/collections.js',
        'lib/collections/roles.js',
        'lib/collections/settings.js',
        'lib/collections/application-data.js',
        'lib/collections/users.js',
    ],
    ['client', 'server']);


    // exports
    api.export(['Skeletor']);
});


Npm.depends({
    'numeral': '2.0.4',
    'nested-property': '0.0.7',
    'sortablejs': '1.7.0',
    "bcrypt": "3.0.5"
});


Package.onTest(function(api) {
    api.use([
        'tinytest',
        'cerealkiller:skeletor'
    ]);

    api.addFiles('skeletor-tests.js');
});
