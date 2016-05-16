Package.describe({
    name: 'cerealkiller:skeletor',
    version: '0.9.7',
    // Brief, one-line summary of the package.
    summary: 'CRUD app skeleton!',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    // namespace
    api.addFiles('namespace.js');

    // packages
    api.use('mongo');
    api.use('session');
    api.use('jquery', 'client');
    api.use('blaze-html-templates', 'client');
    api.use('underscore@1.0.0');
    api.use('kadira:flow-router@2.8.0');
    api.use('kadira:blaze-layout@2.2.0', 'client');
    api.use('meteorhacks:subs-manager@1.6.2');
    api.use('meteorhacks:fast-render@2.10.0');
    api.use('fourseven:scss@3.2.0', 'client');
    api.use('tap:i18n@1.7.0');
    api.use('momentjs:moment@2.10.6');
    api.use('materialize:materialize@0.97.3', 'client');
    api.use('cerealkiller:utils@1.0.0');
    // need skeleform, but allow it to be loaded last
    api.use('cerealkiller:skeleform@0.0.3', {unordered: true});
    api.use('cerealkiller:skelelist@0.0.2', {unordered: true});
    api.use('cerealkiller:skelesite@0.0.1', {unordered: true});


    // exports
    api.export('Skeletor');   // package namespace

    // styles
    api.addFiles('styles/skeletor.scss', 'client');
    api.addFiles('styles/_panel.scss', 'client');
    api.addFiles('styles/_responsive.scss', 'client');
    api.addFiles('styles/gearLoader.scss', 'client');


    // templates
    api.addFiles('templates/commonAssets.html', 'client');
    api.addFiles('templates/dashboard.html', 'client');
    api.addFiles('templates/login.html', 'client');
    api.addFiles('templates/panelLayouts.html', 'client');

    api.addFiles(['templates/users/usersList.html', 'templates/users/userCreate.html'], 'client');
    api.addFiles(['templates/roles/rolesList.html', 'templates/roles/roleCreate.html'], 'client');
    api.addFiles(['templates/sections/sectionsList.html', 'templates/sections/sectionCreate.html'], 'client');
    api.addFiles(['templates/pages/pagesList.html', 'templates/pages/pageCreate.html'], 'client');
    api.addFiles(['templates/menus/menusList.html', 'templates/menus/menuCreate.html'], 'client');

    api.addFiles('templates/debug.html', 'client');


    // i18n
    api.addFiles('i18n/it.i18n.json');
    api.addFiles('i18n/en.i18n.json');


    // libraries
    api.addFiles('lib/publish.js', 'server');
    api.addFiles('lib/main-init.js');
    api.addFiles('lib/collections.js');
    api.addFiles('lib/routerPanel.js');
    api.addFiles('lib/methods.js');
    api.addFiles('lib/methodsServer.js', 'server');
    api.addFiles('lib/permissions.js');
    api.addFiles('lib/clientUtilities.js', 'client');
    api.addFiles('lib/ckMaterializeOverrides.js', 'client');
    api.addFiles('events/debugEvents.js', 'client');

    api.addFiles('helpers/generalHelpers.js', 'client');
    api.addFiles('helpers/panelHelpers.js', 'client');
    api.addFiles('helpers/commonAssetsHelpers.js', 'client');

    api.addFiles('events/panelEvents.js', 'client');
    api.addFiles('events/commonAssetsEvents.js', 'client');

});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('cerealkiller:skeletor');
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
