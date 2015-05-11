#! /usr/bin/env python3
from PyQt5 import QtCore, QtGui, QtWidgets, QtWebKitWidgets
import os, sys

class TitleBar(QtWidgets.QDialog):
    def __init__(self, parent=None):
        QtWidgets.QWidget.__init__(self, parent)
        self.setWindowFlags(QtCore.Qt.FramelessWindowHint)
        titleBarStyle = """
     
        QWidget {
        background-color: #455A64;
        color:white;
        font:12px;
        border: none;
        height: 11px;
        }
        QToolButton:hover {
        background-color: #263238;
        border-radius: 9px;
        }"""

        self.setStyleSheet(titleBarStyle)

        self.minimize=QtWidgets.QToolButton(self)
        self.minimize.setIcon(QtGui.QIcon('data/img/min.png'))

        self.maximize=QtWidgets.QToolButton(self)
        self.maximize.setIcon(QtGui.QIcon('data/img/up.png'))

        close=QtWidgets.QToolButton(self)
        close.setIcon(QtGui.QIcon('data/img/close.png'))

        self.minimize.setMinimumHeight(20)
        self.minimize.setMinimumWidth(20)
        close.setMinimumHeight(20)
        close.setMinimumWidth(20)
        self.maximize.setMinimumHeight(20)
        self.maximize.setMinimumWidth(20)

        label=QtWidgets.QLabel(self)
        label.setText(" SyncNote")
        label.setToolTip("Author: Josip Vuletić Antić")
        hbox=QtWidgets.QHBoxLayout(self)
        hbox.addWidget(label)
        hbox.addWidget(self.minimize)
        hbox.addWidget(self.maximize)
        hbox.addWidget(close)
        hbox.insertStretch(1,500)
        hbox.setSpacing(0)
        self.setSizePolicy(QtWidgets.QSizePolicy.Expanding,QtWidgets.QSizePolicy.Fixed)

        close.clicked.connect(self.close)
        self.minimize.clicked.connect(self.showSmall)
        self.maximize.clicked.connect(self.showMaxRestore)


    def showSmall(self):
        syncnote.hide()
        #syncnote.showMinimized()

    def showMaxRestore(self):
        if(syncnote.isMaximized()):
            syncnote.showNormal()
            self.maximize.setIcon(QtGui.QIcon("data/img/up.png"))

        else:
            syncnote.showMaximized()
            self.maximize.setIcon(QtGui.QIcon("data/img/max-min.png"))

    def close(self):
        syncnote.sysTray.hide()
        syncnote.close()

    def mousePressEvent(self,event):
        if event.button() == QtCore.Qt.LeftButton:
            syncnote.moving = True; syncnote.offset = event.pos()

    def mouseMoveEvent(self,event):
        if syncnote.moving: syncnote.move(event.globalPos()-syncnote.offset)

class Ui_Form(QtWidgets.QWidget):
    save_location = "data"
    autosave_state = "enabled"
    autosave_interval = "2500"
    def __init__(self):
        QtWidgets.QWidget.__init__(self)
        self.setupUi(self)
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(900, 600)
        Form.setStyleSheet("background-color:#455A64;")
        self.setWindowIcon(QtGui.QIcon("data/img/syncnote_icon.png"))

        self.verticalLayout = QtWidgets.QVBoxLayout(Form)
        self.verticalLayout.setObjectName("verticalLayout")
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)

        self.titleBar= TitleBar(self)
        self.verticalLayout.addWidget(self.titleBar)

        self.webView = QtWebKitWidgets.QWebView(Form)
        path = os.path.dirname(os.path.realpath("__file__"))
        self.webView.setHtml(self.getHTML(), QtCore.QUrl.fromLocalFile(path + "/data/"))
        self.webView.setObjectName("webView")
        self.verticalLayout.addWidget(self.webView)

        self.setWindowFlags(QtCore.Qt.FramelessWindowHint)
        self.verticalLayout.setSpacing(0)
        self.sysTray = QtWidgets.QSystemTrayIcon(self)
        self.sysTray.setIcon(QtGui.QIcon("data/img/syncnote_icon.png"))
        self.sysTray.show()
        self.sysTray.activated.connect(self.show)

        self.retranslateUi(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "SyncNote"))

    @QtCore.pyqtSlot(result=str)
    def setSaveLocation(self):
        newSaveLocation = QtWidgets.QFileDialog.getExistingDirectory()
        if newSaveLocation:
            return newSaveLocation

    @QtCore.pyqtSlot(result=str)
    def returnInterval(self):
        return self.autosave_interval

    @QtCore.pyqtSlot(result=str)    
    def returnAutosaveState(self):
        return self.autosave_state

    @QtCore.pyqtSlot(result=str)    
    def returnSaveLocation(self):
        return self.save_location

    @QtCore.pyqtSlot(str, str, str)
    def jsSettingsToPy(self, autosave_interval, autosave_state, save_location):
        self.autosave_interval = autosave_interval
        self.autosave_state = autosave_state
        self.save_location = save_location

    @QtCore.pyqtSlot(str)
    def saveNotes(self, notes):
        file = open(self.save_location + "/notes.html", "w")
        file.write(notes)
        file.close()

    def getNotes(self):
        try:
            file = open(self.save_location + "/notes.html","r")
            notes = file.read()
            file.close()
            return notes
        except:
            return False

    def getHTML(self):
        self.loadSettings()
        file = open("data/syncnote.html", "r")
        html_backup = file.read()
        file.close()
        notes = self.getNotes()
        if(notes):
            container = '<div id="note-container">'
            index = html_backup.find(container) + len(container)
            html = html_backup[:index] + notes + html_backup[index:]
            return html
        else:
            return html_backup

    def loadSettings(self):
        try:
            file = open("data/settings", "r")
            lines = [line.strip().split(" = ") for line in file]
            self.save_location = lines[0][1]
            self.autosave_state = lines[1][1]
            self.autosave_interval = lines[2][1]
        except:
            return False

    @QtCore.pyqtSlot()
    def saveSettings(self):
        file = open("data/settings", "w")
        file.write("Save location = " + self.save_location + "\n")
        file.write("Autosave = " + self.autosave_state + "\n")
        file.write("Autosave interval = " + self.autosave_interval)
        file.close()

class Js_To_Qt(QtCore.QObject):
    @QtCore.pyqtSlot(str)
    def showMessage(self, message):
        print ("Message:", message)

if __name__ == '__main__':
    appSynNt = QtWidgets.QApplication(sys.argv)
    syncnote = Ui_Form()
    syncnote.move(QtWidgets.QApplication.desktop().screen().rect().center()
    - syncnote.rect().center())
    syncnote.sysTray.showMessage("SyncNote","Started in system tray.", 1, 2000)
    #syncnote.show()
    syncnote.webView.page().mainFrame().addToJavaScriptWindowObject("pyQtConnect",syncnote)
    exit = appSynNt.exec_()
    sys.exit(exit)
