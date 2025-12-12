// ---------------------------------------
// PAGING SIMULATOR (FIFO, LRU, OPTIMAL)
// ---------------------------------------
function runPaging() {
    const pages = document.getElementById("pageSeq").value.split(" ");
    const frames = parseInt(document.getElementById("frames").value);
    const algo = document.getElementById("algo").value;
    const out = document.getElementById("pagingOut");
    out.innerHTML = "";

    let frameList = [];
    let lruMap = {};
    let faults = 0;

    pages.forEach((page, index) => {
        let div = document.createElement("span");
        div.classList.add("tag");

        let isHit = frameList.includes(page);

        if (algo === "FIFO") {
            if (!isHit) {
                if (frameList.length < frames) frameList.push(page);
                else frameList.shift(), frameList.push(page);

                div.classList.add("fault");
                div.innerText = `${page} (fault)`;
                faults++;
            } else {
                div.classList.add("hit");
                div.innerText = `${page} (hit)`;
            }
        }

        if (algo === "LRU") {
            if (!isHit) {
                if (frameList.length < frames) frameList.push(page);
                else {
                    let lruPage = Object.keys(lruMap).sort((a, b) => lruMap[a] - lruMap[b])[0];
                    frameList[frameList.indexOf(lruPage)] = page;
                }
                div.classList.add("fault");
                div.innerText = `${page} (fault)`;
                faults++;
            } else {
                div.classList.add("hit");
                div.innerText = `${page} (hit)`;
            }

            lruMap[page] = index;
        }

        if (algo === "OPT") {
            if (!isHit) {
                if (frameList.length < frames) frameList.push(page);
                else {
                    let future = pages.slice(index + 1);
                    let farthest = 0, replacePage = frameList[0];

                    frameList.forEach(p => {
                        let idx = future.indexOf(p);
                        if (idx === -1) { replacePage = p; farthest = 999; }
                        else if (idx > farthest) { farthest = idx; replacePage = p; }
                    });

                    frameList[frameList.indexOf(replacePage)] = page;
                }
                div.classList.add("fault");
                div.innerText = `${page} (fault)`;
                faults++;
            } else {
                div.classList.add("hit");
                div.innerText = `${page} (hit)`;
            }
        }

        out.appendChild(div);
    });

    out.innerHTML += `<br><br><b>Total Page Faults: ${faults}</b>`;
}



// ---------------------------------------
// SEGMENTATION SIMULATOR
// ---------------------------------------
function runSegmentation() {
    const segs = document.getElementById("segments").value.split(" ");
    const out = document.getElementById("segOut");
    out.innerHTML = "";

    segs.forEach((s, i) => {
        let div = document.createElement("span");
        div.classList.add("tag", "seg");
        div.innerText = `Segment ${i} → ${s} KB`;
        out.appendChild(div);
    });
}



// ---------------------------------------
// MEMORY ALLOCATION (FIRST, BEST, WORST FIT)
// ---------------------------------------
function runAllocation() {
    let holes = document.getElementById("holes").value.split(" ").map(Number);
    let p = parseInt(document.getElementById("process").value);
    let method = document.getElementById("allocMethod").value;
    let out = document.getElementById("allocOut");
    out.innerHTML = "";

    let index = -1;

    if (method === "First Fit") {
        index = holes.findIndex(h => h >= p);
    }

    if (method === "Best Fit") {
        let best = Infinity;
        holes.forEach((h, i) => {
            if (h >= p && h < best) { best = h; index = i; }
        });
    }

    if (method === "Worst Fit") {
        let worst = -1;
        holes.forEach((h, i) => {
            if (h >= p && h > worst) { worst = h; index = i; }
        });
    }

    let div = document.createElement("span");
    div.classList.add("tag", "alloc");

    if (index === -1) div.innerText = "Process cannot be allocated!";
    else div.innerText = `Allocated at hole index ${index}`;

    out.appendChild(div);
}

