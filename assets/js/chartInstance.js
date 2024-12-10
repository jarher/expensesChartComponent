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

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data,
          borderWidth: 1,
          yAxisID: "yAxis",
          xAxisID: "xAxis",
          backgroundColor,
          borderRadius: "10",
          hoverBackgroundColor,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          color: "hsl(25, 47%, 15%)",
          text: "Spending - Last 7 days",
          align: "start",
          font: { weight: "bold" },
          padding: 50,
        },
        tooltip: {
          enabled: false, // Desactivamos el tooltip por defecto
          external: function (context) {
            // Obtener el elemento tooltip
            let tooltipEl = document.getElementById("chartjs-tooltip");

            // Crear el elemento si no existe
            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.innerHTML = "<table></table>";
              document.body.appendChild(tooltipEl);
            }

            // Ocultar si no hay hover
            if (context.tooltip.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Establecer el contenido
            const tableRoot = tooltipEl.querySelector("table");

            if (context.tooltip.body) {
              const bodyLines = context.tooltip.body.map((b) => b.lines);
              let innerHtml = "<thead>";

              innerHtml += "</thead><tbody>";

              bodyLines.forEach((body, i) => {
                innerHtml += `<tr><td>$${body}</td></tr>`;
              });
              innerHtml += "</tbody>";

              tableRoot.innerHTML = innerHtml;
            }

            // Establecer estilos del tooltip
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = "absolute";
            tooltipEl.style.background = "rgba(0, 0, 0, 0.8)";
            tooltipEl.style.color = "white";
            tooltipEl.style.padding = "3px";
            tooltipEl.style.borderRadius = "4px";
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.transform = "translate(-50%, 0)";
            tooltipEl.style.transition = "all .1s ease";

            // Establecer la posición
            const position = context.chart.canvas.getBoundingClientRect();
            const bodyPosition = document.body.getBoundingClientRect();

            // Calcular la posición exacta
            const tooltipX =
              position.left + window.pageXOffset + context.tooltip.caretX;
            const tooltipY =
              position.top + window.pageYOffset + context.tooltip.caretY;

            // Posicionar el tooltip 20px arriba de la barra
            tooltipEl.style.left = tooltipX + "px";
            tooltipEl.style.top = tooltipY - 40 + "px";
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
        },
      },
    },
  });
};

export default runChartTable;
