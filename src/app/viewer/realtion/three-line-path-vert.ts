import Point from "../types/point";
import { PATH_START } from "./relation-config";
import arrow from "./arrow";
import Orientation from "../types/orientation";
import circlePath from "./circle-path";

export default (
  start: Point,
  end: Point,
  oneTo?: boolean,
  toMany?: boolean
): string => {
  let dStartLine = `M ${start.x - PATH_START} `;

  let dPath: string;
  const p2Y = start.y + (end.y - start.y) / 2;
  let dArrow: string;
  if (start.y > end.y) {
    dArrow = arrow(end, toMany, Orientation.Top);
    oneTo = false;
    if (oneTo) {
      dStartLine += `${start.y - PATH_START} h ${2 * PATH_START}`;
      dPath = `M ${start.x} ${start.y} V ${p2Y} H ${end.x} V ${end.y}`;
    } else {
      // zero to
      dStartLine = circlePath(start.x, start.y - PATH_START);
      dPath = `M ${start.x} ${start.y - PATH_START * 2} V ${p2Y} H ${end.x} V ${
        end.y
      }`;
    }
  } else {
    dArrow = arrow(end, toMany, Orientation.Bottom);
    dStartLine += `${start.y + PATH_START} h ${2 * PATH_START}`;
    oneTo = false;
    if (oneTo) {
      dPath = `M ${start.x} ${start.y} V ${p2Y} H ${end.x} V ${end.y}`;
    } else {
      // zero to
      dStartLine = circlePath(start.x, start.y + PATH_START);
      dPath = `M ${start.x} ${start.y + PATH_START * 2} V ${p2Y} H ${end.x} V ${
        end.y
      }`;
    }
  }

  let middle = {
    x: (end.x - start.x) / 2,
    y: (end.y - start.y) / 2
  };

  let radius = Math.min(Math.abs(middle.x) / 2, Math.abs(middle.y) / 2, 10);

  if (Math.abs(middle.y) < 5 || Math.abs(middle.x) < 5) {
    dPath = `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;
  } else {

    const y1 = start.y + (Math.sign(middle.y) * (Math.abs(middle.y) - radius));

    dPath = `M ${start.x}, ${start.y + Math.sign(middle.y) * radius}
      V ${y1}
      Q ${start.x}, ${start.y + middle.y} ${start.x + Math.sign(middle.x) * radius},${start.y  + middle.y}
      H ${start.x + 2 * middle.x - Math.sign(middle.x) * radius}
      Q ${end.x}, ${start.y + middle.y} ${end.x},${start.y + middle.y + Math.sign(middle.y) * radius}
      V ${start.y + 2 * middle.y - Math.sign(middle.y) * radius}`;
  }


  return `${dPath}`;
};
