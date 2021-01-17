var ctx = document.getElementById("myChart");
var male = ctx.dataset.male;
var female = ctx.dataset.female;
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Female', 'Male'],
        datasets: [{
            label: "Nombre d'utilisateurs",
            data: [female, male],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
var ctx2 = document.getElementById("myChart2");
var read = ctx2.dataset.read;
var unread = ctx2.dataset.unread;
new Chart(ctx2, {
    type: 'doughnut',
    data: {
       labels: ["Lu", "Non-Lu"],
       datasets: [{
           data: [read, unread],
           backgroundColor: [
            '#26de81',
            '#fd9644'
           ],
           borderColor: [
             '#0fa859',
             '#e07828'
           ],
           borderWidth: 2,
       }]
    }
});

var ctx3 = document.getElementById("myChart3");
var exp = ctx3.dataset.exp;
var noExp = ctx3.dataset.noexp;
new Chart(ctx3, {
    type: 'pie',
    data: {
       labels: ["Expedié", "Non-Expedié"],
       datasets: [{
           data: [exp, noExp],
           backgroundColor: [
            '#fc5c65'
           ],
           borderColor: [
            '#dd252b'
           ],
           borderWidth: 2,
       }]
    }
});

var ctx4 = document.getElementById("myChart4");
new Chart(ctx4, {
    type: 'line',
    data: {
       labels: ['Avril', 'Aout','Octobre'],
       datasets: [{
           data: [998, 549, 889],
           backgroundColor: [
            '#4b6584'
           ],
           borderColor: [
            '#304256'
           ],
           borderWidth: 2,
       }]
    }
});
