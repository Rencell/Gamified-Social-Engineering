import { ref } from "vue";
import { ContentService } from "@/services"; // Adjust the import path as needed

export function useUploadContent() {
    const previewUrl = ref<string | null>(null);
    const selectedFile = ref<File | null>(null);
    const changeUpdate = ref(false);

    function onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            selectedFile.value = file;

            // Clean up previous preview
            if (previewUrl.value) {
                URL.revokeObjectURL(previewUrl.value);
            }
            previewUrl.value = URL.createObjectURL(file);
        } else {
            selectedFile.value = null;
            previewUrl.value = null;
        }
        changeUpdate.value = true;
    }

    async function uploadImage(
        props: { item?: { id?: number }; image?: string },
        updateProps: (data: { image: string }) => void
    ) {
        if (!selectedFile.value) {
            alert("Please select an image first");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile.value as Blob);
        if (props.item && props.item.id !== undefined) {
            formData.append("content_quiz", String(props.item.id));
        } else {
            console.error("props.item is undefined or missing 'id'");
            return;
        }
        const response = await ContentService.uploadImage(formData);

        const data = response;
        console.log("Uploaded:", data);
        const url = new URL(data.image);
        const path = url.pathname;
        changeUpdate.value = true;
        updateProps({ image: path });
    }

    return {
        previewUrl,
        selectedFile,
        changeUpdate,
        onFileChange,
        uploadImage,
    };
}