/* standard_multiple.js */
{% 
Dim i 
Dim ar = CurrentQuestion.AvailableResponses
Dim inputName
For i = 1 To ar.Count 
	inputName = ar[i].InputName("ranking").replace(" ", "_")
%}
	{element : $('#{%= inputName%}'), count : {%= i %} , order : {%= ar[i].Order %}}{%= On(i < ar.Count, ",", "") %}
{% Next %}