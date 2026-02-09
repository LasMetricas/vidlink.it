import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "@/style/css/react-confirm-alert.scss";

export const confirmModal = (
  message: string,
  onConfirm: () => void,
  title: string = ""
) => {
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "Yes",
        onClick: onConfirm,
      },
      {
        label: "No",
        onClick: () => console.log("Cancled"),
      },
    ],
  });
};

export const successModal = (message: string, handle?: () => void) => {
  toast.success(message, {
    autoClose: 3000,
    onClose: handle,
  });
};

export const errorModal = (message: string, handle?: () => void) => {
  toast.error(message, {
    autoClose: 3000,
    onClose: handle,
  });
};
