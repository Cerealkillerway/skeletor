// Lang bar
Template.langBar.events({
    "click .langFlag": function(event, template) {
        var newLang = $(event.target).closest(".langFlag").data("lang");

        changeRouteLang(newLang);
    }
});

//status bar
Template.statusBar.rendered = function() {
    this.visibility = new ReactiveVar(true);
    $('footer').css({marginBottom: '52px'});

    var self = this;
    var description = this.$('#statusDescription');
    var cleaner;

    this.$('.statusLabel').mouseover(function() {
        var id = $(this).attr('id');
        var name;

        if (id === 'statusBarVisibility') {
            if ($(this).children('i').first().html() === 'star') {
                name = TAPi18n.__('setAutohide_tooltip');
            }
            else {
                name = TAPi18n.__('setFixedMode_tooltip');
            }
        }
        else {
            name = TAPi18n.__(id + "_tooltip");
        }

        Meteor.clearTimeout(cleaner);
        description.html(name);
    });

    this.$('.statusLabel').mouseout(function() {
        cleaner = Meteor.setTimeout(function() {
            description.html('');
        }, 1500);
    });

    Tracker.autorun(function() {
        var $statusBar = $('#statusBar');
        description.html('');

        if (!self.visibility.get()) {
            $('footer').css({marginBottom: 0});

            $statusBar.mouseleave(function(event) {
                $statusBar.animate({bottom: '-52px'}, 200, function() {
                    if ($statusBar.children('.barActivator').length === 0) {
                        $statusBar.prepend('<div class="barActivator"></div>');

                        var $barActivator = $statusBar.children('.barActivator').first();
                        $barActivator.mouseenter(function(event) {
                            $statusBar.animate({bottom: 0}, 200);
                            $barActivator.remove();
                        });
                    }
                });
            });
        }
        else {
            $('footer').css({marginBottom: '52px'});
            $statusBar.unbind('mouseleave');
        }
    });
}
Template.statusBar.events({
    "click #disconnect": function(event, template) {
        Meteor.disconnect();
    },
    "click #reconnect": function(event, template) {
        Meteor.reconnect();
    },
    "click #statusBarVisibility": function(event, template) {
        var icon = template.$('#statusBarVisibility').children('i');

        if (icon.html() === 'star') {
            icon.html('star_border');
            template.visibility.set(false);
        }
        else {
            icon.html('star');
            template.visibility.set(true);
        }
    }
});
