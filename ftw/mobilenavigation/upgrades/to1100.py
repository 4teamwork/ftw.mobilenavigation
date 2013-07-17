from ftw.upgrade import UpgradeStep


class Upgrade(UpgradeStep):
    """Enable expandable navigation as default.
    """

    def __call__(self):
        self.setup_install_profile(
            'profile-ftw.mobilenavigation.upgrades:1100')
