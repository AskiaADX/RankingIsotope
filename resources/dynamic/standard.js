/* standard_default.js */
$(window).load(function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcRanking({
        instanceId : '{%= CurrentADC.InstanceId%}',
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		forcedImageWidth : {%= CurrentADC.PropValue("forcedImageW") %},
		forcedImageHeight : {%= CurrentADC.PropValue("forcedImageH") %},
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
		forcedResponseWidth : '{%= CurrentADC.PropValue("forcedResponseW") %}',
		forcedResponseHeight : '{%= CurrentADC.PropValue("forcedResponseH") %}',
		forceResponseSize : '{%= CurrentADC.PropValue("forceResponseSize") %}',
		numberNS: {%= CurrentADC.PropValue("numberNS") %},
		showResponseHoverColour: {%= (CurrentADC.PropValue("showResponseHoverColour") = "1") %},
		showResponseHoverFontColour: {%= (CurrentADC.PropValue("showResponseHoverFontColour") = "1") %},
		showResponseHoverBorder: {%= (CurrentADC.PropValue("showResponseHoverBorder") = "1") %},
		showRankMoveControls: {%= (CurrentADC.PropValue("showRankMoveControls") = "1") %},
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
		setMax : parseInt('{%= CurrentADC.PropValue("maxRankedItems") %}'),
		dkActivated : {% If (CurrentQuestion.Type = "multiple") Then %}
										{% If (CurrentQuestion.AvailableResponses[1].IsExclusive) Then %}
											3
										{% ElseIf (CurrentQuestion.AvailableResponses[CurrentQuestion.AvailableResponses.Count].IsExclusive and CurrentQuestion.AvailableResponses[CurrentQuestion.AvailableResponses.Count - 1].IsExclusive) Then %}
											2
										{% ElseIf (CurrentQuestion.AvailableResponses[CurrentQuestion.AvailableResponses.Count].IsExclusive) Then %}
											1
										{% ElseIf (CurrentQuestion.AvailableResponses[CurrentQuestion.AvailableResponses.Count].IsExclusive) Then %}

										{% Else %}
											0
										{% EndIf %}
									{% Else %}
										{% If (CurrentADC.PropValue("dkActivated") = "2") Then %}
											2
										{% ElseIf (CurrentADC.PropValue("dkActivated") = "1") Then %}
											1
										{% Else %}
											0
										{% EndIf %}
									{% EndIf %},
		animatedResponses : {%= (CurrentADC.PropValue("animatedResponses") = "1") %},
		layout : '{%= CurrentADC.PropValue("responseLayout") %}',
      	currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
      	type: '{%:= CurrentQuestion.Type %}',
		items : [
      {% If (CurrentQuestion.Type = "numeric" ) Then %}
      {%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
      {% Else %}
      {%:= CurrentADC.GetContent("dynamic/standard_multiple.js").ToText()%}
      {% EndIf %}
		]
	});
});
