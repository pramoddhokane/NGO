var DeferredonationAmount = 0;
var canceledDonationsAmount = 0;
var donationAmount = 0;
var planneddonationAmountLastYear = 0
var donationCount = 0;
var UnpaidDonationAmount = 0;
var plannedDonation = 0;
var PaidDonation = 0;
var PaidDonationObj = {};
var data = {};
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = dd;
}
if (mm < 10) {
    mm = mm;
}
var today = mm + '/' + dd + '/' + yyyy;
data.plannedDonationsMonth = 0;
data.plannedDonationYear = 0;
data.DeferredPercentage = 0;
data.canceledPercentage = 0;
var firstDayYear;
var lastDayYear;
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();

//Tile 1 Donation Received for this month.
function getAllDonations(fiscalcalendarstart, fiscalcalendarend, previousYearStartDate) {
    var currentDate = new Date();
    var y = currentDate.getFullYear(),
        m = currentDate.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    var lastMonthFirstDay = new Date(y, m - 1, 1);
    var lastMonthlastDay = new Date(y, m, 0);
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22new_donor%22%3E%3Cattribute%20name%3D%22new_name%22%20%2F%3E%3Cattribute%20name%3D%22new_donorid%22%20%2F%3E%3Cattribute%20name%3D%22statuscode%22%20%2F%3E%3Cattribute%20name%3D%22new_donationtype%22%20%2F%3E%3Cattribute%20name%3D%22new_duedate%22%20%2F%3E%3Cattribute%20name%3D%22new_donationdate%22%20%2F%3E%3Cattribute%20name%3D%22new_amount%22%20%2F%3E%3Cattribute%20name%3D%22new_donorid%22%20%2F%3E%3Corder%20attribute%3D%22new_name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Cfilter%20type%3D%22or%22%3E%3Ccondition%20attribute%3D%22new_donationdate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22new_duedate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22new_donationdate%22%20operator%3D%22last-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22new_duedate%22%20operator%3D%22last-fiscal-year%22%20%2F%3E%3C%2Ffilter%3E%3Ccondition%20attribute%3D%22new_donationtype%22%20operator%3D%22eq%22%20value%3D%22100000000%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E";
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var res = (JSON.parse(this.responseText).value);

            //****************Current Month paid Donations ******************************************************************************

            var currMonthPaidDonations = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_donationdate) {
                    if (o.statuscode === 100000001) {
                        var actualStartDate = new Date((o.new_donationdate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= firstDay && actualStartDate <= lastDay) {
                            return o;
                        }
                    }
                }
            });

            var paidDonationAmt = _.reduce(currMonthPaidDonations, function (sum1, entry) {
                if (entry.new_amount > 0) return sum1 + parseFloat(entry.new_amount);
                else return sum1;
            }, 0);
            PaidDonation = paidDonationAmt;
            data.PaidDonation = PaidDonation;
            data.DonationCount = res.length;
            //*****************************************************************       

            //***********************Current Month Planned Donations.*********************************************************************
            var plannedDonationThisMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    if (o.statuscode != 100000001) {
                        var dateToday = new Date();
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= firstDay && actualStartDate <= lastDay) {
                            return o;
                        }
                    }
                }
            });

            var plannedDonationAmt = _.reduce(plannedDonationThisMonth, function (sum2, entry) {
                if (entry.new_amount > 0) return sum2 + parseFloat(entry.new_amount);
                else return sum2;
            }, 0);
            document.getElementById("ExpectedDonationthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();


            plannedDonation = plannedDonationAmt;
            data.plannedDonation = plannedDonation;
            var variancePercentage1 = 0;
            if (paidDonationAmt != 0 || plannedDonationAmt != 0) {
                if (paidDonationAmt > plannedDonationAmt) {

                    //Monthly Paid Donation growth In  percentage
                    variancePercentage1 = ((paidDonationAmt - plannedDonationAmt) / plannedDonationAmt) * 100;

                    if (variancePercentage1 === Infinity) {
                        document.getElementById("varianceThisMonthPaid").innerHTML = 100 + "%";
                        document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-up";
                    }
                    else {
                        if (variancePercentage1 < -200) {
                            document.getElementById("varianceThisMonthPaid").innerHTML =  -200 +"+"+ "%";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-up";

                        }
                        else if (variancePercentage1 > 200) {
                            document.getElementById("varianceThisMonthPaid").innerHTML =  200 +"+"+ "%";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-up";
                        }
                        else if (variancePercentage1 > 0 && variancePercentage1 < 1) {
                            document.getElementById("varianceThisMonthPaid").innerHTML = "(" + 1 + "%" + ")";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-up";
                        }
                        else {
                            document.getElementById("varianceThisMonthPaid").innerHTML = (Math.round(parseFloat(variancePercentage1) * 100) / 100) + "%";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-up";
                        }
                    }
                }
                else if (paidDonationAmt < plannedDonationAmt) {
                    //Monthly Paid Donation decline In percentage
                    variancePercentage1 = ((paidDonationAmt - plannedDonationAmt) / plannedDonationAmt) * 100;
                    if (variancePercentage1 === Infinity) {
                        document.getElementById("varianceThisMonthPaid").innerHTML = 100 + "%";
                        document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-down";
                    }
                    else {
                        if (variancePercentage1 > 200) {
                            document.getElementById("varianceThisMonthPaid").innerHTML = 200 +"+"+ "%";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-down";

                        }
                        else if (variancePercentage1 < -200) {
                            document.getElementById("varianceThisMonthPaid").innerHTML = -200 +"+"+ "%";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-down";
                        }
                        else if (variancePercentage1 > -1 && variancePercentage1 < 1) {
                            document.getElementById("varianceThisMonthPaid").innerHTML = "(" + 1 + "%" + ")";
                            document.getElementById("varianceThisMonthPaidArrow").className += "  glyphicon glyphicon-arrow-down";
                        }
                        else {
                            document.getElementById("varianceThisMonthPaid").innerHTML = (Math.round(parseFloat(variancePercentage1) * 100) / 100) + "%";
                            document.getElementById("varianceThisMonthPaidArrow").className += " glyphicon glyphicon-arrow-down";
                        }
                    }
                }
                else {
                    document.getElementById("varianceThisMonthPaid").innerHTML = (Math.round(parseFloat(variancePercentage1) * 100) / 100) + "%";
                }
            }
            else {
                document.getElementById("varianceThisMonthPaid").innerHTML = (Math.round(parseFloat(variancePercentage1) * 100) / 100) + "%";
            }



            //**************last Month Planned Donations 
            var lastMonthPlannedDonations = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    if (o.statuscode === 1) {
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= lastMonthFirstDay && actualStartDate <= lastMonthlastDay) {
                            return o;
                        }
                    }
                }
            });

            var lastMonthPlannedDonationAmt = _.reduce(lastMonthPlannedDonations, function (sum8, entry) {
                if (entry.new_amount > 0) return sum8 + parseFloat(entry.new_amount);
                else return sum8;
            }, 0);

            //******************Current Month deferred Donations*****************************************************************************

            var DeferredDonationThisMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    if (o.statuscode === 2) {
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= firstDay && actualStartDate <= lastDay) {
                            return o;
                        }
                    }
                }
            });

            var DeferredDonationAmt = _.reduce(DeferredDonationThisMonth, function (sum9, entry) {
                if (entry.new_amount > 0) return sum9 + parseFloat(entry.new_amount);
                else return sum9;
            }, 0);

            DeferredonationAmount = DeferredDonationAmt;
            data.Deferred = DeferredonationAmount;

            document.getElementById("DeferredDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            $('.dataset4-Loader').hide();
            $('.dataset4').show();

            //***************last Month deferred Donations

            var DeferredDonationLastMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    if (o.statuscode === 2) {
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= lastMonthFirstDay && actualStartDate <= lastMonthlastDay) {
                            return o;
                        }
                    }
                }
            });

            var DeferredDonationLastMonthAmt = _.reduce(DeferredDonationLastMonth, function (sum3, entry) {
                if (entry.new_amount > 0) return sum3 + parseFloat(entry.new_amount);
                else return sum3;
            }, 0);


            var variancePercentage3 = 0;
            if (DeferredDonationAmt != 0 || plannedDonationAmt != 0) {
                //Monthly Deferred Donation growth In percentage
                variancePercentage3 = (DeferredDonationAmt / plannedDonationAmt) * 100;
                if (variancePercentage3 === Infinity) {
                    document.getElementById("varianceThisMonthDeferred").innerHTML = 0 + "%";

                }
                else {
                    document.getElementById("varianceThisMonthDeferred").innerHTML = (Math.round(parseFloat(variancePercentage3) * 100) / 100) + "%";
                }

            }
            DeferredonationAmount = DeferredDonationAmt;
            data.Deferred = DeferredonationAmount;
            document.getElementById("DeferredDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            $('.dataset4-Loader').hide();
            $('.dataset4').show();

            //************************Current Month canceled Donations***************************************

            var canceledDonationThisMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.statuscode === 100000002) {
                    if (o.new_duedate) {
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= firstDay && actualStartDate <= lastDay) {
                            return o;
                        }
                    }
                }
            });

            var canceledDonationAmt = _.reduce(canceledDonationThisMonth, function (sum10, entry) {
                if (entry.new_amount > 0) return sum10 + parseFloat(entry.new_amount);
                else return sum10;
            }, 0);
            //********************Last Month canceled Donations
            var canceledDonationLastMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.statuscode === 100000002) {
                    if (o.new_duedate) {
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= lastMonthFirstDay && actualStartDate <= lastMonthlastDay) {
                            return o;
                        }
                    }
                }
            });

            var canceledDonationLastMonthAmt = _.reduce(canceledDonationLastMonth, function (sum4, entry) {
                if (entry.new_amount > 0) return sum4 + parseFloat(entry.new_amount);
                else return sum4;
            }, 0);

            var variancePercentage4 = 0;
            if (canceledDonationAmt != 0 || plannedDonationAmt != 0) {
                //Monthly Deferred Donation growth In percentage
                variancePercentage4 = (canceledDonationAmt / plannedDonationAmt) * 100;
                if (variancePercentage4 === Infinity) {
                    document.getElementById("varianceThisMonthCanceled").innerHTML = 0 + "%";

                }
                else {
                    document.getElementById("varianceThisMonthCanceled").innerHTML = (Math.round(parseFloat(variancePercentage4) * 100) / 100) + "%";
                }

            }
            canceledDonationsAmount = canceledDonationAmt;
            data.canceled = canceledDonationsAmount;
            document.getElementById("canceledDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            $('.dataset5-Loader').hide();
            $('.dataset5').show();

            //**************************Current Month Unpaid Donations***************************

            var unpaidDonationThisMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    if (o.statuscode === 1) {
                        var dateToday = new Date();
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= firstDay && actualStartDate <= lastDay && actualStartDate < dateToday) {
                            return o;
                        }
                    }
                }
            });

            var unpaidDonationAmt = _.reduce(unpaidDonationThisMonth, function (sum5, entry) {
                if (entry.new_amount > 0) return sum5 + parseFloat(entry.new_amount);
                else return sum5;
            }, 0);

            //**************************Last Month Unpaid Donations***************************

            var unpaidDonationLastMonth = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    if (o.statuscode === 1) {
                        var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                        if (actualStartDate >= lastMonthFirstDay && actualStartDate <= lastMonthlastDay) {
                            return o;
                        }
                    }
                }
            });

            var unpaidDonationLastMonthAmt = _.reduce(unpaidDonationLastMonth, function (sum11, entry) {
                if (entry.new_amount > 0) return sum11 + parseFloat(entry.new_amount);
                else return sum11;
            }, 0);

            var variancePercentage5 = 0;
            if (unpaidDonationAmt != 0 || plannedDonationAmt != 0) {
                //Monthly Deferred Donation growth In percentage
                variancePercentage5 = (unpaidDonationAmt / plannedDonationAmt) * 100;
                if (variancePercentage4 === Infinity) {
                    document.getElementById("varianceThisMonthUnpaid").innerHTML = 0 + "%";

                }
                else {
                    document.getElementById("varianceThisMonthUnpaid").innerHTML = (Math.round(parseFloat(variancePercentage5) * 100) / 100) + "%";
                }

            }

            UnpaidDonationAmount = unpaidDonationAmt;
            data.Unpaid = UnpaidDonationAmount;
            totalDonors(data)
            document.getElementById("UnpaidDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            $('.dataset6-Loader').hide();
            $('.dataset6').show();

            //Total Paid Donation This Year 
            var paidDonationThisYear = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                    if (actualStartDate >= firstDayYear && actualStartDate <= lastDayYear) {
                        if (o.statuscode === 100000001) {
                            return o;
                        }
                    }
                }
            });

            var paidDonationAmtYear = _.reduce(paidDonationThisYear, function (sum5, entry) {
                if (entry.new_amount > 0) return sum5 + parseFloat(entry.new_amount);
                else return sum5;
            }, 0);

            donationAmount = paidDonationAmtYear;
            //Total Planned Donations Previous Year
            var plannedDonationLastYear = _.filter(JSON.parse(this.responseText).value, function (o) {
                if (o.new_duedate) {
                    var actualStartDate = new Date((o.new_duedate).slice(0, 10));// new Date(o.new_actstart);
                    if (actualStartDate >= previousYearStartDate && actualStartDate < fiscalcalendarstart) {
                        if (o.statuscode != 100000001) {
                            return o;
                        }
                    }
                }
            });
            var plannedDonationAmtLastYear = _.reduce(plannedDonationLastYear, function (sum6, entry) {
                if (entry.new_amount > 0) return sum6 + parseFloat(entry.new_amount);
                else return sum6;
            }, 0);

            plannedDonationAmtLastYear;
            var variancePercentage = 0;
            if (donationAmount != 0 || plannedDonationAmtLastYear != 0) {
                if (donationAmount > plannedDonationAmtLastYear) {
                    //Yearly growth Paid Donation(YTD) In percentage
                    variancePercentage = ((donationAmount - plannedDonationAmtLastYear) / plannedDonationAmtLastYear) * 100;
                    if (variancePercentage === Infinity) {
                        document.getElementById("varianceThisYear").innerHTML = 100 + "%";
                        document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-up";
                    }
                    else {

                        if (variancePercentage > 200) {
                            document.getElementById("varianceThisYear").innerHTML = 200 +"+"+ "%";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-up";

                        }
                        else if (variancePercentage < -200) {
                            document.getElementById("varianceThisYear").innerHTML = -200 +"+"+ "%";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-up";
                        }
                        else if (variancePercentage > 0 && variancePercentage < 1) {
                            document.getElementById("varianceThisYear").innerHTML = "(" + 1 + "%" + ")";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-up";
                        }
                        else {
                            document.getElementById("varianceThisYear").innerHTML = (Math.round(parseFloat(variancePercentage) * 100) / 100) + "%";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-up";
                        }
                    }
                }
                else if (donationAmount <= plannedDonationAmtLastYear) {
                    //Yearly decline Paid Donation(YTD) In percentage
                    variancePercentage = ((donationAmount - plannedDonationAmtLastYear) / plannedDonationAmtLastYear) * 100;
                    if (variancePercentage === Infinity) {
                        document.getElementById("varianceThisYear").innerHTML = 100 + "%";
                        document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-down";
                    }
                    else {
                        if (variancePercentage > 200) {
                            document.getElementById("varianceThisYear").innerHTML = "(" + 200 + "%" + ")";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-down";

                        }
                        else if (variancePercentage < -200) {
                            document.getElementById("varianceThisYear").innerHTML = "(" + -200 + "%" + ")";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-down";
                        }
                        else if (variancePercentage > 0 && variancePercentage < 1) {
                            document.getElementById("varianceThisYear").innerHTML = "(" + 1 + "%" + ")";
                            document.getElementById("varianceThisYearArrow").className += "glyphicon glyphicon-arrow-down";
                        }
                        else {
                            document.getElementById("varianceThisYear").innerHTML = (Math.round(parseFloat(variancePercentage) * 100) / 100) + "%";
                            document.getElementById("varianceThisYearArrow").className += " glyphicon glyphicon-arrow-down";
                        }

                    }
                }
            }
            else {
                document.getElementById("varianceThisYear").innerHTML = (Math.round(parseFloat(variancePercentage) * 100) / 100) + "%";
            }

            document.getElementById("DonationThisyear").innerHTML = firstDayYear.getFullYear() + "-" + date.getFullYear();

            if (donationAmount < 1000) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) * 100) / 100).toLocaleString();
            }
            else if (donationAmount >= 1000 && donationAmount < 99999) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            }
            else if (donationAmount >= 100000 && donationAmount < 9999999) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            }
            else if (donationAmount >= 10000000) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            }
            $('.dataset1-Loader').hide();
            $('.dataset1').show();
            document.getElementById("receiveddonationthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
        }
    };
    retrieveReq.send();
}

