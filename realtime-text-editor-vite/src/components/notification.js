import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

function Notify(title,type) {
    Store.addNotification({
      title,type,
      insert:"top",
      container: "top-right",
      animationIn: ["animate__animated animate__bounceIn"],
      animationOut: ["animate__animated animate__zoomOut"],
      dismiss: {
        duration: 2000,
        onScreen: true,
      },
    });
}

export default Notify;