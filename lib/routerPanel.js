import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


// login
FlowRouter.route('/login', {
    triggersEnter: [Skeletor.Utilities.checkLang],
    action: function(params, queryParams) {
        BlazeLayout.render('skelePanelNudeLayout', {main: 'skeleLogin'});
    }
});

FlowRouter.route('/panel', {
    action: function(params, queryParams) {
        FlowRouter.go('/panel/dashboard', {}, {lang: Skeletor.Utilities.getLang()});
    }
});

// panel group-route
Skeletor.PanelRoutes = FlowRouter.group({
    prefix: '/panel',
});

// test/debug page (the skelePanelTest template is defined on skeleform package)
Skeletor.PanelRoutes.route('/skeletest', {
    action: function(params, queryParams) {
        BlazeLayout.render('skelePanelLayout', {main: 'skelePanelTest'});
    }
});


// dashboard
Skeletor.PanelRoutes.route('/dashboard', {
    action: function(params, queryParams) {
        BlazeLayout.render('skelePanelLayout', {main: 'skelePanelDashboard'});
    }
});


// settings
Skeletor.PanelRoutes.route('/settings/update', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'settingCreate'});
    }
});


// application data
Skeletor.PanelRoutes.route('/application-data/update', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'applicationDataCreate'});
    }
});


// users
Skeletor.PanelRoutes.route('/users', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'usersList'});
    }
});
Skeletor.PanelRoutes.route('/users/create', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'userCreate'});
    }
});
Skeletor.PanelRoutes.route('/users/:username', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'userCreate'});
    }
});


// roles
Skeletor.PanelRoutes.route('/roles', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'rolesList'});
    }
});
Skeletor.PanelRoutes.route('/roles/create', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'roleCreate'});
    }
});
Skeletor.PanelRoutes.route('/roles/:name', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'roleCreate'});
    }
});


// sections
Skeletor.PanelRoutes.route('/sections/:itemLang', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'sectionsList'});
    }
});
Skeletor.PanelRoutes.route('/sections/:itemLang/create', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'sectionCreate'});
    }
});
Skeletor.PanelRoutes.route('/sections/:itemLang/:code', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'sectionCreate'});
    }
});


// pages
Skeletor.PanelRoutes.route('/pages/:itemLang', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'pagesList'});
    }
});
Skeletor.PanelRoutes.route('/pages/:itemLang/create', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'pageCreate'});
    }
});
Skeletor.PanelRoutes.route('/pages/:itemLang/:code', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'pageCreate'});
    }
});


// menus
Skeletor.PanelRoutes.route('/menus/:itemLang', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'menusList'});
    }
});
Skeletor.PanelRoutes.route('/menus/:itemLang/create', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'menuCreate'});
    }
});
Skeletor.PanelRoutes.route('/menus/:itemLang/:name', {
    action: function() {
        BlazeLayout.render('skelePanelLayout', {main: 'menuCreate'});
    }
});
