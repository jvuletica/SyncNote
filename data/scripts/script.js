$(function() {

    //sets defaults for custom confirm dialog
    alertify.defaults.transition = "fade";
    alertify.defaults.closable = false;
    alertify.defaults.movable = false;

    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"];

    //wraps execCommand and accepts commands from editor buttons
    function editorCommand(command) {
        document.execCommand(command, false, null);
    }

    //prepends note html into note container
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

    //activates note and transfers content into editor
    function activateNote(selected_note) {
        $(".note").each(function() {
            $(this).removeClass("active");
        });
        selected_note.addClass("active");
        var note_content = selected_note.find(".note-content").html();
        $("#editor_box").html(note_content);
    }

    //checks if activated note exists, if not, creates a new one
    function ifNotActiveCreate() {
        if(!$(".note").hasClass("active")) {
            addNote();
            activateNote($(".note").first());
        }
    }

    //returns number of days in a certain month and the name of first day
    function daysInMonth(month,year) {
        var first_day = new Date(year, month, 1).getDay();
        var days_count = new Date(year, month + 1, 0).getDate();
        var day_name = weekdays[first_day];
        return [days_count, first_day];
    }

    function createCalendar() {
        var date = new Date();
        var month_num = date.getMonth();
        var year = date.getFullYear();
        $("#month").text(months[month_num] + " " + year);
        var cells = $("td:not(.days)");
        var day_stats = daysInMonth(month_num, year);
        var i = day_stats[1];
        var end = day_stats[0] + i - 1;
        var j = 1;
        for (i; i <= end; i++) {
            $(cells[i]).text(j);
            j++;
        }
    }

    function fillCalendar(direction) {
        var date = $("#month").text().split(" ");//month, year
        var month_num = months.indexOf(date[0]);
        var year = parseInt(date[1]);

        if(direction == "next"){
            month_num == 11 ? (month_num = 0, year++) : month_num++;
        }
        else if(direction == "previous"){
            month_num == 0 ? (month_num = 11, year--) : month_num--;            
        }

        $("#calendar").fadeToggle(160, function() {
            $(this).fadeToggle(160);
            $("#month").text(months[month_num] + " " + year);
            var cells = $("td:not(.days)");
            cells.each(function() {
                $(this).text("");
            });
            var day_stats = daysInMonth(month_num, year);
            var i = day_stats[1];
            var end = day_stats[0] + i - 1;
            var j = 1;
            for (i; i <= end; i++) {
                $(cells[i]).text(j);
                j++;
            }
        });
    }

    //WYSIWYG editor buttons below
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

    //click effect on buttons
    $("button").on("click",function() {
        $(this).fadeOut(160, function() {
            $(this).fadeIn(160);
        });
    });

    //adds new empty note and activates it, displays appropriate wrapper
    $("#add").on("click", function() {
        var display_state = $("#note_preview_wrapper").css("display");
        if(display_state == "none") {
            $("body > :not(#controls_wrapper)").fadeOut();
            $("#note_preview_wrapper").fadeIn();
            $("#editor_wrapper").fadeIn();            
        }
        else {
            addNote();
            activateNote($(".note").first());
        }      
    });
    $("#login").on("click", function() {
        $("body > :not(#controls_wrapper)").fadeOut();
        $("#login_wrapper").fadeIn();
    });
    $("#options").on("click", function() {
        $("body > :not(#controls_wrapper)").fadeOut();
        $("#options_wrapper").fadeIn();
    });

    // caching the note-container selector
    var container = $("#note-container");

    //shows confirm dialog and removes note if confirmed
    container.on("click", "#remove-note-btn", function() {
        $(this).parent().parent().attr("id", "remove");
        alertify.dialog('confirm').set({
            "labels":{ok:"Confirm", cancel:"Cancel"},
            "title": "Warning!",
            "message": "Do you want to delete this note?",
            "onok": function(){
                $("#remove").remove();
                $("#editor_box").empty();
            },
            "oncancel": function(){$("#remove").removeAttr("id");}
        }).show();
    });

    container.on("click", "#calendar-btn", function() {
        createCalendar();
        $("#editor_box").fadeOut();
        $(".tb-button").fadeOut();
        $("#calendar").fadeIn();
        activateNote($(this).parent().parent());
        return false;//prevent propagation
    });

    $("#cal-left").on("click", function() {
        fillCalendar("previous");
    });
    $("#cal-right").on("click", function() {
        fillCalendar("next");
    });

    //monitors click on note previews and transfers content to editor
    container.on("click", ".note", function() {
        activateNote($(this));
        //alert($("#calendar").css("display"))
        if($("#calendar").css("display")=="block") {
            $("#calendar").fadeOut();
            $("#editor_box").fadeIn();
            $(".tb-button").fadeIn();
        }
    });

    //transfer contents of editor into active note on input
    $("#editor_box").on("input", function() {
        ifNotActiveCreate();
        $(".active .note-content").html($(this).html());
    });

    //autosave on note container change
    var timeout;
    container.bind("DOMSubtreeModified",function(){
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $(".loader").show();
            //remove active class and save html
            var $notes = container.html().replace(" active","");
            pyqtConnect.saveNotes($notes); 
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
