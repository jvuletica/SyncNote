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
        self.maximize.setIcon(QtGui.QIcon('data/img/min-max.png'))

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
        self.setWindowTitle("Window Title")
        hbox=QtWidgets.QHBoxLayout(self)
        hbox.addWidget(label)
        hbox.addWidget(self.minimize)
        hbox.addWidget(self.maximize)
        hbox.addWidget(close)
        hbox.insertStretch(1,500)
        hbox.setSpacing(0)
        self.setSizePolicy(QtWidgets.QSizePolicy.Expanding,QtWidgets.QSizePolicy.Fixed)
        self.maxNormal=False

        close.clicked.connect(self.close)
        self.minimize.clicked.connect(self.showSmall)
        self.maximize.clicked.connect(self.showMaxRestore)


    def showSmall(self):
        syncnote.showMinimized()

    def showMaxRestore(self):
        if(self.maxNormal):
            syncnote.showNormal()
            self.maxNormal= False
            self.maximize.setIcon(QtGui.QIcon('data/img/min-max.png'))

        else:
            syncnote.showMaximized()
            self.maxNormal=  True
            self.maximize.setIcon(QtGui.QIcon('data/img/max-min.png'))

    def close(self):
        syncnote.close()

    def mousePressEvent(self,event):
        if event.button() == QtCore.Qt.LeftButton:
            syncnote.moving = True; syncnote.offset = event.pos()

    def mouseMoveEvent(self,event):
        if syncnote.moving: syncnote.move(event.globalPos()-syncnote.offset)

class Ui_Form(QtWidgets.QWidget):
    def __init__(self):
        QtWidgets.QWidget.__init__(self)
        self.setupUi(self)
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(900, 600)
        Form.setStyleSheet("background-color:#455A64;")
        self.setWindowIcon(QtGui.QIcon("data/img/sync.png"))

        self.verticalLayout = QtWidgets.QVBoxLayout(Form)
        self.verticalLayout.setObjectName("verticalLayout")
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)

        self.titleBar= TitleBar(self)
        self.verticalLayout.addWidget(self.titleBar)

        self.webView = QtWebKitWidgets.QWebView(Form)
        path = os.path.dirname(os.path.realpath("__file__"))
        #self.webView.setUrl(QtCore.QUrl.fromLocalFile(path + "/data/syncnote.html"))
        self.webView.setHtml(self.getNotes(), QtCore.QUrl.fromLocalFile(path + "/data/"))
        self.webView.setObjectName("webView")
        self.verticalLayout.addWidget(self.webView)

        self.setWindowFlags(QtCore.Qt.FramelessWindowHint)
        self.verticalLayout.setSpacing(0)

        self.retranslateUi(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))

    data_storage = []
    @QtCore.pyqtSlot(str, str)
    def addData(self, title, content):
        dict_data = {"title": title, "content": content}
        self.data_storage.append(dict_data.copy())

    @QtCore.pyqtSlot()
    def saveData(self):
        file = open("data/notes.txt", "w")
        for element in self.data_storage:
            if (file.tell()):
                file.write("\n")
            file.write(element["title"] + " = {")
            file.write(element["content"] + "}")
        file.close()

    @QtCore.pyqtSlot()
    def clearData(self):
        self.data_storage.clear()

    def appendHtml(self, title, content):
        html_element = '<div contenteditable="true" class="wrapper-dropdown">' \
        + title + '<img src="img/menu.png" class = "imgclick"/>' \
        + '<p contenteditable="true">' + content \
        + '</p></div>'
        print(html_element)

    def notesToHtml(self):
        try:
            file = open("data/notes.txt", "r")
            notes = file.read()
            file.close()
        except:
            return False
        #print(notes)
        while(len(notes)):
            title_start = 0
            title_end = notes.find("=") - 1
            content_start = notes.find("{") + 1
            content_end = notes.find("}")
            title = notes[title_start:title_end].strip("\n")
            content = notes[content_start:content_end]
            notes = notes[content_end + 1:]
            self.appendHtml(title, content)

    def getNotes(self):
        file = open("data/syncnote.html", "r")
        html = file.read()
        html_backup = html
        file.close()
        start_index = html.find('<div class = "wrapper">') \
        + len('<div class = "wrapper">')
        notes_html = self.notesToHtml()
        if(notes_html):
            print(notes_html)

        else:
            return(html_backup)

class Js_To_Qt(QtCore.QObject):
    @QtCore.pyqtSlot(str)
    def showMessage(self, message):
        print ("Message:", message)

if __name__ == '__main__':
    appSynNt = QtWidgets.QApplication(sys.argv)
    syncnote = Ui_Form()
    syncnote.move(QtWidgets.QApplication.desktop().screen().rect().center()
    - syncnote.rect().center());
    syncnote.show()
    #JQt_instance = Js_To_Qt()
    syncnote.webView.page().mainFrame().addToJavaScriptWindowObject("pyqtConnect",syncnote)
    exit = appSynNt.exec_()
    #syncnote.saveHTML()
    sys.exit(exit)
