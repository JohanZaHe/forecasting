export const gettingColorForTemperature = (temperature: number): string => {
  if (temperature <= 0) {
    return '#912dee';
  }

  if (temperature > 0 && temperature <= 10) {
    return '#8968cd';
  }

  if (temperature > 10 && temperature <= 20) {
    return '#07eeee';
  }

  if (temperature > 20 && temperature <= 30) {
    return '#00b2ee';
  }

  if (temperature > 30 && temperature <= 40) {
    return '#1d90ff';
  }

  if (temperature > 40 && temperature <= 50) {
    return '#0f4e8b';
  }

  if (temperature > 50 && temperature <= 60) {
    return '#008b00';
  }

  if (temperature > 60 && temperature <= 70) {
    return '#7fff01';
  }

  if (temperature > 70 && temperature <= 80) {
    return '#ffd602';
  }

  if (temperature > 80 && temperature <= 90) {
    return '#ff7f00';
  }

  if (temperature > 90 && temperature <= 100) {
    return '#ef4000';
  }

  if (temperature > 100) {
    return '#cd0000';
  }

  return 'rgb(75, 192, 192)';
};

let gradient: any, width: number, height: number;

export const getGradient = (
  ctx: any,
  chartArea: any,
  temperatures: number[]
) => {
  // Create the gradient because this is either the first render
  // or the size of the chart has changed
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  }
  temperatures?.sort((a: number, b: number) => a - b) || [];
  const colors = [
    ...new Set(
      temperatures?.map((temperature: number) =>
        gettingColorForTemperature(temperature)
      ) ||[]
    ),
  ];
  const size = 1 / colors.length;
  colors.forEach((color, index) => gradient.addColorStop(index * size, color));

  return gradient;
};

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(255, 255, 255, 0.25)';
    tooltipEl.style.backdropFilter = 'blur(5px)';
    tooltipEl.style.maxWidth = '250px';
    tooltipEl.style.borderRadius = '4px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const {
    dataPoints: [data],
  } = tooltip;

  const {
    dataset: { additionalData },
    dataIndex,
  } = data;

  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set content
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: any) => b.lines);

    const tableHead = document.createElement('thead');
    // Set title
    titleLines.forEach((title: string) => {
      const tr = document.createElement('tr') as any;
      tr.style.borderWidth = 0;
      tr.style.textAlign = 'center';

      const th = document.createElement('th') as any;
      th.style.borderWidth = 0;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });
    const tableBody = document.createElement('tbody');

    // Set label (temparature) and its value
    bodyLines.forEach((body: any, i: number) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '10px';
      span.style.borderRadius = '10px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr') as any;
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = 0;
      tr.style.textAlign = 'center';

      const td = document.createElement('td') as any;
      td.style.borderWidth = 0;

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    // Set icon and short forecasting
    const tr = document.createElement('tr') as any;
    tr.style.backgroundColor = 'inherit';
    tr.style.borderWidth = 0;
    const td = document.createElement('td') as any;
    td.style.borderWidth = 0;
    td.style.display = 'flex';
    td.style.alignItems = 'center';
    const img = document.createElement('img');
    img.src = additionalData[dataIndex].icon;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'contain';
    img.style.marginRight = '10px';

    const text = document.createTextNode(
      additionalData[dataIndex].shortForecast
    );

    td.appendChild(img);
    td.appendChild(text);
    tr.appendChild(td);
    tableBody.appendChild(tr);

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
