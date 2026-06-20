const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000');

  // Scroll to the bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  // Wait a few seconds for wobble to finish and breathing to start
  await new Promise(r => setTimeout(r, 4000));

  // Evaluate the footer SVG properties
  const report = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return 'No footer found';
    
    const svgContainer = footer.querySelector('div.absolute.z-30');
    if (!svgContainer) return 'No SVG container found';
    
    const svg = svgContainer.querySelector('svg');
    const glowPath = svg.querySelectorAll('path')[0];
    const fillPath = svg.querySelectorAll('path')[1];
    const strokePath = svg.querySelectorAll('path')[2];

    const getElData = (el, name) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        name,
        d: el.getAttribute('d'),
        fill: el.getAttribute('fill'),
        stroke: el.getAttribute('stroke'),
        opacity: style.opacity,
        visibility: style.visibility,
        rect: { top: rect.top, height: rect.height, bottom: rect.bottom, y: rect.y }
      };
    };

    const prevSection = footer.previousElementSibling;
    const prevStyle = prevSection ? window.getComputedStyle(prevSection) : null;

    return {
      footerRect: footer.getBoundingClientRect(),
      footerZIndex: window.getComputedStyle(footer).zIndex,
      prevSection: prevSection ? {
        tagName: prevSection.tagName,
        className: prevSection.className,
        rect: prevSection.getBoundingClientRect(),
        zIndex: prevStyle.zIndex,
        position: prevStyle.position,
        background: prevStyle.backgroundColor
      } : null,
      svgContainerRect: svgContainer.getBoundingClientRect(),
      glow: getElData(glowPath, 'glowPath'),
      fill: getElData(fillPath, 'fillPath'),
      stroke: getElData(strokePath, 'strokePath')
    };
  });

  console.log(JSON.stringify(report, null, 2));

  await browser.close();
})();
