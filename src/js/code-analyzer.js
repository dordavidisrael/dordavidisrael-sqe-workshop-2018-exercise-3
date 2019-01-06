import * as esprima from 'esprima';
import * as esgraph from 'esgraph';

let graphLines=[];
let gloablDictionary={};
let regularDictionary={};
let arrowLines=[];
let onlyLines=[];
let codeLines=[];


/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const parseCode = (codeToParse) => {
    arrowLines=[];
    onlyLines=[];
    codeLines=codeToParse.split('\n');
    return esprima.parseScript(codeToParse,{range:true,loc:true});
};
const parseCode1 = (codeToParse) => {
    return esprima.parseScript(codeToParse,{range:true,loc:true});
};

const initglobals=()=>{
    graphLines=[];
    gloablDictionary={};
    regularDictionary={};
    arrowLines=[];
    onlyLines=[];
};
const bigFunc =(parsed,parameters,code)=> {
    initglobals();
    let params = parsed.body[0].params;
    if (params.length > 0) {params_handle(params, parameters);}
    let c=esgraph(parsed.body[0].body);
    let graphObject=esgraph.dot(c,{counter:0,source:code});
    graphLines=graphObject.split('\n');
    clean();clean2();
    graphLines=fixarr(graphLines);
    let b=[];
    b.push(c[2][1]);
    arrow();
    graphBuilder(b,'green',0);
    graphLines=addnum();
    let d=arr2str();
    return d;
};

const arrow=()=>{
    for(let i=0;i<graphLines.length;i++){
        if(graphLines[i].includes('->')){
            arrowLines.push(graphLines[i]);
        }
        else{
            onlyLines.push(graphLines[i]);
        }
    }
};
const addnum=()=>{
    let num=1;
    for(let i=0;i<graphLines.length;i++){
        if(graphLines[i].includes('label')&&!graphLines[i].includes('->')){
            let a=graphLines[i].substring(0,graphLines[i].indexOf('=')+2);
            a=a+'-'+num+'-'+'\n';
            a+=graphLines[i].substring(graphLines[i].indexOf('=')+2);
            graphLines[i]=a;
            num++;
        }
    }
    addShape();
    return graphLines;
};

const addShape=()=>{
    for(let i=0;i<graphLines.length;i++){
        if(!graphLines[i].includes('->')){
            if(!graphLines[i].includes('shape')){
                graphLines[i]=addShapehelper(graphLines[i]);
            }
        }
    }
};

const addShapehelper=(str)=>{
    let a=str.substring(0,addShapehelper_findindex(str));
    if(checksign(str)){
        a+=', shape=diamond';
        a+=']';
    }
    else{
        a+=', shape=squre';
        a+=']';
    }
    return a;

};

const addShapehelper_findindex=(str)=>{
    for(let i=str.length-1;i>0;i--){
        if(str.charAt(i)===']'){
            return i;
        }
    }
};

const checksign=(str)=>{
    if(str.includes('>')||str.includes('<')||str.includes('===')){
        return true;
    }
    return false;

};

