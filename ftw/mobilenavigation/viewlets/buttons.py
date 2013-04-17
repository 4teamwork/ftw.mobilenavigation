from plone.app.layout.viewlets.common import ViewletBase
from zope.component import getMultiAdapter
from zope.app.pagetemplate.viewpagetemplatefile import ViewPageTemplateFile


class MobileButtons(ViewletBase):

    render = ViewPageTemplateFile('buttons.pt')

    def buttons(self):
        context_state = getMultiAdapter(
            (self.context, self.request),
            name='plone_context_state')

        results = []
        for action in context_state.actions('mobile_buttons'):
            if action['allowed']:
                aid = action['id']
                results.append({
                        'title': action['title'],
                        'description': action['description'],
                        'action': action['url'],
                        'selected': False,
                        'icon': None,
                        'extra': {'id': aid,
                                  'separator': None},
                        'submenu': None, })
        return results
