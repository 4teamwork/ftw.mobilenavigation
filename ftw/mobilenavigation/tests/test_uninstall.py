from ftw.testing.genericsetup import apply_generic_setup_layer
from ftw.testing.genericsetup import GenericSetupUninstallMixin
from unittest2 import TestCase


@apply_generic_setup_layer
class TestDefaultGenericSetupUninstall(TestCase, GenericSetupUninstallMixin):

    package = 'ftw.mobilenavigation'


@apply_generic_setup_layer
class TestSlideGenericSetupUninstall(TestCase, GenericSetupUninstallMixin):

    package = 'ftw.mobilenavigation'
    install_profile_name = 'slide'
    install_dependencies = False

    def _install_package(self):
        self.setup_tool.runAllImportStepsFromProfile(
            self._make_profile_name('default'), ignore_dependencies=True)
        super(TestSlideGenericSetupUninstall, self)._install_package()
