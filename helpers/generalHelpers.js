// General spacebar helpers
// ==========================================================================================
// console log
UI.registerHelper('log', function(context, options) {
    console.log(context);
});

// check if debug is enable
UI.registerHelper('debug', function(context, options) {
    if (Skeletor.configuration.debug) return true;
    return false;
});

// outputs the currentLang session variable
UI.registerHelper('currentLang', function() {
    return FlowRouter.getQueryParam("lang");
});

// outputs a link with currentLang queryParam
UI.registerHelper('currentLangLink', function(link) {
    var langQuery = "?lang=" + FlowRouter.getQueryParam("lang");
    if (link) {
        return link + langQuery;
    }
    return langQuery;
});

// outputs attribute from configuration object
UI.registerHelper('conf', function(context, options) {
    var pathShards = context.split('.');
    var result  = Skeletor.configuration;

    pathShards.forEach(function(shard, index) {
        result = result[shard];
    });
    return result;
});

// outputs special variables
UI.registerHelper('display', function(context, options) {
    switch (context) {
        case 'currentYear':
            return moment().format('YYYY');

        case 'connectionStatus':
            return TAPi18n.__(Meteor.status().status + '_lbl');
            break;
    }
});

// fetch cursor's attribute(s) as string (stripping out HTML)
UI.registerHelper('fetchAttributes', function(item, attributes, options) {
    if (!item || !item.fetch()[0] || !attributes) return "";

    var result = "";
    var separator = " ";
    item = item.fetch()[0];

    attributes = attributes.split('-');
    attributes.forEach(function(attribute, index) {
        if (index > 0) result = result + separator;
        result = result + item[attribute].replace(/<(?:.|\n)*?>/gm, '');
    });
    return result;
});


// remove HTML markup
UI.registerHelper('stripHtml', function(context, truncate) {
    if (context) return context.replace(/<(?:.|\n)*?>/gm, '');
});

// remove HTML markup from lang dependant attribute
UI.registerHelper("stripHtmlLang", function(context, attribute, truncate) {
    var lang = FlowRouter.getQueryParam("lang");
    var result;

    if (context && context[lang]) {
        result = context[lang][attribute].replace(/<(?:.|\n)*?>/gm, '');

        if (truncate) {
            result = result.substr(0, truncate);
        }
        return result;
    }
    else {
        if (attribute) {
            return attribute + ' (' + TAPi18n.__('translationTitleNoHTML_missing').toUpperCase() + ')';
        }
    }
});

// check if supplied username belongs to current logged user
UI.registerHelper('isMe', function(username, options) {
    if (username === Meteor.user().username) {
        return true;
    }
    else return false;
});

// check if supplied role is undeletable
UI.registerHelper('isUndeletableRole', function(role, options) {
    if ((role === "admin") || (role === "superuser")) {
        return true;
    }
    else return false;
});