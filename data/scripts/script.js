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
        + '<div class="note-content"></div>'
        + '</div>').fadeIn(200));
    }
    function activateNote(selected_note) {
        $(".note").each(function() {
            $(this).removeClass("active");
        });
        selected_note.addClass("active");
        var note_content = selected_note.find(".note-content").html();
        $("#editor").html(note_content);
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

    $(".active").removeClass("active");

    $("button").on("click",function() {
        $(this).fadeOut(160, function() {
            $(this).fadeIn(160);
        });
    })

    $("#add").on("click", function() {
        addNote();
        activateNote($(".note").first());
    });

    alertify.defaults.transition = "fade";
    alertify.defaults.closable = false;
    alertify.defaults.movable = false;

    $("#note-container").on("click", "#remove-note-btn", function() {
        $(this).parent().parent().attr("id", "remove");
        alertify.dialog('confirm').set({
            "labels":{ok:"Confirm", cancel:"Cancel"},
            "title": "Warning!",
            "message": "Do you want to delete this note?",
            "onok": function(){
                $("#remove").remove();
                $("#editor").empty();
            },
            "oncancel": function(){$("#remove").removeAttr("id");}
        }).show();
    });

    $("#note-container").on("click", ".note", function() {
        activateNote($(this));
    });

    $("#editor").on("input", function() {
        $(".active .note-content").html($(this).html());
    });

    var timeout;
    $("#note-container").bind("DOMSubtreeModified",function(){
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $(".loader").show();
            var notes = $("#note-container").html();
            pyqtConnect.saveNotes(notes); 
            setTimeout("$('.loader').hide();", 1200);
        }, 2500);
    });


    /*if (($(".wrapper-dropdown").length) == 0) {
        for ( var i = 0; i < 4; i++ ) {
            addNote();
        }
    }*/
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
