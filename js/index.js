// class name s
var Global_Tline="Tline";
var Global_Tannotation="Tannotation";
var Global_Tinner="Tinner";
var Global_Tsource="Tsource";
var Global_Tlocal="Tlocal";
var Global_Bdelete="button-editor-delete";
// id name s = class name s + source name



function _setAttributes(ele,cn,id)
{
	ele.className=cn;
	ele.id=id;
}
function _setAttributes_tvt(ele,cn,id,type,value,tabindex)
{
	ele.className=cn;
	ele.id=id;
	ele.setAttribute("type",type);
	ele.setAttribute("value",value);
	ele.setAttribute("tabindex",tabindex);
}
function _setAttributes_it(ele,cn,id,inner_content,tabindex)
{
	ele.className=cn;
	ele.id=id;
	ele.innerText=inner_content;
	ele.setAttribute("tabindex",tabindex);
}
function appendLine(ele_name,inner_name,source_name,result_name)
{
	if(ele_name=="" || inner_name=="" || source_name=="")
		return;
	// class id type readonly value tabindex
	var line=document.createElement("div");
	_setAttributes(line,Global_Tline,Global_Tline+source_name);

	// var TinnerName=document.createElement("input");
	var TinnerName=document.createElement("textarea");
	// _setAttributes_tvt(TinnerName,Global_Tinner,Global_Tinner+source_name,"input",inner_name,"-1");
	_setAttributes_it(TinnerName,Global_Tinner,Global_Tinner+source_name,inner_name,"-1");
	TinnerName.setAttribute("readonly","true");

	// var TsourceName=document.createElement("input");
	// _setAttributes_tvt(TsourceName,Global_Tsource,Global_Tsource+source_name,"input",source_name,"-1");
	var TsourceName=document.createElement("textarea");
	_setAttributes_it(TsourceName,Global_Tsource,Global_Tsource+source_name,source_name,"-1");
	TsourceName.setAttribute("readonly","true");

	// var TresultName=document.createElement("input");
	// _setAttributes_tvt(TresultName,Global_Tlocal,Global_Tlocal+source_name,"input",result_name,"1");
	var TresultName=document.createElement("textarea");
	_setAttributes_it(TresultName,Global_Tlocal,Global_Tlocal+source_name,result_name,"1");

	var Bdelete=document.createElement("input");
	_setAttributes_tvt(Bdelete,Global_Bdelete,Global_Bdelete+source_name,"button","移除","-1");

	line.appendChild(TinnerName);
	line.appendChild(TsourceName);
	line.appendChild(TresultName);
	// line.appendChild(Bdelete);

	document.getElementById(ele_name).appendChild(line);
}
function appendAnnotation(ele_name,annotation_content)
{
	// annotation
	var line=document.createElement("div");
	_setAttributes(line,Global_Tannotation,"");
	var Tannotation=document.createElement("p");
	Tannotation.innerText=annotation_content;

	line.appendChild(Tannotation);

	document.getElementById(ele_name).appendChild(line);
}


var lang_source;
var lang_source_lines;

var step_now=0;
function _isAnnotation(str)
{
	// 如果包含等于号 则判断不是注释
	var i;
	for(i=0;i<str.length;i++)
	{
		if(str[i]=="=")
		return false;
	}

	return true;
}

$("#button-input").click(function(){
	if(step_now!=0)
		return;
	step_now=1;
	$("#cb-edit").click();
	document.getElementById("box-sourceLang").setAttribute("readonly","true");
	$(this).hide();
	// $("#side-button-input").css("background-color","green");
	$("#button-make").show();


	// 分析过程
	//
	lang_source=document.getElementById("box-sourceLang").value;
	lang_source_lines=lang_source.split('\n');

	var i=0;
	for(i=0;i<lang_source_lines.length;i++)
	{
		if(_isAnnotation(lang_source_lines[i])) // 注释行
		{
			if(lang_source_lines[i].trim().length<2)
				continue;
			appendAnnotation("editor-box",lang_source_lines[i]);
		}
		else
		{
			var strs=lang_source_lines[i].split('=');
			if(strs.length<3)
				strs.push("");
			appendLine("editor-box",strs[0],strs[1],strs[2]);
		}

	}

	// 只读化
	document.getElementById("box-sourceLang").setAttribute("readonly","true");

	// $("."+Global_Tsource).css("margin","5px");
	applyStyles();
});
$("#button-make").click(function(){
	if(step_now!=1)
		return;
	step_now=2;
	$("#cb-make").click();
	$(this).hide();
	// $("#side-button-edit").css("background-color","green");
	// $("#side-button-make").css("background-color","green");
	$("#button-middle").show();


	// 组装过程
	
	var i;
	var box_output=document.getElementById("output-box");
	box_output.innerText+="组装结果\r\n";


	for(i=0;i<document.getElementsByClassName(Global_Tinner).length;i++)
	{
		box_output.innerText+=document.getElementsByClassName(Global_Tinner)[i].innerText+"=";

		if(document.getElementsByClassName(Global_Tlocal)[i].value!="")
		{
			box_output.innerText+=document.getElementsByClassName(Global_Tlocal)[i].value;
		}
		else
		{
			box_output.innerText+=document.getElementsByClassName(Global_Tsource)[i].value;
		}

		box_output.innerText+="\r\n";

		document.getElementsByClassName(Global_Tlocal)[i].setAttribute("readonly","true");

	}

	// 组装完成后 目标语言只读
	$("#output-box").css("border","1px green solid");
});
$("#button-middle").click(function(){
	if(step_now!=2)
		return;
	step_now++;
	$(this).hide();
	// 中转过程
	//
	var i;
	var box_output=document.getElementById("output-box-middle");
	box_output.innerText+="编辑器中转语言\r\n";

	for(i=0;i<document.getElementsByClassName(Global_Tinner).length;i++)
	{
		box_output.innerText+=document.getElementsByClassName(Global_Tinner)[i].innerText+"=";
		box_output.innerText+=document.getElementsByClassName(Global_Tsource)[i].value+"=";
		box_output.innerText+=document.getElementsByClassName(Global_Tlocal)[i].value;
		
		box_output.innerText+="\r\n";

	}
	
	$("#output-box-middle").css("border","1px green solid");
});

