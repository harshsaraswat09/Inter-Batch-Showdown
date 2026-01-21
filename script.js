
const canvas = document.getElementById("canvas");
const addRectBtn = document.getElementById("addrect");
const addtextbtn = document.getElementById('addtext')
let elementCount = 0;

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

    canvas.appendChild(textEl);
})