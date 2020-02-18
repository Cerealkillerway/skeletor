Template.skelePanelFooter.onRendered(function() {
    SkeleUtils.GlobalEvents.TooltipOnRendered(this);
});
Template.skelePanelFooter.onDestroyed(function() {
    SkeleUtils.GlobalEvents.TooltipOnDestroyed(this);
});
