from Acquisition import aq_inner, aq_parent
from plone.app.layout.navigation.defaultpage import isDefaultPage
from Products.CMFCore.ActionInformation import ActionInfo
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.interfaces.siteroot import IPloneSiteRoot
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.component import getMultiAdapter
from zope.i18n import translate
from zope.publisher.browser import BrowserView
import cgi
import Missing


def escape_html(text):
    return cgi.escape(text)


class UpdateMobileNavigation(BrowserView):

    def __call__(self):
        # Disable theming for ajax requests
        self.request.response.setHeader('X-Theme-Disabled', 'True')

        properties = getToolByName(self.context, 'portal_properties')
        view_action_types = properties.site_properties.getProperty(
            'typesUseViewActionInListings', ())

        context = self.context
        if isDefaultPage(aq_parent(aq_inner(context)), context):
            # When asked for the navigation of a default page, return
            # the navigation of its parent, because the user is actually
            # on the parent but viewing the default page and the base-url
            # makes the request be fired on the default page.
            context = aq_parent(aq_inner(context))

        subnavi = '<ul>'
        level = int(self.request.form.get('level', '1'))
        if level == 0:
            subnavi = '<ul id="portal-globalnav" class="mobileNavigation">'
        for obj in self.sub_objects(context, level=level):
            is_action = isinstance(obj, ActionInfo)
            if is_action:
                url = obj['url']
                title = translate(obj['title'], context=self.request)
            else:
                url = obj.absolute_url()
                title = obj.Title()
            if not is_action and obj.portal_type in view_action_types:
                url = obj.absolute_url() + '/view'
            subnavi += '<li class="%s"><a href="%s">%s</a></li>' % (
                self.get_css_classes(obj),
                url,
                escape_html(title))
        subnavi += '</ul>'
        return subnavi

    def sub_objects(self, parent, level=0, query=None):
        """ Returns the sub objects of a given parent.
        Checks if the objects should be listed in navi.
        """
        # if the parent is the portal and its not level 0,
        # return no children
        portal = getToolByName(self.context, 'portal_url').getPortalObject()
        if parent == portal and level > 0:
            return []

        if isinstance(parent, ActionInfo):
            return []

        objs = []
        properties = getToolByName(self.context, 'portal_properties')
        hidden_types = properties.navtree_properties.metaTypesNotToList
        for brain in parent.getFolderContents(contentFilter=query):
            if brain.portal_type in hidden_types:
                continue
            if getattr(brain, 'exclude_from_nav', False) \
                    not in [Missing.Value, False]:
                continue

            obj = brain.getObject()
            if isDefaultPage(aq_parent(aq_inner(obj)), obj):
                continue

            objs.append(obj)

        if parent == portal:
            self.prepend_actions(objs)

        return objs

    def get_css_classes(self, obj):
        """ Returns classes for an navigation entry.
        Checks if the content is folderish and have children.
        Also adds the navigation depth.
        """
        level = int(self.request.form.get('level', '1'))
        classes = []

        if isinstance(obj, ActionInfo) \
                or not obj.isPrincipiaFolderish \
                or len(self.sub_objects(obj)) == 0 \
                or level >= 2:
            classes.append('noChildren')
        classes.append('level%s' % level)
        return ' '.join(classes)

    def prepend_actions(self, items):
        """ Taken from the `topLevelTabs` method."""
        portal = getToolByName(self.context, 'portal_url').getPortalObject()
        context_state = getMultiAdapter((portal, self.request),
                                        name=u'plone_context_state')
        actions = context_state.actions('portal_tabs')
        actions.reverse()
        if actions is not None:
            for actionInfo in actions:
                data = actionInfo.copy()
                data['absolute_url'] = data['url']
                data['Title'] = data['title']
                items.insert(0, data)


class SliderNavigation(UpdateMobileNavigation):

    template = ViewPageTemplateFile('slider.pt')

    def __call__(self):
        # Disable theming for ajax requests
        self.request.response.setHeader('X-Theme-Disabled', 'True')

        context = self.context
        if isDefaultPage(aq_parent(aq_inner(context)), context):
            # When asked for the navigation of a default page, return
            # the navigation of its parent, because the user is actually
            # on the parent but viewing the default page and the base-url
            # makes the request be fired on the default page.
            context = aq_parent(aq_inner(context))

        self.parent = None
        if not IPloneSiteRoot.providedBy(context):
            self.parent = aq_parent(aq_inner(context))

        self.children = self.sub_objects(context)

        return self.template()
