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
        if (!GlobalConf.langEnable[requestedLang]) {
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



//login
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


//users
//=======================================================================
PanelRoutes.route('/users', {
    subscriptions: function(params, queryParams) {
        var options = {};
        options.fields = {
            _id: 1,
            username: 1,
            "profile.roles": 1
        };
        this.register("usersList", subman.subscribe("findUsers", {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'usersList'})
    } 
});
PanelRoutes.route('/users/create', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                username: 1
            }

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
                username: 1,
                roles: 1
            };

        query.username = params.username;

        this.register("usersList", subman.subscribe("findUsers", {}, options));
        this.register("roles", subman.subscribe("findDocuments", "Roles", {}, {}));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "userCreate"});
    } 
});


//roles
//=======================================================================
PanelRoutes.route('/roles', {
    subscriptions: function() {
        return subman.subscribe("allRoles");
    },
    data: function() {
        return Data.Roles.find({});
    },
    action: function() {
        //this.layout('panelLayout');
        //this.render('rolesList');
    } 
});
PanelRoutes.route('/roles/create', {
    subscriptions: function() {
        //load role list to be able to check for already taken role name
        return subman.subscribe("allRoles");
    },
    data: function() {
        var context = {};
        context.schema = Schemas.Roles_default;
        return context;
    },
    action: function() {
        //this.layout('panelLayout');
        //this.render('roleCreate');
    } 
});
PanelRoutes.route('/roles/:name', {
    subscriptions: function() {
        return subman.subscribe("allRoles");
    },
    data: function() {
        var context = {};
        var params = this.params;

        context.item = Data.Roles.findOne({name: params.name});
        context.schema = Schemas.Roles_default;

        skeleformSetContext(context);
        return context;
    },
    action: function() {
        //this.layout('panelLayout');
        //this.render('roleCreate');
    } 
});


//pages
//=======================================================================
PanelRoutes.route('/pages', {
    subscriptions: function(params, queryParams) {
        var options = {};
        options.fields = {
            _id: 1,
            code: 1
        };
        options.fields[queryParams.lang + '.title'] = 1;
        this.register("pagesList", subman.subscribe("findDocuments", 'Pages', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pagesList"});
    } 
});
PanelRoutes.route('/pages/create', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                code: 1
            };
            
        this.register("pageCodes", subman.subscribe("findDocuments", 'Pages', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pageCreate"});
    } 
});
PanelRoutes.route('/pages/:code', {
    subscriptions: function(params, queryParams) {
        var query = {};
        var options = {};
            options.fields = {
                code: 1
            };

        query.code = params.code;

        this.register("pageData", subman.subscribe("findDocuments", 'Pages', query, {}, true));
        this.register("pageCodes", subman.subscribe("findDocuments", 'Pages', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pageCreate"});
    } 
});



// ======= END PANEL ROUTES ===================================




//404 catchall route (must be the last one!)
PanelRoutes.route('/(.*)', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: "404"});
    }
});