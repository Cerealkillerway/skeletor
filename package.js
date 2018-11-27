Package.describe({
    name: 'cerealkiller:skeletor',
    version: '3.7.1',
    summary: 'CRUD app skeleton!',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // namespace
    api.addFiles('namespace.js');

    api.versionsFrom('METEOR@1.6.1');


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
        'gfk:underscore-deep@1.0.0',
        'jcbernack:reactive-aggregate@1.0.0'
    ],
    ['client', 'server']);

    // need skeleform, skelelist and skelesite, but allow them to be loaded last
    api.use([
        'cerealkiller:skeleform',
        'cerealkiller:skelelist',
        'cerealkiller:skelesite'
    ],
    {unordered: true});

    // styles
    api.addFiles([
        'styles/skeletor.scss',
        'styles/_panel.scss',
        'styles/_responsive.scss'
    ],
    ['client']);

    // templates
    api.addFiles([
        'templates/panelMainMenu.html',
        'templates/panelDashboard.html',
        'templates/login.html',
        'templates/panelLayouts.html',
        'templates/panelFooter.html',
        'templates/panelToolbars.html',
        'templates/elements/commonAssets.html',
        'templates/elements/skeleTooltip.html',
        'templates/elements/superUser.html',
        'templates/settings/settingCreate.html',
        'templates/applicationData/applicationDataCreate.html',
        'templates/users/usersList.html',
        'templates/users/userCreate.html',
        'templates/roles/rolesList.html',
        'templates/roles/roleCreate.html',
        'templates/sections/sectionsList.html',
        'templates/sections/sectionCreate.html',
        'templates/pages/pagesList.html',
        'templates/pages/pageCreate.html',
        'templates/menus/menusList.html',
        'templates/menus/menuCreate.html',
        'templates/debug.html'
    ],
    ['client']);

    // i18n
    /*api.addFiles([
        'i18n/en.Skeletor.Skelelang.i18n.json',
        'i18n/it.Skeletor.Skelelang.i18n.json'
    ], ['client', 'server']);*/


    // libraries
    api.addFiles([
        'lib/publish.js',
        'lib/methodsServer.js'
    ],
    ['server']);

    api.addFiles([
        'events/debugEvents.js',
        'events/panelLayoutEvents.js',
        'events/panelFooterEvents.js',
        'events/panelToolbarsEvents.js',

        'helpers/panelLayoutHelpers.js',
        'helpers/panelToolbarsHelpers.js'
    ],
    ['client']);

    api.addFiles([
        'lib/utils.js',
        'lib/main-init.js',
        'lib/routerPanel.js',
        'lib/methods.js',
        'lib/authMatch.js',
        'lib/collections/collections.js',
        'lib/collections/menus.js',
        'lib/collections/pages.js',
        'lib/collections/roles.js',
        'lib/collections/sections.js',
        'lib/collections/settings.js',
        'lib/collections/applicationData.js',
        'lib/collections/users.js',
    ],
    ['client', 'server']);

    // static files
    /*api.addFiles([
    ],
    ['client']);*/


    // exports
    api.export(['Skeletor']);
});

Npm.depends({
    'numeral': '2.0.4',
    'nested-property': '0.0.7',
    'sortablejs': '1.7.0'
});

Package.onTest(function(api) {
    api.use([
        'tinytest',
        'cerealkiller:skeletor'
    ]);

    api.addFiles('skeletor-tests.js');
});
