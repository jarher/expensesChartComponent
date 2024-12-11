import getData from "./getData.js";

const runChartTable = async () => {
  const chartData = await getData();
  const labels = chartData.map((data) => data.day);
  const data = chartData.map((data) => data.amount);

  const backgroundColor = data.map((amount) => {
    if (amount >= 52.36) {
      return "hsl(186, 34%, 60%)";
    } else {
      return "hsl(10, 79%, 65%)";
    }
  });
  const hoverBackgroundColor = data.map((amount) => {
    if (amount >= 52.36) {
      return "hsl(186, 34%, 70%)";
    } else {
      return "hsl(10, 79%, 75%)";
    }
  });

  const ctx = document.getElementById("myChart");

  // Make sure the canvas has a container with relative dimensions
  ctx.parentElement.style.height = "33vh";
  ctx.parentElement.style.width = "100%";
  ctx.parentElement.style.position = "relative";

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data,
          yAxisID: "yAxis",
          xAxisID: "xAxis",
          backgroundColor,
          borderRadius: function (context) {
            // adjust borderRadius according canvas width
            const chart = context.chart;
            const width = chart.width;
            return width < 400 ? 3 : 5;
          },
          hoverBackgroundColor,
          barPercentage: 0.8, // controls width bars
          categoryPercentage: 0.9, //controls space between bar groups
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, chartElement) => {
        if (chartElement.length > 0) {
          event.native.target.style.cursor = "pointer";
        } else {
          event.native.target.style.cursor = "default";
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          color: "hsl(25, 47%, 15%)",
          text: "Spending - Last 7 days",
          align: "start",
          font: {
            color: "hsl(25, 47%, 15%)",
            family: "DM Sans Bold",
            size: function (context) {
              // adjust font size according canvas size
              const width = context.chart.width;
              return width <= 425 ? 23 : 33.5;
            },
          },
          padding: {
            bottom: 30,
          },
        },
        tooltip: {
          enabled: false,
          external: function (context) {
            let tooltipEl = document.getElementById("chartjs-tooltip");

            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.innerHTML = "<table></table>";
              document.body.appendChild(tooltipEl);
            }

            if (context.tooltip.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const tableRoot = tooltipEl.querySelector("table");

            if (context.tooltip.body) {
              const bodyLines = context.tooltip.body.map((b) => b.lines);
              let innerHtml = "<thead></thead><tbody>";

              bodyLines.forEach((body) => {
                innerHtml += `<tr><td>$${body}</td></tr>`;
              });
              innerHtml += "</tbody>";

              tableRoot.innerHTML = innerHtml;
            }

            // tooltip responsive styles
            const fontSize = context.chart.width < 400 ? "12px" : "14px";
            tooltipEl.style.fontSize = fontSize;
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = "absolute";
            tooltipEl.style.background = "rgba(0, 0, 0, 0.8)";
            tooltipEl.style.color = "white";
            tooltipEl.style.padding = context.chart.width < 400 ? "2px" : "3px";
            tooltipEl.style.borderRadius = "4px";
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.transform = "translate(-50%, 0)";
            tooltipEl.style.transition = "all .1s ease";

            const position = context.chart.canvas.getBoundingClientRect();
            const tooltipX =
              position.left + window.pageXOffset + context.tooltip.caretX;
            const tooltipY =
              position.top + window.pageYOffset + context.tooltip.caretY;

            tooltipEl.style.left = tooltipX + "px";
            tooltipEl.style.top =
              tooltipY - (context.chart.width < 400 ? 30 : 40) + "px";
          },
        },
      },
      scales: {
        yAxis: {
          display: false,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        xAxis: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            font: {
              color: "hsl(28, 10%, 53%)",

              size: function (context) {
                // adjust font size form X axis according its width
                return context.chart.width < 425 ? 12 : 16;
              },
            },
          },
        },
      },
    },
  });
};

export default runChartTable;