const findindex=(str,sign)=>{
    let arr=findindex1(str);
    if(arr.length===1){
        let s=arr[0].substring(arr[0].indexOf('->')+3).trim();
        s=s.substring(0,s.indexOf(' ')).trim();
        return findLine(s.trim());
    }
    if(arr.length>1){
        for(let i=0;i<arr.length;i++){
            if(!(arr[i].includes(sign))){
                arr[i]='';
                arr=fixarr(arr);i=-1;
            }
        }
        let st=arr[0].substring(arr[0].indexOf('->')+3);
        st=st.substring(0,st.indexOf(' '));
        return findLine(st.trim());
    }
};
const findindex1=(str)=>{
    let str1=str+' ->';
    let arr=[];
    for(let i=0;i<arrowLines.length;i++){
        if(arrowLines[i].includes(str1)){
            arr.push(arrowLines[i]);
        }
    }

    return arr;
};
const  findLine=(str)=>{
    for(let i=0;i<onlyLines.length;i++){
        if(onlyLines[i].includes(str)){
            return i.toString();
        }
    }
};
/*
const MergeNode=(arr)=>{
    arr=fixarr(arr);
    for(let i=0;i<arr.length-1;i++){
        let a=arr[i];
        let b=arr[i+1];
        if(a.includes('let')&&b.includes('let')){
            arr=MergeLines(arr,i,i+1);
            arr=fixarr(arr);
            i=-1;
        }
    }
    arr=cleansign(arr);
    return arr;
};
const MergeLines=(arr,i,j)=>{
    let a_index=arr[i].indexOf('%!@');
    let first=arr[i].substring(0,a_index);
    let first2=arr[i].substring(a_index+4);
    let name2del = arr[j].substring(0,arr[j].indexOf(' ')).trim();
    let name2stay = arr[i].substring(0,arr[j].indexOf(' ')).trim();
    let b_index=arr[j].indexOf('=')+1;
    let b_index_finish=arr[j].indexOf('%!@');
    let second=arr[j].substring(b_index+1,b_index_finish);
    first=first+'\n'+second+'%!@'+'" '+first2;
    arr[i]=first;
    arr[j]='';
    deletename(arr,name2del,name2stay);
    return arr;
};

const deletename=(arr,nam,name2stay)=>{
    let arr2=[];
    let arr_index=[];
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('-> '+nam)){
            arr[i]='';
        }
    }

    for(let i=0;i<arr.length;i++){
        if(arr[i].startsWith(nam)){
            arr_index.push(i);
            arr2.push(arr[i].substring(arr[i].indexOf('>')+1,arr[i].indexOf('[')).trim());
            arr[i]='';
        }
    }
    let curr=arr_index[0];
    let counter=0;
    for(let i=0;i<arr2.length;i++){
        arr[curr]=(name2stay+' -> '+arr2[i]+' []');
        counter++;
        curr=arr_index[counter];
    }
    return arr;
};
 */
const fixarr=(arr)=>{
    let counter=0;
    let arr1=[];
    for(let i=0;i<arr.length;i++){
        if(arr[i]!=''){
            arr1[counter]=arr[i];
            counter++;
        }
    }
    return arr1;
};
const graphBuilder=(c,color,index)=>{
    let element;
    for(let i=0;i<c.length;i++) {
        element = c[i];
        if (element.astNode && (!(element.color))) {
            if (element.astNode.type === 'VariableDeclaration') {
                variableDec(c, color, element,index);
            }
            else {graphBuilder2(c,color,index,element);}
        }
    }
};
const graphBuilder2=(c,color,index,element)=>{
    if (element.astNode.type === 'AssignmentExpression') {
        AE(c, color, element,index);
    }
    else if (element.astNode.type === 'BinaryExpression') {
        let evalres = check_if(element.astNode);
        element.color = color;
        BS(c, color, element, evalres,index);
    }
    else {
        //  if (element.astNode.type === 'ReturnStatement')
        Ret(c, color, element,index);
    }
};
/*
const cleansign=(arr)=>{
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('%!@')){
            let first=arr[i].indexOf('%!@');
            let firs=arr[i].substring(0,first);
            let seco=arr[i].substring(first+4);
            arr[i]=firs+'"'+seco;
        }
    }
    return arr;
};

const checkstring=(str)=>{
    let ans = isNaN(str);
    if(ans){
        if(str.includes('-(')){ans=false;}
        str = '\''+str+'\'';
        return str;
    }
    else{return str;}
};


*/
const variableDec=(c,color,element,index)=>{
    let str=graphLines[index].substring(0,graphLines[index].indexOf(';'));
    //+'%!@';
    str=str+'", style=filled,color=green,  shape=square ]';
    //else{str=str+'" ,  shape=square ]';}

    let startStat = graphLines[index].indexOf('let')+4;
    let endStat = graphLines[index].indexOf(';');
    updateDic(graphLines[index].substring(startStat,endStat));

    let new_str=graphLines[index].substring(0,graphLines[index].indexOf(' '));
    let new_index=findindex(new_str);
    graphLines[index] =str;
    element.color=color;
    graphBuilder(element.next,color,new_index);
};
const AE=(c,color,element,index)=>{
    let startStat = graphLines[index].indexOf('"')+1;
    let str1=graphLines[index].substring(graphLines[index].indexOf('"')+1);
    let endStat = str1.indexOf('"');
    updateDic1(graphLines[index].substring(startStat,startStat+endStat));

    let str=graphLines[index].substring(0,startStat+endStat+1);
    str=str+' , style=filled,color='+color+',  shape=square ]';

    let new_str=graphLines[index].substring(0,graphLines[index].indexOf(' '));
    let new_index=findindex(new_str);
    graphLines[index] =str;


    element.color=color;
    graphBuilder(element.next,color,new_index);
};
const BS=(c,color,element,evalres,index)=>{
    let str=graphLines[index].substring(0,graphLines[index].indexOf('"')+1);
    let tempstr=graphLines[index].substring(graphLines[index].indexOf('"')+1);
    str+=tempstr.substring(0,tempstr.indexOf('"')+1);

    str=str+' , style=filled,color='+color+', shape=diamond]';
    if(!codeLines[element.astNode.loc.start.line-1].includes('while')) {
        takecareif(c, color, evalres, element, index,str);
    }
    else{takecarewhile(c, color, evalres, element, index,str);}
};

