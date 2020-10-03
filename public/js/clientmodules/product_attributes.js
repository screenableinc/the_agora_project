

    let attr_col = $(".attr_columns")
    let add_btn = $(".add")
    let body = $("#attrs_table_body")
    let headings = []

    export function toJSON(selector){
        let table = $(selector)
        let json = {variations:[],attr_count:headings.length,attrs:headings}
        let non_empty = true;


        $(selector +" tr").each(function (index){

            var new_j = {}
            $(this).children("td").each(function (index) {
                let value = $(this).find("input").val()
                if(!value){
                    non_empty=false;
                }
                new_j[headings[index]]= value
            })
            json["variations"].push(new_j)

        })
        if(non_empty) {
            return json
        }else {
            return {};
        }
    }
    function columncreate(name){
        headings.push(name)
        attr_col.append($("<th class='th-sm'>"+ name +"</th>"))
    }
    function removeRow(){
        $("#attrs_table_body tr").last().remove()
    }
    function addRow(){
        let tr = $("<tr></tr>")

        $(".attr_columns .th-sm").each(function (index){
            if($(this).text()==="Qty"){
                let td = $("<td><input type='number' class='form-control' placeholder='Enter " + $(this).text() +"'></td>")
                tr.append(td)
            }else {
                let td = $("<td><input type='text' class='form-control' placeholder='Enter " + $(this).text() +"'></td>")
                tr.append(td)
            }



        })
        body.append(tr)

    }
    function updateTable(){
        // add a table column
       /* steps
       1. check how many specified columns
       2.loop throug and add
       3. add a row to show example
       4. enable add row button

    */

        var columns = $("#attrs_input").val().split(";")
        for (let i = 0; i < columns.length; i++) {
            // if(columns.length===2){
            //     headings.push("Qty")
            //
            // }

            if(columns[i].trim()!==""){
                columncreate(columns[i])

                //    loop and add row




            }
        }

        //put quantity column
        let qty = $("input[name='quantity']").val()
        if(qty>>0 && $("#attrs_input").val().trim() !==";"){
            columncreate("Qty")
        }

        addRow()
    //    check how many rows the user specified
    //     show add button
    }
    $("#attrs_input").on("keyup",function (ev) {

        var code = ev.keyCode || ev.which;


        if(code===186){
            body.empty()
            headings=[]
            attr_col.empty()
            updateTable()
        }
    })
    $("#plus").on('click',function (){
        //only add if cokumns are present
        if(headings.length>0){
            addRow()
        }
    })
    $("#minus").on('click',function (){
        //only add if cokumns are present
        if(headings.length>0){
            removeRow()
        }
    })
