// import React from "react";

// // import "antd/dist/antd.css";
// import { notification } from "antd";

// const createNotification = (type, message, description) => {
//   notification[type]({
//     message,
//     description,
//   });
// };
// export default createNotification;

import React from "react";
import { notification } from "antd";

const createNotification = (type, message, description, duration = 3) => {
  notification[type]({
    message,
    description,
    duration,
  });
};

export default createNotification;