const takecareif=(c, color, evalres, element, index,str)=>{
    graphLines[index] = str;
    //let global_old = copyDIC(gloablDictionary);
    //let regular_old = copyDIC(regularDictionary);
    if (evalres && element.true.astNode) {
        TakeCareRight(c, color, evalres, element, index);
    }
    //gloablDictionary = global_old;
    //regularDictionary = regular_old;
    if (!evalres && element.false.astNode) {
        TakeCareFalse(c, color, evalres, element, index);
    }
    // gloablDictionary = global_old;
    // regularDictionary = regular_old;
};
const takecarewhile=(c, color, evalres, element, index,str)=>{
    graphLines[index] = str;
    //let global_old = copyDIC(gloablDictionary);
    //let regular_old = copyDIC(regularDictionary);
    if (evalres && element.true.astNode) {
        TakeCareRight(c, color, evalres, element, index);
    }
    //gloablDictionary = global_old;
    //regularDictionary = regular_old;
    if (element.false.astNode) {
        TakeCareFalse(c, color, evalres, element, index);
    }
    //gloablDictionary = global_old;
    //regularDictionary = regular_old;
};

const TakeCareFalse=(c,color,evalres,element,index)=>{
    let new_str=graphLines[index].substring(0,graphLines[index].indexOf(' '));
    let new_index=findindex(new_str,'false');
    let b=[];
    b.push(element.false);
    graphBuilder(b,'green',new_index);
};
const TakeCareRight=(c,color,evalres,element,index)=>{
    let b=[];
    let new_str=graphLines[index].substring(0,graphLines[index].indexOf(' '));
    let new_index=findindex(new_str,'true');
    b.push(element.true);
    graphBuilder(b,'green',new_index);
};
const Ret=(c,color,element,index)=>{
    element.color=color;
    let str = graphLines[index].substring(0, graphLines[index].indexOf(';')) + '"';
    str = str + ', style=filled,color=green,shape=square]';
    graphLines[index] = str;
};


const updateDic=(obj)=>{
    let name=obj.substring(0,obj.indexOf('=')).trim();
    let value=obj.substring(obj.indexOf('=')+1);
    let o=parseCode1(value);
    if(o.body[0].expression.type==='ArrayExpression'){
        arrayHandler1(o,name);
    }
    else {
        regularDictionary[name] = calculateNum(interpet(value));
    }
};

const arrayHandler1=(entry,name)=>{
    let arr=entry.body[0].expression.elements;
    // i think that i can get only literal and unary expression here in a value in the array!!
    for(let i=0;i<arr.length;i++){
        if(arr[i].type==='Literal'){
            regularDictionary[name+'['+i+']']=arr[i].raw;
        }
        else {
            // if(arr[i].type==='UnaryExpression')
            regularDictionary[name+'['+i+']']=unarySolver(arr[i].argument);
        }
    }
};

