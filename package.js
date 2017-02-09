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
        'kadira:blaze-layout@2.2.0',
        'fourseven:scss@3.2.0',
        'materialize:materialize@0.97.8'
    ],
    ['client']);

    api.use([
        'mongo',
        'session',
        'ecmascript',
        'tap:i18n@1.8.1',
        'underscore@1.0.0',
        'kadira:flow-router@2.8.0',
        'meteorhacks:subs-manager@1.6.2',
        'meteorhacks:fast-render@2.10.0',
        'momentjs:moment@2.10.6',
        'cerealkiller:skeleutils@1.0.0'
    ],
    ['client', 'server']);

    // need skeleform, but allow it to be loaded last
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
        'styles/_responsive.scss',
        'styles/gearLoader.scss'
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
    api.addFiles('package-tap.i18n');
    api.addFiles('i18n/it.i18n.json');
    api.addFiles('i18n/en.i18n.json');


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
        'lib/collections.js',
        'lib/routerPanel.js',
        'lib/methods.js',
        'lib/authMatch.js'
    ],
    ['client', 'server']);


    // exports
    api.export(['Skeletor']);
});

Npm.depends({
    'numeral': '2.0.4'
});

Package.onTest(function(api) {
    api.use([
        'tinytest',
        'cerealkiller:skeletor'
    ]);

    api.addFiles('skeletor-tests.js');
});




// UTILITIES
// get list of all files in a folder
function getFilesFromFolder(packageName, folder){
    // local imports
    var _ = Npm.require("underscore");
    var fs = Npm.require("fs");
    var path = Npm.require("path");
    // helper function, walks recursively inside nested folders and return absolute filenames
    function walk(folder){
        var filenames = [];
        // get relative filenames from folder
        var folderContent=fs.readdirSync(folder);
        // iterate over the folder content to handle nested folders
        _.each(folderContent,function(filename){
            // build absolute filename
            var absoluteFilename=folder + path.sep + filename;
            // get file stats
            var stat=fs.statSync(absoluteFilename);
            if (stat.isDirectory()){
                // directory case => add filenames fetched from recursive call
                filenames=filenames.concat(walk(absoluteFilename));
            }
            else {
                // file case => simply add it
                filenames.push(absoluteFilename);
            }
        });
        return filenames;
    }
    // save current working directory (something like "/home/user/projects/my-project")
    var cwd = process.cwd();
    // chdir to our package directory
    process.chdir("packages" + path.sep + packageName);
    // launch initial walk
    var result = walk(folder);
    // restore previous cwd
    process.chdir(cwd);
    return result;
}
