import { isEmpty } from "lodash";
import uuid from "react-native-uuid";
import { ErrorType } from "../types/index";

// change image filename {fileName: the original file name, origin: to determine which folder it would be sotred, userId, for unique key}
export const changeImageFileName = ({ fileName, origin, _id }) => {
  let name = fileName;
  const splitName = name?.split(".");
  const extension = splitName?.at(-1);

  _id = !isEmpty(_id) ? _id : "UNKNOWN";

  // getting a unique id for the image
  const imageGUID = uuid.v4();

  //put it together to form the image url
  const result = `${_id}_${origin}_${imageGUID}.${extension}`;
  return result;
};

export const getErrorType = (error: unknown): ErrorType => {
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("network")) {
      return ErrorType.NETWORK;
    }
    if (error.message.toLowerCase().includes("not found")) {
      return ErrorType.NOT_FOUND;
    }
    // Add more conditions as needed
  }
  return ErrorType.UNKNOWN;
};
