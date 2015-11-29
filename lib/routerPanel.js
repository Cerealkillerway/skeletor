// check authorizations for general panel access
function checkAuth(current) {
    if (!Meteor.userId() || !checkPermissions("panelAccess", Meteor.userId())) {
        return FlowRouter.go(Skeletor.configuration.login.defaultLoginPath, {}, {lang: getLang()});
    }    
}

// check if lang queryParam is defined, or set it to defaultLang
function checkLang() {
    var requestedLang = FlowRouter.current().queryParams.lang;

    if (!requestedLang) {
        FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
    }
    else {
        if (!Skeletor.GlobalConf.langEnable[requestedLang]) {
            FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
        }
    }
}

// returns the current lang or the default one
function getLang() {
    var lang = FlowRouter.current().queryParams.lang;

    if (!lang) {
        lang = Skeletor.configuration.lang.default;
    }
    return lang;
}



// login
FlowRouter.route('/login', {
    triggersEnter: [checkLang],
    action: function(params, queryParams) {
        BlazeLayout.render("login");
    }
});

FlowRouter.route("/panel", {
    triggersEnter: [checkAuth],
    action: function(params, queryParams) {
        FlowRouter.go("/panel/dashboard", {}, {lang: getLang()});
    }
});

// panel group-route
var PanelRoutes = FlowRouter.group({
    prefix: "/panel",
    triggersEnter: [checkAuth, checkLang],
});


// ======= PANEL ROUTES ==============================================>
//dashboard
PanelRoutes.route('/dashboard', {
    action: function(params, queryParams) {
        BlazeLayout.render("panelLayout", {main: "dashboard"});
    } 
});


// users
// =======================================================================
PanelRoutes.route('/users', {
    subscriptions: function(params, queryParams) {
        var options = {};
        options.fields = {
            username: 1,
            "profile.roles": 1
        };
        this.register("usersList", subman.subscribe("findDocuments", 'Users', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'usersList'});
    } 
});
PanelRoutes.route('/users/create', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                username: 1
            };

        this.register("usernames", subman.subscribe("findDocuments", 'Users', {}, options));
        this.register("roles", subman.subscribe("findDocuments", "Roles", {}, {}));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "userCreate"});
    } 
});
PanelRoutes.route('/users/:username', {
    subscriptions: function(params, queryParams) {
        var query = {};
        var options = {};
            options.fields = {
                username: 1
            };

        query.username = params.username;

        this.register("user", subman.subscribe("findDocuments", 'Users', query, {}, true));
        this.register("usernames", subman.subscribe("findDocuments", 'Users', {}, options));
        this.register("roles", subman.subscribe("findDocuments", "Roles", {}, {}));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "userCreate"});
    } 
});


// roles
// =======================================================================
PanelRoutes.route('/roles', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                name: 1
            };

        this.register("rolesList", subman.subscribe("findDocuments", 'Roles', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'rolesList'});
    } 
});
PanelRoutes.route('/roles/create', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                name: 1
            };

        this.register("roleNames", subman.subscribe("findDocuments", 'Roles', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "roleCreate"});
    } 
});
PanelRoutes.route('/roles/:name', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                name: 1
            };

        this.register("roleNames", subman.subscribe("findDocuments", 'Roles', {}, options));
        this.register("role", subman.subscribe("findDocuments", "Roles", {}, {}, true));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "roleCreate"});
    } 
});


// pages
// =======================================================================
PanelRoutes.route('/pages/:itemLang', {
    subscriptions: function(params, queryParams) {
        var options = {};
        options.fields = {};
        options.fields[params.itemLang + '.code'] = 1;
        options.fields[params.itemLang + '.title'] = 1;

        this.register("pagesList", subman.subscribe("findDocuments", 'Pages', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pagesList"});
    } 
});
PanelRoutes.route('/pages/:itemLang/create', {
    subscriptions: function(params, queryParams) {
        var options = {};
            options.fields = {};
        
        options.fields[params.itemLang + '.code'] = 1;

        this.register("pageCodes", subman.subscribe("findDocuments", 'Pages', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pageCreate"});
    } 
});
PanelRoutes.route('/pages/:itemLang/:code', {
    subscriptions: function(params, queryParams) {
        var query = {};
        var options = {};
            options.fields = {};

        query[params.itemLang + '.code'] = params.code;
        options.fields[params.itemLang + '.code'] = 1;
        options.fields[queryParams.lang + '.title'] = 1;

        this.register("pageData", subman.subscribe("findDocuments", 'Pages', query, {}, true));
        this.register("pageCodes", subman.subscribe("findDocuments", 'Pages', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pageCreate"});
    } 
});



// ======= END PANEL ROUTES ===================================




// 404 catchall route (must be the last one!)
PanelRoutes.route('/(.*)', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: "404"});
    }
});