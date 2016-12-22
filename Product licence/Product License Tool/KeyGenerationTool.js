'use strict';
var secretKey = 'espl@123';
var startDate;
var endDate;
$(function () {
    $('input[name="daterange"]').daterangepicker({
        startDate: new Date(),
        endDate: moment().add(30, 'days'),
        locale: {
            format: 'DD/MM/YYYY',
        }
    });
    $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
        startDate = picker.startDate.format('YYYY/MM/DD');
        endDate = picker.endDate.format('YYYY/MM/DD');
    });
});

function GenerateKey() {
    if ($('#secretKey').val() === secretKey) {
        var gracePeriod = $('#gracePeriod').val();
        var userLicenses = $('#userLicenses').val();
        var userKey = 'espl@ngoproductlicenses2016|' + startDate + '|' + endDate + '|' + gracePeriod + '|' + userLicenses;
        var encrypted = CryptoJS.AES.encrypt(userKey, secretKey).toString();
        $('#productKey').text(encrypted);
    }
}