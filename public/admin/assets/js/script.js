//click-sider
const sider = document.querySelector(".sider");
if (sider) {
  const items = sider.querySelectorAll("li a");
  const path = window.location.pathname; 
  items.forEach(a => {
    a.classList.remove("active"); 
    const hrefName = a.getAttribute("href").split("/").pop(); 

    if (path.includes(hrefName)&&hrefName!='') {
      a.classList.add("active");   
    }
    if(path=='/' && hrefName==''){
      a.classList.add("active"); 
    }
  });
}

const buttonMenuMobile = document.querySelector(".inner-button-menu");
if(buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");
    console.log(sider,siderOverlay)
  buttonMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  })

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  })
}
//End click-sider
const listFilepondImage = document.querySelectorAll("[filepond-image]");
var filePond = {};
if(listFilepondImage.length > 0) {
    listFilepondImage.forEach(filepondImage => {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateType);
        
        let files = null;
        const elementImageDefault = filepondImage.closest("[image-default]");
        if(elementImageDefault) {
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if(imageDefault) {
            files = [
            {
                source: imageDefault,
            },
            ]
        }
        }

        filePond[filepondImage.name] = FilePond.create(filepondImage, {
            labelIdle: '+',
            files: files
        });
    });
}
// End Filepond Image

//lesson-create-post
const btn = document.querySelector(".button-lesson");
if(btn){
    btn.addEventListener("click", () => {
    const title = document.querySelector("#title").value;
    const avatars = filePond["avatar"].getFiles();
    let avatar = null;
    if(avatars.length > 0) {
        avatar = avatars[0].file;
    }
    const formData = new FormData();
    if (!title) return Swal.fire({
        icon: 'warning',
        title: 'Thiếu dữ liệu',
        text: 'Tên buổi học không được để trống!'
    });
    formData.append("title", title);
    formData.append("avatar",avatar);

    fetch("/lesson/create", {
        method: "POST",
        body: formData
    }).then(res=>res.json())
    .then(data=>{
        if(data.code=="success"){
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: data.message
            });
 
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: data.message
            });
        }
    })

});
}
//End lesson-create-post

//update lesson
const addWordBtn = document.querySelector("#addWordBtn");
const section4 = document.querySelector(".section-4");
const btnSubmit = document.querySelector(".button-edit-lesson");
const pondMap = new Map();

document.querySelectorAll(".image-up").forEach(inputFile => {
    if (!inputFile.matches("input")) {
        const id = inputFile.id;
        const wrapper = inputFile.closest(".inner-upload-image");
        const newInput = document.createElement("input");
        newInput.type = "file";
        newInput.className = "image-up";
        newInput.id = id;
        newInput.name = id;
        inputFile.remove();
        wrapper.prepend(newInput);
        inputFile = newInput;
    }
    const pond = FilePond.create(inputFile, {
        allowMultiple: false,
        labelIdle: '+',
        files: [
            {
                source: inputFile.closest("[image-default]").getAttribute("image-default")
            }
        ]
    });
    pondMap.set(inputFile.id, pond);
});

FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);
if (addWordBtn) {
    addWordBtn.addEventListener("click", () => {
        const wordDiv = document.createElement("div");
        wordDiv.classList.add("word");

        const wordCount = section4.querySelectorAll(".word").length + 1;
        const timestamp = Date.now();
        const inputId = `avatar-${timestamp}`;

        wordDiv.innerHTML = `
            <div class="inner-item">
                <div class="number">Từ thứ ${wordCount}</div>
            </div>

            <div class="item">
                <label class="inner-label" for="${inputId}">Ảnh</label>
                <div class="inner-upload-image">
                    <input class="image-up" type="file" id="${inputId}" name="${inputId}">
                </div>
            </div>

            <div class="inner-item">
                <label for="word-${timestamp}">Từ</label>
                <input type="text" id="word-${timestamp}" class="input-name">
            </div>
            <div class="inner-delete-vocab" inner-insert-delete> Xóa </div>
        `;
        section4.appendChild(wordDiv);
        const inputFile = wordDiv.querySelector(".image-up");
        const pond = FilePond.create(inputFile, {
            labelIdle: '+',
            allowMultiple: false
        });
        pondMap.set(inputId, pond);

        
        const deleteBtn = wordDiv.querySelector("[inner-insert-delete]");
            deleteBtn.addEventListener("click", () => {
            const pond = pondMap.get(inputId);
            if (pond) {
                pond.destroy();
                pondMap.delete(inputId);
            }
            wordDiv.remove();
            updateWordOrder();
        });
    });
}
const updateWordOrder = () => {
    const items = section4.querySelectorAll(".word");
    let index = 1;
    items.forEach(word => {
        const numberBox = word.querySelector(".number");
        numberBox.textContent = `Từ thứ ${index}`;
        index++;
    });
};


