// import Ajv from "ajv";
import { Schema } from "./types/schema.js";
// import validationSchema from "./validation-schema.json";

// const ajv = new Ajv();
// const ajvCompiled = ajv.compile(validationSchema);

export default function validateJson(
  dbSchema: Schema
): boolean | PromiseLike<unknown> {
  // const validJson = ajvCompiled(dbSchema);
  return true;// validJson;
}
