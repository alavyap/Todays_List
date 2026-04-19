document.addEventListener("DOMContentLoaded", () => {
     const DELETE_SETTING_KEY = "deleteCompletedAfterDelay";
        const deleteDelayOptions = document.querySelectorAll('input[name="delete-delay"]');
        const closeButton = document.getElementById("settings-modal-close");

        const syncDeleteSettingUI = () => {
            const savedValue = localStorage.getItem(DELETE_SETTING_KEY) || "no";
            deleteDelayOptions.forEach((option) => {
                option.checked = option.value === savedValue;
            });
        };

        const notifyParent = (type) => {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type }, "*");
            }
        };

        if (!localStorage.getItem(DELETE_SETTING_KEY)) {
            localStorage.setItem(DELETE_SETTING_KEY, "no");
        }

        syncDeleteSettingUI();

        deleteDelayOptions.forEach((option) => {
            option.addEventListener("change", () => {
                localStorage.setItem(DELETE_SETTING_KEY, option.value);
                notifyParent("settings-updated");
            });
        });

        closeButton.addEventListener("click", () => {
            notifyParent("close-settings-modal");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                notifyParent("close-settings-modal");
            }
        });
});