if (btnSubmit) {
    btnSubmit.addEventListener("click", () => {
        const wordDivs = section4.querySelectorAll(".word");
        if (wordDivs.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: 'Chưa nhập từ nào!'
            });
            return;
        }
        const id_less = document.querySelector("[id_less]");
        const valueId = id_less.getAttribute("id_less");

        const formData = new FormData();
        const wordsData = [];
        let isValid = true;
        let index = 1;
        for (const wordDiv of wordDivs) {
            const nameInput = wordDiv.querySelector(".input-name");
            const inputFile = wordDiv.querySelector(".image-up");
            const pond = pondMap.get(inputFile.id);
            const pondFiles = pond ? pond.getFiles() : [];
            if (!nameInput.value.trim()) {
                Swal.fire({
                    icon: "error",
                    title: "Thiếu dữ liệu!",
                    text: `Từ thứ ${index} chưa nhập tên!`
                });
                isValid = false;
                break;
            }
            if (pondFiles.length === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Thiếu ảnh!",
                    text: `Từ thứ ${index} chưa chọn ảnh!`
                });
                isValid = false;
                break;
            }
            const avatarField = inputFile.id;
            formData.append(avatarField, pondFiles[0].file);

            wordsData.push({
                name: nameInput.value,
                avatar: avatarField
            });

            index++;
        }

        if (!isValid) return; 
        formData.append("words", JSON.stringify(wordsData));

        fetch(`/lesson/edit/${valueId}`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                icon: data.code === "success" ? "success" : "error",
                title: data.code === "success" ? "Thành công" : "Thất bại",
                text: data.message
            });
        });
    });
}
//end update lesson

//inner-delete-vocab
const innerDeleteVocabs = document.querySelectorAll(".inner-delete-vocab")
if(innerDeleteVocabs){
    innerDeleteVocabs.forEach(innerDeleteVocab => {
        innerDeleteVocab.addEventListener("click",()=>{
            const id_delete = innerDeleteVocab.getAttribute("id-delete")
            fetch(`/lesson/delete/${id_delete}`,{
                method:"PATCH"
            })
            .then(res => res.json())
            .then(data => {
                Swal.fire({
                    icon: data.code === "success" ? "success" : "error",
                    title: data.code === "success" ? "Thành công" : "Thất bại",
                    text: data.message
                });
                if (data.code === "success") {
                    setTimeout(() => {
                        location.reload();
                    }, 1000); 
                }
            });
        })
    });
}
//End inner-delete-vocab

//inner-delete-lesson
const innerDeleteLessons = document.querySelectorAll(".inner-delete-lesson")
if(innerDeleteLessons){
    innerDeleteLessons.forEach(innerDeleteLesson => {
        innerDeleteLesson.addEventListener("click",()=>{
            const id_delete = innerDeleteLesson.getAttribute("id-delete")
            fetch(`/lesson/delete-lesson/${id_delete}`,{
                method:"PATCH"
            })
            .then(res => res.json())
            .then(data => {
                Swal.fire({
                    icon: data.code === "success" ? "success" : "error",
                    title: data.code === "success" ? "Thành công" : "Thất bại",
                    text: data.message
                });
                if (data.code === "success") {
                    setTimeout(() => {
                        location.reload();
                    }, 1000); 
                }
            });
        })
    });
}
//end inner-delete-lesson