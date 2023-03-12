import Point from "../types/point";
import Orientation from "../types/orientation";
import { PATH_ARROW_LENGTH, PATH_ARROW_HEIGHT, PATH_START } from "./relation-config";

export default (
  { x, y }: Point,
  toMany: boolean | undefined,
  orientation: Orientation
): string => {

  switch (orientation) {
    case Orientation.Top:
      return (`M ${x - PATH_START} ${y +  PATH_START}` +
      ` a 1,1 0 1,0 ${PATH_START * 2},0 a 1,1 0 1,0 ${-PATH_START * 2},0`);
    case Orientation.Bottom:
      return (`M ${x} ${y + 2 * PATH_START}` +
      ` a 1,1 0 1,0 ${PATH_START * 2},0 a 1,1 0 1,0 ${-PATH_START * 2},0`);
    case Orientation.Left:
      return (
        `M ${x} ${y}` +
        ` a 1,1 0 1,0 ${PATH_START * 2},0 a 1,1 0 1,0 ${-PATH_START * 2},0`
      );
    case Orientation.Right:
      return `M ${x -2 *PATH_START} ${y}` +
      ` a 1,1 0 1,0 ${PATH_START * 2},0 a 1,1 0 1,0 ${-PATH_START * 2},0`
  }
/*
  switch (orientation) {
    case Orientation.Top:
      if (toMany) {
        return (
          `M ${x} ${
            y + PATH_ARROW_LENGTH
          } l ${PATH_ARROW_HEIGHT} ${-PATH_ARROW_LENGTH} ` +
          `M ${x} ${
            y + PATH_ARROW_LENGTH
          } l ${-PATH_ARROW_HEIGHT} ${-PATH_ARROW_LENGTH}`
        );
      } else {
        return (
          `M ${x} ${y} l ${PATH_ARROW_HEIGHT} ${PATH_ARROW_LENGTH} ` +
          `M ${x} ${y} l ${-PATH_ARROW_HEIGHT} ${PATH_ARROW_LENGTH}`
        );
      }
    case Orientation.Bottom:
      if (toMany) {
        return (
          `M ${x} ${
            y - PATH_ARROW_LENGTH
          } l ${PATH_ARROW_HEIGHT} ${PATH_ARROW_LENGTH} ` +
          `M ${x} ${
            y - PATH_ARROW_LENGTH
          } l ${-PATH_ARROW_HEIGHT} ${PATH_ARROW_LENGTH}`
        );
      } else {
        return (
          `M ${x} ${y} l ${PATH_ARROW_HEIGHT} ${-PATH_ARROW_LENGTH} ` +
          `M ${x} ${y} l ${-PATH_ARROW_HEIGHT} ${-PATH_ARROW_LENGTH}`
        );
      }
    case Orientation.Left:
      if (toMany) {
        return (
          `M ${
            x + PATH_ARROW_LENGTH
          } ${y} l ${-PATH_ARROW_LENGTH} ${PATH_ARROW_HEIGHT} ` +
          `M ${
            x + PATH_ARROW_LENGTH
          } ${y} l ${-PATH_ARROW_LENGTH} ${-PATH_ARROW_HEIGHT}`
        );
      } else {
        return (
          `M ${x} ${y} l ${PATH_ARROW_LENGTH} ${PATH_ARROW_HEIGHT} ` +
          `M ${x} ${y} l ${PATH_ARROW_LENGTH} ${-PATH_ARROW_HEIGHT}`
        );
      }
    case Orientation.Right:
      if (toMany) {
        return (
          `M ${
            x - PATH_ARROW_LENGTH
          } ${y} l ${PATH_ARROW_LENGTH} ${PATH_ARROW_HEIGHT} ` +
          `M ${
            x - PATH_ARROW_LENGTH
          } ${y} l ${PATH_ARROW_LENGTH} ${-PATH_ARROW_HEIGHT}`
        );
      } else {
        return (
          `M ${x} ${y} l ${-PATH_ARROW_LENGTH} ${PATH_ARROW_HEIGHT} ` +
          `M ${x} ${y} l ${-PATH_ARROW_LENGTH} ${-PATH_ARROW_HEIGHT}`
        );
      }
  }*/
};
