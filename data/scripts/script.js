$(function() {

    function editorCommand(command) {
        document.execCommand(command, false, null);
    }
    function addNote() {
        $("#note-container").prepend($(''
        + '<div class="note">'
        + '<div class="note-controls-wrapper">'
        + '<div id="calendar-btn" class="note-controls"></div>'
        + '<div id="remove-note-btn" class="note-controls"></div>'
        + '</div>'
        + '<p class="note-content"></p>'
        + '</div>').fadeIn(200));
    }
    $("#bold").on("click", function() {
        editorCommand("bold");
    });
    $("#italic").on("click", function() {
        editorCommand("italic");
    });
    $("#underline").on("click", function() {
        editorCommand("underline");
    });
    $("#strikethrough").on("click", function() {
        editorCommand("strikethrough");
    });
    $("#outdent").on("click", function() {
        editorCommand("outdent");
    });
    $("#indent").on("click", function() {
        editorCommand("indent");
    });
    $("#subscript").on("click", function() {
        editorCommand("subscript");
    });
    $("#superscript").on("click", function() {
        editorCommand("superscript");
    });
    $("#removeformat").on("click", function() {
        editorCommand("removeFormat");
    });
    $("#align_left").on("click", function() {
        editorCommand("justifyLeft");
    });
    $("#align_center").on("click", function() {
        editorCommand("justifyCenter");
    });
    $("#align_right").on("click", function() {
        editorCommand("justifyRight");
    });
    $("#align_justify").on("click", function() {
        editorCommand("justifyFull");
    });
    $("#undo").on("click", function() {
        editorCommand("undo");
    });
    $("#redo").on("click", function() {
        editorCommand("redo");
    });

    $("button").on("click",function() {
        $(this).fadeOut(160, function() {
            $(this).fadeIn(160);
        });
    })

    $("#add").on("click", function() {
        addNote();
    });

    $("#note-container").on("click", "#remove-note-btn", function() {
        $(this).parent().parent().attr("id", "remove");
        alertify.confirm("Message", function (e) {
    if (e) {
        alert("radi");
    } else {
        // user clicked "cancel"
    }
});
        //confirmBox();
    });

    $("#note-container").on("click", ".note", function() {
        $(".note").each(function() {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
        var note_content = $(this).find("p").html();
        $("#editor").html(note_content);
    });

    $("#editor").on("input", function() {
        $(".active p").html($(this).html());
    });

    /*function hideInactive() {
        $(".wrapper-dropdown").each(function() {
            if(!$(this).hasClass("active"))
                $(this).hide(200)
        });
    }*/

    /*if (($(".wrapper-dropdown").length) == 0) {
        for ( var i = 0; i < 4; i++ ) {
            addNote();
        }
    }

    $(".wrapper").on("click", ".imgclick", function() {
        if(!$(this).parent().hasClass("active")) {
            $(this).parent().toggleClass("active");
            hideInactive();
        }
        else {
            $(this).parent().toggleClass("active");
            showAll();
        }        
    });

    var timeout;
    $(".wrapper").bind("DOMSubtreeModified",function(){
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $(".loader").show();
            $(".wrapper-dropdown").each(function() {
                title = $(this).clone().children().remove().end().text(),
                content = $(this).find("p").text()
                pyqtConnect.addData(title, content);
            })
            pyqtConnect.saveData();
            pyqtConnect.clearData();
            setTimeout("$('.loader').hide();", 2800);
        }, 2000);
    });*/
    /*$(".wrapper").bind('DOMNodeInserted DOMNodeRemoved',function(){
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $(".loader").show();
            pyqtConnect.saveHTML();
            setTimeout("$('.loader').hide();", 2800);
        }, 2000);
    });*/

    /*$("div").each(function() {
        var colors = ["#ffc", "#cfc", "#BBDEFB", "#BAB7A9"];
        var rand = Math.floor(Math.random()*colors.length);
        $(this).css("background-color", colors[rand]);
    });*/

    /*$("#add").on("click", "button", function() {
        $(this).fadeToggle(150, function () {
            addNote();
            $(this).fadeToggle(150);
        });
    });*/

    //tekst = qtConnector.showMessage("SuuuperRadi");

});
