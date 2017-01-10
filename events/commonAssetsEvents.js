// Lang bar
Template.langBar.events({
    'click .langFlag': function(event, template) {
        let newLang = $(event.target).closest('.langFlag').data('lang');

        Skeletor.Utilities.changeRouteLang(newLang);
    }
});

//status bar
Template.statusBar.rendered = function() {
    this.visibility = new ReactiveVar(false);
    $('footer').css({marginBottom: '52px'});

    let description = this.$('#statusDescription');
    let cleaner;

    this.$('.statusLabel').mouseover(function() {
        let id = $(this).attr('id');
        let name;

        if (id === 'statusBarVisibility') {
            if ($(this).children('i').first().html() === 'star') {
                name = TAPi18n.__('setAutohide_tooltip');
            }
            else {
                name = TAPi18n.__('setFixedMode_tooltip');
            }
        }
        else {
            name = TAPi18n.__(id + '_tooltip');
        }

        Meteor.clearTimeout(cleaner);
        description.html(name);
    });

    this.$('.statusLabel').mouseout(function() {
        cleaner = Meteor.setTimeout(function() {
            description.html('');
        }, 1500);
    });

    let $statusBar = $('#statusBar');

    function hideStatusBar() {
        $statusBar.animate({bottom: '-52px'}, 200, function() {
            if ($statusBar.children('.barActivator').length === 0) {
                $statusBar.prepend('<div class="barActivator"></div>');
            }
            var $barActivator = $statusBar.children('.barActivator').first();
            $barActivator.mouseenter(function(event) {
                $statusBar.animate({bottom: 0}, 200);
                $barActivator.remove();
            });

        });
    }

    Tracker.autorun(() => {
        description.html('');

        if (!this.visibility.get()) {
            $('footer').css({marginBottom: 0});

            hideStatusBar();

            $statusBar.mouseleave(function(event) {
                hideStatusBar();
            });
        }
        else {
            $('footer').css({marginBottom: '52px'});
            $statusBar.unbind('mouseleave');
        }
    });
};
Template.statusBar.events({
    'click #disconnect': function(event, template) {
        Meteor.disconnect();
    },
    'click #reconnect': function(event, template) {
        Meteor.reconnect();
    },
    'click #statusBarVisibility': function(event, template) {
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
