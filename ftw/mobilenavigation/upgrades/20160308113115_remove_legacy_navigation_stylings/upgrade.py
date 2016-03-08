from ftw.upgrade import UpgradeStep


class RemoveLegacyNavigationStylings(UpgradeStep):
    """Remove legacy navigation stylings.
    """

    def __call__(self):
        self.install_upgrade_profile()
