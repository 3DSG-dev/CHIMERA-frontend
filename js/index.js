var editIndex = undefined;
var editIndexInt = undefined;
var dgInitEdit = false;
var dgInitEditInt = false;

$(document).ready(function () {
    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });


    var cv = document.getElementById("theCanvas");
    cv.width = $("#centerPanel").width() - 4;
    cv.height = $("#centerPanel").height() - 4;



    $('#Area2CB').combobox({
        onShowPanel: function () {
            $('#Area2CB').combobox({ url: './php/getElementiModelloPerCombo.php?campo=Area&zone=' + $('#ZoneCB').combo('getText') + '&sector=' + $('#SectorCB').combo('getText') + '&type=' + $('#TypeCB').combo('getText') + '&nome=' + $('#NomeCB').combo('getText') });
            $('#Area2CB').combobox('reload');
        }
    });
    $('#ZoneCB').combobox({
        onShowPanel: function () {
            $('#ZoneCB').combobox({ url: './php/getElementiModelloPerCombo.php?campo=Zone&area=' + $('#Area2CB').combo('getText') + '&sector=' + $('#SectorCB').combo('getText') + '&type=' + $('#TypeCB').combo('getText') + '&nome=' + $('#NomeCB').combo('getText') });
            $('#ZoneCB').combobox('reload');
        }
    });
    $('#SectorCB').combobox({
        onShowPanel: function (param) {
            $('#SectorCB').combobox({ url: './php/getElementiModelloPerCombo.php?campo=Sector&area=' + $('#Area2CB').combo('getText') + '&zone=' + $('#ZoneCB').combo('getText') + '&type=' + $('#TypeCB').combo('getText') + '&nome=' + $('#NomeCB').combo('getText') });
            $('#SectorCB').combobox('reload');
        }
    });
    $('#TypeCB').combobox({
        onShowPanel: function () {
            $('#TypeCB').combobox({ url: './php/getElementiModelloPerCombo.php?campo=Type&area=' + $('#Area2CB').combo('getText') + '&zone=' + $('#ZoneCB').combo('getText') + '&sector=' + $('#SectorCB').combo('getText') + '&nome=' + $('#NomeCB').combo('getText') });
            $('#TypeCB').combobox('reload');
        }
    });
    $('#NomeCB').combobox({
        onShowPanel: function (param) {
            $('#NomeCB').combobox({ url: './php/getElementiModelloPerCombo.php?campo=Name&area=' + $('#Area2CB').combo('getText') + '&zone=' + $('#ZoneCB').combo('getText') + '&sector=' + $('#SectorCB').combo('getText') + '&type=' + $('#TypeCB').combo('getText') });
            $('#NomeCB').combobox('reload');
        }
    });

    $('#viewPezziButton').bind('click', function () {
        //$('#dg').datagrid({
        //    queryParams: { area: $('#Area2CB').combo('getText'), zone: $('#ZoneCB').combo('getText'), sector: $('#SectorCB').combo('getText'), type: $('#TypeCB').combo('getText'), nome: $('#NomeCB').combo('getText') },
        //    url: 'php/getInfoOggetti.php'
        //})
        $('#dg').datagrid({
            queryParams: {  },
            url: 'php/getInfoOggettiImportati.php'
        })
        $('#dlg').dialog('open');
    });

    $('#viewInterventiButton').bind('click', function () {
        $('#dg2').datagrid({
            queryParams: { area: $('#Area2CB').combo('getText'), zone: $('#ZoneCB').combo('getText'), sector: $('#SectorCB').combo('getText'), type: $('#TypeCB').combo('getText'), nome: $('#NomeCB').combo('getText') },
            url: 'php/getInfoInterventi.php'
        })
        $('#dlg2').dialog('open');
    });

    $('#creaInterventoButton').bind('click', function () {
        value = selectedObjectList.length;
        var q=""
        for (var i = 0; i < value; i++) {
            q = q + selectedObjectList[i]._targetNode.attr.id.substring(1);
            if (i<(value-1)) q=q+",";
        };
        var setListaImportazione = $.ajax({
            type: 'POST',
            url: 'php/creaListaImportazione.php',
            data: {
                listaPezzi: "" + q + ""
            },
            dataType: "text",
            success: function (resultData) {
                if (resultData != "") {
                    alert("Impossibile creare l'intervento: " + resultData);
                }
                else {
                    $('#nuoviPezziNS').numberspinner("clear");
                    $('#nuoviPezziNS').numberspinner("setValue", 0);
                    $('#dlg4').dialog('open');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    });

    $('#azzeraListaButton').bind('click', function () {
        var azzeraListaImportazione = $.ajax({
            type: 'POST',
            url: 'php/resettaListaImportazione.php',
            dataType: "text",
            success: function (resultData) {
                alert("Lista correttamente cancellata");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    });

    $('#azzeraVistaButton').bind('click', function () {
        var blocchi = myscene.findNode("block");
        var l = blocchi._targetNode.children.length;
        for (var i = l - 1; i > -1; i--) {
            blocchi.remove("nodeAt", i);
        }
        selectedObjectList = [];
    });


    var baseNuovoNome = "";
    var area = "";
    var type = "";
    var sector="";
    var zone = "";

    $("input:radio[name ='eliminazioneEsistentiRadioGroup']").change(function () {
        var s = $("input:radio[name ='eliminazioneEsistentiRadioGroup']:checked").val();
        $('#containerVecchiPezzi').empty();
        if (s == "no") {
            var numPadriEsistenti = selectedObjectList.length;
            $('#containerVecchiPezzi').append("Identificativo dei pezzi esistenti e modificati");

            for (var i = 0; i < numPadriEsistenti; i++) {
                ///////////////////

                var setDatiPezzo = $.ajax({
                    type: 'POST',
                    url: 'php/getInfoBaseOggetto.php',
                    data: {
                        codicePezzo: "" + selectedObjectList[i]._targetNode.attr.id.substring(1) + ""
                    },
                    dataType: "json",
                    pippo: i,
                    success: function (resultData) {
                        var s = '<div id="codiceVecchioPezzo' + (this.pippo + 1).toString() + '" title="' + (resultData[0].Codice).toString() + '">Identificativo del pezzo esistente e modificato n° ' + (resultData[0].Codice).toString() + '<div>Cantiere: <input class="easyui-validatebox" id="cantiereVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="cantiereVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Area + '"><br>Zone: <input class="easyui-validatebox" id="zoneVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="zoneVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Zone + '"><br>Sector: <input class="easyui-validatebox" id="sectorVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="sectorVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Sector + '"><br>Type: <input class="easyui-validatebox" id="typeVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="typeVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Type + '"><br>Nome interno: <input class="easyui-validatebox" id="nomeinternoVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="nomeinternoVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Name + '(#intervento)"><br></div></div>';
                        //s = s.replace('1', (i + 1).toString());
                        $('#containerVecchiPezzi').append(s);
                        if (value == 0) {
                            if (baseNuovoNome == "(") {
                                baseNuovoNome = baseNuovoNome + resultData[0].Name;
                                area = resultData[0].Area;
                                type = resultData[0].Type;
                                sector = resultData[0].Sector;
                                zone = resultData[0].Zone;
                            }
                            else {
                                baseNuovoNome = baseNuovoNome + "°" + resultData[0].Name;
                            }
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si è verificato un errore.");
                    }
                });

            };

        }
        else {

        }

    });


    $('#nuoviPezziNS').numberspinner({
        onChange: function (value) {
            if (value == 0) {
                baseNuovoNome = "(";
            }
            $('#containerNuoviPezzi').empty();
            $('#containerNuoviPezzi').append("Identificativo dei nuovi pezzi");
            for (var i = 0; i < value; i++) {
                var s = '<div>Identificativo del nuovo pezzo n° ' + (i + 1).toString() + '<div>Cantiere: <input class="easyui-validatebox" id="cantiereNuovoPezzo' + (i + 1).toString() + 'VB" name="cantiereNuovoPezzo' + (i + 1).toString() + 'VB" value="' + area + '"><br>Zone: <input class="easyui-validatebox" id="zoneNuovoPezzo' + (i + 1).toString() + 'VB" name="zoneNuovoPezzo' + (i + 1).toString() + 'VB" value="' + zone + '"><br>Sector: <input class="easyui-validatebox" id="sectorNuovoPezzo' + (i + 1).toString() + 'VB" name="sectorNuovoPezzo' + (i + 1).toString() + 'VB" value="' + sector + '"><br>Type: <input class="easyui-validatebox" id="typeNuovoPezzo' + (i + 1).toString() + 'VB" name="typeNuovoPezzo' + (i + 1).toString() + 'VB" value="' + type + '"><br>Nome interno: <input class="easyui-validatebox" id="nomeinternoNuovoPezzo' + (i + 1).toString() + 'VB" name="nomeinternoNuovoPezzo' + (i + 1).toString() + 'VB" value="' + baseNuovoNome + ')#intervento' + ((value == 1) ? '' : ('_' + (i + 1).toString())) + '"><br></div></div>';
                $('#containerNuoviPezzi').append(s);
            };
            var numPadriEsistenti = selectedObjectList.length;
            $('#containerVecchiPezzi').empty();
            $('#containerVecchiPezzi').append("Identificativo dei pezzi esistenti e modificati");

            for (var i = 0; i < numPadriEsistenti; i++) {
                ///////////////////
               
                var setDatiPezzo = $.ajax({
                    type: 'POST',
                    url: 'php/getInfoBaseOggetto.php',
                    data: {
                        codicePezzo: "" + selectedObjectList[i]._targetNode.attr.id.substring(1) + ""
                    },
                    dataType: "json",
                    pippo: i,
                    success: function (resultData) {
                        var s = '<div id="codiceVecchioPezzo' + (this.pippo + 1).toString() + '" title="' + (resultData[0].Codice).toString() + '">Identificativo del pezzo esistente e modificato n° ' + (resultData[0].Codice).toString() + '<div>Cantiere: <input class="easyui-validatebox" id="cantiereVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="cantiereVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Area + '"><br>Zone: <input class="easyui-validatebox" id="zoneVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="zoneVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Zone + '"><br>Sector: <input class="easyui-validatebox" id="sectorVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="sectorVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Sector + '"><br>Type: <input class="easyui-validatebox" id="typeVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="typeVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Type + '"><br>Nome interno: <input class="easyui-validatebox" id="nomeinternoVecchioPezzo' + (this.pippo + 1).toString() + 'VB" name="nomeinternoVecchioPezzo' + (this.pippo + 1).toString() + 'VB" value="' + resultData[0].Name + '(#intervento)"><br></div></div>';
                        //s = s.replace('1', (i + 1).toString());
                        $('#containerVecchiPezzi').append(s);
                        if (value == 0) {
                            if (baseNuovoNome == "(") {
                                baseNuovoNome = baseNuovoNome + resultData[0].Name;
                                area = resultData[0].Area;
                                type = resultData[0].Type;
                                sector = resultData[0].Sector;
                                zone = resultData[0].Zone;
                            }
                            else {
                                baseNuovoNome = baseNuovoNome + "°" + resultData[0].Name;
                            }
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si è verificato un errore.");
                    }
                });

                ///////////////////

            };
        }
    });
       

    $('#confermaCreazioneInterventoButton').bind('click', function () {
        var listaPadriVecchi="";
        var listaPadriModificati="";
        var listaFigliNuovi = "";

        //selectedObjectList[i]._targetNode.attr.id.substring(1)
        var s = $("input:radio[name ='eliminazioneEsistentiRadioGroup']:checked").val();
        if (s == "no") {
            $('#containerVecchiPezzi').children('div').each(function (index) {
                var codice = $(('#codiceVecchioPezzo' + (index + 1).toString())).attr("title");
                var pezzo = $(('#cantiereVecchioPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#zoneVecchioPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#sectorVecchioPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#typeVecchioPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#nomeinternoVecchioPezzo' + (index + 1).toString() + 'VB')).val();
                if (pezzo == "____") pezzo = "";
                if (index == 0) {
                    listaPadriModificati = pezzo;
                    listaPadriVecchi = codice;
                }
                else {
                    listaPadriModificati = listaPadriModificati + "," + pezzo;
                    listaPadriVecchi = listaPadriVecchi + "," + codice;
                }
                //$('#cantiereVecchioPezzo' + (index+1).toString() + 'VB').validatebox.
                //var tempModificati = padri[i].Cantiere + "_" + padri[i].Zone + "_" + padri[i].Sector + "_" + padri[i].Type + "_" + padri[i].Name;
                //if (index == 0) {
                //}
            });
        }
        else {
            for(var i=0; i<selectedObjectList.length; i++)
            {
                var codice = selectedObjectList[i]._targetNode.attr.id.substring(1);
                if (i == 0) {
                    listaPadriVecchi = codice;
                }
                else {
                    listaPadriVecchi = listaPadriVecchi + "," + codice;
                }
            }
            //listaPadriModificati = pezzo;

        }
        $('#containerNuoviPezzi').children('div').each(function (index) {
            var pezzo = $(('#cantiereNuovoPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#zoneNuovoPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#sectorNuovoPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#typeNuovoPezzo' + (index + 1).toString() + 'VB')).val() + "_" + $(('#nomeinternoNuovoPezzo' + (index + 1).toString() + 'VB')).val();
            if (index == 0) {
                listaFigliNuovi = pezzo;
            }
            else {
                listaFigliNuovi = listaFigliNuovi + "," + pezzo;
            }
        });


        var setIntervento = $.ajax({
            type: 'POST',
            url: 'php/aggiungiIntervento.php',
            data: {
                lPadriVecchi: "" + listaPadriVecchi + "",
                lPadriModificati: "" + listaPadriModificati + "",
                lFigliNuovi: "" + listaFigliNuovi + "",
                completed: "" + $('#completedCB').is(":checked") + ""
        },
            dataType: "text",
            success: function (resultData) {
                if (resultData != "") {
                    alert("Impossibile creare l'intervento: " + resultData);
                }
                else {
                    alert("Intervento creato con successo");
                    $('#dlg4').dialog('close');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });



    });
    
    function formatImage(val, row) {
        s = '<div>' +
            '   <div>' +
            '       <img src="php/getImmagineOggetto.php?url=' + encodeURIComponent(row.URL) + '&quality=min" height="144px" width="auto" alt="immagine" >' +
            '   </div>' +
            '   <div>' +
            '       <form>' +
            '           <label>Descrizione:</label><br />' +
            '           <textarea name="Descrizione" readonly="readonly">' + row.Descrizione + '</textarea>' +
            '       </form>' +
            '   </div>' +
            '</div>';
        return s;
    }

    function formatImageIntervento(val, row) {
        s = '<div>' +
            '   <div>' +
            '       <img src="php/getImmagineIntervento.php?url=' + encodeURIComponent(row.URL) + '&quality=min" height="144px" width="auto" alt="immagine" >' +
            '   </div>' +
            '   <div>' +
            '       <form>' +
            '           <label>Descrizione:</label><br />' +
            '           <textarea name="Descrizione" readonly="readonly">' + row.Descrizione + '</textarea>' +
            '       </form>' +
            '   </div>' +
            '</div>';
        return s;
    }

    function append(index, row) {
        $('#dlg3').find('.files').empty();
        $('#dlg3').find('.well').empty();
        $('#dlg3').find('.bar').css('width', '0%');
        $('#dlg3').find('#fileupload').replaceWith('<input id="fileupload" type="file" name="files[]" multiple="multiple">');
        setUploader(index, row);
        $('#dlg3').dialog('open');
    }

    function appendint(index, row) {
        $('#dlg3').find('.files').empty();
        $('#dlg3').find('.well').empty();
        $('#dlg3').find('.bar').css('width', '0%');
        $('#dlg3').find('#fileupload').replaceWith('<input id="fileupload" type="file" name="files[]" multiple="multiple">');
        setUploaderInt(index, row);
        $('#dlg3').dialog('open');
    }

    function update(ldg) {
        ldg.datagrid('getPanel').find('.datagrid-row').find('textArea[name="Descrizione"]').removeAttr('readonly');
    }
    function removeit(ldg) {
        var selIdx = ldg.datagrid('getRowIndex', ldg.datagrid('getSelected'));
        if (selIdx < 0) return;
        if (!(confirm("Eliminare l'elemento selezionato?"))) {
            return;
        }
        var v = ldg.datagrid('getSelected');
        var deleteData = $.ajax({
            type: 'POST',
            url: 'php/removeImageOggetto.php',
            data: {
                codicePezzo: "" + v.Codice_pezzo + "",
                URL: "" + v.URL + ""
            },
            dataType: "text",
            success: function (resultData) {
                ldg.datagrid('reload');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
                ldg.datagrid('reload');
            }
        });
    }
    function removeitint(ldg) {
        var selIdx = ldg.datagrid('getRowIndex', ldg.datagrid('getSelected'));
        if (selIdx < 0) return;
        if (!(confirm("Eliminare l'elemento selezionato?"))) {
            return;
        }
        var v = ldg.datagrid('getSelected');
        var deleteData = $.ajax({
            type: 'POST',
            url: 'php/removeImageIntervento.php',
            data: {
                codicePezzo: "" + v.Codice_intervento + "",
                URL: "" + v.URL + ""
            },
            dataType: "text",
            success: function (resultData) {
                ldg.datagrid('reload');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
                ldg.datagrid('reload');
            }
        });
    }

    function accept(index, row) {
        var ldg = $('#ddv-' + index).datagrid();
        var rows = ldg.datagrid('getRows');
        $.each(rows, function (i, v) {
            var selIdx = ldg.datagrid('getRowIndex', v);
            var nuovaDescrizione = (ldg.datagrid('getPanel').find('.datagrid-row[datagrid-row-index=' + selIdx + ']').find('textArea[name="Descrizione"]')).val();
            var insertData = $.ajax({
                type: 'POST',
                url: 'php/setDescrizioneImmagine.php',
                data: {
                    codicePezzo: "" + v.Codice_pezzo + "",
                    URL: "" + v.URL + "",
                    descrizione: "" + nuovaDescrizione + ""
                },
                dataType: "text",
                success: function (resultData) {
                    ldg.datagrid('reload');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si è verificato un errore.");
                    ldg.datagrid('reload');
                }
            });
        });
    }
    function acceptint(index, row) {
        var ldg = $('#ddv-' + index + '-i' + row.Codice).datagrid();
        var rows = ldg.datagrid('getRows');
        $.each(rows, function (i, v) {
            var selIdx = ldg.datagrid('getRowIndex', v);
            var nuovaDescrizione = (ldg.datagrid('getPanel').find('.datagrid-row[datagrid-row-index=' + selIdx + ']').find('textArea[name="Descrizione"]')).val();
            var insertData = $.ajax({
                type: 'POST',
                url: 'php/setDescrizioneImmagineIntervento.php',
                data: {
                    codicePezzo: "" + v.Codice_intervento + "",
                    URL: "" + v.URL + "",
                    descrizione: "" + nuovaDescrizione + ""
                },
                dataType: "text",
                success: function (resultData) {
                    ldg.datagrid('reload');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si è verificato un errore.");
                    ldg.datagrid('reload');
                }
            });
        });
    }
    function reject(ldg) {
        ldg.datagrid('reload');
        ldg.datagrid('getPanel').find('.datagrid-row').find('textArea[name="Descrizione"]').attribute('readonly', 'readonly');
    }

    $('#dg').datagrid({
        view: detailview,
        detailFormatter: function (index, row) {
            return '<div style="padding:2px"><table id="ddv-' + index + '"></table></div>';
        },
        toolbar: [{
            iconCls: 'icon-edit',
            text: 'Edita',
            handler: function () { dgInitEdit = true; }
        }, '-', {
            iconCls: 'icon-undo',
            text: 'Termina editazione',
            handler: function () {
                dgInitEdit = false;
                editIndex = undefined;
                $('#dg').datagrid('reload');
            }
        }],
        onExpandRow: function (index, row) {
            $('#ddv-' + index).datagrid({
                url: 'php/getDetailsOggetto.php?codicePezzo=' + row.Codice,
                fitColumns: true,
                singleSelect: true,
                rownumbers: false,
                loadMsg: '',
                height: 'auto',
                showHeader: false,
                rowStyler: function (index, row) {
                    return 'display: table-cell';
                },
                columns: [[
                    { field: 'Codice_pezzo', title: 'Codice', hidden: true },
                    { field: 'URL', title: 'Immagine', formatter: formatImage },
                    { field: 'Descrizione', title: 'Descrizione', hidden: true }
                ]],
                toolbar: [{
                    iconCls: 'icon-edit',
                    text: 'Edita',
                    handler: function () {
                        update($('#ddv-' + index));
                    }
                }, '-', {
                    iconCls: 'icon-add',
                    text: 'Aggiungi',
                    handler: function () { append(index, row) }
                }, '-', {
                    iconCls: 'icon-remove',
                    text: 'Rimuovi',
                    handler: function () { removeit($('#ddv-' + index)) }
                }, '-', {
                    iconCls: 'icon-save',
                    text: 'Salva',
                    handler: function () { accept(index, row) }
                }, '-', {
                    iconCls: 'icon-undo',
                    text: 'Annulla',
                    handler: function () { reject($('#ddv-' + index)) }
                }],
                onResize: function () {
                    $('#dg').datagrid('fixDetailRowHeight', index);
                },
                onDblClickCell: function (index, field, value) {
                    if (field == "URL") {
                        $.prettyPhoto.open('php/getImmagineOggetto.php?url=' + encodeURIComponent(value) + '&quality=max', index, index);
                    }
                }, /*
                onClickRow: function (rowIndex, rowData) {
                    if (editIndex[$('#ddv-' + index)] != rowIndex) {
                        if (endEditing($('#ddv-' + index))) {
                            $('#ddv-' + index).datagrid('selectRow', index).datagrid('beginEdit', rowIndex);
                            editIndex[$('#ddv-' + index)] = rowIndex;
                        } else {
                            $('#ddv-' + index).datagrid('selectRow', editIndex[$('#ddv-' + index)]);
                        }
                    }

                },*/
                onClickCell: function (innerindex, field) {
                },
                onLoadSuccess: function () {
                    setTimeout(function () {
                        $('td[field="URL"]').children('div').css('width', 'auto');
                        $('.datagrid-body').css('overflow-x', 'visible');
                        $('#dg').datagrid('fixDetailRowHeight', index);
                    }, 2000);
                }
            });
            $('#dg').datagrid('fixDetailRowHeight', index);
        }
    });


    $('#dg2').datagrid({
        view: detailview,
        detailFormatter: function (index, row) {
            //return '<div style="padding:2px"><table id="ddv-' + index + '"></table></div><div style="padding:2px"><table id="ddv2-' + index + '"></table></div>';
            var s = '<div>Foto dell\'intervento</div>';
            s += '<div style="padding:2px"><table id="ddv-' + index + '-i' + row.Codice + '"></table>';
            s += '<div>Elenco Padri</div>';
            var sP = row.elencoPadri.split(",");
            var sF = row.elencoFigli.split(",");
            //for (var i = 0; i < row.numPadri; i++) {
            for (var i = 0; i < 1; i++) {
                    s += "<table id=\"dg5" + index + '-p' + sP[i] + "\" class=\"easyui-datagrid\" data-options=\"fitColumns:'true',width:800, height: 400,idField:'Codice'\"></table>";

            }
            s += '<div>Elenco Figli</div>';
            //for (var i = 0; i < row.numFigli; i++) {
            for (var i = 0; i < 1; i++) {
                    s += "<table id=\"dg5" + index + '-f' + sF[i] + "\" class=\"easyui-datagrid\" data-options=\"fitColumns:'true',width:800, height: 400,idField:'Codice'\"></table>";
            }
            return s;
        },
        toolbar: [{
            iconCls: 'icon-edit',
            text: 'Edita',
            handler: function () { dgInitEditInt = true; }
        }, '-', {
            iconCls: 'icon-undo',
            text: 'Termina editazione',
            handler: function () {
                dgInitEditInt = false;
                editIndex = undefined;
                $('#dg2').datagrid('reload');
            }
        }, {
            iconCls: 'icon-remove',
            text: 'Elimina intervento',
            handler: function () {
                var selectedrow = $('#dg2').datagrid("getSelected");
                var setListaImportazione = $.ajax({
                    type: 'POST',
                    url: 'php/creaListaImportazione.php',
                    data: {
                        listaPezzi: "" + selectedrow.elencoPadri + "," + selectedrow.elencoFigli + ""
                    },
                    dataType: "text",
                    success: function (resultData) {
                        if (resultData != "") {
                            alert("Impossibile rimuovere l'intervento: " + resultData);
                        }
                        else {
                            //////////////////////////
                            $.ajax({
                                type: 'POST',
                                url: 'php/rimuoviIntervento.php',
                                data: {
                                    InterventoDaEliminare: "" + selectedrow.Codice + ""
                                },
                                dataType: "text",
                                success: function (resultData) {
                                    if (resultData != "") {
                                        alert("Impossibile rimuovere l'intervento: " + resultData);
                                    }
                                    else {
                                        alert("Intervento rimosso con successo");
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    alert("Si è verificato un errore.");
                                }
                            });
                            //////////////////////////
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si è verificato un errore.");
                    }
                });

            }
        }],
        onExpandRow: function (index, row) {
            $('#ddv-' + index + '-i' + row.Codice).datagrid({
                url: 'php/getDetailsIntervento.php?codiceIntervento=' + row.Codice,
                fitColumns: true,
                singleSelect: true,
                rownumbers: false,
                loadMsg: '',
                height: 'auto',
                showHeader: false,
                rowStyler: function (index, row) {
                    return 'display: table-cell';
                },
                columns: [[
                    { field: 'Codice_intervento', title: 'Codice', hidden: true },
                    { field: 'URL', title: 'Immagine', formatter: formatImageIntervento },
                    { field: 'Descrizione', title: 'Descrizione', hidden: true }
                ]],
                toolbar: [{
                    iconCls: 'icon-edit',
                    text: 'Edita',
                    handler: function () {
                        update($('#ddv-' + index + '-i' + row.Codice));
                    }
                }, '-', {
                    iconCls: 'icon-add',
                    text: 'Aggiungi',
                    handler: function () { appendint(index, row) }
                }, '-', {
                    iconCls: 'icon-remove',
                    text: 'Rimuovi',
                    handler: function () { removeitint($('#ddv-' + index + '-i' + row.Codice)) }
                }, '-', {
                    iconCls: 'icon-save',
                    text: 'Salva',
                    handler: function () { acceptint(index, row) }
                }, '-', {
                    iconCls: 'icon-undo',
                    text: 'Annulla',
                    handler: function () { reject($('#ddv-' + index + '-i' + row.Codice)) }
                }],
                onResize: function () {
                    $('#dg2').datagrid('fixDetailRowHeight', index);
                },
                onDblClickCell: function (index, field, value) {
                    if (field == "URL") {
                        $.prettyPhoto.open('php/getImmagineIntervento.php?url=' + encodeURIComponent(value) + '&quality=max', index, index);
                    }
                },
                onClickCell: function (innerindex, field) {
                },
                onLoadSuccess: function () {
                    setTimeout(function () {
                        $('td[field="URL"]').children('div').css('width', 'auto');
                        $('.datagrid-body').css('overflow-x', 'visible');
                        $('#dg2').datagrid('fixDetailRowHeight', index);
                    }, 2000);
                }
            });

            var sP = row.elencoPadri.split(",");
            var sF = row.elencoFigli.split(",");
            //var sPForQuery = "(" + row.elencoPadri.replace(/,/g, " OR ") + ")";
            ///////////////////////////////////////////
            //for (var i = 0; i < row.numPadri; i++) {
            for (var i = 0; i < 1; i++) {
                //alert("dg5" + index + '-p' + sP[i]);
                //$("#dg5" + index + '-p' + sP[i]).datagrid('load');
                //$('#dg50-p2202').datagrid('getColumnFields');
                var nomeTabAux = "#dg5" + index + '-p' + sP[i];
                var nomeTabAux2 = "dg5" + index + '-p' + sP[i];
                $(nomeTabAux).datagrid({
                    queryParams: { area: '', zone: '', sector: '', type: '', nome: '', codice: row.elencoPadri },
                    url: 'php/getInfoOggetti.php',
                    view: detailview,
                    detailFormatter: function (index, row) {
                        return '<div style="padding:2px"><table id="' + nomeTabAux2 + 'ddv-' + index + '"></table></div>';
                    },
                    toolbar: [/*{
                        iconCls: 'icon-edit',
                        text: 'Edita',
                        handler: function () { dgInitEdit = true; }
                    }, '-', {
                        iconCls: 'icon-undo',
                        text: 'Termina editazione',
                        handler: function () {
                            dgInitEdit = false;
                            editIndex = undefined;
                            $("#dg5" + index + '-p' + sP[i]).datagrid('reload');
                        }
                    }*/],
                    onExpandRow: function (index, row) {
                        $(nomeTabAux + 'ddv-' + index).datagrid({
                            url: 'php/getDetailsOggetto.php?codicePezzo=' + row.Codice,
                            fitColumns: true,
                            singleSelect: true,
                            rownumbers: false,
                            loadMsg: '',
                            height: 'auto',
                            showHeader: false,
                            rowStyler: function (index, row) {
                                return 'display: table-cell';
                            },
                            columns: [[
                                { field: 'Codice-pezzo', title: 'Codice', hidden: true },
                                { field: 'URL', title: 'Immagine', formatter: formatImage },
                                { field: 'Descrizione', title: 'Descrizione', hidden: true }
                            ]],
                            toolbar: [/*{
                                iconCls: 'icon-edit',
                                text: 'Edita',
                                handler: function () {
                                    update($(nomeTabAux + '#ddv-' + index));
                                }
                            }, '-', {
                                iconCls: 'icon-add',
                                text: 'Aggiungi',
                                handler: function () { append(index, row) }
                            }, '-', {
                                iconCls: 'icon-remove',
                                text: 'Rimuovi',
                                handler: function () { removeit($(nomeTabAux + 'ddv-' + index)) }
                            }, '-', {
                                iconCls: 'icon-save',
                                text: 'Salva',
                                handler: function () { accept(index, row) }
                            }, '-', {
                                iconCls: 'icon-undo',
                                text: 'Annulla',
                                handler: function () { reject($(nomeTabAux + 'ddv-' + index)) }
                            }*/],
                            onResize: function () {
                                $(nomeTabAux).datagrid('fixDetailRowHeight', index);
                            },
                            onDblClickCell: function (index, field, value) {
                                if (field == "URL") {
                                    $.prettyPhoto.open('php/getImmagineOggetto.php?url=' + encodeURIComponent(value) + '&quality=max', index, index);
                                }
                            }, 
                            onClickCell: function (innerindex, field) {
                            },
                            onLoadSuccess: function () {
                                setTimeout(function () {
                                    $('td[field="URL"]').children('div').css('width', 'auto');
                                    $('.datagrid-body').css('overflow-x', 'visible');
                                    $(nomeTabAux).datagrid('fixDetailRowHeight', index);
                                }, 2000);
                            },
                            onLoadError: function () {
                                alert('error');
                            },
                            onBeforeLoad: function (param) {
                            }
                        });
                        $(nomeTabAux).datagrid('fixDetailRowHeight', index);
                    },

                    columns: [[
                        { field: 'Codice', title: 'Id', width: 100, sortable: 'true' },
                        { field: 'Area', title: 'Area', width: 100, sortable: 'true' },
                        { field: 'Zone', title: 'Zone', width: 100, sortable: 'true' },
                        { field: 'Sector', title: 'Sector', width: 100, sortable: 'true' },
                        { field: 'Area', title: 'Area', width: 100, sortable: 'true' },
                        { field: 'Type', title: 'Type', width: 100, sortable: 'true' },
                        { field: 'Name', title: 'Nome', width: 100, sortable: 'true' },
                        { field: 'Sigla', title: 'Sigla', width: 100, sortable: 'true' },
                        { field: 'Originale', title: 'Originale', width: 100, sortable: 'true' },
                        { field: 'Superficie', title: 'Superficie', width: 100, sortable: 'true' },
                        { field: 'Volume', title: 'Volume', width: 100, sortable: 'true' },
                        { field: 'Descrizione', title: 'Descrizione', width: 100, sortable: 'true' },
                        { field: 'Note', title: 'Note', width: 100, sortable: 'true' },
                        { field: 'Note_storiche', title: 'Note storiche', width: 100, sortable: 'true' },
                        {
                            field: 'Entrato',
                            formatter: function (value, row) {
                                if (row.Entrato == null)
                                    return null;
                                if (row.Entrato.split('-').length != 3)
                                    return row.Entrato;
                                return row.Entrato.split('-')[2] + '-' + row.Entrato.split('-')[1] + '-' + row.Entrato.split('-')[0];
                            },
                            title: 'Entrato', width: 100, sortable: 'true'
                        },
                        {
                            field: 'Uscito',
                            formatter: function (value, row) {
                                if (row.Uscito == null)
                                    return null;
                                if (row.Uscito.split('-').length != 3)
                                    return row.Uscito;
                                return row.Uscito.split('-')[2] + '-' + row.Uscito.split('-')[1] + '-' + row.Uscito.split('-')[0];
                            },
                            title: 'Uscito', width: 100, sortable: 'true'
                        },
                        {
                            field: 'Data_creazione',
                            formatter: function (value, row) {
                                if (row.Data_creazione == null)
                                    return null;
                                if (row.Data_creazione.split('-').length != 3)
                                    return row.Data_creazione;
                                return row.Data_creazione.split('-')[2] + '-' + row.Data_creazione.split('-')[1] + '-' + row.Data_creazione.split('-')[0];
                            },
                            title: 'Data di creazione', width: 100, sortable: 'true'
                        },
                        {
                            field: 'Data_eliminazione',
                            formatter: function (value, row) {
                                if (row.Data_eliminazione == null)
                                    return null;
                                if (row.Data_eliminazione.split('-').length != 3)
                                    return row.Data_eliminazione;
                                return row.Data_eliminazione.split('-')[2] + '-' + row.Data_eliminazione.split('-')[1] + '-' + row.Data_eliminazione.split('-')[0];
                            },
                            title: 'Data di eliminazione', width: 100, sortable: 'true'
                        }
                    ]]
                });
                //alert("pippo");
            };
            ///////////////////////////////////////////
            for (var i = 0; i < 1; i++) {
                //alert("dg5" + index + '-p' + sP[i]);
                //$("#dg5" + index + '-p' + sP[i]).datagrid('load');
                //$('#dg50-p2202').datagrid('getColumnFields');
                var nomeTabAux = "#dg5" + index + '-f' + sF[i];
                var nomeTabAux2 = "dg5" + index + '-f' + sF[i];
                $(nomeTabAux).datagrid({
                    queryParams: { area: '', zone: '', sector: '', type: '', nome: '', codice: row.elencoFigli },
                    url: 'php/getInfoOggetti.php',
                    view: detailview,
                    detailFormatter: function (index, row) {
                        return '<div style="padding:2px"><table id="' + nomeTabAux2 + 'ddv-' + index + '"></table></div>';
                    },
                    toolbar: [/*{
                        iconCls: 'icon-edit',
                        text: 'Edita',
                        handler: function () { dgInitEdit = true; }
                    }, '-', {
                        iconCls: 'icon-undo',
                        text: 'Termina editazione',
                        handler: function () {
                            dgInitEdit = false;
                            editIndex = undefined;
                            $("#dg5" + index + '-f' + sF[i]).datagrid('reload');
                        }
                    }*/],
                    onExpandRow: function (index, row) {
                        $(nomeTabAux + 'ddv-' + index).datagrid({
                            url: 'php/getDetailsOggetto.php?codicePezzo=' + row.Codice,
                            fitColumns: true,
                            singleSelect: true,
                            rownumbers: false,
                            loadMsg: '',
                            height: 'auto',
                            showHeader: false,
                            rowStyler: function (index, row) {
                                return 'display: table-cell';
                            },
                            columns: [[
                                { field: 'Codice-pezzo', title: 'Codice', hidden: true },
                                { field: 'URL', title: 'Immagine', formatter: formatImage },
                                { field: 'Descrizione', title: 'Descrizione', hidden: true }
                            ]],
                            toolbar: [/*{
                                iconCls: 'icon-edit',
                                text: 'Edita',
                                handler: function () {
                                    update($(nomeTabAux + '#ddv-' + index));
                                }
                            }, '-', {
                                iconCls: 'icon-add',
                                text: 'Aggiungi',
                                handler: function () { append(index, row) }
                            }, '-', {
                                iconCls: 'icon-remove',
                                text: 'Rimuovi',
                                handler: function () { removeit($(nomeTabAux + 'ddv-' + index)) }
                            }, '-', {
                                iconCls: 'icon-save',
                                text: 'Salva',
                                handler: function () { accept(index, row) }
                            }, '-', {
                                iconCls: 'icon-undo',
                                text: 'Annulla',
                                handler: function () { reject($(nomeTabAux + 'ddv-' + index)) }
                            }*/],
                            onResize: function () {
                                $(nomeTabAux).datagrid('fixDetailRowHeight', index);
                            },
                            onDblClickCell: function (index, field, value) {
                                if (field == "URL") {
                                    $.prettyPhoto.open('php/getImmagineOggetto.php?url=' + encodeURIComponent(value) + '&quality=max', index, index);
                                }
                            },
                            onClickCell: function (innerindex, field) {
                            },
                            onLoadSuccess: function () {
                                setTimeout(function () {
                                    $('td[field="URL"]').children('div').css('width', 'auto');
                                    $('.datagrid-body').css('overflow-x', 'visible');
                                    $(nomeTabAux).datagrid('fixDetailRowHeight', index);
                                }, 2000);
                            },
                            onLoadError: function () {
                                alert('error');
                            },
                            onBeforeLoad: function (param) {
                            }
                        });
                        $(nomeTabAux).datagrid('fixDetailRowHeight', index);
                    },

                    columns: [[
                        { field: 'Codice', title: 'Id', width: 100, sortable: 'true' },
                        { field: 'Area', title: 'Area', width: 100, sortable: 'true' },
                        { field: 'Zone', title: 'Zone', width: 100, sortable: 'true' },
                        { field: 'Sector', title: 'Sector', width: 100, sortable: 'true' },
                        { field: 'Area', title: 'Area', width: 100, sortable: 'true' },
                        { field: 'Type', title: 'Type', width: 100, sortable: 'true' },
                        { field: 'Name', title: 'Nome', width: 100, sortable: 'true' },
                        { field: 'Sigla', title: 'Sigla', width: 100, sortable: 'true' },
                        { field: 'Originale', title: 'Originale', width: 100, sortable: 'true' },
                        { field: 'Superficie', title: 'Superficie', width: 100, sortable: 'true' },
                        { field: 'Volume', title: 'Volume', width: 100, sortable: 'true' },
                        { field: 'Descrizione', title: 'Descrizione', width: 100, sortable: 'true' },
                        { field: 'Note', title: 'Note', width: 100, sortable: 'true' },
                        { field: 'Note_storiche', title: 'Note storiche', width: 100, sortable: 'true' },
                        {
                            field: 'Entrato',
                            formatter: function (value, row) {
                                if (row.Entrato == null)
                                    return null;
                                if (row.Entrato.split('-').length != 3)
                                    return row.Entrato;
                                return row.Entrato.split('-')[2] + '-' + row.Entrato.split('-')[1] + '-' + row.Entrato.split('-')[0];
                            },
                            title: 'Entrato', width: 100, sortable: 'true'
                        },
                        {
                            field: 'Uscito',
                            formatter: function (value, row) {
                                if (row.Uscito == null)
                                    return null;
                                if (row.Uscito.split('-').length != 3)
                                    return row.Uscito;
                                return row.Uscito.split('-')[2] + '-' + row.Uscito.split('-')[1] + '-' + row.Uscito.split('-')[0];
                            },
                            title: 'Uscito', width: 100, sortable: 'true'
                        },
                        {
                            field: 'Data_creazione',
                            formatter: function (value, row) {
                                if (row.Data_creazione == null)
                                    return null;
                                if (row.Data_creazione.split('-').length != 3)
                                    return row.Data_creazione;
                                return row.Data_creazione.split('-')[2] + '-' + row.Data_creazione.split('-')[1] + '-' + row.Data_creazione.split('-')[0];
                            },
                            title: 'Data di creazione', width: 100, sortable: 'true'
                        },
                        {
                            field: 'Data_eliminazione',
                            formatter: function (value, row) {
                                if (row.Data_eliminazione == null)
                                    return null;
                                if (row.Data_eliminazione.split('-').length != 3)
                                    return row.Data_eliminazione;
                                return row.Data_eliminazione.split('-')[2] + '-' + row.Data_eliminazione.split('-')[1] + '-' + row.Data_eliminazione.split('-')[0];
                            },
                            title: 'Data di eliminazione', width: 100, sortable: 'true'
                        }
                    ]]
                });
                //alert("pippo");
            };

            ///////////////////////////////////////////
            $('#dg2').datagrid('fixDetailRowHeight', index);
        }
    });


    $("a[rel^='prettyPhoto']").prettyPhoto({ social_tools: false });
});

function resizeCanvas() {
    //var cv = document.getElementById("theCanvas");
    //cv.width = window.innerWidth;
    //cv.height = window.innerHeight;
    //cv.width = $("#centerPanel").width() - 4;
    //cv.height = $("#centerPanel").height() - 4;

    try{
        var scene = SceneJS.scene("the-scene");
        var mc = scene.findNode("maincamera");
        var optics = mc.get("optics");
        optics.aspect = $("#theCanvas").width() / $("#theCanvas").height();
        mc.set("optics", optics);
        //console.log("ratio: " + optics.aspect);
    }
    catch(error) {}
};

function setUploader(idx, row) {
    'use strict';
    // Change this to the location of your server-side upload handler:
    var url = 'fwlib/jQuery-File-Upload-8.4.2/server/php/',
    uploadButton = $('<button/>').addClass('btn').prop('disabled', true).text('Processing...').on('click', function () {
        var $this = $(this), data = $this.data();
        $this.off('click').text('Abort').on('click', function () {
            $this.remove();
            data.abort();
        });
        data.submit().always(function () {
            $this.remove();
        });
    });
    $('input[id^="fileupload"]').each(function (index) {
        var dtinfo = new Array();
        $(this).fileupload({
            row: row,
            dtinfo: dtinfo,
            url: url,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 20000000, // 20 MB
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            previewMaxWidth: 144,
            previewMaxHeight: 144,
            imageMaxWidth: 1600,
            imageMaxHeight: 1600,
            previewCrop: false,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator && navigator.userAgent),
            dropZone: $('#dlg3')
            //                ,processQueue: [
            //                    {
            //                        action: 'loadImage',
            //                        fileTypes: /^image\/(gif|jpeg|png)$/,
            //                        maxFileSize: 20000000 // 20MB
            //                    },
            //                    {
            //                        action: 'resizeImage',
            //                        maxWidth: 1600,
            //                        maxHeight: 1600
            //                    },
            //                    { action: 'saveImage' }
            //                    { action: 'duplicateImage' },
            //                    {
            //                        action: 'resizeImage',
            //                        maxWidth: 192,
            //                        maxHeight: 192
            //                    },
            //                    { action: 'saveImage' }
            //                ]
        }).on('fileuploadadd', function (e, data) {
            //$(this).parents('div:eq(0)').find('img').remove();
            //$(this).parents('div:eq(0)').find('.files').empty();
            data.context = $('<div style="display: inline-block" />').appendTo($(this).parents('div:eq(0)').find('.files'));
            //data.context = $('#files img').replaceWith($('<div/>'))
            $.each(data.files, function (index, file) {
                var node = $('<p/>').append($('<span/>').text(file.name));
                if (!index) {
                    //node.append('<br>').append(uploadButton.clone(true).data(data));
                }
                node.appendTo(data.context);
                //data.file
                //dtinfo[file] = file.lastModifiedDate;
            });
        }).on('fileuploadprocessalways', function (e, data) {
            var index = data.index, file = data.files[index], node = $(data.context.children()[index]);
            if (file.preview) {
                node.prepend('<br>').prepend(file.preview);
            }
            if (file.error) {
                node.append('<br>').append(file.error);
            }
            if (index + 1 === data.files.length) {
                data.context.find('button').text('Upload').prop('disabled', !!data.files.error);
            }
        }).on('fileuploadprogressall', function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $(this).parents('div:eq(0)').find('.bar').css('width', progress + '%');
        }).on('fileuploaddone', function (e, data) {
            $.each(data.result.files, function (index, file) {
                //var link = $('<a>').attr('target', '_blank').prop('href', file.url);
                //$(data.context.children()[index]).wrap(link);
                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();

                try {
                    year = data.files[index].lastModifiedDate.getFullYear();
                    month = data.files[index].lastModifiedDate.getMonth() + 1;
                    day = data.files[index].lastModifiedDate.getDate();
                }
                catch (err) {
                }
                var str = "" + month;
                var pad = "00"
                month = pad.substring(0, pad.length - str.length) + str;
                str = "" + day;
                day = pad.substring(0, pad.length - str.length) + str;

                var insertData = $.ajax({
                    type: 'POST',
                    url: 'php/insertImagePezzo.php',
                    data: {
                        codicePezzo: "" + row.Codice + "",
                        URL: "./" + row.Area + "/" + row.Zone + "/" + row.Sector + "/" + row.Type + "/" + row.Name + "/" + year + month + day + "/" + file.name + "",
                        dataIns: "" + year + "-" + month + "-" + day + "",
                        fileName: "" + file.name + ""
                    },
                    dataType: "text",
                    success: function (resultData) {
                        $('#dlg3').dialog('close');
                        $('#ddv-' + idx).datagrid('reload');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si &egrave; verificato un errore.");
                        $('#dlg3').dialog('close');
                        $('#ddv-' + idx).datagrid('reload');
                    }
                });
            });
        }).on('fileuploadfail', function (e, data) {
            $.each(data.result.files, function (index, file) {
                var error = $('<span/>').text(file.error);
                $(data.context.children()[index]).append('<br>').append(error);
            });
        });

    });

};

function setUploaderInt(idx, row) {
    'use strict';
    // Change this to the location of your server-side upload handler:
    var url = 'fwlib/jQuery-File-Upload-8.4.2/server/php/',
    uploadButton = $('<button/>').addClass('btn').prop('disabled', true).text('Processing...').on('click', function () {
        var $this = $(this), data = $this.data();
        $this.off('click').text('Abort').on('click', function () {
            $this.remove();
            data.abort();
        });
        data.submit().always(function () {
            $this.remove();
        });
    });
    $('input[id^="fileupload"]').each(function (index) {
        var dtinfo = new Array();
        $(this).fileupload({
            row: row,
            dtinfo: dtinfo,
            url: url,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 20000000, // 20 MB
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            previewMaxWidth: 144,
            previewMaxHeight: 144,
            imageMaxWidth: 1600,
            imageMaxHeight: 1600,
            previewCrop: false,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator && navigator.userAgent),
            dropZone: $('#dlg3')
            //                ,processQueue: [
            //                    {
            //                        action: 'loadImage',
            //                        fileTypes: /^image\/(gif|jpeg|png)$/,
            //                        maxFileSize: 20000000 // 20MB
            //                    },
            //                    {
            //                        action: 'resizeImage',
            //                        maxWidth: 1600,
            //                        maxHeight: 1600
            //                    },
            //                    { action: 'saveImage' }
            //                    { action: 'duplicateImage' },
            //                    {
            //                        action: 'resizeImage',
            //                        maxWidth: 192,
            //                        maxHeight: 192
            //                    },
            //                    { action: 'saveImage' }
            //                ]
        }).on('fileuploadadd', function (e, data) {
            //$(this).parents('div:eq(0)').find('img').remove();
            //$(this).parents('div:eq(0)').find('.files').empty();
            data.context = $('<div style="display: inline-block" />').appendTo($(this).parents('div:eq(0)').find('.files'));
            //data.context = $('#files img').replaceWith($('<div/>'))
            $.each(data.files, function (index, file) {
                var node = $('<p/>').append($('<span/>').text(file.name));
                if (!index) {
                    //node.append('<br>').append(uploadButton.clone(true).data(data));
                }
                node.appendTo(data.context);
                //data.file
                //dtinfo[file] = file.lastModifiedDate;
            });
        }).on('fileuploadprocessalways', function (e, data) {
            var index = data.index, file = data.files[index], node = $(data.context.children()[index]);
            if (file.preview) {
                node.prepend('<br>').prepend(file.preview);
            }
            if (file.error) {
                node.append('<br>').append(file.error);
            }
            if (index + 1 === data.files.length) {
                data.context.find('button').text('Upload').prop('disabled', !!data.files.error);
            }
        }).on('fileuploadprogressall', function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $(this).parents('div:eq(0)').find('.bar').css('width', progress + '%');
        }).on('fileuploaddone', function (e, data) {
            $.each(data.result.files, function (index, file) {
                //var link = $('<a>').attr('target', '_blank').prop('href', file.url);
                //$(data.context.children()[index]).wrap(link);
                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();

                try {
                    year = data.files[index].lastModifiedDate.getFullYear();
                    month = data.files[index].lastModifiedDate.getMonth() + 1;
                    day = data.files[index].lastModifiedDate.getDate();
                }
                catch (err) {
                }
                var str = "" + month;
                var pad = "00"
                month = pad.substring(0, pad.length - str.length) + str;
                str = "" + day;
                day = pad.substring(0, pad.length - str.length) + str;

                var insertData = $.ajax({
                    type: 'POST',
                    url: 'php/insertImageIntervento.php',
                    data: {
                        codicePezzo: "" + row.Codice + "",
                        URL: "/Intervento " + row.Codice + "/" + year + month + day + "/" + file.name + "",
                        dataIns: "" + year + "-" + month + "-" + day + "",
                        fileName: "" + file.name + ""
                    },
                    dataType: "text",
                    success: function (resultData) {
                        $('#dlg3').dialog('close');
                        $('#ddv-' + idx + '-i' + row.Codice).datagrid('reload');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si &egrave; verificato un errore.");
                        $('#dlg3').dialog('close');
                        $('#ddv-' + idx + '-i' + row.Codice).datagrid('reload');
                    }
                });
            });
        }).on('fileuploadfail', function (e, data) {
            $.each(data.result.files, function (index, file) {
                var error = $('<span/>').text(file.error);
                $(data.context.children()[index]).append('<br>').append(error);
            });
        });

    });

};