const updateDic1=(obj)=>{
    let name=obj.substring(0,obj.indexOf('=')).trim();
    let value=obj.substring(obj.indexOf('=')+1);
    let o=parseCode1(value);
    if(o.body[0].expression.type==='ArrayExpression'){
        arrayHandler1(o,name);
    }
    else {
        regularDictionary[name] = calculateNum(interpet(value));
    }
};

const params_handle=(params,arg)=>{
    let i=0;
    let args=arg.body[0].expression.expressions;
    if(!args){
        let z=arg.body[0].expression;
        args = [];
        args.push(z);
    }
    params.forEach(function(entry) {
        //if(entry.type==='Identifier'){
        Args_handle(args[i], entry.name);
        i++;
        // }
    });
};
const Args_handle=(elem,name)=>{
    if(elem.type==='Literal'){gloablDictionary[name]=(elem.raw);}
    //else if(elem.type==='BinaryExpression'){return(input[elem.loc.start.line-1].substring(elem.loc.start.column,elem.loc.end.column));}
    else if(elem.type==='ArrayExpression'){arrayHandler(elem.elements,name);}
    else{
        gloablDictionary[name]=unarySolver(elem);
        // (elem.type==='UnaryExpression')
    }
};

const arrayHandler=(arr,name)=>{
    // i think that i can get only literal and unary expression here in a value in the array!!
    for(let i=0;i<arr.length;i++){
        if(arr[i].type==='Literal'){
            gloablDictionary[name+'['+i+']']=arr[i].raw;
        }
        else {
            // if(arr[i].type==='UnaryExpression')
            gloablDictionary[name+'['+i+']']=unarySolver(arr[i].argument);
        }
    }
};

