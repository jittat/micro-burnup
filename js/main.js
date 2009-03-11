/*
Micro Burn-up.
*/

var startTime = null;
var velocity = 1;
var timestamps = null;

function refreshChart() {
    var maxTime = timestamps[timestamps.length-1];
    var maxCount = timestamps.length;

    if(maxTime==0)
	maxTime = 1;

    var expectedDone = velocity*maxTime/60;
    if(expectedDone>maxCount)
	maxCount = expectedDone;

    var dataX = '0';
    var dataY = '0';

    var count = 0;
    $(timestamps).each(function(){
	count++;
	dataX += ',' + parseInt(this*100 / maxTime);
	dataY += ',' + parseInt(count*100 / maxCount);
    });

    var rangeOption = "0,0," + maxTime + "|" +
	"1,0," + (count+1);

    $("#chart").attr("src",
		     "http://chart.apis.google.com/chart?" +
		     "chs=300x200&" +
		     "cht=lxy&" + 
		     "chd=t:" + dataX + "|" + dataY + "|" + 
		     "0,100|0," + (expectedDone*100/maxCount) + "&" +
		     "chxt=x,y&" +
		     "chxr=" + rangeOption);
}

function getCurrentTime() {
    var d = new Date();
    return d.getTime();
}

function addTimeStamp() {
    // add timestamp in seconds
    timestamps.push(parseInt((getCurrentTime()-startTime)/1000));
}

function initStat() {
    velocity = $("#velocity").val();
    startTime = getCurrentTime();
    timestamps = new Array();
}

function main() {
    $("#change").click(function() {
	velocity = $("#velocity").val();
	refreshChart();
    });

    $("#reset").click(function() {
	this.innerHTML = "Reset";
	initStat();
	$("#done").attr("disabled", false);
	refreshChart();
    });

    $("#done").click(function() {
	addTimeStamp();
	refreshChart();
    });

    initStat();
    refreshChart();
}

$(document).ready(main);