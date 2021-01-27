<%
set conn=server.createobject("adodb.connection")
connstr="Provider=Microsoft.jet.oledb.4.0;data source="&server.mappath("../mdb/#@drwl.mdb")
conn.open connstr
%>