/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const clean = ()=>{
    for(let i=0;i<graphLines.length;i++){
        if(graphLines[i].includes('exception')||graphLines[i].includes('n0')){
            graphLines[i]='';
        }
    }
};
const clean2 =()=>{
    let z='';
    for(let i=0;i<graphLines.length;i++){
        if(graphLines[i].includes('exit')){
            z=graphLines[i].substring(0,graphLines[i].indexOf('[')).trim();
        }
    }

    for(let i=0;i<graphLines.length;i++){
        if(graphLines[i].includes(z)){
            graphLines[i]='';
        }
    }
};
const cleanLet =()=>{
    for(let i=0;i<graphLines.length;i++){
        if(graphLines[i].includes('let')){
            let z=graphLines[i].substring(0,graphLines[i].indexOf('let'));
            z+=graphLines[i].substring(graphLines[i].indexOf('let')+3);
            graphLines[i]=z;
        }
    }
};
const getvalue=(item)=>{
    if(regularDictionary.hasOwnProperty(item)){return regularDictionary[item];}
    else{return gloablDictionary[item];}
};
const interpet=(st)=>{
    st=st+' ';
    let arr = st.split(' ');
    for(let i=0;i<arr.length;i++){
        if(arr[i]!=''){
            if(gloablDictionary.hasOwnProperty(arr[i])||regularDictionary.hasOwnProperty(arr[i])){
                arr[i]=getvalue(arr[i]);
            }
        }
    }
    return arr2str1(arr);
};
const arr2str=()=>{
    cleanLet();
    let s='';
    graphLines=fixarr(graphLines);
    for(let i=0;i<graphLines.length;i++){
        s+=graphLines[i]+'\n';
    }
    return s;
};
const arr2str1=(arr)=>{
    let s='';
    for(let i=0;i<arr.length;i++){
        if(arr[i]!=''){
            s+=arr[i];
        }
    }
    return s;
};
const calculateNum=(num)=>{
    let i=-100;
    let flagg=true;
    while(i<1000 && flagg){
        let str =num+'==='+i;
        if(eval(str)){flagg=false;}
        else{i++;}
    }
    if(i===1000){return num;}
    return i.toString();
};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const check_if=(entry)=>{
    let left=HandleIF(entry.left);
    let right=HandleIF(entry.right);
    let operator = entry.operator;
    left=interpet(left);
    right=interpet(right);
    //right=checkstring(right);
    //left=checkstring(left);
    return eval(left+operator+right);

};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const memberExpression_solver=(element)=>{
    let v=[];
    v.push(element.object.name);
    v.push('[');
    let s='';
    if(element.property.type==='Literal'){v.push(element.property.raw);}
    else {
        // if(element.property.type==='Identifier')
        v.push(getvalue(element.property.name));
    }
    //else {v.push(binaryCare(element.property));}
    v.push(']');
    for(let i=0;i<v.length;i++){
        s=s+v[i];
    }
    return s;
};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const unarySolver=(element)=>{
    let s='';
    let v=[];
    if(element.type==='Literal'){v.push(element.raw);}
    else if(element.type==='Identifier'){v.push(getvalue(element.name));}
    //else{unarySolver1(element,v);}
    // to remember on the checks -> i hide the binaryexpression and memberexpression as unari.
    for(let i=0;i<v.length;i++){
        s=s+v[i];
    }
    return '-('+s+')';
};
/*
const unarySolver1=(element,v)=>{
    if(element.type==='BinaryExpression'){v.push(binaryCare(element));}
    else if(element.type==='MemberExpression'){v.push(memberExpression_solver(element));}
};
*/
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const binaryCare=(entry)=>{
    let arr=[],arr1=[];
    let s='';
    binaryEXPsolve_helper(entry,arr);
    for(let i=0;i<arr.length;i=i+2) {
        if (arr[i].type === 'Literal') {
            arr1[i] = arr[i].raw;
        }
        else {binaryCare2(entry,arr,arr1,i);}
        s=s+arr1[i]+' ';
        if(!(i===arr.length-1))s=s+arr[i+1]+' ';
    }
    return s;
};
const binaryCare2=(entry,arr,arr1,i)=>{
    if (arr[i].type === 'Identifier') {
        arr1[i] =arr[i].name;
    }
    else if (arr[i].type === 'UnaryExpression') {
        arr1[i] = unarySolver(arr[i].argument);
    }
    else if (arr[i].type === 'MemberExpression') {
        arr1[i] = memberExpression_solver(arr[i]);
    }
    else {
        // if (arr[i].type === 'BinaryExpression')
        arr1[i] = binaryCare(arr[i]);
    }
};
const binaryEXPsolve_helper=(entry,arr)=>{
    if(entry.left.type==='BinaryExpression'){
        binaryEXPsolve_helper(entry.left,arr);
        arr.push(entry.operator);
        arr.push(entry.right);
    }
    else{
        arr.push(entry.left);
        arr.push(entry.operator);
        arr.push(entry.right);
    }
};
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
/*
const getName=(x)=>{
    if(x.type==='Identifier'){return x.name;}
    else {return TakeCareMemberC(x);}
};
const TakeCareMemberC=(entry)=>{
    let s=entry.object.name;
    s=s+'[';
    s=s+BigTakeCare(entry.property);
    s=s+']';
    return s;
};
const BigTakeCare=(x)=>{
    if(x.type==='Identifier'){return x.name;}
    else if(x.type==='Literal'){return x.raw;}
    //if(x.type==='BinaryExpression'){}
};
*/
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
const HandleIF=(entry)=>{
    if(entry.type==='Literal'){return entry.raw;}
    else if(entry.type==='Identifier'){return entry.name;}
    else if(entry.type==='BinaryExpression'){return binaryCare(entry);}
    else { return HandleIF2(entry);}
};
const HandleIF2=(entry)=>{
    if(entry.type==='MemberExpression'){
        return memberExpression_solver(entry);
    }
    else{//if(entry.type==='UnaryExpression')
        return unarySolver(entry.argument);
    }
};
/*
const copyDIC=(old)=>{
    let had = {};
    for(var key in old){
        had[key]= old[key];
    }
    return had;
};
*/
/*--------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------*/
export {parseCode,bigFunc,parseCode1};
