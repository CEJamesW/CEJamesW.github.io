<%
  if Session("admin")="" then
		   Response.Write("<script>alert('�û�δ��¼�����¼');top.location='login.asp';</script>")
		   Response.end
  end if
  session.Abandon()
  Response.Redirect("login.asp")
%>