// Tile  5 Total Donors for the current month
function totalDonors(data) {

    if (data.PaidDonation < 1000) {
        document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) * 100) / 100).toLocaleString();
    }
    else if (data.PaidDonation >= 1000 && data.PaidDonation < 99999) {
        document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) / 1000 * 100) / 100).toLocaleString() + " " + "K";
    }
    else if (data.PaidDonation >= 100000 && data.PaidDonation < 9999999) {
        document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) / 100000 * 100) / 100).toLocaleString() + " " + "L";
    }
    else if (data.PaidDonation >= 10000000) {
        document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
    }
    /******************************************************************************************** */
    if (data.plannedDonation < 1000) {
        document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) * 100) / 100).toLocaleString();
    }
    else if (data.plannedDonation >= 1000 && data.plannedDonation < 99999) {
        document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) / 1000 * 100) / 100).toLocaleString() + " " + "K";
    }
    else if (data.plannedDonation >= 100000 && data.plannedDonation < 9999999) {
        document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) / 100000 * 100) / 100).toLocaleString() + " " + "L";
    }
    else if (data.plannedDonation >= 10000000) {
        document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
    }
    $('.dataset3-Loader').hide();
    $('.dataset3').show();

    /***************************************************************************************** */
    if (data.Deferred < 1000) {
        document.getElementById("deferredDonation").innerHTML = "₹" + (Math.round(parseFloat(data.Deferred) * 100) / 100).toLocaleString();
    }
    else if (data.Deferred >= 1000 && data.Deferred < 99999) {
        document.getElementById("deferredDonation").innerHTML = "₹" + (Math.round(parseFloat(data.Deferred) / 1000 * 100) / 100).toLocaleString() + " " + "K";
    }
    if (data.Deferred >= 100000 && data.Deferred < 9999999) {
        document.getElementById("deferredDonation").innerHTML = "₹" + (Math.round(parseFloat(data.Deferred) / 100000 * 100) / 100).toLocaleString() + " " + "L";
    }
    if (data.Deferred >= 10000000) {
        document.getElementById("deferredDonation").innerHTML = "₹" + (Math.round(parseFloat(data.Deferred) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
    }

    /***************************************************************************************** */
    if (data.canceled < 1000) {
        document.getElementById("canceledDonations").innerHTML = "₹" + (Math.round(parseFloat(data.canceled) * 100) / 100).toLocaleString();
    }
    else if (data.canceled >= 1000 && data.canceled < 99999) {
        document.getElementById("canceledDonations").innerHTML = "₹" + (Math.round(parseFloat(data.canceled) / 1000 * 100) / 100).toLocaleString() + " " + "K";
    }
    if (data.canceled >= 100000 && data.canceled < 9999999) {
        document.getElementById("canceledDonations").innerHTML = "₹" + (Math.round(parseFloat(data.canceled) / 100000 * 100) / 100).toLocaleString() + " " + "L";
    }
    if (data.canceled >= 10000000) {
        document.getElementById("canceledDonations").innerHTML = "₹" + (Math.round(parseFloat(data.canceled) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
    }

    /************************************************************************************************ */
    if (data.Unpaid < 1000) {
        document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) * 100) / 100).toLocaleString();
    }
    else if (data.Unpaid >= 1000 && data.Unpaid < 99999) {
        document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) / 1000 * 100) / 100).toLocaleString() + " " + "K";
    }
    if (data.Unpaid >= 100000 && data.Unpaid < 9999999) {
        document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) / 100000 * 100) / 100).toLocaleString() + " " + "L";
    }
    if (data.Unpaid >= 10000000) {
        document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
    }
    /************************************************************************************************ */
    // document.getElementById("totalDonors").innerHTML = data.totalDonors;
    //  document.getElementById("totalDonorsthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();

    $('.dataset2-Loader').hide();
    $('.dataset2').show();
}
function getCurrentFiscalYear() {
    var req = new XMLHttpRequest();
    req.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/organizations()?$select=fiscalcalendarstart", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.responseText).value;
                var fiscalcalendarstart = new Date(result[0]["fiscalcalendarstart"]);

                var fiscalcalendarend = new Date(new Date().setFullYear(fiscalcalendarstart.getFullYear() + 1, fiscalcalendarstart.getMonth(), fiscalcalendarstart.getDate()));
                console.log("lastday" + fiscalcalendarend);
                var previousYearStartDate = new Date(new Date().setFullYear(fiscalcalendarstart.getFullYear() - 1, fiscalcalendarstart.getMonth(), fiscalcalendarstart.getDate()));
                firstDayYear = fiscalcalendarstart;
                lastDayYear = fiscalcalendarend;
                getAllDonations(fiscalcalendarstart, fiscalcalendarend, previousYearStartDate);
            }
            else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}

function getODataUTCDateFilter(date) {
    var monthString;
    var rawMonth = (date.getUTCMonth() + 1).toString();
    if (rawMonth.length == 1) {
        monthString = "0" + rawMonth;
    }
    else {
        monthString = rawMonth;
    }
    var dateString;
    var rawDate = date.getDate().toString();
    if (rawDate.length == 1) {
        dateString = "0" + rawDate;
    }
    else {
        dateString = rawDate;
    }
    var DateFilter = '';
    DateFilter += date.getUTCFullYear() + "-";
    DateFilter += monthString + "-";
    DateFilter += dateString;
    return DateFilter;
}
$(document).ready(function () {
    $('.dataset1-Loader').show();
    $('.dataset1').hide();
    $('.dataset2-Loader').show();
    $('.dataset2').hide();
    $('.dataset3-Loader').show();
    $('.dataset3').hide();
    $('.dataset4-Loader').show();
    $('.dataset4').hide();
    $('.dataset5-Loader').show();
    $('.dataset5').hide();
    $('.dataset6-Loader').show();
    $('.dataset6').hide();
});