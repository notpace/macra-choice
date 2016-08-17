// Calculate Model Outcome
$( document ).ready(function() {
  function getValue(id){
    return parseFloat($('#' + id)[0].value)
  }
  function makeCurrency(number) {
    return number.toLocaleString('USD', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits : 2,
      maximumFractionDigits : 2
    })
  }
  function calculateOutcome() {
    // Get user-entered factors
    var part_b_revenue = getValue('part_b_revenue'),
        patients_per_panel = getValue('patients_per_panel'),
        per_beneficiary_spending = getValue('per_beneficiary_spending'),
        savings_loss_range = getValue('savings_loss_range') * 0.01,
        marginal_risk_assumption = getValue('marginal_risk_assumption') * 0.01,
        mips_performance_range = getValue('mips_performance_range') * 0.01,
        upside_performance_assumption = getValue('upside_performance_assumption') * 0.01,
        budget_scale_factor_1 = getValue('budget_scale_factor_1'),
        budget_scale_factor_2 = getValue('budget_scale_factor_2')
    // APM calculations
    var five_percent = 0.05 * part_b_revenue
    $('#five_upside')[0].innerHTML = makeCurrency(five_percent);
    $('#five_likely')[0].innerHTML = makeCurrency(five_percent);
    $('#five_downside')[0].innerHTML = makeCurrency(five_percent);
    var patient_spending = patients_per_panel * per_beneficiary_spending
    var shared_upside = (patient_spending - (patient_spending - patient_spending * savings_loss_range)) * marginal_risk_assumption
    var shared_downside = (patient_spending - (patient_spending + patient_spending * savings_loss_range)) * marginal_risk_assumption
    $('#shared_upside')[0].innerHTML = makeCurrency(shared_upside);
    $('#shared_downside')[0].innerHTML = makeCurrency(shared_downside);
    var total_upside = five_percent + shared_upside;
    var total_likely = five_percent;
    var total_downside = five_percent + shared_downside;
    $('#total_upside')[0].innerHTML = makeCurrency(total_upside);
    $('#total_likely')[0].innerHTML = makeCurrency(total_likely);
    $('#total_downside')[0].innerHTML = makeCurrency(total_downside);
    // MIPS calculations
    var mips_adjustments_upside = part_b_revenue * mips_performance_range;
    var mips_adjustments_downside = part_b_revenue * mips_performance_range * -1;
    $('#mips_adjustments_upside')[0].innerHTML = makeCurrency(mips_adjustments_upside);
    $('#mips_adjustments_downside')[0].innerHTML = makeCurrency(mips_adjustments_downside);
    var mips_performance_upside = part_b_revenue * upside_performance_assumption;
    $('#mips_performance_upside')[0].innerHTML = makeCurrency(mips_performance_upside);
    var mips_total_upside = mips_adjustments_upside + mips_performance_upside;
    var mips_total_downside = mips_adjustments_downside;
    $('#mips_total_upside')[0].innerHTML = makeCurrency(mips_total_upside);
    $('#mips_total_downside')[0].innerHTML = makeCurrency(mips_total_downside);
    var mips_budget_1_upside = mips_total_upside * budget_scale_factor_1;
    $('#mips_budget_1_upside')[0].innerHTML = makeCurrency(mips_budget_1_upside);
    var mips_budget_2_upside = mips_total_upside * budget_scale_factor_2;
    $('#mips_budget_2_upside')[0].innerHTML = makeCurrency(mips_budget_2_upside);
  };
  $('.factor-input').on('change, input', calculateOutcome);
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
