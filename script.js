const canvas = document.getElementById("canvas");
const addRectBtn = document.getElementById("addrect");
const addtextbtn = document.getElementById('addtext')
let elementCount = 0;

let selectedElement = null;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;


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
    selectElement(rect);

    isDragging = true
    
    const rectBox = rect.getBoundingClientRect();
    offsetX = e.clientX - rectBox.left;
    offsetY = e.clientY - rectBox.top;
    });

  canvas.appendChild(rect);
  
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
})

document.addEventListener("mousemove", (e) => {
  if (!isDragging || !selectedElement) return;

  const canvasBox = canvas.getBoundingClientRect();

  let newLeft = e.clientX - canvasBox.left - offsetX;
  let newTop  = e.clientY - canvasBox.top  - offsetY;

  /* 🔒 Canvas boundary constraint */
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
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});


function selectElement(el) {
  if (selectedElement) {
    deselectElement(); // pehle purana hatao
  }

  selectedElement = el; // editor ko batao kaun active hai
  el.classList.add("selected");
  addResizeHandles(el);
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
    el.appendChild(handle);
  });
}

function removeResizeHandles(el) {
  el.querySelectorAll(".resize-handle").forEach(h => h.remove());
}

canvas.addEventListener("click", () => {
  deselectElement();
});

