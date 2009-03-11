/*
Micro Burn-up.

Copyright (c) 2009 Jittat Fakcharoenphol

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var startTime = null;
var velocity = 1;
var timestamps = null;

function refreshChart() {
    var chartScale = 1;
    var lineColor = "00FF00";

    var maxCount = timestamps.length;
    var maxTime = timestamps[timestamps.length-1];
    if(maxTime==0)
	maxTime = 1;

    if(maxTime > 120)
	chartScale = 60;  //  display in minutes

    var expectedDone = velocity*maxTime/60;
    if(expectedDone>maxCount) {
	lineColor = "FF0000";
	maxCount = expectedDone;
    }

    var dataX = '0';
    var dataY = '0';

    var count = 0;
    $(timestamps).each(function(){
	count++;
	dataX += ',' + parseInt(this*100 / maxTime);
	dataY += ',' + parseInt(count*100 / maxCount);
    });

    var rangeOption = "0,0," + parseInt(maxTime / chartScale) + "|" +
	"1,0," + (count+1);

    $("#chart").attr("src",
		     "http://chart.apis.google.com/chart?" +
		     "chs=400x300&" +
		     "cht=lxy&" + 
		     "chd=t:" + dataX + "|" + dataY + "|" + 
		     "0,100|0," + (expectedDone*100/maxCount) + "&" +
		     "chxt=x,y&" +
		     "chxr=" + rangeOption + "&" +
		     "chco=" + lineColor + ",707070&" + 
		     "chls=2,1,0|0.5,1,0");

    $("#done_count").html(count);
}

function getCurrentTime() {
    var d = new Date();
    return d.getTime();
}

function addTimeStamp() {
    // add timestamp in seconds
    timestamps.push(parseInt((getCurrentTime()-startTime)/1000));
}

function readVelocity() {
    var v = parseInt($("#velocity").val());
    if(v==NaN)
	v = 1;
    return v;
}

function initStat() {
    velocity = readVelocity();
    startTime = getCurrentTime();
    timestamps = new Array();
}

function main() {
    $("#change").click(function() {
	velocity = readVelocity();
	refreshChart();
    });

    $("#reset").click(function() {
	this.innerHTML = "Reset";
	initStat();
	$("#done").attr("disabled", false);
	refreshChart();
	$("#done").focus();
    });

    $("#done").click(function() {
	addTimeStamp();
	refreshChart();
	$("#done").focus();
    });

    initStat();
    refreshChart();
}

$(document).ready(main);