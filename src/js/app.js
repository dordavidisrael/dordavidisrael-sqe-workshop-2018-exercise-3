import $ from 'jquery';
import {parseCode,bigFunc,parseCode1} from './code-analyzer';
const viz=require('viz.js');

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parameter = $('#codePlaceholder1').val();
        parameter = parseCode1(parameter);
        let parsedCode = parseCode(codeToParse);
        let x = document.getElementById('t').rows[1].cells;

        let d=bigFunc(parsedCode,parameter,codeToParse);
        let v=viz('digraph{'+d+'}');
        x[1].innerHTML=v;

    });
});
