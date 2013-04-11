from ftw.mobilenavigation.testing import MOBILE_NAVIGATION_FUNCTIONAL_TESTING
from plone.app.testing import TEST_USER_ID, TEST_USER_NAME, TEST_USER_PASSWORD
from plone.app.testing import login, setRoles
from plone.testing.z2 import Browser
import transaction
import unittest2 as unittest


class TestSetup(unittest.TestCase):

    layer = MOBILE_NAVIGATION_FUNCTIONAL_TESTING

    def setUp(self):
        portal = self.layer['portal']
        login(portal, TEST_USER_NAME)
        setRoles(portal, TEST_USER_ID, ['Manager'])
        self.browser = Browser(self.layer['app'])
        self.folder = portal[portal.invokeFactory(id='folder',
                                                  type_name='Folder')]
        transaction.commit()

    def _open_url(self, url):
        self.browser.addHeader('Authorization', 'Basic %s:%s' % (
                TEST_USER_NAME, TEST_USER_PASSWORD))
        self.browser.open(url)

    def test_default_navigation(self):
        self._open_url(self.folder.absolute_url())
        self.assertNotIn('mobileNavigation', self.browser.contents)
