import Point from "../types/point";
import { PATH_START } from "./relation-config";
import circlePath from "./circle-path";
import arrow from "./arrow";
import Orientation from "../types/orientation";

export default (
  start: Point,
  end: Point,
  oneTo?: boolean,
  toMany?: boolean
): string => {
  let dArrow: string;
  let dStartLine: string;
  let dPath: string;

  if (start.y > end.y) {
    oneTo = false;
    if (oneTo) {
      dStartLine = `M ${start.x - PATH_START} ${start.y - PATH_START}
                    h ${2 * PATH_START}`;
      dPath = `M ${start.x} ${start.y}`;
    } else {
      // zero to
      dStartLine = circlePath(start.x, start.y - PATH_START);
      dPath = `M ${start.x} ${start.y - PATH_START * 2}`;
    }
    dPath += ` V ${end.y} H ${end.x}`;

    if (start.x > end.x) {
      dArrow = arrow(end, toMany, Orientation.Left);
    } else {
      dArrow = arrow(end, toMany, Orientation.Right);
    }
  } else {
    oneTo = false;
    if (oneTo) {
      if (start.x > end.x) {
        dStartLine = `M ${start.x - PATH_START} `;
      } else {
        dStartLine = `M ${start.x + PATH_START} `;
      }
      dStartLine += `${start.y - PATH_START} v ${2 * PATH_START}`;
      dPath = `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
    } else {
      // zero to
      if (start.x > end.x) {
        dStartLine = circlePath(start.x - PATH_START, start.y);
      } else {
        dStartLine = circlePath(start.x + PATH_START, start.y);
      }
      if (start.x > end.x) {
        dPath = `M ${start.x - PATH_START * 2}`;
      } else {
        dPath = `M ${start.x + PATH_START * 2}`;
      }
      dPath += ` ${start.y} H ${end.x} V ${end.y}`;
    }
    dArrow = arrow(end, toMany, Orientation.Bottom);
  }

  let middle = {
    x: (end.x - start.x) / 2,
    y: (end.y - start.y) / 2
  };

  if (Math.abs(middle.y) < 10) {
    dPath = `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;
  } else {

    const x1 = start.x + middle.x + (Math.sign(middle.x) * (Math.abs(middle.x) - 10));

    dPath = `M ${start.x}, ${start.y}
      H ${x1}
      Q ${end.x}, ${start.y} ${end.x},${start.y + Math.sign(middle.y) * 10}
      L ${end.x},${end.y}`;
  }

  return `${dPath}`;
};
