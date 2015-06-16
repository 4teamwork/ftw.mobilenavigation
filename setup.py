from setuptools import setup, find_packages
import os

version = '1.4.2'

maintainer = 'Julian Infanger'

tests_require = [
    'ftw.testing',
    'plone.app.testing',
    ]

setup(name='ftw.mobilenavigation',
      version=version,
      description="Defines a special navigation.",
      long_description=open("README.rst").read() + "\n" + \
          open(os.path.join("docs", "HISTORY.txt")).read(),

      # Get more strings from
      # http://www.python.org/pypi?%3Aaction=list_classifiers

      classifiers=[
        'Framework :: Plone',
        'Framework :: Plone :: 4.1',
        'Framework :: Plone :: 4.2',
        'Framework :: Plone :: 4.3',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        ],

      keywords='plone ftw content templates',
      author='4teamwork AG',
      author_email='mailto:info@4teamwork.ch',
      maintainer=maintainer,
      url='https://github.com/4teamwork/ftw.mobilenavigation',
      license='GPL2',

      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['ftw'],
      include_package_data=True,
      zip_safe=False,

      install_requires=[
        'setuptools',
        'ftw.upgrade',
        'Missing',
        ],
      tests_require=tests_require,
      extras_require=dict(tests=tests_require),

      entry_points="""
# -*- Entry points: -*-
[z3c.autoinclude.plugin]
target = plone
""",
      )
