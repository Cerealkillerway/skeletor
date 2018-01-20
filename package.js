Package.describe({
    name: 'cerealkiller:skeletor',
    version: '3.13.7',
    summary: 'CRUD app skeleton!',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // namespace
    api.addFiles('namespace.js');

    // packages
    api.use([
        'jquery',
        'blaze-html-templates',
        'reactive-var',
        'kadira:blaze-layout@2.3.0',
        'fourseven:scss',
        'materialize:materialize@0.100.2'
    ],
    ['client']);

    api.use([
        'mongo',
        'session',
        'ecmascript',
        'tap:i18n@1.8.2',
        'underscore@1.0.0',
        'meteorhacks:subs-manager@1.6.4',
        'staringatlights:flow-router@2.12.1',
        'staringatlights:fast-render@2.16.0',
        'momentjs:moment@2.19.2',
        'cerealkiller:skeleutils@1.6.0',
        'gfk:underscore-deep'
    ],
    ['client', 'server']);

    // need skeleform, skelelist and skelesite, but allow them to be loaded last
    api.use([
        'cerealkiller:skeleform',
        'cerealkiller:skelelist',
        'cerealkiller:skelesite'
    ],
    {unordered: true});

    // i18n settings
    api.addFiles('package-tap.i18n', ['client', 'server']);

    // styles
    api.addFiles([
        'styles/skeletor.scss',
        'styles/_panel.scss',
        'styles/_responsive.scss'
    ],
    ['client']);

    // templates
    api.addFiles([
        'templates/skelePanelDashboard.html',
        'templates/skeleLogin.html',
        'templates/skelePanelLayouts.html',
        'templates/elements/commonAssets.html',
        'templates/elements/skeleTooltip.html',
        'templates/elements/superUser.html',
        'templates/settings/settingCreate.html',
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
    api.addFiles([
        'i18n/en.i18n.json',
        'i18n/it.i18n.json'
    ], ['client', 'server']);


    // libraries
    api.addFiles([
        'lib/publish.js',
        'lib/methodsServer.js'
    ],
    ['server']);

    api.addFiles([
        'events/debugEvents.js',
        'helpers/panelHelpers.js',
        'helpers/commonAssetsHelpers.js',
        'events/panelEvents.js',
        'events/commonAssetsEvents.js'
    ],
    ['client']);

    api.addFiles([
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
        'lib/collections/users.js',
    ],
    ['client', 'server']);


    // exports
    api.export(['Skeletor']);
});

Npm.depends({
    'numeral': '2.0.4',
    'nested-property': '0.0.7'
});

Package.onTest(function(api) {
    api.use([
        'tinytest',
        'cerealkiller:skeletor'
    ]);

    api.addFiles('skeletor-tests.js');
});
