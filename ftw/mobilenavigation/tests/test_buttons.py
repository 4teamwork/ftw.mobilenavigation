from ftw.mobilenavigation.testing import MOBILE_NAVIGATION_INTEGRATION_TESTING
from zope.component import queryMultiAdapter
from zope.publisher.browser import BrowserView
from zope.viewlet.interfaces import IViewletManager
import unittest2 as unittest


class TestViewlet(unittest.TestCase):

    layer = MOBILE_NAVIGATION_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']

    def test_viewlet_is_present(self):
        """ looking up and updating the manager should list our viewlet
        """
        # we need a context and request
        request = self.portal.REQUEST
        context = self.portal

        view = BrowserView(context, request)
        manager = queryMultiAdapter((context, request, view),
                                    IViewletManager, 'plone.portalheader', default=None)
        manager.update()
        # check if viewlet is there
        self.assertIn('ftw.mobilenavigation.buttons',
                      [viewlet.__name__ for viewlet in manager.viewlets])
