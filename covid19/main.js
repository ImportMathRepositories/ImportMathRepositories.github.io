const dataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const dataOffset = 53;

var dailyContext = document.getElementById('dailyChart').getContext('2d');
var newCasesContext = document.getElementById('newCasesChart').getContext('2d');
var growthContext = document.getElementById('growthChart').getContext('2d');

var confirmedLabel = document.getElementById('dailyConfirmedCases');
var newCasesLabel = document.getElementById('dailyNewCases');
var growthRateLabel = document.getElementById('dailyGrowthRate');
var accelerationStateLabel = document.getElementById('accelerationState');

fetch(dataUrl)
    .then(response => response.text())
    .then((text) => {
        var lines = text.split('\n');
        var dates = lines[0].split(",").slice(dataOffset);
        var dailyCases = [];
        var firstRow = true;
        var currentRow;

        lines.forEach((line, index) => {
            currentRow = line.split(',');
            if (currentRow[1] === 'US') {
                for (var i = dataOffset; i < currentRow.length; i++) {
                    var casesInt = parseInt(currentRow[i]);
                    if (Number.isInteger(casesInt)) {
                        if (firstRow) {
                            dailyCases.push(casesInt);
                        } else {
                            dailyCases[i - dataOffset] += casesInt;
                        }
                    }
                }
                firstRow = false;
            }
        });

        var newCases = [0];
        for (var i = 0; i < dailyCases.length - 1; i++) {
            newCases.push(dailyCases[i + 1] - dailyCases[i]);
        }

        var growth = [0];
        for (var i = 0; i < newCases.length - 1; i++) {
            growth.push(newCases[i + 1] - newCases[i]);
        }

        var growthAverage = [];
        for (var i = 0; i < growth.length; i++) {
            var currentTotal = 0;
            for (var o = 0; o < 7; o++) {
                var currentOffset = i - o;
                if (currentOffset >= 0) {
                    currentTotal += growth[currentOffset];
                }
            }
            growthAverage.push(parseInt(currentTotal / 7));
        }

        confirmedLabel.innerHTML = dailyCases[dailyCases.length - 1] + " Total Confirmed Cases";
        newCasesLabel.innerHTML = newCases[newCases.length - 1] + " New Cases Today";

        if (growth[growth.length - 1] > 0) {
            growthRateLabel.innerHTML = "Accelerative Growth Today";
        } else {
            growthRateLabel.innerHTML = "Decelerative Growth Today";
        }

        if (growth.slice(-7).reduce((a, b) => a + b, 0) > 0) {
            accelerationStateLabel.innerHTML = "Likely Accelerative";
            accelerationStateLabel.style.color = "#C41E3D";
        } else {
            accelerationStateLabel.innerHTML = "Likely Decelerative";
            accelerationStateLabel.style.color = "#606C38";
        }

        while (dates.length > dailyCases.length) {
            dates.pop();
        }

        var dailyChart = new Chart(dailyContext, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: "Total Confirmed Cases",
                    data: dailyCases,
                    backgroundColor: "#F3A712"
                }]
            }
        });

        var newCasesChart = new Chart(newCasesContext, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: "New Cases Each Day",
                    data: newCases,
                    backgroundColor: "#EF7B45"
                }]
            }
        });

        var growthChart = new Chart(growthContext, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: "Growth Rate Moving Average",
                    data: growthAverage,
                    backgroundColor: "#D84727"
                }, {
                    label: "Daily Growth Rate",
                    data: growth,
                    fill: false
                }]
            }
        });
    });
