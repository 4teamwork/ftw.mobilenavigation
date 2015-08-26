from ftw.upgrade import UpgradeStep


class ApplyPrefixToCSS(UpgradeStep):
    """Apply prefix to css.
    """

    def __call__(self):
        self.install_upgrade_profile()
