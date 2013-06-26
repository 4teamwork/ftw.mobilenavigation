from ftw.upgrade import UpgradeStep


class Upgrade(UpgradeStep):
    """Upgrade navigation action url
    """

    def __call__(self):
        self.setup_install_profile(
            'profile-ftw.mobilenavigation.upgrades:1010')
