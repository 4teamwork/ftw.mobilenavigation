from plone.app.testing import applyProfile
from plone.app.testing import IntegrationTesting, FunctionalTesting
from plone.app.testing import login
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import TEST_USER_NAME
from zope.configuration import xmlconfig


class MobileNavigationLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load ZCML

        import ftw.mobilenavigation
        xmlconfig.file('configure.zcml',
                       ftw.mobilenavigation,
                       context=configurationContext)

    def setUpPloneSite(self, portal):
        login(portal, TEST_USER_NAME)
        # Install into Plone site using portal_setup
        applyProfile(portal, 'ftw.mobilenavigation:default')


MOBILE_NAVIGATION_TAGS_FIXTURE = MobileNavigationLayer()
MOBILE_NAVIGATION_INTEGRATION_TESTING = IntegrationTesting(
    bases=(MOBILE_NAVIGATION_TAGS_FIXTURE,),
    name="ftw.mobilenavigation:integration")
MOBILE_NAVIGATION_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(MOBILE_NAVIGATION_TAGS_FIXTURE,),
    name="ftw.mobilenavigation:functional")