/*
多行显示太长的字段
没有填写目标就用源语言
*/

function applyStyles()
{
	$("."+Global_Tline).css("border","1px #02C874 solid");

	$("."+Global_Tlocal).css("margin","5px");
	$("."+Global_Tinner).css("margin","5px");
	$("."+Global_Tsource).css("margin","5px");

	$("."+Global_Tsource).attr("cols","30");
	$("."+Global_Tsource).attr("rows","1");
	$("."+Global_Tinner).attr("cols","30");
	$("."+Global_Tinner).attr("rows","1");
	$("."+Global_Tlocal).attr("cols","30");
	$("."+Global_Tlocal).attr("rows","1");

	var all_textarea=document.getElementsByClassName(Global_Tinner);
	var i;
	for(i=0;i<all_textarea.length;i++)
	{
		if(all_textarea[i].innerHTML.length<30)
			continue;
		if(all_textarea[i].innerHTML.length>30 && all_textarea[i].innerHTML.length<90)
			all_textarea[i].setAttribute("rows","3");
		else if(all_textarea[i].innerHTML.length<180)
			all_textarea[i].setAttribute("rows","6");
		else
			all_textarea[i].setAttribute("rows","12");
	}
	all_textarea=document.getElementsByClassName(Global_Tsource);
	all_textarea2=document.getElementsByClassName(Global_Tlocal);
	for(i=0;i<all_textarea.length;i++)
	{
		if(all_textarea[i].innerHTML.length<30)
			continue;
		if(all_textarea[i].innerHTML.length>30 && all_textarea[i].innerHTML.length<90)
		{
			all_textarea[i].setAttribute("rows","3");
			all_textarea2[i].setAttribute("rows","3");
		}
		else if(all_textarea[i].innerHTML.length<180)
		{
			all_textarea[i].setAttribute("rows","6");
			all_textarea2[i].setAttribute("rows","6");
		}
		else
		{
			all_textarea[i].setAttribute("rows","12");
			all_textarea2[i].setAttribute("rows","12");
		}
	}
}


// 界面相关函数
var style_temp=0;
$(".dynamicStyle").mouseenter(function (){
	style_temp=$(this).css("background-color");
	$(this).css("background-color","#3399CC");
});
$(".dynamicStyle").mouseleave(function (){
	$(this).css("background-color",style_temp);
});

// $(".main-box-item").hide();
// $(".main-box-button").hide();

$("#cb-reload").css("background-color","crimson");
$("#cb-clear").css("background-color","darkred");
$(".cbis").hide();
$(".cbi1").show();

$("#cb-input").click(function(){
	$(".main-box-item").hide();
	$("#box-input").show();
	$(".cbis").hide();
	if(step_now==0)
		$(".cbi1").show();
});
$("#cb-edit").click(function(){
	$(".main-box-item").hide();
	$("#box-edit").show();
	$(".cbis").hide();
	if(step_now==1)
		$(".cbi2").show();
	$("#cb-clear").hide(); // 暂时不显示清空按钮
});
$("#cb-make").click(function(){
	$(".main-box-item").hide();
	$("#box-output").show();
	$(".cbis").hide();
	if(step_now==2)
		$(".cbi3").show();
});
$("#cb-reload").dblclick(function(){
	location.reload();
});
$("#cb-help").click(function(){
	$(".main-box-item").hide();
	$("#box-help").show();
	$(".cbis").hide();
});

$("#cb-new").click(function(){
	$("#bar-edit-new").show();
});

// 编辑界面上的删除按钮
$("."+Global_Bdelete).click(function(){
	$(this).parent().remove();
});

// 编辑界面上的新增按钮
$("#input-new-create").click(function(){
	if(document.getElementById("input-new-inner").value.trim()==""
	||document.getElementById("input-new-source").value.trim()=="")
		alert("内部名称或源语言不可为空");
	else
	{
		appendLine("editor-box",document.getElementById("input-new-inner").value.trim(),
		document.getElementById("input-new-source").value.trim(),
		document.getElementById("input-new-result").value.trim());

		$("#input-new-cancel").click();
	}
});
$("#input-new-cancel").click(function(){
	document.getElementById("input-new-inner").value="";
	document.getElementById("input-new-source").value="";
	document.getElementById("input-new-result").value="";
	$("#bar-edit-new").hide();
});

$("#cb-input").click();
$("#input-new-cancel").click();
$("#cb-clear").hide();