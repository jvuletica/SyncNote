# setup skripta za py2exe program, služi za automatsko traženje i dodavanje librarya te kompajlanje aplikacije
# na taj način nisu potrebne dodatne instalacije qt-a, pyqt-a ili pythona kad se program pokreće na drugom kompjuteru
from distutils.core import setup
import py2exe
setup(windows=[{"script":"syncnote.py"}], \
    options={"py2exe":{"includes":["sip","PyQt5.QtPrintSupport", "PyQt5.QtNetwork", "PyQt5.QtWebKit"], "compressed":2, "optimize":2, "bundle_files": 1}}, zipfile=None)

    # navodi koja skripta je glavna za pokretanje kao "main()" u c/c++, koje librarye želim dodati, da ih bundla (smanji broj fileova što više)
    # te da ne zippira
