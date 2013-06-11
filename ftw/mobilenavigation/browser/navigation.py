import Missing
from Products.CMFCore.utils import getToolByName
from zope.publisher.browser import BrowserView


class UpdateMobileNavigation(BrowserView):

    def __call__(self):
        subnavi = '<ul>'
        level = int(self.request.form.get('level', '1'))
        if level == 0:
            subnavi = '<ul id="portal-globalnav" class="mobileNavigation">'
        for obj in self.sub_objects(self.context, level=level):
            subnavi += '<li class="%s"><a href="%s">%s</a></li>' % (
                self.get_css_classes(obj),
                obj.absolute_url(),
                obj.Title())
        subnavi += '</ul>'
        return subnavi

    def sub_objects(self, parent, level=0):
        """ Returns the sub objects of a given parent.
        Checks if the objects should be listed in navi.
        """
        # if the parent is the portal and its not level 0,
        # return no children
        portal = getToolByName(self.context, 'portal_url').getPortalObject()
        if parent == portal and level > 0:
            return []
        objs = []
        properties = getToolByName(self.context, 'portal_properties')
        hidden_types = properties.navtree_properties.metaTypesNotToList
        for brain in parent.getFolderContents():
            if brain.portal_type not in hidden_types:
                if getattr(brain, 'exclude_from_nav', False) in [Missing.Value, False]:
                    obj = brain.getObject()
                    objs.append(obj)
        return objs

    def get_css_classes(self, obj):
        """ Returns classes for an navigation entry.
        Checks if the content is folderish and have children.
        Also adds the navigation depth.
        """
        level = int(self.request.form.get('level', '1'))
        classes = []

        if not obj.isPrincipiaFolderish \
                or len(self.sub_objects(obj)) == 0 \
                or level >= 2:
            classes.append('noChildren')
        classes.append('level%s' % level)
        return ' '.join(classes)
