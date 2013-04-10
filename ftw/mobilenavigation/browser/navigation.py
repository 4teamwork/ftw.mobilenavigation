from zope.publisher.browser import BrowserView


class UpdateMobileNavigation(BrowserView):

    def __call__(self):
        subnavi = '<ul>'
        for obj in self.context.getFolderContents(full_objects=True):
            subnavi += '<li class="%s"><a href="%s">%s</a></li>' % (
                self.get_css_classes(obj),
                obj.absolute_url(),
                obj.Title())
        subnavi += '</ul>'

        return subnavi

    def get_css_classes(self, obj):
        level = int(self.request.form.get('level', '1'))
        classes = []

        if not obj.isPrincipiaFolderish \
                or len(obj.objectIds()) == 0 \
                or level >= 2:
            classes.append('noChildren')
        classes.append('level%s' % level)
        return ' '.join(classes)
