(function() {
  var randseed = new Array(4);
  var colors = ['#423EEE', '#E2E2FC', '#FE5907', '#FEDED6', '#5F5CF1', '#171553', '#1C1E26', '#E1E2E8', ];

  function seedrand(seed) {
    for (var i = 0; i < randseed.length; i++) {
      randseed[i] = 0;
    }
    for (var i = 0; i < seed.length; i++) {
      randseed[i % 4] = ((randseed[i % 4] << 5) - randseed[i % 4]) + seed.charCodeAt(i);
    }
  }

  function rand() {
    var t = randseed[0] ^ (randseed[0] << 11);

    randseed[0] = randseed[1];
    randseed[1] = randseed[2];
    randseed[2] = randseed[3];
    randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

    return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
  }

  function createColor() {
    return colors[Math.floor(rand() * 100) % colors.length];
  }

  function createImageData(size) {
    var width = size;
    var height = size;

    var dataWidth = Math.ceil(width / 2);
    var mirrorWidth = width - dataWidth;

    var data = [];
    for (var y = 0; y < height; y++) {
      var row = [];
      for (var x = 0; x < dataWidth; x++) {
        row[x] = Math.floor(rand() * 2.3);
      }
      var r = row.slice(0, mirrorWidth);
      r.reverse();
      row = row.concat(r);

      for (var i = 0; i < row.length; i++) {
        data.push(row[i]);
      }
    }

    return data;
  }

  function buildOpts(opts) {
    var newOpts = {};

    newOpts.seed = opts.seed || Math.floor((Math.random() * Math.pow(10, 16))).toString(16);

    seedrand(newOpts.seed);

    newOpts.size = opts.size || 8;
    newOpts.scale = opts.scale || 4;
    newOpts.color = opts.color || createColor();
    newOpts.bgcolor = opts.bgcolor || createColor();
    newOpts.spotcolor = opts.spotcolor || createColor();

    return newOpts;
  }

  function renderIcon(opts) {
	opts = buildOpts(opts || {});
	var imageData = createImageData(opts.size);
	var width = Math.sqrt(imageData.length);
  
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', opts.size * opts.scale);
	svg.setAttribute('height', opts.size * opts.scale);
  
	var bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	bgRect.setAttribute('width', opts.size * opts.scale);
	bgRect.setAttribute('height', opts.size * opts.scale);
	bgRect.setAttribute('fill', opts.bgcolor);
	svg.appendChild(bgRect);
  
	for (var i = 0; i < imageData.length; i++) {
	  if (imageData[i]) {
		var row = Math.floor(i / width);
		var col = i % width;
  
		var fillColor = (imageData[i] == 1) ? opts.color : opts.spotcolor;
		var shapeType = Math.floor(rand() * 3);

      switch (shapeType) {
        case 0: // Rectangle
          var rectSizeMultiplier = rand() * 2;
          var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', col * opts.scale);
          rect.setAttribute('y', row * opts.scale);
          rect.setAttribute('width', opts.scale * rectSizeMultiplier);
          rect.setAttribute('height', opts.scale * rectSizeMultiplier);
          rect.setAttribute('fill', fillColor);
          svg.appendChild(rect);
          break;
        case 1: // Circle
          var circleSizeMultiplier = rand() * 1;
          var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', col * opts.scale + opts.scale / 2);
          circle.setAttribute('cy', row * opts.scale + opts.scale / 2);
          circle.setAttribute('r', (opts.scale / 2) * circleSizeMultiplier);
          circle.setAttribute('fill', fillColor);
          svg.appendChild(circle);
          break;
        default:
          break;
      }
	  }
	}
  
	return svg;
  }
  

  function createIcon(opts) {
    return renderIcon(opts);
  }

  function backgroundColors(opts) {
    opts = buildOpts(opts || {});

    return '100% 100% linear-gradient(to bottom, ' + opts.bgcolor + ' 0%, ' + opts.spotcolor + ' 100%) no-repeat';
  }

  var api = {
    create: createIcon,
    background: backgroundColors,
    render: renderIcon
  };

  if (typeof module !== "undefined") {
    module.exports = api;
  }
  if (typeof window !== "undefined") {
    window.blockies = api;
  }

})();