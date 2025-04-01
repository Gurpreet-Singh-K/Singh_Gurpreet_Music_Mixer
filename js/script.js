document.addEventListener("DOMContentLoaded", () => {
    const dropbox = document.getElementById("dropbox");
    const originalContainer = document.querySelector(".music-container");
    const activeSounds = new Map();

    document.querySelectorAll(".GTA").forEach(img => {
        img.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("sound", event.target.dataset.sound);
            event.dataTransfer.setData("image", event.target.src);
            event.dataTransfer.setData("origin", "original");
        });
    });

    dropbox.addEventListener("dragover", (event) => event.preventDefault());

    dropbox.addEventListener("drop", (event) => {
        event.preventDefault();
        const soundPath = event.dataTransfer.getData("sound");
        const imageSrc = event.dataTransfer.getData("image");
        const origin = event.dataTransfer.getData("origin");

        if (!activeSounds.has(soundPath)) {
            const audio = new Audio(soundPath);
            audio.loop = true;
            audio.play();
            activeSounds.set(soundPath, audio);

            const droppedItem = document.createElement("img");
            droppedItem.src = imageSrc;
            droppedItem.classList.add("dropped-image");
            droppedItem.dataset.sound = soundPath;
            droppedItem.setAttribute("draggable", "true");
            droppedItem.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("sound", soundPath);
                e.dataTransfer.setData("image", imageSrc);
                e.dataTransfer.setData("origin", "dropbox");
            });

            dropbox.appendChild(droppedItem);
        }
    });

    originalContainer.addEventListener("dragover", (event) => event.preventDefault());

    originalContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const soundPath = event.dataTransfer.getData("sound");
        const imageSrc = event.dataTransfer.getData("image");
        const origin = event.dataTransfer.getData("origin");

        if (origin === "dropbox") {
            if (activeSounds.has(soundPath)) {
                activeSounds.get(soundPath).pause();
                activeSounds.delete(soundPath);
            }

            const images = dropbox.querySelectorAll("img");
            images.forEach((img) => {
                if (img.src === imageSrc) {
                    img.remove();
                }
            });
        }
    });

    dropbox.addEventListener("dblclick", () => {
        activeSounds.forEach((audio) => audio.pause());
        activeSounds.clear();
        dropbox.innerHTML = "Drop Here";
    });
});
