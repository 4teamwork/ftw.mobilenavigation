from Products.CMFCore.utils import getToolByName


def uninstall(self):
    setup_tool = getToolByName(self, 'portal_setup')
    setup_tool.runAllImportStepsFromProfile(
        'profile-{0}:uninstall'.format('ftw.mobilenavigation'),
        ignore_dependencies=True)
