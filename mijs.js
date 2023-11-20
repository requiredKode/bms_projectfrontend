export function cargarPDF(pdfData) {
  //var pdfData = atob($("#pdfBase64").val());

  var maxPDFx = 595;
  var maxPDFy = 842;
  var offsetY = 7;

  ("use strict");

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  var loadingTask = pdfjsLib.getDocument({ data: pdfData });
  loadingTask.promise.then(function (pdf) {
    pdf.getPage(1).then(function (page) {
      var scale = 1.0;
      var viewport = page.getViewport(scale);

      var canvas = document.getElementById("the-canvas");
      var context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page
        .render(renderContext)
        .promise.then(function () {
          $(document).trigger("pagerendered");
        })
        .catch(function (error) {
          console.error("ERROR:", error);
        });
    });
  });

  interact(".dropzone").dropzone({
    accept: ".drag-drop",
    overlap: 1,

    ondropactivate: function (event) {
      event.target.classList.add("drop-active");
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      dropzoneElement.classList.add("drop-target");
      draggableElement.classList.add("can-drop");
      draggableElement.classList.remove("dropped-out");
    },
    ondragleave: function (event) {
      event.target.classList.remove("drop-target");
      event.relatedTarget.classList.remove("can-drop");
      event.relatedTarget.classList.add("dropped-out");
    },
    ondrop: function (event) {
      // event.relatedTarget.textContent = 'Dropped';
    },
    ondropdeactivate: function (event) {
      event.target.classList.remove("drop-active");
      event.target.classList.remove("drop-target");
    },
  });

  interact(".drag-drop").draggable({
    inertia: true,
    restrict: {
      restriction: "#selectorContainer",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
    },
    autoScroll: true,
    onmove: dragMoveListener,
  });

  function dragMoveListener(event) {
    var target = event.target,
      x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
      y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px, " + y + "px)";

    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }

  window.dragMoveListener = dragMoveListener;

  $(document).on("pagerendered", function (e) {
    $("#pdfManager").show();
    var parametri = JSON.parse($("#parameters").val());
    $("#parametriContainer").empty();
    renderizzaPlaceholder(parametri);
  });

}

export function renderizzaPlaceholder(parametri) {
  var maxHTMLx = $("#the-canvas").width();
  var maxHTMLy = $("#the-canvas").height();

  var paramContainerWidth = $("#parametriContainer").width();
  var yCounterOfGenerated = 0;
  var numOfMaxItem = 25;
  var notValidHeight = 30;
  var y = 0;
  var x = 6;

  for (var i = 0; i < parametri.length; i++) {
    var param = parametri[i];

    if (i > 0 && i % numOfMaxItem == 0) {
      yCounterOfGenerated = 0;
    }

    var classStyle = "";
    var valore = param.valore;

    if (i > 0 && i % numOfMaxItem == 0) {
      yCounterOfGenerated = 0;
    }

    y = yCounterOfGenerated;
    yCounterOfGenerated += notValidHeight;
    classStyle = "drag-drop dropped-out";

    $("#parametriContainer").append(
      '<div id="paramData' +
        (i + 1) +
        '" class="' +
        classStyle +
        '" data-id="-1" data-toggle="' +
        valore +
        '" data-valore="' +
        valore +
        '" data-x="' +
        x +
        '" data-y="' +
        y +
        '" style="transform: translate(' +
        x +
        'px, ' +
        y +
        'px);">  <span class="circle"></span><span class="descrizione">' +
        param.descrizione +
        " </span></div>"
    );
  }
}