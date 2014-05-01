import zope.i18nmessageid


_ = zope.i18nmessageid.MessageFactory('ftw.mobilenavigation')


def initialize(context):
    """Initializer called when used as a Zope 2 product.

    This is referenced from configure.zcml. Regstrations as a "Zope 2 product"
    is necessary for GenericSetup profiles to work, for example.

    """
