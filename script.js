const canvas = document.getElementById("canvas");
const addRectBtn = document.getElementById("addrect");
const addtextbtn = document.getElementById('addtext')

const layersList = document.getElementById("layers-list");

let elementCount = 0;

let selectedElement = null;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Resize wali functionality
let suppressCanvasClick = false;

let isResizing = false;
let activeHandle = null;

let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;

const MIN_WIDTH = 40;
const MIN_HEIGHT = 30;



// "Add Rectangle" button ko select kar rahe hain
addRectBtn.addEventListener("click", () => {
  // Har naye element ke liye counter badha rahe hain
  elementCount++;

  const rect = document.createElement("div");

  rect.id = `element-${elementCount}`;
  // Metadata: ye element kis type ka hai
  rect.dataset.type = "rectangle"; 

  rect.style.width = "120px";
  rect.style.height = "80px";
  rect.style.background = "#4da3ff";
  rect.style.position = "absolute";
  rect.style.left = "50px";
  rect.style.top = "50px";


  rect.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    suppressCanvasClick = true;

    selectElement(rect);

    isDragging = true
    
    const rectBox = rect.getBoundingClientRect();
    offsetX = e.clientX - rectBox.left;
    offsetY = e.clientY - rectBox.top;
    });

  canvas.appendChild(rect);
  renderLayers()
  
});

// "Add Text" button ko select kar rahe hain
addtextbtn.addEventListener("click", ()=>{
    elementCount++

    const textEl = document.createElement("div")
    textEl.id = `element-${elementCount}`;
    textEl.dataset.type = "text";
    textEl.textContent = "Text";

    textEl.style.position = "absolute";
    textEl.style.left = "60px";
    textEl.style.top = "60px";
    textEl.style.minWidth = "60px";
    textEl.style.padding = "6px 8px";

    textEl.style.fontSize = "16px";
    textEl.style.color = "#000";
    textEl.style.background = "transparent";
    textEl.style.border = "1px dashed #aaa";
    textEl.style.cursor = "text";

    textEl.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectElement(textEl);

    isDragging = true;

    const box = textEl.getBoundingClientRect();
    offsetX = e.clientX - box.left;
    offsetY = e.clientY - box.top;
    });

    canvas.appendChild(textEl);
    renderLayers()
})

document.addEventListener("mousemove", (e) => {

  /* ---------- DRAG ---------- */
  if (isDragging && selectedElement) {
    const canvasBox = canvas.getBoundingClientRect();

    let newLeft = e.clientX - canvasBox.left - offsetX;
    let newTop  = e.clientY - canvasBox.top  - offsetY;

    const elWidth = selectedElement.offsetWidth;
    const elHeight = selectedElement.offsetHeight;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;

    if (newLeft + elWidth > canvasBox.width) {
      newLeft = canvasBox.width - elWidth;
    }
    if (newTop + elHeight > canvasBox.height) {
      newTop = canvasBox.height - elHeight;
    }

    selectedElement.style.left = newLeft + "px";
    selectedElement.style.top  = newTop + "px";
  }

  /* ---------- RESIZE ---------- */
  if (isResizing && selectedElement) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (activeHandle === "br") {
      newWidth = startWidth + dx;
      newHeight = startHeight + dy;
    }

    if (activeHandle === "tr") {
      newWidth = startWidth + dx;
      newHeight = startHeight - dy;
      newTop = startTop + dy;
    }

    if (activeHandle === "bl") {
      newWidth = startWidth - dx;
      newHeight = startHeight + dy;
      newLeft = startLeft + dx;
    }

    if (activeHandle === "tl") {
      newWidth = startWidth - dx;
      newHeight = startHeight - dy;
      newLeft = startLeft + dx;
      newTop = startTop + dy;
    }

    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;

    selectedElement.style.width = newWidth + "px";
    selectedElement.style.height = newHeight + "px";
    selectedElement.style.left = newLeft + "px";
    selectedElement.style.top = newTop + "px";
  }
});


document.addEventListener("mouseup", () => {
  isDragging = false;

  isResizing = false;
  activeHandle = null;
});


function selectElement(el) {
  if (selectedElement) {
    deselectElement(); // pehle purana hatao
  }

  selectedElement = el; // editor ko batao kaun active hai
  el.classList.add("selected");
  addResizeHandles(el);
  highlightActiveLayer(el)
}

function deselectElement() {
  if (!selectedElement) return;

  removeResizeHandles(selectedElement);
  selectedElement.classList.remove("selected");
  selectedElement = null;
}

function addResizeHandles(el) {
  ["tl", "tr", "bl", "br"].forEach(pos => {
    const handle = document.createElement("div");
    handle.classList.add("resize-handle", pos);
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();

      suppressCanvasClick = true; 

      isDragging = false;
      isResizing = true;
      activeHandle = pos;

      const box = el.getBoundingClientRect();
      const canvasBox = canvas.getBoundingClientRect();

      startX = e.clientX;
      startY = e.clientY;

      startWidth = box.width;
      startHeight = box.height;

      // element ki position canvas ke relative store karo
      startLeft = box.left - canvasBox.left;
      startTop  = box.top  - canvasBox.top;
    });
    el.appendChild(handle);
  });
}

function removeResizeHandles(el) {
  el.querySelectorAll(".resize-handle").forEach(h => h.remove());
}

//--------------------------------
function renderLayers() {
  layersList.innerHTML = "";

  // Canvas ke saare elements lo
  const elements = [...canvas.children];

  // Topmost element = last in DOM
  elements.reverse().forEach(el => {
    const layer = document.createElement("div");
    layer.classList.add("layer-item");

    // Name
    const name = document.createElement("span");
    name.textContent = el.dataset.type + " (" + el.id + ")";

    // Controls
    const controls = document.createElement("div");
    controls.classList.add("layer-controls");

    const upBtn = document.createElement("button");
    upBtn.textContent = "▲";

    const downBtn = document.createElement("button");
    downBtn.textContent = "▼";

    controls.appendChild(upBtn);
    controls.appendChild(downBtn);

    layer.appendChild(name);
    layer.appendChild(controls);

    /* ---- Selection via Layer ---- */
    layer.addEventListener("click", () => {
      selectElement(el);
      highlightActiveLayer(el);
    });

    /* ---- Move Up ---- */
    upBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      moveLayerUp(el);
    });

    /* ---- Move Down ---- */
    downBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      moveLayerDown(el);
    });

    layersList.appendChild(layer);
  });

  highlightActiveLayer(selectedElement);
}

//------------------------------
// Highlight active layer
function highlightActiveLayer(el) {
  const items = document.querySelectorAll(".layer-item");
  items.forEach(item => item.classList.remove("active"));

  if (!el) return;

  [...layersList.children].forEach(layer => {
    if (layer.textContent.includes(el.id)) {
      layer.classList.add("active");
    }
  });
}

//--------------------------------
// Move Up Logic
function moveLayerUp(el) {
  const next = el.nextElementSibling;
  if (!next) return; // already top

  canvas.insertBefore(next, el);
  renderLayers();
  selectElement(el);
}

//--------------------------------
// Move Down logic
function moveLayerDown(el) {
  const prev = el.previousElementSibling;
  if (!prev) return; // already bottom

  canvas.insertBefore(el, prev);
  renderLayers();
  selectElement(el);
}


canvas.addEventListener("click", () => {
  if (suppressCanvasClick) {
    suppressCanvasClick = false; // reset
    return;
  }
  
  deselectElement();
});
  
