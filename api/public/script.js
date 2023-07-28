const updateBtn = document.getElementById("update");

updateBtn.addEventListener("click", async () => {
    const formData = new FormData(document.getElementById("input-form"));
    const name = formData.get("name");
    const quote = formData.get("quote");

    if(!(name.length === 0) && !(quote.length === 0)) {
        await fetch("/people", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                quote
            })
        });

        window.location.reload();
    }
});

const deleteBtns = document.querySelectorAll(".delete");
for(let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener("click", async (e) => {
        await fetch("/people", {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: e.target.id
            })
        });

        window.location.reload();
    });
}