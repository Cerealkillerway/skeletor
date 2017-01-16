// check authorizations for general panel access
Skeletor.Utilities.checkAuth = function(current) {
    if (!Meteor.userId() || !checkPermissions('panelAccess', Meteor.userId())) {
        return FlowRouter.go(Skeletor.configuration.login.defaultLoginPath, {}, {lang: Skeletor.Utilities.getLang()});
    }
};

// check if lang queryParam is defined, or set it to defaultLang
Skeletor.Utilities.checkLang = function() {
    'use strict';
    let requestedLang = FlowRouter.current().queryParams.lang;

    if (!requestedLang) {
        FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
    }
    else {
        if (!Skeletor.GlobalConf.langEnable[requestedLang]) {
            FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
        }
    }
};

// returns the current lang or the default one
Skeletor.Utilities.getLang = function() {
    'use strict';
    let lang = FlowRouter.current().queryParams.lang;

    if (!lang) {
        lang = Skeletor.configuration.lang.default;
    }
    return lang;
};

// global subscriptions
FlowRouter.subscriptions = function() {
};




// login
FlowRouter.route('/login', {
    triggersEnter: [Skeletor.Utilities.checkLang],
    action: function(params, queryParams) {
        BlazeLayout.render('login');
    }
});

FlowRouter.route('/panel', {
    triggersEnter: [Skeletor.Utilities.checkAuth],
    action: function(params, queryParams) {
        FlowRouter.go('/panel/dashboard', {}, {lang: Skeletor.Utilities.getLang()});
    }
});

// panel group-route
Skeletor.PanelRoutes = FlowRouter.group({
    prefix: '/panel',
    triggersEnter: [Skeletor.Utilities.checkAuth, Skeletor.Utilities.checkLang],
});


// dashboard
Skeletor.PanelRoutes.route('/dashboard', {
    action: function(params, queryParams) {
        BlazeLayout.render('panelLayout', {main: 'dashboard'});
    }
});


// users
Skeletor.PanelRoutes.route('/users', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'usersList'});
    }
});
Skeletor.PanelRoutes.route('/users/create', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'userCreate'});
    }
});
Skeletor.PanelRoutes.route('/users/:username', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'userCreate'});
    }
});


// roles
Skeletor.PanelRoutes.route('/roles', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'rolesList'});
    }
});
Skeletor.PanelRoutes.route('/roles/create', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'roleCreate'});
    }
});
Skeletor.PanelRoutes.route('/roles/:name', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'roleCreate'});
    }
});


// sections
Skeletor.PanelRoutes.route('/sections/:itemLang', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'sectionsList'});
    }
});
Skeletor.PanelRoutes.route('/sections/:itemLang/create', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'sectionCreate'});
    }
});
Skeletor.PanelRoutes.route('/sections/:itemLang/:code', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'sectionCreate'});
    }
});


// pages
Skeletor.PanelRoutes.route('/pages/:itemLang', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'pagesList'});
    }
});
Skeletor.PanelRoutes.route('/pages/:itemLang/create', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'pageCreate'});
    }
});
Skeletor.PanelRoutes.route('/pages/:itemLang/:code', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'pageCreate'});
    }
});


// menus
Skeletor.PanelRoutes.route('/menus/:itemLang', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'menusList'});
    }
});
Skeletor.PanelRoutes.route('/menus/:itemLang/create', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'menuCreate'});
    }
});
Skeletor.PanelRoutes.route('/menus/:itemLang/:code', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'menuCreate'});
    }
});
