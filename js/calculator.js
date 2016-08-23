// Calculate Model Outcome
$( document ).ready(function() {
  function getValue(id){
    return parseFloat($('#' + id)[0].value)
  }
  // Interactive range slider value labels
  $('#savings_loss_range, #savings_loss_range_bottom').on('change, input', function(range){
    $('#savings_loss_range_value, #savings_loss_range_bottom_value').each(function(i,v) {
      v.innerHTML = '(+/-) ' + parseFloat(range.target.value).toFixed(1) + '%';
    });
  });
  $('#marginal_risk_assumption, #marginal_risk_assumption_bottom').on('change, input', function(range){
    $('#marginal_risk_assumption_value, #marginal_risk_assumption_bottom_value').each(function(i,v) {
      v.innerHTML = parseInt(range.target.value) + '%';
    });
  });
  $('#upside_performance_assumption, #upside_performance_assumption_bottom').on('change, input', function(range){
    $('#upside_performance_assumption_value, #upside_performance_assumption_bottom_value').each(function(i,v) {
      v.innerHTML = parseFloat(range.target.value).toFixed(1) + '%';
    });
  });
  $('#budget_scale_factor, #budget_scale_factor_bottom').on('change, input', function(range){
    $('#budget_scale_factor_value, #budget_scale_factor_bottom_value').each(function(i,v) {
      v.innerHTML = parseFloat(range.target.value).toFixed(1);
    });
  });
  // Sync top and bottom inputs
  $('.sync-input').on('change, input', function(input){
    $('#' + input.target.id.replace('_bottom',''))[0].value = input.target.value;
  });
  $('.factor-input').on('change, input', function(input){
    $('#' + input.target.id + '_bottom')[0].value = input.target.value;
  });
  function calculateOutcome() {
    // Get user-entered factors
    var part_b_revenue = getValue('part_b_revenue'),
        patients_per_panel = getValue('patients_per_panel'),
        per_beneficiary_spending = getValue('per_beneficiary_spending'),
        savings_loss_range = getValue('savings_loss_range') * 0.01,
        marginal_risk_assumption = getValue('marginal_risk_assumption') * 0.01,
        upside_performance_assumption = getValue('upside_performance_assumption') * 0.01,
        budget_scale_factor = getValue('budget_scale_factor')
    // APM calculations
    var five_percent = 0.05 * part_b_revenue
    var patient_spending = patients_per_panel * per_beneficiary_spending
    var shared_upside = (patient_spending - (patient_spending - patient_spending * savings_loss_range)) * marginal_risk_assumption
    var shared_downside = (patient_spending - (patient_spending + patient_spending * savings_loss_range)) * marginal_risk_assumption
    var total_upside = five_percent + shared_upside;
    var total_downside = five_percent + shared_downside;
    // Calculate MIPS over time based on fixed performance range
    var performance_range_values = [0.04, 0.05, 0.07, 0.09];
    var mips_performance_upside = part_b_revenue * upside_performance_assumption;
    var mips_adjustments_upside_values = [];
    var mips_adjustments_downside_values = [];
    for (i in performance_range_values) {
      mips_adjustments_upside_values.push( part_b_revenue * performance_range_values[i] );
      mips_adjustments_downside_values.push( part_b_revenue * performance_range_values[i] * -1 );
    };
    var mips_budget_neutral_upside_values = [];
    for (i in mips_adjustments_upside_values) {
      mips_budget_neutral_upside_values.push( (mips_adjustments_upside_values[i] + mips_performance_upside) * budget_scale_factor );
    }
    // Render the chart for MIPS and APM values over time
  	var chart = new CanvasJS.Chart("chartContainer",
  	{
  		title:{
  			text: "Projected Revenue Range (per clinician)",
        fontFamily: 'Open Sans'
  		},
  		exportEnabled: false,
  		axisX: {
        labelFontFamily: 'Open Sans'
  		},
  		axisY: {
  			includeZero:true,
  			prefix: "$",
        labelFontFamily: 'Open Sans'
  		},
  		toolTip: {
  			shared: true,
        fontFamily: 'Open Sans'
  		},
      legend: {
        fontFamily: 'Open Sans',
        horizontalAlign: 'center', // left, center ,right
        verticalAlign: 'top'  // top, center, bottom
      },
  		data: [
  		{
  			type: "rangeColumn",
  			name: "MIPS",
  			indexLabelFontSize: 12,
  			yValueFormatString: "$#,##0.##",
  			showInLegend: true,
  			dataPoints: [
  				{label: '2019', y: [mips_adjustments_downside_values[0], mips_budget_neutral_upside_values[0]]},
  				{label: '2020', y: [mips_adjustments_downside_values[1], mips_budget_neutral_upside_values[1]]},
  				{label: '2021', y: [mips_adjustments_downside_values[2], mips_budget_neutral_upside_values[2]]},
  				{label: '2022 and beyond', y: [mips_adjustments_downside_values[3], mips_budget_neutral_upside_values[3]]}
  			]
  		},
  		{
  			type: "rangeColumn",
  			name: "APM",
  			indexLabelFontSize: 12,
  			yValueFormatString: "$#,##0.##",
  			showInLegend: true,
  			dataPoints: [
  				{label: '2019', y: [total_downside, total_upside]},
  				{label: '2020', y: [total_downside, total_upside]},
  				{label: '2021', y: [total_downside, total_upside]},
  				{label: '2022 and beyond', y: [total_downside, total_upside]}
  			]
  		}
  		]
  	});
  	chart.render();
  };
  calculateOutcome();
  $('.factor-input, .sync-input').on('change, input', calculateOutcome);
  $(".mc-button").on('click', function(e) {
    // prevent default anchor click behavior
    e.preventDefault();
    // store hash
    var hash = this.hash;
    // animate
    $('html, body').animate({
       scrollTop: $(hash).offset().top
     }, 300, function(){
       // when done, add hash to url
       // (default click behaviour)
       window.location.hash = hash;
    });
  });
});
