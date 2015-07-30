/* standard_default.js */
$(window).load(function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcRanking({
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
		otherRID : '{%= CurrentADC.PropValue("otherRID") %}',
		otherQID : '{%= CurrentADC.PropValue("otherQID") %}',
		setMax : parseInt('{%= CurrentADC.PropValue("maxRankedItems") %}'),
		dkActivated : {%= (CurrentADC.PropValue("dkActivated") = "1") %},
		layout : '{%= CurrentADC.PropValue("responseLayout") %}',
		items : [
			{%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
		]
	});
});